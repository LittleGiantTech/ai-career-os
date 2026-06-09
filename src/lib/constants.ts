// AI model — single source of truth, never hardcoded elsewhere
export const AI_INTERVIEW_MODEL = "claude-sonnet-4-6" as const;

// Mastery system thresholds
export const MASTERY_THRESHOLD_PERCENT = 85;
export const MAX_SCORE_PER_QUESTION = 4;
export const STANDARD_INTERVIEW_QUESTIONS = 5;
export const SYNTHESIS_INTERVIEW_QUESTIONS = 7;
export const MAX_WEAKNESS_INJECTIONS = 2;
export const MAX_FOLLOW_UPS_PER_QUESTION = 3;
// Any failed interview: 1-hour cooldown before retry
export const INTERVIEW_COOLDOWN_HOURS = 1;

/**
 * QA mode disables cooldown timers only.
 * Scoring, pass/fail, and weakness generation are unchanged.
 * Never active in production regardless of env var.
 */
export function isQAMode(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.INTERVIEW_QA_MODE === "true"
  );
}

// Sprint limits
export const MAX_SPRINT_TASKS = 15;

// Interview answer length limits (SEC-02)
export const MAX_ANSWER_LENGTH = 3000;
export const MAX_TOTAL_SUBMISSION_LENGTH = 12000;

// Curriculum structure
export const TOTAL_STAGES = 29;
export const TOTAL_CHAPTERS = 6;

// Chapter boundaries [firstStageNumber, lastStageNumber]
export const CHAPTER_BOUNDARIES: Record<number, [number, number]> = {
  1: [1, 6],
  2: [7, 12],
  3: [13, 16],
  4: [17, 19],
  5: [20, 25],
  6: [26, 29],
};
