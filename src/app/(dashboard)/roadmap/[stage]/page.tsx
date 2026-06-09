import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, BookOpen, FileText, Layers } from "lucide-react";
import { getOrCreateUser } from "@/lib/user";
import { getStage } from "@/lib/curriculum";
import { getStagesWithStatus } from "@/lib/stage";
import { StartStageButton } from "@/components/roadmap/start-stage-button";
import { StageStatusIndicator } from "@/components/roadmap/stage-status-indicator";
import type { Resource } from "@/lib/curriculum";
import type { StageStatus } from "@/lib/stage";

type Props = { params: Promise<{ stage: string }> };

export default async function StageDetailPage({ params }: Props) {
  const { stage: stageParam } = await params;
  const stageNumber = parseInt(stageParam, 10);

  if (isNaN(stageNumber)) notFound();

  const stage = getStage(stageNumber);
  if (!stage) notFound();

  const user = await getOrCreateUser();
  const stagesWithStatus = await getStagesWithStatus(user.id);
  const stageData = stagesWithStatus.find((s) => s.stage.number === stageNumber);
  const status: StageStatus = stageData?.status ?? "locked";
  const sprintId = stageData?.sprintId;

  return (
    <div className="px-4 py-6 sm:px-6 max-w-2xl w-full mx-auto flex flex-col gap-8">
      {/* Back */}
      <Link
        href="/roadmap"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Learning Path
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Chapter {stage.chapter} · Stage {stage.number}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">{stage.title}</h1>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-lg">
            {stage.description}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/60 mt-2">
            ~{stage.estimatedDays} days · {stage.tasks.length} tasks · {stage.miniChallenges.length} challenges
          </p>
        </div>
        <StageStatusIndicator status={status} />
      </div>

      {/* Why it matters */}
      <Section title="Why this stage matters">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {stage.whyItMatters}
        </p>
      </Section>

      {/* Resources */}
      <Section title="Resources">
        <div className="flex flex-col gap-2">
          <ResourceRow resource={stage.resources.primary} label="Primary" />
          <ResourceRow resource={stage.resources.reference} label="Reference" />
          {stage.resources.deepDive && (
            <ResourceRow resource={stage.resources.deepDive} label="Deep dive" />
          )}
        </div>
      </Section>

      {/* Tasks */}
      <Section title={`Tasks — ${stage.tasks.length}`}>
        <ol className="flex flex-col gap-1">
          {stage.tasks.map((task, i) => (
            <li key={task.key} className="flex items-start gap-3 py-1.5">
              <span className="font-mono text-[10px] text-muted-foreground/50 w-5 text-right shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="text-sm text-foreground">{task.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Challenges */}
      <Section title={`Challenges — ${stage.miniChallenges.length}`}>
        <div className="flex flex-col gap-4">
          {stage.miniChallenges.map((challenge, i) => (
            <div key={challenge.key} className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground mb-1">
                {i + 1}. {challenge.title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {challenge.description}
              </p>
              {challenge.hint && (
                <p className="text-[11px] text-muted-foreground/60 mt-2 border-t border-border pt-2">
                  Hint: {challenge.hint}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Chapter project (chapter-end stages only) */}
      {stage.isChapterEnd && stage.chapterProject && (
        <Section title="Chapter Project">
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-sm font-semibold text-foreground mb-1">
              {stage.chapterProject.title}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {stage.chapterProject.description}
            </p>
            <ul className="flex flex-col gap-1">
              {stage.chapterProject.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-amber-500/60 mt-0.5 shrink-0">·</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* Completion criteria */}
      <Section title="Completion criteria">
        <ul className="flex flex-col gap-1.5">
          {stage.completionCriteria.map((criterion, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-muted-foreground/40 mt-0.5 shrink-0 font-mono text-xs">
                {i + 1}.
              </span>
              {criterion}
            </li>
          ))}
        </ul>
      </Section>

      {/* Interview preview */}
      <Section title="Interview blueprint">
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {Object.entries(stage.interviewBlueprint).map(([type, question], i) => (
            <div
              key={type}
              className={`px-4 py-3 ${i < Object.keys(stage.interviewBlueprint).length - 1 ? "border-b border-border" : ""}`}
            >
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                {type}
              </p>
              <p className="text-xs text-foreground leading-relaxed">{question}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Reflection prompts */}
      <Section title="Reflection prompts">
        <ol className="flex flex-col gap-3">
          {stage.reflectionPrompts.map((prompt, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="font-mono text-[10px] text-muted-foreground/40 mt-0.5 shrink-0">
                {i + 1}.
              </span>
              {prompt}
            </li>
          ))}
        </ol>
      </Section>

      {/* CTA */}
      <div className="pt-2 border-t border-border">
        {status === "startable" && (
          <StartStageButton stageNumber={stage.number} className="w-full justify-center" />
        )}
        {status === "active" && (
          <Link
            href="/sprint"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md text-sm font-medium border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 transition-colors"
          >
            Continue this stage
          </Link>
        )}
        {status === "complete" && (
          <p className="text-center text-xs text-muted-foreground">
            Stage complete.
          </p>
        )}
        {status === "locked" && (
          <p className="text-center text-xs text-muted-foreground">
            Complete prior stages to unlock this one.
          </p>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

function ResourceRow({
  resource,
  label,
}: {
  resource: Resource;
  label: string;
}) {
  const Icon =
    resource.type === "video"
      ? Layers
      : resource.type === "book"
      ? BookOpen
      : FileText;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 rounded-md border border-border bg-card px-3 py-2.5 hover:bg-muted/30 transition-colors group"
    >
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
            {label}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/40">
            · {resource.estimatedDuration}
          </span>
        </div>
        <p className="text-sm font-medium text-foreground group-hover:text-amber-500 transition-colors truncate">
          {resource.title}
        </p>
        <p className="text-[11px] text-muted-foreground">{resource.author}</p>
      </div>
      <ExternalLink className="h-3 w-3 text-muted-foreground/40 shrink-0 mt-1" />
    </a>
  );
}
