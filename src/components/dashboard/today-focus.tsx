import { prisma } from "@/lib/prisma";
import { ArrowRight } from "lucide-react";

type Props = { userId: string };

export async function TodayFocus({ userId }: Props) {
  const sprint = await prisma.sprint.findFirst({
    where: { userId, isActive: true },
    include: {
      tasks: {
        where: { isComplete: false },
        orderBy: { order: "asc" },
        take: 1,
      },
    },
  });

  const nextTask = sprint?.tasks[0];

  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3.5 flex items-center gap-3">
      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-0.5">
          Today&apos;s Focus
        </p>
        <p className="text-sm font-medium text-foreground truncate">
          {nextTask?.title ?? "All tasks complete — great work!"}
        </p>
      </div>
      {nextTask && <ArrowRight className="h-3.5 w-3.5 text-amber-500/60 shrink-0" />}
    </div>
  );
}
