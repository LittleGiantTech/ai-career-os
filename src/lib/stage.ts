import { prisma } from "@/lib/prisma";
import {
  CURRICULUM,
  getStage,
  getChapterStages,
  type CurriculumStage,
} from "@/lib/curriculum";
import { CHAPTER_BOUNDARIES } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// View and start predicates
// ─────────────────────────────────────────────────────────────────────────────

/** All stages are always viewable — content is never hidden. */
export function isStageViewable(stageNumber: number): boolean {
  return stageNumber >= 1 && stageNumber <= 29;
}

/**
 * A stage is startable when:
 * 1. Its number matches User.currentStage
 * 2. No active sprint exists
 * 3. No sprint for this stageKey has already been created
 */
export async function isStageStartable(
  stageKey: string,
  stageNumber: number,
  userId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStage: true },
  });
  if (!user || user.currentStage !== stageNumber) return false;

  const activeSprint = await prisma.sprint.findFirst({
    where: { userId, isActive: true },
    select: { id: true },
  });
  if (activeSprint) return false;

  const existingSprint = await prisma.sprint.findUnique({
    where: { userId_stageKey: { userId, stageKey } },
    select: { id: true },
  });
  return !existingSprint;
}

// ─────────────────────────────────────────────────────────────────────────────
// Completion checks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A stage is complete when a Sprint record for this stage exists with
 * a passing Interview record (not chapter synthesis).
 */
export async function isStageComplete(
  stageNumber: number,
  userId: string
): Promise<boolean> {
  const sprint = await prisma.sprint.findFirst({
    where: { userId, stageNumber },
    include: {
      interviews: {
        where: { passed: true, isChapterSynthesis: false },
        select: { id: true },
      },
    },
  });
  return sprint !== null && sprint.interviews.length > 0;
}

/**
 * A chapter is complete when a ChapterCompletion record exists with completedAt set.
 */
export async function isChapterComplete(
  chapterNumber: number,
  userId: string
): Promise<boolean> {
  const record = await prisma.chapterCompletion.findUnique({
    where: { userId_chapterNumber: { userId, chapterNumber } },
    select: { completedAt: true },
  });
  return record?.completedAt !== null && record?.completedAt !== undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Bulk stage status for roadmap rendering
// ─────────────────────────────────────────────────────────────────────────────

export type StageStatus = "locked" | "startable" | "active" | "complete";

export type StageWithStatus = {
  stage: CurriculumStage;
  status: StageStatus;
  sprintId?: string;
};

/**
 * Returns all 29 stages (currently implemented) with their status
 * for a given user. Used by the roadmap page.
 */
export async function getStagesWithStatus(
  userId: string
): Promise<StageWithStatus[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStage: true },
  });
  if (!user) return [];

  const sprints = await prisma.sprint.findMany({
    where: { userId },
    include: {
      interviews: {
        where: { passed: true, isChapterSynthesis: false },
        select: { id: true },
      },
    },
  });

  const sprintByKey = new Map(sprints.map((s) => [s.stageKey, s]));

  return CURRICULUM.map((stage) => {
    const sprint = sprintByKey.get(stage.key);

    if (sprint) {
      const passed = sprint.interviews.length > 0;
      return {
        stage,
        status: (passed ? "complete" : "active") as StageStatus,
        sprintId: sprint.id,
      };
    }

    if (stage.number === user.currentStage) {
      return { stage, status: "startable" as StageStatus };
    }

    return { stage, status: "locked" as StageStatus };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Chapter helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the chapter number (1–6) for a given stage number. */
export function getChapterForStage(stageNumber: number): number | undefined {
  for (const [chapter, [first, last]] of Object.entries(CHAPTER_BOUNDARIES)) {
    if (stageNumber >= first && stageNumber <= last) {
      return Number(chapter);
    }
  }
  return undefined;
}

/** Returns true if this stage is the last stage in its chapter. */
export function isChapterEndStage(stageNumber: number): boolean {
  const stage = getStage(stageNumber);
  return stage?.isChapterEnd ?? false;
}

/**
 * Returns all stage numbers in the same chapter as the given stage.
 * Used for chapter synthesis interview context.
 */
export function getCoChapterStageNumbers(stageNumber: number): number[] {
  const stage = getStage(stageNumber);
  if (!stage) return [];
  return getChapterStages(stage.chapter).map((s) => s.number);
}
