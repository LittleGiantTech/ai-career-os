import type { Sprint, SprintTask } from "@/generated/prisma/client";
import type { CurriculumStage } from "@/lib/curriculum";

type SprintWithTasks = Sprint & { tasks: SprintTask[] };

// ─────────────────────────────────────────────────────────────────────────────
// Stage Progress Card
// ─────────────────────────────────────────────────────────────────────────────

type StageProgressProps = {
  sprint: SprintWithTasks | null;
  stage: CurriculumStage | undefined;
  currentStage: number;
  totalStages: number;
};

export function StageProgressCard({
  sprint,
  stage,
  currentStage,
  totalStages,
}: StageProgressProps) {
  const done = sprint?.tasks.filter((t) => t.isComplete).length ?? 0;
  const total = sprint?.tasks.length ?? 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const overallPct = Math.round(((currentStage - 1) / totalStages) * 100);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-mono text-[10px] tracking-[0.16em] text-amber-500 uppercase mb-4">
        Current Stage
      </p>

      <div className="flex items-end gap-3 mb-1">
        <span className="font-mono text-5xl font-bold text-foreground leading-none">
          {currentStage}
        </span>
        <span className="font-mono text-sm text-muted-foreground mb-1">
          / {totalStages}
        </span>
      </div>

      <p className="text-sm font-semibold text-foreground mb-0.5">
        {stage?.title ?? `Stage ${currentStage}`}
      </p>
      <p className="font-mono text-[11px] text-muted-foreground mb-4">
        {stage?.chapterTitle ?? "—"}
      </p>

      {/* Sprint task progress */}
      {sprint && total > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Sprint tasks
            </span>
            <span className="font-mono text-[10px] text-amber-500">
              {done} / {total}
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Curriculum arc progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Curriculum arc
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {overallPct}%
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-amber-500/40 rounded-full"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mastery Index Card
// ─────────────────────────────────────────────────────────────────────────────

type MasteryIndexProps = {
  masteryIndex: number;
  interviewCount: number;
};

function masteryLabel(score: number): string {
  if (score === 0) return "No data yet";
  if (score < 60) return "Building foundation";
  if (score < 75) return "Developing";
  if (score < 85) return "Solid progress";
  if (score < 93) return "Strong";
  return "Elite";
}

function MasteryArc({ pct }: { pct: number }) {
  const size = 96;
  const strokeWidth = 6;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="-rotate-90"
      aria-hidden="true"
    >
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="oklch(0.15 0 0)"
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      {pct > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#00D4AA"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function MasteryIndexCard({ masteryIndex, interviewCount }: MasteryIndexProps) {
  const label = masteryLabel(masteryIndex);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-mono text-[10px] tracking-[0.16em] text-[#00D4AA] uppercase mb-4">
        Mastery Index
      </p>

      <div className="flex items-center gap-5 mb-4">
        {/* Arc visual */}
        <div className="relative shrink-0">
          <MasteryArc pct={masteryIndex} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-lg font-bold text-foreground leading-none">
              {masteryIndex}
              <span className="text-sm font-normal text-muted-foreground">%</span>
            </span>
          </div>
        </div>

        {/* Label stack */}
        <div>
          <p className="text-xl font-bold text-foreground leading-tight mb-0.5">
            {masteryIndex > 0 ? `${masteryIndex}%` : "—"}
          </p>
          <p className="text-sm text-[#00D4AA] font-medium mb-2">{label}</p>
          <p className="font-mono text-[11px] text-muted-foreground">
            {interviewCount === 0
              ? "No interviews completed"
              : `Avg across ${interviewCount} interview${interviewCount === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      {/* Threshold indicator */}
      <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Mastery threshold
          </span>
          <span className="font-mono text-[10px] text-[#00D4AA]">85%</span>
        </div>
        <div className="h-1 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(masteryIndex, 100)}%`,
              background:
                masteryIndex >= 85 ? "#00E87A" : "#00D4AA",
            }}
          />
        </div>
        {masteryIndex > 0 && masteryIndex < 85 && (
          <p className="font-mono text-[10px] text-muted-foreground mt-1.5">
            {85 - masteryIndex}% below threshold
          </p>
        )}
        {masteryIndex >= 85 && (
          <p className="font-mono text-[10px] text-[#00E87A] mt-1.5">
            Above threshold
          </p>
        )}
      </div>
    </div>
  );
}
