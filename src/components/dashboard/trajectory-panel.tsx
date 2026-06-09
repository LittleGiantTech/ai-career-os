import { differenceInCalendarDays } from "date-fns";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getStage } from "@/lib/curriculum";

type InterviewRecord = {
  stageNumber: number;
  percentage: number | null;
  passed: boolean | null;
  completedAt: Date | null;
  isChapterSynthesis: boolean;
};

type Props = {
  interviews: InterviewRecord[];
  currentStage: number;
  userCreatedAt: Date;
};

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function TrajectoryPanel({ interviews, currentStage, userCreatedAt }: Props) {
  // Only stage interviews (not chapter synthesis)
  const stageInterviews = interviews.filter((i) => !i.isChapterSynthesis);
  const recentFive = stageInterviews.slice(0, 5);

  // Mastery trend — compare last 3 vs previous 3 passing interviews
  const passing = stageInterviews.filter((i) => i.passed === true);
  const recentScores = passing.slice(0, 3).map((i) => i.percentage ?? 0);
  const prevScores = passing.slice(3, 6).map((i) => i.percentage ?? 0);
  const recentAvg = avg(recentScores);
  const prevAvg = avg(prevScores);
  const trendDelta = prevScores.length > 0 ? recentAvg - prevAvg : 0;
  const trend: "up" | "down" | "stable" =
    trendDelta > 2 ? "up" : trendDelta < -2 ? "down" : "stable";

  // Stage completion pace — stages per week
  const daysActive = Math.max(1, differenceInCalendarDays(new Date(), userCreatedAt));
  const weeksActive = daysActive / 7;
  const completedStages = Math.max(0, currentStage - 1);
  const pacePerWeek = completedStages > 0 ? completedStages / weeksActive : 0;

  const hasSufficientData = stageInterviews.length > 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase mb-4">
        Trajectory
      </p>

      {!hasSufficientData ? (
        <p className="font-mono text-[11px] text-muted-foreground">
          Complete your first interview to see trajectory data.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Interview trend dots */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-2">
              Recent interviews
            </p>
            <div className="flex items-end gap-2 flex-wrap">
              {recentFive.map((interview, i) => {
                const pct = Math.round(interview.percentage ?? 0);
                const passed = interview.passed === true;
                const stageDef = getStage(interview.stageNumber);
                const stageLabel = stageDef?.title ?? `S${interview.stageNumber}`;

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1"
                    title={`${stageLabel}: ${pct}%`}
                  >
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        passed ? "text-[#00E87A]" : "text-[#FF3B3B]"
                      }`}
                    >
                      {pct}%
                    </span>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        passed ? "bg-[#00E87A]" : "bg-[#FF3B3B]"
                      }`}
                    />
                    <span className="font-mono text-[9px] text-muted-foreground/60">
                      S{interview.stageNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mastery trend */}
          {passing.length >= 2 && (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
              <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-1.5">
                Score trend
              </p>
              <div className="flex items-center gap-2">
                {trend === "up" && (
                  <TrendingUp className="h-4 w-4 text-[#00E87A] shrink-0" />
                )}
                {trend === "down" && (
                  <TrendingDown className="h-4 w-4 text-[#FF3B3B] shrink-0" />
                )}
                {trend === "stable" && (
                  <Minus className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    trend === "up"
                      ? "text-[#00E87A]"
                      : trend === "down"
                      ? "text-[#FF3B3B]"
                      : "text-muted-foreground"
                  }`}
                >
                  {trend === "up"
                    ? "Improving"
                    : trend === "down"
                    ? "Declining"
                    : "Consistent"}
                </span>
                {trendDelta !== 0 && prevScores.length > 0 && (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    ({trendDelta > 0 ? "+" : ""}
                    {trendDelta.toFixed(1)}% vs prior)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stage pace */}
          {completedStages > 0 && (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
              <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-1.5">
                Stage pace
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-xl font-bold text-foreground">
                  {pacePerWeek.toFixed(1)}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  stages / week
                </span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground/60 mt-0.5">
                {completedStages} stage{completedStages !== 1 ? "s" : ""} in{" "}
                {daysActive} day{daysActive !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
