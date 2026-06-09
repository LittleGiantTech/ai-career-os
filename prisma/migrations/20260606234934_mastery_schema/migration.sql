/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `remediationReport` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `sourceWeaknessId` on the `InterviewQuestion` table. All the data in the column will be lost.
  - You are about to drop the `InterviewSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InterviewTranscript` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InterviewSession" DROP CONSTRAINT "InterviewSession_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "InterviewTranscript" DROP CONSTRAINT "InterviewTranscript_interviewId_fkey";

-- DropIndex
DROP INDEX "ChapterCompletion_synthesisInterviewId_key";

-- DropIndex
DROP INDEX "InterviewQuestion_interviewId_questionType_idx";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "expiresAt",
DROP COLUMN "remediationReport",
ALTER COLUMN "attemptNumber" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "InterviewQuestion" DROP COLUMN "sourceWeaknessId",
ALTER COLUMN "confidence" SET DEFAULT 2;

-- AlterTable
ALTER TABLE "Weakness" ALTER COLUMN "initialConfidence" SET DEFAULT 2;

-- DropTable
DROP TABLE "InterviewSession";

-- DropTable
DROP TABLE "InterviewTranscript";
