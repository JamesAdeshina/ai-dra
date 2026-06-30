"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Flame,
  UserRound,
} from "lucide-react";

import type { SurvivorDetail } from "@/features/carer/types/survivor-detail";
import { cn } from "@/lib/utils";

type SurvivorOverviewViewProps = {
  survivor: SurvivorDetail;
};

type OverviewMetricProps = {
  icon: LucideIcon;
  iconClassName: string;
  iconBackgroundClassName: string;
  label: string;
  value: string;
  helper: string;
  helperClassName?: string;
};

function OverviewMetric({
  icon: Icon,
  iconClassName,
  iconBackgroundClassName,
  label,
  value,
  helper,
  helperClassName,
}: OverviewMetricProps) {
  return (
    <article
      className={cn(
        "min-w-0 border-b border-[#E7E3DF] px-5 py-5",
        "sm:border-r",
        "xl:min-h-[150px] xl:border-b-0",
        "xl:last:border-r-0",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full",
          iconBackgroundClassName,
          iconClassName,
        )}
      >
        <Icon size={19} />
      </span>

      <div className="mt-3 min-w-0">
        <p className="text-sm font-medium leading-5 text-[#403A36]">
          {label}
        </p>

        <p className="mt-1 whitespace-normal break-words text-base font-semibold leading-6 text-[#292522]">
          {value}
        </p>

        <p
          className={cn(
            "mt-1 whitespace-normal text-xs leading-5 text-[#817A75]",
            helperClassName,
          )}
        >
          {helper}
        </p>
      </div>
    </article>
  );
}

function WeeklyProgressChart({
  survivor,
}: {
  survivor: SurvivorDetail;
}) {
  const chart = useMemo(() => {
    const width = 720;
    const height = 230;
    const left = 42;
    const right = 18;
    const top = 24;
    const bottom = 42;

    const minimum = 40;
    const maximum = 100;

    const usableWidth = width - left - right;
    const usableHeight = height - top - bottom;

    const points = survivor.weeklyProgress.map(
      (point, index) => {
        const x =
          left +
          (index /
            Math.max(
              survivor.weeklyProgress.length - 1,
              1,
            )) *
            usableWidth;

        const normalised =
          (point.value - minimum) /
          (maximum - minimum);

        const y =
          top +
          usableHeight -
          Math.max(
            0,
            Math.min(1, normalised),
          ) *
            usableHeight;

        return {
          ...point,
          x,
          y,
        };
      },
    );

    const linePath = points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
      )
      .join(" ");

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const baselineY = height - bottom;

    const areaPath =
      firstPoint && lastPoint
        ? `${linePath} L ${lastPoint.x} ${baselineY} L ${firstPoint.x} ${baselineY} Z`
        : "";

    return {
      width,
      height,
      left,
      right,
      top,
      bottom,
      points,
      linePath,
      areaPath,
    };
  }, [survivor.weeklyProgress]);

  const gridValues = [60, 70, 80, 90];

  return (
    <article className="rounded-2xl border border-[#DEDAD6] bg-white p-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold text-[#332E2B]">
          Weekly Progress Summary
        </h2>

        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-between gap-5 rounded-xl border border-[#DEDAD6] px-4 text-sm text-[#403B37]"
        >
          This Week
          <ChevronDown size={17} />
        </button>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_145px]">
        <div className="min-w-0 overflow-x-auto">
          <svg
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            className="min-w-[620px]"
            role="img"
            aria-label={`${survivor.name}'s rehabilitation completion trend for this week`}
          >
            <defs>
              <linearGradient
                id={`progress-fill-${survivor.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#A98AF7"
                  stopOpacity="0.42"
                />

                <stop
                  offset="100%"
                  stopColor="#EEE9FB"
                  stopOpacity="0.08"
                />
              </linearGradient>
            </defs>

            {gridValues.map((value) => {
              const y =
                chart.top +
                (chart.height -
                  chart.top -
                  chart.bottom) -
                ((value - 40) / 60) *
                  (chart.height -
                    chart.top -
                    chart.bottom);

              return (
                <g key={value}>
                  <line
                    x1={chart.left}
                    x2={chart.width - chart.right}
                    y1={y}
                    y2={y}
                    stroke="#ECE8E4"
                    strokeWidth="1"
                  />

                  <text
                    x="0"
                    y={y + 4}
                    fontSize="11"
                    fill="#8B837E"
                  >
                    {value}%
                  </text>
                </g>
              );
            })}

            <path
              d={chart.areaPath}
              fill={`url(#progress-fill-${survivor.id})`}
            />

            <path
              d={chart.linePath}
              fill="none"
              stroke="#592EBD"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chart.points.map((point, index) => (
              <g key={`${point.label}-${index}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={
                    index === chart.points.length - 1
                      ? 5
                      : 4
                  }
                  fill={
                    index === chart.points.length - 1
                      ? "#FFFFFF"
                      : "#592EBD"
                  }
                  stroke="#592EBD"
                  strokeWidth="2.5"
                />

                <text
                  x={point.x}
                  y={chart.height - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#817A75"
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-[#F2EDFF] p-4">
          <p className="text-sm font-medium text-[#403A36]">
            This Week
          </p>

          <strong className="mt-2 text-4xl text-[#5523E8]">
            {survivor.averageCompletion}%
          </strong>

          <p className="mt-4 text-xs leading-5 text-[#817A75]">
            Average Completion
          </p>
        </div>
      </div>
    </article>
  );
}

export function SurvivorOverviewView({
  survivor,
}: SurvivorOverviewViewProps) {
  const statusLabel =
    survivor.status === "ON_TRACK"
      ? "On Track"
      : survivor.status === "NEEDS_SUPPORT"
        ? "Needs Support"
        : "At Risk";

  return (
    <div className="space-y-4">
      <section className="grid overflow-hidden rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <OverviewMetric
          icon={CalendarDays}
          iconBackgroundClassName="bg-[#F1ECFF]"
          iconClassName="text-[#7040D4]"
          label="Today’s Goal"
          value={`${survivor.todayProgressMinutes}/${survivor.dailyGoalMinutes}`}
          helper="mins"
        />

        <OverviewMetric
          icon={CheckCircle2}
          iconBackgroundClassName="bg-[#EAF8EF]"
          iconClassName="text-[#2DB36F]"
          label="Current Exercise"
          value={survivor.currentExercise}
          helper={survivor.currentExerciseTargetLabel}
        />

        <OverviewMetric
          icon={Flame}
          iconBackgroundClassName="bg-[#FFF7E5]"
          iconClassName="text-[#F2B322]"
          label="Streak"
          value={`${survivor.currentStreakDays} days`}
          helper="Should keep it up!"
        />

        <OverviewMetric
          icon={UserRound}
          iconBackgroundClassName="bg-[#EAF3FF]"
          iconClassName="text-[#3478EA]"
          label="Status"
          value={statusLabel}
          helper={survivor.statusHelperText}
        />

        <OverviewMetric
          icon={Clock3}
          iconBackgroundClassName="bg-[#EAF3FF]"
          iconClassName="text-[#5696ED]"
          label="Last Session"
          value={`${survivor.lastSession.dateLabel}, ${survivor.lastSession.timeLabel}`}
          helper={`${survivor.lastSession.score}% score`}
          helperClassName="font-semibold text-[#3478EA]"
        />
      </section>

      <WeeklyProgressChart survivor={survivor} />
    </div>
  );
}