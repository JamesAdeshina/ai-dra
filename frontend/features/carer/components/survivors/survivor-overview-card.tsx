import Link from "next/link";
import { Check, ChevronRight, Flame } from "lucide-react";

import type {
  CarerSurvivorSummary,
  SurvivorStatus,
} from "@/features/carer/types";
import { cn } from "@/lib/utils";

type SurvivorOverviewCardProps = {
  survivors: CarerSurvivorSummary[];
};

const statusPresentation: Record<
  SurvivorStatus,
  { label: string; className: string }
> = {
  ON_TRACK: {
    label: "On Track",
    className: "bg-[#EAF8EF] text-[#258B55]",
  },
  NEEDS_SUPPORT: {
    label: "Needs Support",
    className: "bg-[#EEF9F4] text-[#2C9569]",
  },
  SESSION_MISSED: {
    label: "Session Missed",
    className: "bg-[#FFF0F0] text-[#D33B3B]",
  },
  NO_RECENT_ACTIVITY: {
    label: "No Recent Activity",
    className: "bg-[#F2F0EF] text-[#68615D]",
  },
  DIFFICULTY_REPORTED: {
    label: "Difficulty Reported",
    className: "bg-[#FFF6E7] text-[#B76C0B]",
  },
};

function ProgressRing({
  percentage,
  needsSupport,
}: {
  percentage: number;
  needsSupport: boolean;
}) {
  const ringColour = needsSupport ? "#F05A17" : "#592EBD";

  return (
    <div
      className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${ringColour} ${percentage * 3.6}deg, #EFEDEB 0deg)`,
      }}
      aria-label={`${percentage}% of today’s rehabilitation goal completed`}
    >
      <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white text-xs font-bold text-[#312D2A]">
        {percentage}%
      </div>
    </div>
  );
}

export function SurvivorOverviewCard({
  survivors,
}: SurvivorOverviewCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-5">
        <div>
          <h2 className="font-semibold text-[#2C2825]">Survivor Overview</h2>
          <p className="mt-0.5 text-xs text-[#817A75]">
            A quick summary of your linked survivors.
          </p>
        </div>
      </div>

      <div className="hidden grid-cols-[minmax(190px,1.25fr)_minmax(170px,1fr)_minmax(120px,.75fr)_minmax(170px,1fr)_120px] gap-3 border-t border-[#EEEAE6] px-5 py-3 text-xs font-medium text-[#48423E] lg:grid">
        <span>Stroke Survivor</span>
        <span>Today’s Progress</span>
        <span>Current Streak</span>
        <span>Last Completed</span>
        <span>Status</span>
      </div>

      <div>
        {survivors.map((survivor, index) => {
          const percentage = Math.round(
            (survivor.todayProgressMinutes / survivor.dailyGoalMinutes) * 100
          );
          const status = statusPresentation[survivor.status];
          const needsSupport = survivor.status === "NEEDS_SUPPORT";

          return (
            <Link
              key={survivor.id}
              href={`/carer/survivors/${survivor.id}`}
              className={cn(
                "group block px-4 py-5 transition hover:bg-[#FCFBFA] sm:px-5",
                index > 0 && "border-t border-[#EEEAE6]"
              )}
            >
              <div className="grid gap-5 lg:grid-cols-[minmax(190px,1.25fr)_minmax(170px,1fr)_minmax(120px,.75fr)_minmax(170px,1fr)_120px] lg:items-center lg:gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {survivor.avatarUrl ? (
                    <img
                      src={survivor.avatarUrl}
                      alt=""
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EEE9FB] text-sm font-bold text-[#592EBD]">
                      {survivor.initials}
                    </span>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#2A2623]">
                      {survivor.name}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#5D5753]">
                      <span className="h-2 w-2 rounded-full bg-[#F23636]" />
                      {survivor.conditionLabel}
                    </p>
                    <span className="mt-1 inline-flex rounded-full bg-[#F2EBFF] px-2 py-0.5 text-[11px] font-medium text-[#7646DE]">
                      {survivor.relationship}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ProgressRing
                    percentage={percentage}
                    needsSupport={needsSupport}
                  />
                  <div>
                    <p className="text-sm font-medium text-[#393431]">
                      {survivor.todayProgressMinutes} / {survivor.dailyGoalMinutes} min
                    </p>
                    <p className="mt-1 text-xs text-[#817A75]">
                      {survivor.completedSessions} of {survivor.targetSessions} sessions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF7E5] text-[#F2B322]">
                    <Flame size={19} />
                  </span>
                  <p className="text-sm font-medium text-[#393431]">
                    {survivor.currentStreakDays} days
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#393431]">
                    {survivor.lastCompletedExercise}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#817A75]">
                    {survivor.lastCompletedTime}
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1FA05E] text-white">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold",
                      status.className
                    )}
                  >
                    {status.label}
                  </span>
                  <ChevronRight
                    size={20}
                    className="text-[#322E2B] transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
