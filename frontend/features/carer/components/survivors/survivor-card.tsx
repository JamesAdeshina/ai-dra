import Link from "next/link";
import {
  Check,
  Flame,
  MoreHorizontal,
} from "lucide-react";

import type {
  CarerSurvivorDirectoryItem,
  DirectorySurvivorStatus,
} from "@/features/carer/types";
import { cn } from "@/lib/utils";

type SurvivorCardProps = {
  survivor: CarerSurvivorDirectoryItem;
};

const statusPresentation: Record<
  DirectorySurvivorStatus,
  {
    label: string;
    badgeClassName: string;
  }
> = {
  ON_TRACK: {
    label: "On Track",
    badgeClassName: "bg-[#EAF8EF] text-[#258B55]",
  },
  NEEDS_SUPPORT: {
    label: "Needs Support",
    badgeClassName: "bg-[#FFF7E5] text-[#AD7200]",
  },
  AT_RISK: {
    label: "At Risk",
    badgeClassName: "bg-[#FFF0F0] text-[#D33B3B]",
  },
};

function ProgressRing({
  percentage,
  status,
}: {
  percentage: number;
  status: DirectorySurvivorStatus;
}) {
  const progressColour =
    status === "AT_RISK"
      ? "#F23636"
      : status === "NEEDS_SUPPORT"
        ? "#F2B322"
        : "#592EBD";

  return (
    <div
      className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(
          ${progressColour} ${percentage * 3.6}deg,
          #EFEEEC 0deg
        )`,
      }}
      aria-label={`${percentage}% of today's rehabilitation goal completed`}
    >
      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white text-xs font-bold text-[#302C29]">
        {percentage}%
      </div>
    </div>
  );
}

export function SurvivorCard({ survivor }: SurvivorCardProps) {
  const status = statusPresentation[survivor.status];

  const progressPercentage =
    survivor.dailyGoalMinutes > 0
      ? Math.round(
          (survivor.todayProgressMinutes /
            survivor.dailyGoalMinutes) *
            100,
        )
      : 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            {survivor.avatarUrl ? (
              <img
                src={survivor.avatarUrl}
                alt=""
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEE9FB] text-sm font-bold text-[#592EBD]">
                {survivor.initials}
              </span>
            )}

            <span
              className={cn(
                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                survivor.activeToday
                  ? "bg-[#2DB36F]"
                  : "bg-[#F23636]",
              )}
              aria-label={
                survivor.activeToday
                  ? "Active today"
                  : "Not active today"
              }
            />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-[#292522]">
              {survivor.name}
            </h2>

            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#514B47]">
              <span>Age {survivor.age}</span>
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#302C29]"
                aria-hidden="true"
              />
              <span>{survivor.conditionLabel}</span>
            </p>

            <span className="mt-1.5 inline-flex rounded-full bg-[#F1EBFF] px-2.5 py-1 text-[11px] font-medium text-[#7040D4]">
              {survivor.relationship}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "inline-flex w-fit rounded-full px-3 py-1.5 text-[11px] font-semibold",
            status.badgeClassName,
          )}
        >
          {status.label}
        </span>
      </div>

      <div className="mx-3 grid gap-5 rounded-xl border border-[#E3DFDB] px-4 py-5 sm:mx-4 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_.85fr] xl:gap-0">
        <div className="xl:border-r xl:border-[#E7E3DF] xl:pr-5">
          <p className="text-xs font-medium text-[#48423E]">
            Today&apos;s Goal
          </p>

          <div className="mt-3 flex items-center gap-3">
            <ProgressRing
              percentage={progressPercentage}
              status={survivor.status}
            />

            <div>
              <p className="text-sm font-medium text-[#393431]">
                {survivor.todayProgressMinutes} /{" "}
                {survivor.dailyGoalMinutes} min
              </p>
              <p className="mt-1 text-xs text-[#817A75]">
                {survivor.completedSessions} of{" "}
                {survivor.targetSessions} sessions
              </p>
            </div>
          </div>
        </div>

        <div className="xl:border-r xl:border-[#E7E3DF] xl:px-8">
          <p className="text-xs font-medium text-[#48423E]">
            Current Streak
          </p>

          <div className="mt-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF7E5] text-[#F2B322]">
              <Flame size={20} />
            </span>

            <p className="text-sm font-medium text-[#393431]">
              {survivor.currentStreakDays}{" "}
              {survivor.currentStreakDays === 1 ? "day" : "days"}
            </p>
          </div>
        </div>

        <div className="xl:border-r xl:border-[#E7E3DF] xl:px-8">
          <p className="text-xs font-medium text-[#48423E]">
            Latest Session
          </p>

          <div className="mt-5">
            <p className="text-sm font-medium text-[#393431]">
              {survivor.latestSessionExercise}
            </p>

            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#817A75]">
              {survivor.latestSessionDateLabel} ·{" "}
              {survivor.latestSessionTime}

              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1FA05E] text-white">
                <Check size={10} strokeWidth={3} />
              </span>
            </p>
          </div>
        </div>

        <div className="xl:pl-8">
          <p className="text-xs font-medium text-[#48423E]">
            Average Score
          </p>

          <p className="mt-4 text-[32px] font-bold leading-none text-[#592EBD]">
            {survivor.averageScore}%
          </p>

          <p className="mt-2 text-xs text-[#817A75]">
            Average Completion
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:px-4">
        <Link
          href={`/carer/survivors/${survivor.id}`}
          className="flex min-h-12 items-center justify-center rounded-full border border-[#DDD8D4] px-8 text-sm font-medium text-[#312D2A] transition hover:border-[#592EBD] hover:text-[#592EBD]"
        >
          View Profile
        </Link>

        <Link
          href={`/carer/survivors/${survivor.id}/sessions`}
          className="flex min-h-12 items-center justify-center rounded-full border border-[#DDD8D4] px-8 text-sm font-medium text-[#312D2A] transition hover:border-[#592EBD] hover:text-[#592EBD]"
        >
          View Sessions
        </Link>

        <button
          type="button"
          aria-label={`More actions for ${survivor.name}`}
          title="More actions"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#DDD8D4] text-[#403B37] transition hover:border-[#592EBD] hover:text-[#592EBD] sm:ml-auto"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>
    </article>
  );
}