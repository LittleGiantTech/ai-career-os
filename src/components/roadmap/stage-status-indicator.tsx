import { cn } from "@/lib/utils";
import type { StageStatus } from "@/lib/stage";

type Props = { status: StageStatus };

const config: Record<StageStatus, { label: string; className: string }> = {
  locked:    { label: "Locked",     className: "text-muted-foreground/40 border-border/40" },
  startable: { label: "Ready",      className: "text-amber-500 border-amber-500/40 bg-amber-500/5" },
  active:    { label: "In progress", className: "text-amber-500 border-amber-500/60 bg-amber-500/10" },
  complete:  { label: "Complete",   className: "text-emerald-500 border-emerald-500/30 bg-emerald-500/5" },
};

export function StageStatusIndicator({ status }: Props) {
  const { label, className } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-mono font-medium tracking-wider uppercase",
        className
      )}
    >
      {label}
    </span>
  );
}
