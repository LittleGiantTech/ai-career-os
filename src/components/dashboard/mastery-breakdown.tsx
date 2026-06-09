import type { Weakness } from "@/generated/prisma/client";
import { getStage } from "@/lib/curriculum";

type InterviewSummary = {
  stageNumber: number;
  percentage: number | null;
  passed: boolean | null;
  isChapterSynthesis: boolean;
};

type Props = {
  masteryIndex: number;
  weaknesses: Weakness[];
  passedInterviews: InterviewSummary[];
};

const SEVERITY_ORDER = {
  CRITICAL: 0,
  SIGNIFICANT: 1,
  FRAGILE: 2,
  PATTERN: 3,
} as const;

type SeverityKey = keyof typeof SEVERITY_ORDER;

const SEVERITY_STYLE: Record<SeverityKey, { label: string; dot: string; text: string; bg: string; border: string }> = {
  CRITICAL:    { label: "Critical",    dot: "bg-[#FF3B3B]", text: "text-[#FF3B3B]",  bg: "bg-[#FF3B3B]/10",  border: "border-[#FF3B3B]/25" },
  SIGNIFICANT: { label: "Significant", dot: "bg-amber-500", text: "text-amber-500",   bg: "bg-amber-500/10",   border: "border-amber-500/25" },
  FRAGILE:     { label: "Fragile",     dot: "bg-yellow-500", text: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/25" },
  PATTERN:     { label: "Pattern",     dot: "bg-zinc-500",   text: "text-zinc-400",   bg: "bg-zinc-500/10",   border: "border-zinc-500/25" },
};

export function MasteryBreakdown({ masteryIndex, weaknesses, passedInterviews }: Props) {
  const sorted = [...weaknesses].sort(
    (a, b) =>
      (SEVERITY_ORDER[a.severity as SeverityKey] ?? 4) -
      (SEVERITY_ORDER[b.severity as SeverityKey] ?? 4)
  );

  const topGap = sorted[0] ?? null;

  // Strengths: recent passing interviews with high scores
  const strengths = passedInterviews
    .filter((i) => !i.isChapterSynthesis && (i.percentage ?? 0) >= 88)
    .slice(0, 3);

  const hasWeaknesses = sorted.length > 0;
  const hasStrengths = strengths.length > 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] tracking-[0.16em] text-[#00D4AA] uppercase">
          Mastery Breakdown
        </p>
        <span className="font-mono text-sm font-bold text-[#00D4AA]">
          {masteryIndex}%
        </span>
      </div>

      {/* Active gaps */}
      <div className="mb-4">
        <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-2">
          Active gaps
          {hasWeaknesses && (
            <span className="ml-1.5 text-muted-foreground/50">
              ({sorted.length})
            </span>
          )}
        </p>

        {hasWeaknesses ? (
          <div className="flex flex-col gap-1.5">
            {sorted.slice(0, 4).map((w) => {
              const style = SEVERITY_STYLE[w.severity as SeverityKey] ?? SEVERITY_STYLE.PATTERN;
              return (
                <div
                  key={w.id}
                  className={`flex items-center gap-2.5 rounded-md border px-3 py-2 ${style.bg} ${style.border}`}
                >
                  <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${style.dot}`} />
                  <span className="text-xs text-foreground/80 truncate flex-1 min-w-0">
                    {w.conceptTested}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider shrink-0 ${style.text}`}
                  >
                    {style.label}
                  </span>
                </div>
              );
            })}
            {sorted.length > 4 && (
              <p className="font-mono text-[10px] text-muted-foreground pl-1">
                +{sorted.length - 4} more
              </p>
            )}
          </div>
        ) : (
          <p className="font-mono text-[11px] text-muted-foreground">
            No active gaps — keep building.
          </p>
        )}
      </div>

      {/* Strengths */}
      {hasStrengths && (
        <div className="mb-4">
          <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-2">
            Recent strengths
          </p>
          <div className="flex flex-col gap-1.5">
            {strengths.map((i) => {
              const stageDef = getStage(i.stageNumber);
              return (
                <div
                  key={i.stageNumber}
                  className="flex items-center gap-2.5 rounded-md border border-[#00E87A]/20 bg-[#00E87A]/8 px-3 py-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00E87A] shrink-0" />
                  <span className="text-xs text-foreground/80 truncate flex-1 min-w-0">
                    {stageDef?.title ?? `Stage ${i.stageNumber}`}
                  </span>
                  <span className="font-mono text-[10px] text-[#00E87A] shrink-0">
                    {Math.round(i.percentage ?? 0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Highest impact opportunity */}
      {topGap && (
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-1.5">
            Highest impact opportunity
          </p>
          <p className="text-xs font-semibold text-foreground mb-0.5">
            {topGap.conceptTested}
          </p>
          {topGap.description && (
            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
              {topGap.description}
            </p>
          )}
          <p className="font-mono text-[10px] text-amber-500 mt-1.5">
            Stage {topGap.stageNumber} · Address this first
          </p>
        </div>
      )}

      {!hasWeaknesses && !hasStrengths && masteryIndex === 0 && (
        <p className="font-mono text-[11px] text-muted-foreground">
          Complete your first stage interview to populate this panel.
        </p>
      )}
    </div>
  );
}
