import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Sprint, SprintTask } from "@/generated/prisma/client";
import type { CurriculumStage } from "@/lib/curriculum";

export type SprintWithTasks = Sprint & { tasks: SprintTask[] };

type Props = {
  sprint: SprintWithTasks | null;
  stage: CurriculumStage | undefined;
  currentStage: number;
};

export function MissionCard({ sprint, stage, currentStage }: Props) {
  if (!sprint || !stage) {
    return <NoMissionState currentStage={currentStage} stage={stage} />;
  }

  const tasks = sprint.tasks;
  const done = tasks.filter((t) => t.isComplete).length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const nextTask = tasks.find((t) => !t.isComplete);
  const allDone = done === total && total > 0;

  return (
    <div className="relative rounded-xl border border-border bg-card overflow-hidden">
      {/* Orange top gradient accent */}
      <div className="h-px w-full bg-gradient-to-r from-amber-500 via-amber-500/50 to-transparent" />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
          {/* Left: Mission details */}
          <div className="min-w-0">
            {/* Context label */}
            <p className="font-mono text-[10px] tracking-[0.18em] text-amber-500 uppercase mb-3">
              Active Mission · {stage.chapterTitle} · Stage {sprint.stageNumber}
            </p>

            {/* Stage title */}
            <h1 className="text-2xl font-bold text-foreground tracking-tight leading-tight mb-2">
              {stage.title}
            </h1>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-2xl line-clamp-2">
              {stage.description}
            </p>

            {/* Why it matters — the mission briefing */}
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 mb-5">
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-1.5">
                Why it matters
              </p>
              <p className="text-sm text-foreground/75 leading-relaxed line-clamp-2">
                {stage.whyItMatters}
              </p>
            </div>

            {/* Next action */}
            <div className="flex items-center gap-3">
              <div
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                  allDone ? "bg-[#00E87A]" : "bg-amber-500 animate-pulse"
                }`}
              />
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase shrink-0">
                Next action
              </p>
              <p className="text-sm font-medium text-foreground truncate">
                {allDone
                  ? "All tasks complete — ready for interview"
                  : (nextTask?.title ?? "—")}
              </p>
            </div>
          </div>

          {/* Right: Progress + CTA */}
          <div className="flex flex-col items-end justify-between gap-5 shrink-0 min-w-[160px]">
            {/* Task count */}
            <div className="text-right">
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-1">
                Sprint Progress
              </p>
              <p className="font-mono text-4xl font-bold text-foreground leading-none">
                {done}
                <span className="text-xl font-normal text-muted-foreground">
                  /{total}
                </span>
              </p>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                tasks complete
              </p>

              {/* Progress bar */}
              <div className="mt-3 w-full h-1 rounded-full bg-border overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    pct === 100 ? "bg-[#00E87A]" : "bg-amber-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="font-mono text-[10px] text-amber-500 mt-1 text-right">
                {pct}%
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/sprint"
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-semibold text-sm transition-colors duration-150 whitespace-nowrap"
            >
              Continue Sprint
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoMissionState({
  currentStage,
  stage,
}: {
  currentStage: number;
  stage: CurriculumStage | undefined;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card overflow-hidden">
      <div className="p-6">
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase mb-3">
          No Active Mission
        </p>
        <h1 className="text-xl font-bold text-foreground tracking-tight mb-1.5">
          {stage?.title ?? `Stage ${currentStage}`}
        </h1>
        {stage && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xl">
            {stage.description}
          </p>
        )}
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors duration-150"
        >
          Start Stage {currentStage}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
