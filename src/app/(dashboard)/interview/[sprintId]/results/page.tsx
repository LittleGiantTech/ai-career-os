import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import { calculateMasteryIndex } from "@/lib/mastery";
import { completeStage } from "@/actions/stage";
import { cn } from "@/lib/utils";
import type { QuestionType } from "@/generated/prisma/client";

type Props = {
  params: Promise<{ sprintId: string }>;
  searchParams: Promise<{ error?: string }>;
};

const QUESTION_LABEL: Record<QuestionType, string> = {
  CONCEPT:       "Concept",
  APPLICATION:   "Application",
  ARCHITECTURE:  "Architecture",
  DEFENSE:       "Defense",
  CONNECTION:    "Connection",
  WEAKNESS_RETEST: "Retention Check",
};

const SCORE_LABEL: Record<number, string> = {
  0: "No answer",
  1: "Incorrect",
  2: "Partial",
  3: "Correct",
  4: "Excellent",
};

export default async function InterviewResultsPage({ params, searchParams }: Props) {
  const { sprintId } = await params;
  const { error: completionError } = await searchParams;
  const user = await getOrCreateUser();

  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
    include: {
      interviews: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { questions: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!sprint || sprint.userId !== user.id) notFound();

  const interview = sprint.interviews[0];
  if (!interview) notFound();

  // Not yet evaluated — edge case
  if (interview.status === "AWAITING_EVALUATION" || interview.status === "PENDING") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-sm text-muted-foreground">Evaluating your responses…</p>
      </div>
    );
  }

  const passed = interview.passed ?? false;
  const percentage = interview.percentage ?? 0;
  const masteryIndex = passed ? await calculateMasteryIndex(user.id) : null;

  // Cooldown remaining
  const cooldownRemaining = !passed && interview.reinterviewAvailableAt
    ? Math.max(0, Math.ceil((interview.reinterviewAvailableAt.getTime() - Date.now()) / 60000))
    : 0;

  async function handleComplete() {
    "use server";
    const result = await completeStage(sprintId);
    if (result.success) {
      redirect("/dashboard");
    } else {
      redirect(
        `/interview/${sprintId}/results?error=${encodeURIComponent(result.error)}`
      );
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 max-w-2xl w-full mx-auto flex flex-col gap-6">
      {/* Result header */}
      <div className={cn(
        "rounded-lg border px-5 py-4",
        passed
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-destructive/30 bg-destructive/5"
      )}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase mb-1 text-muted-foreground">
              {passed ? "Interview passed" : "Interview not passed"}
            </p>
            <p className={cn(
              "text-3xl font-semibold font-mono tabular-nums",
              passed ? "text-emerald-500" : "text-destructive"
            )}>
              {percentage.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {interview.totalScore}/{interview.maxScore} points · Threshold: 85%
            </p>
          </div>

          {passed && masteryIndex !== null && (
            <div className="text-right">
              <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-1">
                Mastery Index
              </p>
              <p className="text-3xl font-semibold font-mono tabular-nums text-foreground">
                {masteryIndex}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">path average</p>
            </div>
          )}
        </div>

        {!passed && interview.failReason && (
          <p className="mt-3 text-xs text-destructive/80 border-t border-destructive/20 pt-3">
            {interview.failReason}
          </p>
        )}
      </div>

      {/* Question breakdown */}
      <div className="flex flex-col gap-0 rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border bg-muted/20">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Question breakdown
          </p>
        </div>
        {interview.questions.map((q) => (
          <div
            key={q.id}
            className="flex items-start gap-4 px-4 py-3 border-b border-border last:border-0"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  {QUESTION_LABEL[q.questionType]}
                </span>
                {q.weaknessFlagged && (
                  <span className="font-mono text-[10px] text-amber-500 border border-amber-500/30 px-1.5 rounded">
                    weakness
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{q.conceptTested}</p>
              {q.notes && (
                <p className="text-xs text-muted-foreground/60 mt-1 italic">{q.notes}</p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className={cn(
                "font-mono text-sm font-semibold tabular-nums",
                q.score >= 3 ? "text-foreground" : q.score === 2 ? "text-amber-500" : "text-destructive"
              )}>
                {q.score}/4
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {SCORE_LABEL[q.score] ?? ""}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      {passed ? (
        <div className="flex flex-col gap-3">
          {sprint.isActive ? (
            <>
              <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
                <p className="text-xs text-emerald-500 font-medium">
                  Stage completion unlocked. Complete all tasks and challenges to advance.
                </p>
              </div>
              {completionError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
                  <p className="text-xs text-destructive">{completionError}</p>
                </div>
              )}
              <form action={handleComplete}>
                <button
                  type="submit"
                  className="w-full py-3 rounded-md text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors"
                >
                  Complete Stage & Advance
                </button>
              </form>
            </>
          ) : (
            <div className="rounded-md border border-border bg-muted/20 px-4 py-3 text-center">
              <p className="font-mono text-xs text-muted-foreground">
                Stage already complete.
              </p>
            </div>
          )}
          <Link
            href="/sprint"
            className="block py-3.5 text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Return to sprint
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {cooldownRemaining > 0 ? (
            <div className="rounded-md border border-border bg-muted/20 px-4 py-3 text-center">
              <p className="font-mono text-xs text-muted-foreground">
                Re-interview available in{" "}
                <span className="text-foreground">
                  {cooldownRemaining} minute{cooldownRemaining !== 1 ? "s" : ""}
                </span>
              </p>
            </div>
          ) : (
            <Link
              href={`/interview/${sprintId}`}
              className="w-full py-3 rounded-md text-sm font-semibold text-center bg-amber-500 hover:bg-amber-400 text-black transition-colors"
            >
              Retake Interview
            </Link>
          )}
          <Link
            href="/sprint"
            className="block py-3.5 text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Return to sprint to review material
          </Link>
        </div>
      )}
    </div>
  );
}
