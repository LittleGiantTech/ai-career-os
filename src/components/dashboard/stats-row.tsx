import type { User } from "@/generated/prisma/client";
import { getStage } from "@/lib/curriculum";

type Props = { user: User; hasActiveSprint: boolean };

export function StatsRow({ user, hasActiveSprint }: Props) {
  const stage = user.currentStage;
  const curriculumStage = getStage(stage);
  const stageLabel = curriculumStage?.chapterTitle ?? `Stage ${stage}`;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <StatCard label="Current Stage" value={`Stage ${stage}`} sub={stageLabel} />
      <StatCard label="Day Streak" value={`${user.streak}`} sub="consecutive days" />
      <StatCard
        label="Status"
        value={hasActiveSprint ? "Active" : "No Sprint"}
        sub={hasActiveSprint ? "sprint in progress" : "start from roadmap"}
        className="col-span-2 sm:col-span-1"
        accent={hasActiveSprint}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
  className,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-border bg-card px-4 py-3.5 ${className ?? ""}`}
    >
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
        {label}
      </p>
      <p
        className={`text-xl font-semibold font-mono ${accent ? "text-amber-500" : "text-foreground"}`}
      >
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}
