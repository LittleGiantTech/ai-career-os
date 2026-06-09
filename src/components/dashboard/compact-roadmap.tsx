import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { getStage } from "@/lib/curriculum";

type StageRowStatus = "complete" | "active" | "next" | "locked";

type StageEntry = {
  number: number;
  status: StageRowStatus;
};

type Props = {
  stages: StageEntry[];
  currentStage: number;
};

const STATUS_CONFIG: Record<
  StageRowStatus,
  {
    ring: string;
    bg: string;
    numColor: string;
    label: string;
    labelColor: string;
    rowBg: string;
  }
> = {
  complete: {
    ring: "border-[#00E87A]/60",
    bg: "bg-[#00E87A]/10",
    numColor: "text-[#00E87A]",
    label: "Complete",
    labelColor: "text-[#00E87A]",
    rowBg: "",
  },
  active: {
    ring: "border-amber-500",
    bg: "bg-amber-500/10",
    numColor: "text-amber-500",
    label: "Active",
    labelColor: "text-amber-500",
    rowBg: "bg-amber-500/5 border border-amber-500/15",
  },
  next: {
    ring: "border-border",
    bg: "bg-muted/30",
    numColor: "text-muted-foreground",
    label: "Up next",
    labelColor: "text-muted-foreground",
    rowBg: "",
  },
  locked: {
    ring: "border-border/50",
    bg: "bg-muted/10",
    numColor: "text-muted-foreground/40",
    label: "Locked",
    labelColor: "text-muted-foreground/40",
    rowBg: "",
  },
};

export function CompactRoadmap({ stages, currentStage }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          Stage Progression
        </p>
        <Link
          href="/roadmap"
          className="flex items-center gap-1 font-mono text-[10px] tracking-[0.08em] text-muted-foreground hover:text-foreground uppercase transition-colors"
        >
          Full roadmap
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {stages.map((entry, i) => {
          const stageDef = getStage(entry.number);
          if (!stageDef) return null;
          const cfg = STATUS_CONFIG[entry.status];
          const isActive = entry.status === "active";

          return (
            <div
              key={entry.number}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${cfg.rowBg}`}
            >
              {/* Status node */}
              <div
                className={`h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 ${cfg.ring} ${cfg.bg}`}
              >
                {entry.status === "complete" ? (
                  <Check className="h-3.5 w-3.5 text-[#00E87A]" />
                ) : (
                  <span
                    className={`font-mono text-[11px] font-bold ${cfg.numColor}`}
                  >
                    {entry.number}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p
                    className={`text-sm font-medium truncate ${
                      isActive ? "text-foreground" : "text-foreground/70"
                    }`}
                  >
                    {stageDef.title}
                  </p>
                  {isActive && (
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  )}
                </div>
                <p className="font-mono text-[10px] text-muted-foreground/60 truncate">
                  {stageDef.chapterTitle}
                </p>
              </div>

              {/* Status label */}
              <span
                className={`font-mono text-[10px] uppercase tracking-wider shrink-0 ${cfg.labelColor}`}
              >
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Connector thread — purely decorative */}
      {stages.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="font-mono text-[10px] text-muted-foreground/50">
            Stage {currentStage} of 29 &middot; Chapter {getStage(currentStage)?.chapter ?? "—"} of 6
          </p>
        </div>
      )}
    </div>
  );
}
