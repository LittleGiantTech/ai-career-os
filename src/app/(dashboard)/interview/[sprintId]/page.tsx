import { notFound, redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import { getStageByKey } from "@/lib/curriculum";
import { submitInterview } from "@/actions/interview";
import type { InterviewAnswers } from "@/actions/interview";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ sprintId: string }>;
  searchParams: Promise<{ error?: string }>;
};

const QUESTION_TYPES = [
  { key: "concept" as const,      label: "Concept",      description: "Explain your understanding of the core concept." },
  { key: "application" as const,  label: "Application",  description: "Apply the concept to a real engineering scenario." },
  { key: "architecture" as const, label: "Architecture", description: "Design or evaluate a system using what you have learned." },
  { key: "defense" as const,      label: "Defense",      description: "Defend a technical position under challenge." },
  { key: "connection" as const,   label: "Connection",   description: "Connect this stage's concepts to prior learning." },
];

export default async function InterviewPage({ params, searchParams }: Props) {
  const { sprintId } = await params;
  const { error: submissionError } = await searchParams;
  const user = await getOrCreateUser();

  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
    include: {
      interviews: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!sprint || sprint.userId !== user.id) notFound();
  if (!sprint.isActive) redirect("/sprint");

  // Check cooldown
  const lastInterview = sprint.interviews[0];
  if (
    lastInterview &&
    !lastInterview.passed &&
    lastInterview.reinterviewAvailableAt &&
    lastInterview.reinterviewAvailableAt > new Date()
  ) {
    redirect(`/interview/${sprintId}/results`);
  }

  const stage = getStageByKey(sprint.stageKey);
  if (!stage) notFound();

  const questions = [
    { key: "concept" as const,      label: "Concept",      description: QUESTION_TYPES[0].description, question: stage.interviewBlueprint.concept },
    { key: "application" as const,  label: "Application",  description: QUESTION_TYPES[1].description, question: stage.interviewBlueprint.application },
    { key: "architecture" as const, label: "Architecture", description: QUESTION_TYPES[2].description, question: stage.interviewBlueprint.architecture },
    { key: "defense" as const,      label: "Defense",      description: QUESTION_TYPES[3].description, question: stage.interviewBlueprint.defense },
    { key: "connection" as const,   label: "Connection",   description: QUESTION_TYPES[4].description, question: stage.interviewBlueprint.connection },
  ];

  const attemptNumber = sprint.interviews.length + 1;

  async function handleSubmit(formData: FormData) {
    "use server";
    const answers: InterviewAnswers = {
      concept:      formData.get("concept")?.toString() ?? "",
      application:  formData.get("application")?.toString() ?? "",
      architecture: formData.get("architecture")?.toString() ?? "",
      defense:      formData.get("defense")?.toString() ?? "",
      connection:   formData.get("connection")?.toString() ?? "",
    };
    const result = await submitInterview(sprintId, answers);
    if (!result.success) {
      redirect(`/interview/${sprintId}?error=${encodeURIComponent(result.error)}`);
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 max-w-2xl w-full mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            Stage {stage.number} · Chapter {stage.chapter}
          </span>
          {attemptNumber > 1 && (
            <span className="font-mono text-[10px] text-amber-500">
              Attempt {attemptNumber}
            </span>
          )}
        </div>
        <h1 className="text-xl font-semibold text-foreground">{stage.title} — Interview</h1>

        <div className="mt-4 rounded-md border border-border bg-muted/30 px-4 py-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This interview determines stage completion. Answer each question completely and precisely.
            Your responses will be evaluated and recorded. Incomplete or vague answers will not pass.
          </p>
        </div>
      </div>

      {/* Submission error */}
      {submissionError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-xs text-destructive">{submissionError}</p>
        </div>
      )}

      {/* Questions */}
      <form action={handleSubmit} className="flex flex-col gap-8">
        {questions.map((q, idx) => (
          <div key={q.key} className="flex flex-col gap-3">
            {/* Question header */}
            <div className="flex items-start gap-3">
              <span className="font-mono text-[10px] text-muted-foreground/50 pt-0.5 w-4 shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-mono uppercase tracking-wider",
                    q.key === "architecture" || q.key === "defense"
                      ? "border-amber-500/40 text-amber-500 bg-amber-500/5"
                      : "border-border text-muted-foreground"
                  )}>
                    {q.label}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {q.question}
                </p>
              </div>
            </div>

            {/* Answer textarea */}
            <div className="pl-7">
              <textarea
                name={q.key}
                rows={5}
                maxLength={3000}
                placeholder="Write your answer here. Be specific and precise."
                className={cn(
                  "w-full rounded-md border border-border bg-transparent px-3 py-2.5 text-sm",
                  "text-foreground placeholder:text-muted-foreground/30",
                  "focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20",
                  "resize-y min-h-[120px] transition-colors"
                )}
              />
            </div>
          </div>
        ))}

        {/* Submit */}
        <div className="border-t border-border pt-6 flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">
            Architecture and Defense questions require a score of at least 2/4 to pass.
            The overall threshold is 85%.
          </p>
          <button
            type="submit"
            className={cn(
              "w-full py-3 rounded-md text-sm font-semibold transition-colors",
              "bg-amber-500 hover:bg-amber-400 text-black"
            )}
          >
            Submit Interview
          </button>
        </div>
      </form>
    </div>
  );
}
