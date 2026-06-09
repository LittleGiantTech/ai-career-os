// ─────────────────────────────────────────────────────────────────────────────
// Resource
// Each resource must pass the selection standard:
//   Tier 1: Official documentation
//   Tier 2: Industry-recognized educators (MDN-endorsed, O'Reilly, university)
// Low-authority content (AI influencers, Medium, Twitter) is never included.
// ─────────────────────────────────────────────────────────────────────────────

export type ResourceTier = "tier-1-official" | "tier-2-educator";
export type QualityRating = "definitive" | "excellent" | "good";
export type ResourceType = "video" | "documentation" | "book" | "course";

export type Resource = {
  title: string;
  author: string;
  url: string;
  type: ResourceType;
  tier: ResourceTier;
  estimatedDuration: string;
  selectionReason: string;
  qualityRating: QualityRating;
};

// ─────────────────────────────────────────────────────────────────────────────
// Curriculum content types
// ─────────────────────────────────────────────────────────────────────────────

export type CurriculumTask = {
  key: string;       // stable kebab-case identifier
  title: string;     // short label stored in SprintTask.title at sprint creation
  description: string; // one sentence — displayed in sprint page, never stored in DB
};

export type MiniChallenge = {
  key: string;
  title: string;
  description: string;
  hint?: string;
};

export type InterviewBlueprint = {
  concept: string;      // tests mental model accuracy
  application: string;  // tests practical use in a real scenario
  architecture: string; // tests system-level thinking and tradeoffs
  defense: string;      // tests reasoning under challenge
  connection: string;   // tests integration with prior stages
};

export type ChapterProjectArtifacts = {
  architectureDiagram: boolean;
  workflowDiagram: boolean;
  minAdrCount: number;
  additionalNotes?: string[];
};

export type ChapterProject = {
  title: string;
  description: string;
  requirements: string[];
  requiredArtifacts: ChapterProjectArtifacts;
};

// Reserved for future AI Coach integration — not yet populated in any stage.
export type KnowledgeCheck = {
  question: string;
  type: "free-text" | "multiple-choice";
  options?: string[];
  correctAnswer?: string;
  aiEvalContext?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// CurriculumStage — the core unit of the curriculum
//
// Consumed by:
//   - Roadmap page (title, chapter, estimatedDays)
//   - Stage detail page (full object)
//   - Sprint page (resources, miniChallenges[].description, reflectionPrompts)
//   - startStage() action (tasks, miniChallenges, projectTitle, durationDays)
//   - Interview system (interviewBlueprint)
//   - Stage unlock logic (number, chapter, isChapterEnd)
//
// Never written to by the application. Read-only source of truth.
// ─────────────────────────────────────────────────────────────────────────────

export type CurriculumStage = {
  // Identity — permanent, never change after first use
  key: string;          // "html-fundamentals" — stored in Sprint.stageKey
  number: number;       // 1–29 — stored in Sprint.stageNumber
  chapter: number;      // 1–6
  chapterTitle: string;
  isChapterEnd: boolean;

  // Content
  title: string;
  description: string;    // 2–3 sentences displayed in stage detail and sprint header
  whyItMatters: string;   // 1–2 paragraphs displayed in stage detail

  estimatedDays: number;  // mastery-based estimate, not task completion

  resources: {
    primary: Resource;
    reference: Resource;
    deepDive?: Resource;
  };

  tasks: CurriculumTask[];
  miniChallenges: MiniChallenge[];

  // For chapter-ending stages only; undefined for all others
  chapterProject?: ChapterProject;

  completionCriteria: string[];
  interviewBlueprint: InterviewBlueprint;
  reflectionPrompts: string[]; // 3–5 prompts; display-only, never tracked

  // Future AI Coach integration point — empty for all stages in initial release
  knowledgeChecks?: KnowledgeCheck[];
};
