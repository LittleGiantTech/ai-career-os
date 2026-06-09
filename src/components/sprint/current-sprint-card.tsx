import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SprintTaskItem } from "./sprint-task-item";
import { NoSprintState } from "./no-sprint-state";
import { FolderGit2 } from "lucide-react";
import type { SprintTask } from "@/generated/prisma/client";

type Props = { userId: string };

export async function CurrentSprintCard({ userId }: Props) {
  const sprint = await prisma.sprint.findFirst({
    where: { userId, isActive: true },
    include: {
      tasks: { orderBy: { order: "asc" } },
    },
  });

  if (!sprint) return <NoSprintState />;

  const total = sprint.tasks.length;
  const done = sprint.tasks.filter((t: SprintTask) => t.isComplete).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const start = new Date(sprint.createdAt);
  const now = new Date();
  const dayElapsed = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  const dayTotal = sprint.durationDays;

  return (
    <Card className="border-border bg-card overflow-hidden">
      {/* Amber accent bar */}
      <div className="h-0.5 w-full bg-amber-500" />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="font-mono text-[10px] tracking-widest text-amber-500 uppercase mb-1">
              Active Sprint
            </p>
            <h2 className="text-base font-semibold text-foreground leading-snug">
              {sprint.title}
            </h2>
            {sprint.goal && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {sprint.goal}
              </p>
            )}
          </div>
          <Badge
            variant="outline"
            className="shrink-0 font-mono text-[10px] text-muted-foreground border-border"
          >
            Day {dayElapsed}/{dayTotal}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground font-mono">
              Progress
            </span>
            <span className="text-xs font-mono text-amber-500">
              {done}/{total} tasks
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Tasks */}
        {total > 0 ? (
          <div className="divide-y divide-border/50">
            {sprint.tasks.map((task: SprintTask) => (
              <SprintTaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                isComplete={task.isComplete}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-4">
            No tasks added to this sprint yet.
          </p>
        )}

        {/* Project requirement */}
        {sprint.projectTitle && (
          <div className="mt-5 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2.5">
            <FolderGit2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-0.5">
                Final Project
              </p>
              <p className="text-xs font-medium text-foreground truncate">
                {sprint.projectTitle}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
