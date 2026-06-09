-- CreateEnum
CREATE TYPE "SprintTaskType" AS ENUM ('TASK', 'CHALLENGE', 'KNOWLEDGE_CHECK');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'AWAITING_EVALUATION', 'COMPLETE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('CONCEPT', 'APPLICATION', 'ARCHITECTURE', 'DEFENSE', 'CONNECTION', 'WEAKNESS_RETEST');

-- CreateEnum
CREATE TYPE "WeaknessSeverity" AS ENUM ('CRITICAL', 'SIGNIFICANT', 'FRAGILE', 'PATTERN');

-- AlterTable: drop old stage column, add new curriculum fields with defaults for existing rows
ALTER TABLE "Sprint" DROP COLUMN "stage",
ADD COLUMN     "adrCount" INTEGER,
ADD COLUMN     "architectureDiagramUrl" TEXT,
ADD COLUMN     "chapterNumber" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stageKey" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "stageNumber" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workflowDiagramUrl" TEXT;

-- AlterTable
ALTER TABLE "SprintTask" ADD COLUMN "type" "SprintTaskType" NOT NULL DEFAULT 'TASK';

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "stageNumber" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "isChapterSynthesis" BOOLEAN NOT NULL DEFAULT false,
    "attemptNumber" INTEGER NOT NULL,
    "status" "InterviewStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "evaluatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "reinterviewAvailableAt" TIMESTAMP(3),
    "totalScore" INTEGER,
    "maxScore" INTEGER,
    "percentage" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "failReason" TEXT,
    "remediationReport" JSONB,
    "evaluationAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastEvaluationError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewSession" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "questionQueue" JSONB NOT NULL,
    "conversationHistory" JSONB NOT NULL DEFAULT '[]',
    "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "currentFollowUpCount" INTEGER NOT NULL DEFAULT 0,
    "partialScores" JSONB NOT NULL DEFAULT '[]',
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewTranscript" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "entries" JSONB NOT NULL,
    "totalTurns" INTEGER NOT NULL,
    "durationMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewTranscript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewQuestion" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "conceptTested" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "responseText" TEXT NOT NULL,
    "followUpCount" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL,
    "confidence" INTEGER NOT NULL,
    "weaknessFlagged" BOOLEAN NOT NULL DEFAULT false,
    "weaknessDescription" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL,
    "isWeaknessRetest" BOOLEAN NOT NULL DEFAULT false,
    "sourceWeaknessId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weakness" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stageNumber" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "conceptTested" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "initialScore" INTEGER NOT NULL,
    "initialConfidence" INTEGER NOT NULL,
    "severity" "WeaknessSeverity" NOT NULL,
    "sourceInterviewId" TEXT NOT NULL,
    "resurfaceCount" INTEGER NOT NULL DEFAULT 0,
    "nextResurfaceStage" INTEGER NOT NULL,
    "lastResurfacedStage" INTEGER,
    "cleared" BOOLEAN NOT NULL DEFAULT false,
    "clearedAt" TIMESTAMP(3),
    "clearedInInterviewId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Weakness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterCompletion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "synthesisInterviewId" TEXT,
    "synthesisScore" DOUBLE PRECISION,
    "synthesisPassedAt" TIMESTAMP(3),
    "projectUrl" TEXT,
    "architectureDiagramUrl" TEXT,
    "workflowDiagramUrl" TEXT,
    "adrCount" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Interview_userId_stageNumber_idx" ON "Interview"("userId", "stageNumber");

-- CreateIndex
CREATE INDEX "Interview_userId_status_idx" ON "Interview"("userId", "status");

-- CreateIndex
CREATE INDEX "Interview_sprintId_idx" ON "Interview"("sprintId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewSession_interviewId_key" ON "InterviewSession"("interviewId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewTranscript_interviewId_key" ON "InterviewTranscript"("interviewId");

-- CreateIndex
CREATE INDEX "InterviewQuestion_interviewId_idx" ON "InterviewQuestion"("interviewId");

-- CreateIndex
CREATE INDEX "InterviewQuestion_interviewId_questionType_idx" ON "InterviewQuestion"("interviewId", "questionType");

-- CreateIndex
CREATE INDEX "Weakness_userId_cleared_idx" ON "Weakness"("userId", "cleared");

-- CreateIndex
CREATE INDEX "Weakness_userId_nextResurfaceStage_cleared_idx" ON "Weakness"("userId", "nextResurfaceStage", "cleared");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterCompletion_synthesisInterviewId_key" ON "ChapterCompletion"("synthesisInterviewId");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterCompletion_userId_chapterNumber_key" ON "ChapterCompletion"("userId", "chapterNumber");

-- CreateIndex
CREATE INDEX "ParkingLotItem_userId_idx" ON "ParkingLotItem"("userId");

-- CreateIndex
CREATE INDEX "Sprint_userId_isActive_idx" ON "Sprint"("userId", "isActive");

-- CreateIndex
CREATE INDEX "Sprint_userId_stageNumber_idx" ON "Sprint"("userId", "stageNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Sprint_userId_stageKey_key" ON "Sprint"("userId", "stageKey");

-- CreateIndex
CREATE INDEX "SprintTask_sprintId_type_idx" ON "SprintTask"("sprintId", "type");

-- CreateIndex
CREATE INDEX "SprintTask_sprintId_isComplete_idx" ON "SprintTask"("sprintId", "isComplete");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewTranscript" ADD CONSTRAINT "InterviewTranscript_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weakness" ADD CONSTRAINT "Weakness_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weakness" ADD CONSTRAINT "Weakness_sourceInterviewId_fkey" FOREIGN KEY ("sourceInterviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weakness" ADD CONSTRAINT "Weakness_clearedInInterviewId_fkey" FOREIGN KEY ("clearedInInterviewId") REFERENCES "Interview"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterCompletion" ADD CONSTRAINT "ChapterCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
