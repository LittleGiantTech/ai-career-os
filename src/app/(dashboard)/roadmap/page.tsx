import Link from "next/link";
import { getOrCreateUser } from "@/lib/user";
import { getStagesWithStatus } from "@/lib/stage";
import { CHAPTER_BOUNDARIES, TOTAL_STAGES } from "@/lib/constants";
import { StageStatusIndicator } from "@/components/roadmap/stage-status-indicator";
import { StartStageButton } from "@/components/roadmap/start-stage-button";
import { cn } from "@/lib/utils";
import type { StageWithStatus } from "@/lib/stage";

export default async function RoadmapPage() {
  const user = await getOrCreateUser();
  const stagesWithStatus = await getStagesWithStatus(user.id);

  const completed = stagesWithStatus.filter((s) => s.status === "complete").length;
  const progressPct = Math.round((completed / TOTAL_STAGES) * 100);

  // Group by chapter
  const chapters = Object.entries(CHAPTER_BOUNDARIES).map(([num, [first, last]]) => {
    const chapterStages = stagesWithStatus.filter(
      (s) => s.stage.chapter === Number(num)
    );
    const chapterCompleted = chapterStages.filter(
      (s) => s.status === "complete"
    ).length;
    return {
      number: Number(num),
      title: chapterStages[0]?.stage.chapterTitle ?? `Chapter ${num}`,
      stages: chapterStages,
      completed: chapterCompleted,
      total: chapterStages.length,
    };
  });

  return (
    <div className="px-4 py-6 sm:px-6 max-w-2xl w-full mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] text-amber-500 uppercase mb-1">
          AI Product Engineer
        </p>
        <h1 className="text-xl font-semibold text-foreground">Learning Path</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {completed} of {TOTAL_STAGES} stages complete
        </p>

        {/* Path progress bar */}
        <div className="mt-3 h-1 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Chapters */}
      {chapters.map((chapter) => (
        <ChapterSection key={chapter.number} chapter={chapter} />
      ))}
    </div>
  );
}

type ChapterData = {
  number: number;
  title: string;
  stages: StageWithStatus[];
  completed: number;
  total: number;
};

function ChapterSection({ chapter }: { chapter: ChapterData }) {
  const allComplete = chapter.completed === chapter.total;

  return (
    <div>
      {/* Chapter header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Chapter {chapter.number}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {chapter.title}
          </span>
        </div>
        <span
          className={cn(
            "font-mono text-[10px] tabular-nums",
            allComplete ? "text-emerald-500" : "text-muted-foreground"
          )}
        >
          {chapter.completed}/{chapter.total}
        </span>
      </div>

      {/* Stage list */}
      <div className="rounded-lg border border-border overflow-hidden">
        {chapter.stages.map((item, idx) => (
          <StageRow
            key={item.stage.key}
            item={item}
            isLast={idx === chapter.stages.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function StageRow({
  item,
  isLast,
}: {
  item: StageWithStatus;
  isLast: boolean;
}) {
  const { stage, status } = item;
  const isLocked = status === "locked";

  return (
    <div
      className={cn(
        "relative flex items-center gap-4 px-4 py-3 bg-card transition-colors group",
        !isLast && "border-b border-border",
        status === "active" && "border-l-2 border-l-amber-500",
        !isLocked && "hover:bg-muted/30"
      )}
    >
      {/* Full-row tap target — sits below interactive CTAs via z-0 */}
      {!isLocked && (
        <Link
          href={`/roadmap/${stage.number}`}
          className="absolute inset-0 z-0"
          aria-label={`Stage ${stage.number}: ${stage.title}`}
        />
      )}

      {/* Stage number */}
      <span
        className={cn(
          "relative z-10 font-mono text-xs tabular-nums w-6 shrink-0 text-right",
          isLocked ? "text-muted-foreground/30" : "text-muted-foreground"
        )}
      >
        {stage.number}
      </span>

      {/* Title + chapter-end indicator */}
      <div className="relative z-10 flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate",
            isLocked
              ? "text-muted-foreground/40"
              : "text-foreground group-hover:text-amber-500 transition-colors"
          )}
        >
          {stage.title}
          {stage.isChapterEnd && (
            <span className="ml-2 font-mono text-[10px] text-muted-foreground/60 normal-case tracking-normal">
              + chapter project
            </span>
          )}
        </p>
        <span className="font-mono text-[10px] text-muted-foreground/50">
          ~{stage.estimatedDays}d
        </span>
      </div>

      {/* Status / CTA */}
      <div className="relative z-10 shrink-0 flex items-center gap-2">
        {status === "startable" && (
          <StartStageButton stageNumber={stage.number} />
        )}
        {status === "active" && (
          <Link
            href="/sprint"
            className="inline-flex items-center px-3 py-3.5 rounded-md text-xs font-medium border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 transition-colors"
          >
            Continue
          </Link>
        )}
        {status !== "startable" && status !== "active" && (
          <StageStatusIndicator status={status} />
        )}
      </div>
    </div>
  );
}
