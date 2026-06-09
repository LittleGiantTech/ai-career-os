import { CHAPTER_1_STAGES } from "./chapter-1";
import { CHAPTER_2_STAGES } from "./chapter-2";
import { CHAPTER_3_STAGES } from "./chapter-3";
import { CHAPTER_4_STAGES } from "./chapter-4";
import { CHAPTER_5_STAGES } from "./chapter-5";
import { CHAPTER_6_STAGES } from "./chapter-6";
// import { CHAPTER_3_STAGES } from "./chapter-3";
// import { CHAPTER_4_STAGES } from "./chapter-4";
// import { CHAPTER_5_STAGES } from "./chapter-5";
// import { CHAPTER_6_STAGES } from "./chapter-6";

import type { CurriculumStage } from "./types";

export const CURRICULUM: CurriculumStage[] = [
  ...CHAPTER_1_STAGES,
  ...CHAPTER_2_STAGES,
  ...CHAPTER_3_STAGES,
  ...CHAPTER_4_STAGES,
  ...CHAPTER_5_STAGES,
  ...CHAPTER_6_STAGES,
];

// ─────────────────────────────────────────────────────────────────────────────
// Integrity checks — run at module load, fail fast if curriculum is malformed.
// ─────────────────────────────────────────────────────────────────────────────

const EXPECTED_FINAL_STAGE_COUNT = 29; // update when all chapters are added

// Stage numbers must be unique and sequential starting at 1
const stageNumbers = CURRICULUM.map((s) => s.number);
const uniqueNumbers = new Set(stageNumbers);
if (uniqueNumbers.size !== stageNumbers.length) {
  throw new Error(
    `Curriculum integrity error: duplicate stage numbers detected. Numbers: ${stageNumbers.join(", ")}`
  );
}

// Stage keys must be unique
const stageKeys = CURRICULUM.map((s) => s.key);
const uniqueKeys = new Set(stageKeys);
if (uniqueKeys.size !== stageKeys.length) {
  throw new Error(
    `Curriculum integrity error: duplicate stage keys detected.`
  );
}

// Each chapter must have exactly one chapter-end stage
const chapters = [...new Set(CURRICULUM.map((s) => s.chapter))];
for (const chapter of chapters) {
  const chapterEndStages = CURRICULUM.filter(
    (s) => s.chapter === chapter && s.isChapterEnd
  );
  if (chapterEndStages.length !== 1) {
    throw new Error(
      `Curriculum integrity error: chapter ${chapter} has ${chapterEndStages.length} chapter-end stages (expected exactly 1).`
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper functions — the only interface the application uses to read curriculum
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the stage with the given number, or undefined if not yet implemented. */
export function getStage(stageNumber: number): CurriculumStage | undefined {
  return CURRICULUM.find((s) => s.number === stageNumber);
}

/** Returns the stage with the given key, or undefined if not found. */
export function getStageByKey(key: string): CurriculumStage | undefined {
  return CURRICULUM.find((s) => s.key === key);
}

/** Returns all stages belonging to the given chapter number. */
export function getChapterStages(chapterNumber: number): CurriculumStage[] {
  return CURRICULUM.filter((s) => s.chapter === chapterNumber);
}

/** Returns the chapter-ending stage for a given chapter, or undefined. */
export function getChapterEndStage(
  chapterNumber: number
): CurriculumStage | undefined {
  return CURRICULUM.find((s) => s.chapter === chapterNumber && s.isChapterEnd);
}

/** Returns the total number of stages currently in the curriculum. */
export function getImplementedStageCount(): number {
  return CURRICULUM.length;
}

/** Returns the total number of stages the full path will contain. */
export function getTotalStageCount(): number {
  return EXPECTED_FINAL_STAGE_COUNT;
}

/** Returns true when all 29 stages have been added to the curriculum. */
export function isCurriculumComplete(): boolean {
  return CURRICULUM.length === EXPECTED_FINAL_STAGE_COUNT;
}

/**
 * Returns the chapter number for a given stage number.
 * Returns undefined if the stage is not yet implemented.
 */
export function getChapterForStage(stageNumber: number): number | undefined {
  return CURRICULUM.find((s) => s.number === stageNumber)?.chapter;
}

/**
 * Returns all stages in the same chapter as the given stage number.
 * Useful for building chapter synthesis interview context.
 */
export function getCoChapterStages(stageNumber: number): CurriculumStage[] {
  const stage = getStage(stageNumber);
  if (!stage) return [];
  return getChapterStages(stage.chapter);
}

// Re-export types so application code imports from a single location:
// import type { CurriculumStage } from "@/lib/curriculum"
export type {
  CurriculumStage,
  Resource,
  ResourceTier,
  QualityRating,
  ResourceType,
  CurriculumTask,
  MiniChallenge,
  InterviewBlueprint,
  ChapterProject,
  ChapterProjectArtifacts,
  KnowledgeCheck,
} from "./types";
