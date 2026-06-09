import Link from "next/link";
import { ExternalLink, BookOpen, FileText, Layers, FolderGit2 } from "lucide-react";
import { getOrCreateUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import { getStageByKey } from "@/lib/curriculum";
import { SprintTaskItem } from "@/components/sprint/sprint-task-item";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SprintTask } from "@/generated/prisma/client";
import type { Resource } from "@/lib/curriculum";

export default async function SprintPage() {
  const user = await getOrCreateUser();

  const sprint = await prisma.sprint.findFirst({
    where: { userId: user.id, isActive: true },
    include: {
      tasks: { orderBy: { order: "asc" } },
      interviews: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!sprint) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-20 text-center">
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-4">
          No active sprint
        </p>
        <h2 className="text-sm font-semibold text-foreground mb-1">
          No stage in progress
        </h2>
        <p className="text-xs text-muted-foreground max-w-xs mb-6">
          Select a stage from the learning path to begin.
        </p>
        <Link
          href="/roadmap"
          className={cn(
            buttonVariants({ size: "sm" }),
            "bg-amber-500 hover:bg-amber-400 text-black font-semibold border-transparent"
          )}
        >
          Go to Roadmap
        </Link>
      </div>
    );
  }

  // Read curriculum content fresh — never from DB
  const stage = getStageByKey(sprint.stageKey);

  const tasks = sprint.tasks.filter((t: SprintTask) => t.type === "TASK");
  const challenges = sprint.tasks.filter((t: SprintTask) => t.type === "CHALLENGE");

  const tasksComplete = tasks.filter((t: SprintTask) => t.isComplete).length;
  const challengesComplete = challenges.filter((t: SprintTask) => t.isComplete).length;
  const totalTasks = tasks.length;
  const totalChallenges = challenges.length;

  const taskProgress = totalTasks > 0 ? Math.round((tasksComplete / totalTasks) * 100) : 0;
  const allTasksDone = tasksComplete === totalTasks;
  const allChallengesDone = challengesComplete === totalChallenges;

  // Phase visibility
  const showChallenges = taskProgress >= 50 || allChallengesDone;
  const showProject = allTasksDone && allChallengesDone && sprint.isActive;

  const dayElapsed =
    Math.floor(
      (new Date().getTime() - new Date(sprint.createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;
  const daysRemaining = Math.max(0, sprint.durationDays - dayElapsed + 1);

  const chapterTitle = stage?.chapterTitle ?? `Chapter ${sprint.chapterNumber}`;

  return (
    <div className="px-4 py-6 sm:px-6 max-w-2xl w-full mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-1">
          {chapterTitle} · Stage {sprint.stageNumber}
        </p>
        <h1 className="text-xl font-semibold text-foreground">{sprint.title}</h1>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {sprint.goal}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 flex-wrap mt-3">
          <MetaChip label="Day" value={`${dayElapsed} / ${sprint.durationDays}`} />
          <MetaChip
            label="Days left"
            value={`${daysRemaining}`}
            accent={daysRemaining <= 3}
          />
          <MetaChip label="Tasks" value={`${tasksComplete}/${totalTasks}`} />
          {totalChallenges > 0 && (
            <MetaChip
              label="Challenges"
              value={`${challengesComplete}/${totalChallenges}`}
            />
          )}
        </div>
      </div>

      {/* ── PHASE 1: RESOURCES ── */}
      {stage && (
        <PhaseSection label="Resources">
          <div className="flex flex-col gap-2">
            <ResourceRow resource={stage.resources.primary} label="Start here" />
            <ResourceRow resource={stage.resources.reference} label="Reference" />
            {stage.resources.deepDive && (
              <ResourceRow resource={stage.resources.deepDive} label="Deep dive" />
            )}
          </div>
        </PhaseSection>
      )}

      {/* ── PHASE 2: TASKS ── */}
      <PhaseSection label={`Tasks — ${tasksComplete}/${totalTasks} complete`}>
        {/* Progress bar */}
        <div className="h-1 w-full rounded-full bg-muted overflow-hidden mb-3">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${taskProgress}%` }}
          />
        </div>

        <div className="rounded-lg border border-border overflow-hidden bg-card">
          {tasks.map((task: SprintTask) => (
            <div key={task.id} className="px-4 border-b border-border last:border-0">
              <SprintTaskItem
                id={task.id}
                title={task.title}
                isComplete={task.isComplete}
              />
            </div>
          ))}
        </div>

        {/* Task descriptions from curriculum */}
        {stage && taskProgress < 100 && (
          <div className="mt-3 rounded-lg border border-border bg-card divide-y divide-border">
            {tasks
              .filter((t: SprintTask) => !t.isComplete)
              .slice(0, 1)
              .map((task: SprintTask) => {
                const curriculumTask = stage.tasks.find(
                  (ct) => ct.title === task.title
                );
                if (!curriculumTask) return null;
                return (
                  <div key={task.id} className="px-4 py-3">
                    <p className="font-mono text-[10px] text-amber-500 uppercase tracking-widest mb-1">
                      Current task
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {curriculumTask.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {curriculumTask.description}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </PhaseSection>

      {/* ── PHASE 3: CHALLENGES (gated at 50% tasks) ── */}
      {challenges.length > 0 && (
        <PhaseSection
          label={`Challenges — ${challengesComplete}/${totalChallenges} complete`}
          locked={!showChallenges}
          lockReason="Complete at least half of the tasks to unlock challenges"
        >
          <div className="flex flex-col gap-4">
            {challenges.map((challenge: SprintTask, i: number) => {
              const curriculumChallenge = stage?.miniChallenges.find(
                (mc) => mc.title === challenge.title
              );
              return (
                <div
                  key={challenge.id}
                  className="rounded-lg border border-border bg-card overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                    <SprintTaskItem
                      id={challenge.id}
                      title={`${i + 1}. ${challenge.title}`}
                      isComplete={challenge.isComplete}
                    />
                  </div>
                  {curriculumChallenge && (
                    <div className="px-4 py-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {curriculumChallenge.description}
                      </p>
                      {curriculumChallenge.hint && (
                        <p className="text-[11px] text-muted-foreground/50 mt-2 border-t border-border pt-2">
                          Hint: {curriculumChallenge.hint}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </PhaseSection>
      )}

      {/* ── PHASE 4: REFLECTION ── (display-only, non-blocking) */}
      {allChallengesDone && stage && stage.reflectionPrompts.length > 0 && (
        <PhaseSection label="Reflection">
          <ol className="flex flex-col gap-3">
            {stage.reflectionPrompts.map((prompt, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="font-mono text-[10px] text-muted-foreground/40 mt-0.5 shrink-0">
                  {i + 1}.
                </span>
                {prompt}
              </li>
            ))}
          </ol>
        </PhaseSection>
      )}

      {/* ── PHASE 5: PROJECT (chapter-end, gated) ── */}
      {sprint.projectTitle && (
        <PhaseSection
          label="Chapter Project"
          locked={!showProject}
          lockReason="Complete all tasks and challenges first"
        >
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <FolderGit2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {sprint.projectTitle}
                </p>
                {sprint.projectDescription && (
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {sprint.projectDescription}
                  </p>
                )}
                {sprint.completionCriteria && (
                  <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
                    Criteria: {sprint.completionCriteria}
                  </p>
                )}
              </div>
            </div>
          </div>
        </PhaseSection>
      )}

      {/* ── INTERVIEW CTA ── */}
      {allChallengesDone && (() => {
        const lastInterview = sprint.interviews[0];
        const passed = lastInterview?.passed === true;
        const failed = lastInterview?.passed === false;
        const inCooldown = failed && lastInterview?.reinterviewAvailableAt
          && lastInterview.reinterviewAvailableAt > new Date();
        const cooldownMinutes = inCooldown
          ? Math.ceil((lastInterview.reinterviewAvailableAt!.getTime() - Date.now()) / 60000)
          : 0;

        return (
          <div className={cn(
            "rounded-lg border px-4 py-4",
            passed ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-card"
          )}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">
                  Stage Interview
                </p>
                {passed && (
                  <p className="text-sm font-medium text-emerald-500">
                    Passed — {lastInterview?.percentage?.toFixed(0)}%
                  </p>
                )}
                {inCooldown && (
                  <p className="text-sm font-medium text-foreground">
                    Available in {cooldownMinutes}m
                  </p>
                )}
                {!passed && !inCooldown && (
                  <p className="text-sm font-medium text-foreground">
                    {failed ? "Retake when ready" : "Ready for interview"}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {passed && (
                  <Link
                    href={`/interview/${sprint.id}/results`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View results
                  </Link>
                )}
                {!passed && !inCooldown && (
                  <Link
                    href={`/interview/${sprint.id}`}
                    className="px-4 py-3 rounded-md text-sm font-medium bg-amber-500 hover:bg-amber-400 text-black transition-colors"
                  >
                    {failed ? "Retake Interview" : "Begin Interview"}
                  </Link>
                )}
                {inCooldown && (
                  <span className="font-mono text-xs text-muted-foreground px-3 py-2 border border-border rounded-md">
                    Cooldown active
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function PhaseSection({
  label,
  children,
  locked,
  lockReason,
}: {
  label: string;
  children: React.ReactNode;
  locked?: boolean;
  lockReason?: string;
}) {
  return (
    <div className={cn(locked && "opacity-40 pointer-events-none select-none")}>
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
        {locked && lockReason && (
          <p className="text-[10px] text-muted-foreground/50 italic">{lockReason}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function MetaChip({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded border border-border bg-card px-2.5 py-1.5">
      <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest leading-none mb-0.5">
        {label}
      </p>
      <p
        className={cn(
          "font-mono text-xs font-semibold",
          accent ? "text-amber-500" : "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function ResourceRow({ resource, label }: { resource: Resource; label: string }) {
  const Icon =
    resource.type === "video"
      ? Layers
      : resource.type === "book"
      ? BookOpen
      : FileText;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 hover:bg-muted/30 transition-colors group"
    >
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
            {label}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/40">
            · {resource.estimatedDuration}
          </span>
        </div>
        <p className="text-sm font-medium text-foreground group-hover:text-amber-500 transition-colors truncate">
          {resource.title}
        </p>
        <p className="text-[11px] text-muted-foreground">{resource.author}</p>
      </div>
      <ExternalLink className="h-3 w-3 text-muted-foreground/30 shrink-0" />
    </a>
  );
}
