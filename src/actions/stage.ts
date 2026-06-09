"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getOrCreateUser } from "@/lib/user";
import { getStage } from "@/lib/curriculum";
import { isStageStartable } from "@/lib/stage";

// ─────────────────────────────────────────────────────────────────────────────
// startStage
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a Sprint and SprintTask rows from the curriculum definition.
 * Enforces: one active sprint at a time, one sprint per stage.
 * Redirects to /sprint on success.
 */
export async function startStage(stageNumber: number): Promise<void> {
  const user = await getOrCreateUser();
  const stage = getStage(stageNumber);
  if (!stage) throw new Error(`Stage ${stageNumber} not found in curriculum`);

  const canStart = await isStageStartable(stage.key, stageNumber, user.id);
  if (!canStart) {
    throw new Error(
      "Stage cannot be started. Either a sprint is already active, this stage is already complete, or it is not yet unlocked."
    );
  }

  try {
    await prisma.sprint.create({
      data: {
        userId: user.id,
        stageKey: stage.key,
        stageNumber: stage.number,
        chapterNumber: stage.chapter,
        title: stage.title,
        goal: stage.description,
        durationDays: stage.estimatedDays,
        projectTitle: stage.isChapterEnd
          ? (stage.chapterProject?.title ?? null)
          : null,
        projectDescription: stage.isChapterEnd
          ? (stage.chapterProject?.description ?? null)
          : null,
        completionCriteria: stage.completionCriteria.join(" | "),
        isActive: true,
        tasks: {
          create: [
            ...stage.tasks.map((task, i) => ({
              type: "TASK" as const,
              title: task.title,
              order: i,
            })),
            ...stage.miniChallenges.map((challenge, i) => ({
              type: "CHALLENGE" as const,
              title: challenge.title,
              order: stage.tasks.length + i,
            })),
          ],
        },
      },
    });
  } catch (err) {
    // Concurrent start race: another request already created this sprint.
    // Both requests should land on /sprint — only the P2002 is suppressed.
    if (
      !(
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      )
    ) {
      throw err;
    }
  }

  redirect("/sprint");
}

// ─────────────────────────────────────────────────────────────────────────────
// completeStage
// ─────────────────────────────────────────────────────────────────────────────

export type CompleteStageResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Validates all completion conditions and advances the user's stage.
 *
 * Completion requires:
 * 1. All TASK-type tasks complete
 * 2. All CHALLENGE-type tasks complete
 * 3. Stage interview passed (not chapter synthesis)
 * 4. If chapter-end: projectUrl submitted + chapter synthesis interview passed
 */
export async function completeStage(
  sprintId: string
): Promise<CompleteStageResult> {
  const user = await getOrCreateUser();

  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
    include: {
      tasks: true,
      interviews: {
        where: { passed: true },
        select: { id: true, isChapterSynthesis: true },
      },
    },
  });

  if (!sprint || sprint.userId !== user.id) {
    return { success: false, error: "Sprint not found." };
  }

  if (!sprint.isActive) {
    return { success: false, error: "This stage has already been completed." };
  }

  const stage = getStage(sprint.stageNumber);
  if (!stage) {
    return { success: false, error: "Stage not found in curriculum." };
  }

  // Validate tasks
  const incompleteTasks = sprint.tasks.filter(
    (t) => t.type === "TASK" && !t.isComplete
  );
  if (incompleteTasks.length > 0) {
    return {
      success: false,
      error: `${incompleteTasks.length} task(s) not yet complete.`,
    };
  }

  // Validate challenges
  const incompleteChallenges = sprint.tasks.filter(
    (t) => t.type === "CHALLENGE" && !t.isComplete
  );
  if (incompleteChallenges.length > 0) {
    return {
      success: false,
      error: `${incompleteChallenges.length} challenge(s) not yet complete.`,
    };
  }

  // Validate stage interview
  const stageInterviewPassed = sprint.interviews.some(
    (i) => !i.isChapterSynthesis
  );
  if (!stageInterviewPassed) {
    return {
      success: false,
      error: "Stage interview not yet passed.",
    };
  }

  // Chapter-end additional requirements
  if (stage.isChapterEnd) {
    if (!sprint.projectUrl) {
      return {
        success: false,
        error: "Chapter project URL is required before completing a chapter-end stage.",
      };
    }
    const synthesisInterviewPassed = sprint.interviews.some(
      (i) => i.isChapterSynthesis
    );
    if (!synthesisInterviewPassed) {
      return {
        success: false,
        error: "Chapter synthesis interview not yet passed.",
      };
    }
  }

  // Advance stage and close sprint atomically
  await prisma.$transaction(async (tx) => {
    await tx.sprint.update({
      where: { id: sprintId },
      data: { isActive: false, completedAt: new Date() },
    });

    const nextStage = Math.min(user.currentStage + 1, 29);
    await tx.user.update({
      where: { id: user.id },
      data: { currentStage: nextStage, lastActiveAt: new Date() },
    });

    // Create chapter completion record for chapter-end stages
    if (stage.isChapterEnd) {
      const synthInterview = sprint.interviews.find((i) => i.isChapterSynthesis);
      await tx.chapterCompletion.create({
        data: {
          userId: user.id,
          chapterNumber: stage.chapter,
          synthesisInterviewId: synthInterview?.id ?? null,
          projectUrl: sprint.projectUrl,
          architectureDiagramUrl: sprint.architectureDiagramUrl,
          workflowDiagramUrl: sprint.workflowDiagramUrl,
          adrCount: sprint.adrCount ?? 0,
          completedAt: new Date(),
        },
      });
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/roadmap");
  revalidatePath("/sprint");

  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// submitProjectUrl
// ─────────────────────────────────────────────────────────────────────────────

export async function submitProjectUrl(
  sprintId: string,
  projectUrl: string,
  architectureDiagramUrl?: string,
  workflowDiagramUrl?: string,
  adrCount?: number
): Promise<CompleteStageResult> {
  const user = await getOrCreateUser();

  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
    select: { userId: true, isActive: true },
  });

  if (!sprint || sprint.userId !== user.id) {
    return { success: false, error: "Sprint not found." };
  }

  if (!sprint.isActive) {
    return { success: false, error: "Sprint is already complete." };
  }

  try {
    new URL(projectUrl);
  } catch {
    return { success: false, error: "Invalid project URL." };
  }

  await prisma.sprint.update({
    where: { id: sprintId },
    data: {
      projectUrl,
      architectureDiagramUrl: architectureDiagramUrl ?? null,
      workflowDiagramUrl: workflowDiagramUrl ?? null,
      adrCount: adrCount ?? null,
    },
  });

  revalidatePath("/sprint");
  return { success: true };
}
