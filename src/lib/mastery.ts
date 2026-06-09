import { differenceInCalendarDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import type { InterviewQuestion, WeaknessSeverity } from "@/generated/prisma/client";
import {
  MASTERY_THRESHOLD_PERCENT,
  MAX_SCORE_PER_QUESTION,
  INTERVIEW_COOLDOWN_HOURS,
} from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// Score calculation
// ─────────────────────────────────────────────────────────────────────────────

export type ScoreResult = {
  totalScore: number;
  maxScore: number;
  percentage: number;
};

/** Calculates the interview score from primary (non-weakness-retest) questions. */
export function calculateInterviewScore(
  questions: Pick<InterviewQuestion, "score" | "questionType">[]
): ScoreResult {
  const primary = questions.filter((q) => q.questionType !== "WEAKNESS_RETEST");
  const totalScore = primary.reduce((sum, q) => sum + q.score, 0);
  const maxScore = primary.length * MAX_SCORE_PER_QUESTION;
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  return { totalScore, maxScore, percentage };
}

// ─────────────────────────────────────────────────────────────────────────────
// Pass/fail determination
// ─────────────────────────────────────────────────────────────────────────────

export type PassFailResult =
  | { passed: true }
  | { passed: false; failReason: string };

/**
 * Determines whether an interview passes.
 *
 * Hard floor rules (any one triggers fail):
 * - Score below 85%
 * - Any question scored 0
 * - Two or more questions scored below 2
 * - Architecture question scored below 2
 * - Defense question scored below 2
 */
export function determinePassed(
  questions: Pick<InterviewQuestion, "score" | "questionType">[]
): PassFailResult {
  const primary = questions.filter((q) => q.questionType !== "WEAKNESS_RETEST");
  const { percentage } = calculateInterviewScore(questions);

  if (percentage < MASTERY_THRESHOLD_PERCENT) {
    return {
      passed: false,
      failReason: `Score ${percentage.toFixed(1)}% is below the ${MASTERY_THRESHOLD_PERCENT}% threshold.`,
    };
  }

  const zeroCount = primary.filter((q) => q.score === 0).length;
  if (zeroCount > 0) {
    return {
      passed: false,
      failReason: "One or more questions received no answer (score 0).",
    };
  }

  const belowTwoCount = primary.filter((q) => q.score < 2).length;
  if (belowTwoCount >= 2) {
    return {
      passed: false,
      failReason: "Two or more questions scored below 2.",
    };
  }

  const architecture = primary.find((q) => q.questionType === "ARCHITECTURE");
  if (architecture && architecture.score < 2) {
    return {
      passed: false,
      failReason: "Architecture question scored below 2.",
    };
  }

  const defense = primary.find((q) => q.questionType === "DEFENSE");
  if (defense && defense.score < 2) {
    return {
      passed: false,
      failReason: "Defense question scored below 2.",
    };
  }

  return { passed: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Weakness identification
// ─────────────────────────────────────────────────────────────────────────────

function deriveSeverity(score: number, confidence: number): WeaknessSeverity {
  if (score <= 1) return "CRITICAL";
  if (score === 2) return "SIGNIFICANT";
  return "FRAGILE"; // score 3 or 4 with confidence 1
}

function calculateNextResurfaceStage(
  currentStage: number,
  severity: WeaknessSeverity,
  resurfaceCount: number
): number {
  const intervals: Record<WeaknessSeverity, [number, number, number]> = {
    CRITICAL:    [2, 3, 5],
    SIGNIFICANT: [3, 5, 8],
    FRAGILE:     [5, 8, 12],
    PATTERN:     [2, 3, 5],
  };
  const idx = Math.min(resurfaceCount, 2);
  return currentStage + intervals[severity][idx];
}

export type WeaknessInput = Pick<
  InterviewQuestion,
  | "questionType"
  | "conceptTested"
  | "score"
  | "confidence"
  | "weaknessDescription"
>;

export type WeaknessToCreate = {
  stageNumber: number;
  chapterNumber: number;
  questionType: InterviewQuestion["questionType"];
  conceptTested: string;
  description: string;
  initialScore: number;
  initialConfidence: number;
  severity: WeaknessSeverity;
  sourceInterviewId: string;
  nextResurfaceStage: number;
  resurfaceCount: 0;
  cleared: false;
};

/** Extracts weakness records from a scored set of interview questions. */
export function identifyWeaknesses(
  questions: WeaknessInput[],
  interviewId: string,
  stageNumber: number,
  chapterNumber: number
): WeaknessToCreate[] {
  return questions
    .filter((q) => {
      if (q.questionType === "WEAKNESS_RETEST") return false;
      if (q.score <= 2) return true;
      if (q.score >= 3 && q.confidence === 1) return true; // fragile knowledge
      return false;
    })
    .map((q) => {
      const severity = deriveSeverity(q.score, q.confidence);
      return {
        stageNumber,
        chapterNumber,
        questionType: q.questionType,
        conceptTested: q.conceptTested,
        description: q.weaknessDescription ?? "",
        initialScore: q.score,
        initialConfidence: q.confidence,
        severity,
        sourceInterviewId: interviewId,
        nextResurfaceStage: calculateNextResurfaceStage(stageNumber, severity, 0),
        resurfaceCount: 0 as const,
        cleared: false as const,
      };
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mastery Index
// ─────────────────────────────────────────────────────────────────────────────

/** Average of all passing stage interview scores (excluding synthesis interviews). */
export async function calculateMasteryIndex(userId: string): Promise<number> {
  const passed = await prisma.interview.findMany({
    where: { userId, passed: true, isChapterSynthesis: false },
    select: { percentage: true },
  });
  if (passed.length === 0) return 0;
  const sum = passed.reduce((acc, i) => acc + (i.percentage ?? 0), 0);
  return Math.round(sum / passed.length);
}

// ─────────────────────────────────────────────────────────────────────────────
// Reinterview wait period
// ─────────────────────────────────────────────────────────────────────────────

/** Calculates when Travis may retake a failed interview. Always 1-hour cooldown. */
export function calculateReinterviewAvailableAt(evaluatedAt: Date): Date {
  const date = new Date(evaluatedAt);
  date.setHours(date.getHours() + INTERVIEW_COOLDOWN_HOURS);
  return date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Streak
// ─────────────────────────────────────────────────────────────────────────────

export type StreakUpdate = {
  streak: number;
  lastActiveAt: Date;
};

/**
 * Calculates the new streak value.
 * Called inside getOrCreateUser on every authenticated request.
 *
 * Rules:
 * - Same calendar day as lastActiveAt: no change
 * - One day after lastActiveAt: increment
 * - Two or more days after: reset to 1
 */
export function calculateStreak(
  currentStreak: number,
  lastActiveAt: Date | null
): StreakUpdate {
  const now = new Date();

  if (!lastActiveAt) {
    return { streak: 1, lastActiveAt: now };
  }

  const daysDiff = differenceInCalendarDays(now, lastActiveAt);

  if (daysDiff === 0) {
    return { streak: currentStreak, lastActiveAt };
  }

  if (daysDiff === 1) {
    return { streak: currentStreak + 1, lastActiveAt: now };
  }

  return { streak: 1, lastActiveAt: now };
}
