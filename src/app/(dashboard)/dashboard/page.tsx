import { getOrCreateUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import { getStage } from "@/lib/curriculum";
import { TOTAL_STAGES } from "@/lib/constants";
import { MissionCard } from "@/components/dashboard/mission-card";
import { StageProgressCard, MasteryIndexCard } from "@/components/dashboard/metrics-row";
import { MasteryBreakdown } from "@/components/dashboard/mastery-breakdown";
import { CompactRoadmap } from "@/components/dashboard/compact-roadmap";
import { TrajectoryPanel } from "@/components/dashboard/trajectory-panel";
import type { SprintWithTasks } from "@/components/dashboard/mission-card";

export default async function DashboardPage() {
  const user = await getOrCreateUser();
  const { id: userId, currentStage } = user;

  // Parallel data fetching
  const [sprint, allInterviews, weaknesses] = await Promise.all([
    prisma.sprint.findFirst({
      where: { userId, isActive: true },
      include: { tasks: { orderBy: { order: "asc" } } },
    }) as Promise<SprintWithTasks | null>,

    prisma.interview.findMany({
      where: { userId, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      take: 12,
      select: {
        stageNumber: true,
        percentage: true,
        passed: true,
        completedAt: true,
        isChapterSynthesis: true,
      },
    }),

    prisma.weakness.findMany({
      where: { userId, cleared: false },
      orderBy: { createdAt: "asc" },
      take: 8,
    }),
  ]);

  // Mastery index — average of all passing stage interviews
  const passedStageInterviews = allInterviews.filter(
    (i) => i.passed === true && !i.isChapterSynthesis
  );
  const masteryIndex =
    passedStageInterviews.length > 0
      ? Math.round(
          passedStageInterviews.reduce((acc, i) => acc + (i.percentage ?? 0), 0) /
            passedStageInterviews.length
        )
      : 0;

  // Compact roadmap: previous 1, current, next 2
  const nearbyNumbers = [
    currentStage - 1,
    currentStage,
    currentStage + 1,
    currentStage + 2,
  ].filter((n) => n >= 1 && n <= TOTAL_STAGES);

  const completedSprints = await prisma.sprint.findMany({
    where: {
      userId,
      stageNumber: { in: nearbyNumbers },
      interviews: { some: { passed: true, isChapterSynthesis: false } },
    },
    select: { stageNumber: true },
  });
  const completedSet = new Set(completedSprints.map((s) => s.stageNumber));

  type StageRowStatus = "complete" | "active" | "next" | "locked";
  const roadmapStages = nearbyNumbers.map((n) => ({
    number: n,
    status: (completedSet.has(n)
      ? "complete"
      : n === currentStage
      ? "active"
      : n === currentStage + 1
      ? "next"
      : "locked") as StageRowStatus,
  }));

  const curriculumStage = getStage(sprint?.stageNumber ?? currentStage);

  return (
    <div className="p-5 md:p-6 space-y-5 w-full">
      {/* Row 1: Mission Card — dominant */}
      <MissionCard
        sprint={sprint}
        stage={curriculumStage}
        currentStage={currentStage}
      />

      {/* Row 2: Primary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <StageProgressCard
          sprint={sprint}
          stage={curriculumStage}
          currentStage={currentStage}
          totalStages={TOTAL_STAGES}
        />
        <MasteryIndexCard
          masteryIndex={masteryIndex}
          interviewCount={passedStageInterviews.length}
        />
      </div>

      {/* Row 3: Roadmap (left) + Right rail stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <CompactRoadmap stages={roadmapStages} currentStage={currentStage} />

        <div className="flex flex-col gap-5">
          <MasteryBreakdown
            masteryIndex={masteryIndex}
            weaknesses={weaknesses}
            passedInterviews={passedStageInterviews.slice(0, 5)}
          />
          <TrajectoryPanel
            interviews={allInterviews}
            currentStage={currentStage}
            userCreatedAt={user.createdAt}
          />
        </div>
      </div>
    </div>
  );
}
