"use client";

import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Filter,
  Gauge,
  HeartHandshake,
  Info,
  Mail,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AdminAnalyticsDataset,
  AdminAnalyticsDateRange,
  AdminAnalyticsExerciseSegment,
  AdminAnalyticsHeatmapCell,
  AdminAnalyticsPoint,
  AdminAnalyticsSessionStatus,
} from "@/features/admin/types/admin-analytics";
import type { AdminSessionSummary } from "@/features/admin/types/admin-session";
import { cn } from "@/lib/utils";

type AdminAnalyticsViewProps = {
  data: AdminAnalyticsDataset;
};

const DEMO_REFERENCE_DATE = new Date(
  "2026-07-03T23:59:59Z"
);

const exerciseColours = [
  "#592EBD",
  "#3559D9",
  "#21A67A",
  "#F1A81E",
  "#E94E77",
  "#A451C4",
  "#2FA9D1",
  "#7E8A9A",
];

export function AdminAnalyticsView({
  data,
}: AdminAnalyticsViewProps) {
  const [dateRange, setDateRange] =
    useState<AdminAnalyticsDateRange>("Last 30 Days");

  const [statusFilter, setStatusFilter] =
    useState<AdminAnalyticsSessionStatus>("All");

  const [exerciseFilter, setExerciseFilter] =
    useState("All");

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const filteredSessions = useMemo(() => {
    return data.sessions.filter((session) => {
      const matchesDate = matchesDateRange(
        session,
        dateRange
      );

      const matchesStatus =
        statusFilter === "All" ||
        session.status === statusFilter;

      const matchesExercise =
        exerciseFilter === "All" ||
        session.exerciseName === exerciseFilter;

      return (
        matchesDate &&
        matchesStatus &&
        matchesExercise
      );
    });
  }, [
    data.sessions,
    dateRange,
    statusFilter,
    exerciseFilter,
  ]);

  const activeSurvivorIds = useMemo(
    () =>
      new Set(
        filteredSessions.map(
          (session) => session.participantId
        )
      ),
    [filteredSessions]
  );

  const completedSessions = filteredSessions.filter(
    (session) => session.status === "Completed"
  ).length;

  const completionRate =
    filteredSessions.length === 0
      ? 0
      : Math.round(
          (completedSessions /
            filteredSessions.length) *
            100
        );

  const sessionsOverTime = useMemo(
    () => createSessionsOverTime(filteredSessions),
    [filteredSessions]
  );

  const engagementOverTime = useMemo(
    () =>
      createActiveSurvivorsOverTime(
        filteredSessions
      ),
    [filteredSessions]
  );

  const sessionsByExercise = useMemo(
    () =>
      createExerciseBreakdown(filteredSessions),
    [filteredSessions]
  );

  const usageHeatmap = useMemo(
    () => createUsageHeatmap(filteredSessions),
    [filteredSessions]
  );

  const mostUsedExercise = [...data.exercises].sort(
    (left, right) =>
      right.totalSessions - left.totalSessions
  )[0];

  const activeCarers = data.carers.filter(
    (carer) => carer.status === "Active"
  ).length;

  const acceptedInvitations =
    data.invitations.filter(
      (invitation) =>
        invitation.status === "Accepted"
    ).length;

  const engagementCounts = {
    high: data.survivors.filter(
      (survivor) =>
        survivor.engagementStatus === "High"
    ).length,

    moderate: data.survivors.filter(
      (survivor) =>
        survivor.engagementStatus === "Moderate"
    ).length,

    low: data.survivors.filter(
      (survivor) =>
        survivor.engagementStatus === "Low" ||
        survivor.engagementStatus === "Inactive"
    ).length,

    notStarted: data.survivors.filter(
      (survivor) =>
        survivor.engagementStatus === "Not Started"
    ).length,
  };

  const peakUsage = getPeakUsagePeriod(
    usageHeatmap
  );

  const activeFilterCount = [
    statusFilter !== "All",
    exerciseFilter !== "All",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setStatusFilter("All");
    setExerciseFilter("All");
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1750px]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#201D1B] sm:text-3xl">
                Analytics Overview
              </h1>

              <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                Demo dataset
              </span>
            </div>

            <p className="mt-2 text-sm text-[#68615D] sm:text-base">
              Insights into platform usage, rehabilitation
              activity and engagement across AI-DRA.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <label className="relative">
              <CalendarDays
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#66605C]"
              />

              <select
                value={dateRange}
                onChange={(event) =>
                  setDateRange(
                    event.target
                      .value as AdminAnalyticsDateRange
                  )
                }
                aria-label="Analytics date range"
                className="h-11 rounded-xl border border-[#DDD8D4] bg-white pl-11 pr-4 text-sm font-semibold text-[#3C3734] outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
              >
                <option value="Last 7 Days">
                  Last 7 Days
                </option>

                <option value="Last 30 Days">
                  Last 30 Days
                </option>

                <option value="Last 90 Days">
                  Last 90 Days
                </option>

                <option value="All Time">
                  All Time
                </option>
              </select>
            </label>

            <button
              type="button"
              onClick={() =>
                setFiltersOpen((current) => !current)
              }
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm font-semibold text-[#3E3936] transition hover:border-[#A98CE6] hover:text-[#592EBD]"
            >
              <Filter size={17} />
              Filters

              {activeFilterCount > 0 ? (
                <span className="rounded-full bg-[#592EBD] px-2 py-0.5 text-[10px] text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              disabled
              title="Report export will be connected after database integration."
              className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white opacity-70"
            >
              <Download size={17} />
              Export Report
            </button>
          </div>
        </div>

        {filtersOpen ? (
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#DCD5EA] bg-[#FAF8FF] p-5 sm:flex-row sm:items-end">
            <FilterSelect
              label="Session Status"
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(
                  value as AdminAnalyticsSessionStatus
                )
              }
              options={[
                ["All", "All Session Statuses"],
                ["Completed", "Completed"],
                ["Active", "Active"],
                ["Paused", "Paused"],
                ["Ended Early", "Ended Early"],
              ]}
            />

            <FilterSelect
              label="Exercise"
              value={exerciseFilter}
              onChange={setExerciseFilter}
              options={[
                ["All", "All Exercises"],
                ...Array.from(
                  new Set(
                    data.sessions.map(
                      (session) =>
                        session.exerciseName
                    )
                  )
                )
                  .sort()
                  .map(
                    (exercise): [string, string] => [
                      exercise,
                      exercise,
                    ]
                  ),
              ]}
            />

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#CFC6E6] bg-white px-4 text-sm font-semibold text-[#592EBD]"
            >
              <RefreshCw size={16} />
              Clear Filters
            </button>

            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-[#625C58]"
            >
              <X size={16} />
              Close
            </button>
          </div>
        ) : null}

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          <AnalyticsMetricCard
            title="Total Survivors"
            value={String(data.survivors.length)}
            helper="Registered demo accounts"
            icon={Users}
            tone="purple"
          />

          <AnalyticsMetricCard
            title="Active Survivors"
            value={String(activeSurvivorIds.size)}
            helper={`Within ${dateRange.toLowerCase()}`}
            icon={Activity}
            tone="green"
          />

          <AnalyticsMetricCard
            title="Total Sessions"
            value={String(filteredSessions.length)}
            helper={`Filtered activity records`}
            icon={CalendarDays}
            tone="blue"
          />

          <AnalyticsMetricCard
            title="Session Completion Rate"
            value={`${completionRate}%`}
            helper={`${completedSessions} completed sessions`}
            icon={CheckCircle2}
            tone="purple"
          />

          <AnalyticsMetricCard
            title="Average Movement Score"
            value="Not Available"
            helper="Requires movement scoring"
            icon={Gauge}
            tone="amber"
            compact
          />

          <AnalyticsMetricCard
            title="Active Carers"
            value={String(activeCarers)}
            helper={`${data.carers.length} total carers`}
            icon={HeartHandshake}
            tone="pink"
          />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          <LineChartCard
            title="Sessions Over Time"
            subtitle="Number of sessions recorded"
            data={sessionsOverTime}
            colour="#592EBD"
          />

          <ExerciseDonutChart
            data={sessionsByExercise}
            total={filteredSessions.length}
          />

          <LineChartCard
            title="Survivor Engagement"
            subtitle="Unique active survivors by day"
            data={engagementOverTime}
            colour="#6C42DD"
          />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.2fr_1fr_0.85fr]">
          <MovementScorePlaceholder />

          <CompletionRateChart
            exercises={data.exercises}
          />

          <UsageHeatmap
            cells={usageHeatmap}
          />

          <PlatformActivitySummary
            survivorCount={data.survivors.length}
            carerCount={data.carers.length}
            invitationsSent={
              data.invitations.length
            }
            invitationsAccepted={
              acceptedInvitations
            }
          />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_1fr]">
          <EngagementInsights
            total={data.survivors.length}
            high={engagementCounts.high}
            moderate={engagementCounts.moderate}
            low={engagementCounts.low}
            notStarted={
              engagementCounts.notStarted
            }
          />

          <RecentInsights
            completionRate={completionRate}
            mostUsedExercise={
              mostUsedExercise?.title ??
              "Not Available"
            }
            peakUsage={peakUsage}
            activeSurvivors={activeSurvivorIds.size}
            totalSurvivors={
              data.survivors.length
            }
            acceptedInvitations={
              acceptedInvitations
            }
            totalInvitations={
              data.invitations.length
            }
          />
        </div>

        <div className="mt-5 flex gap-3 rounded-2xl border border-[#D9D0F0] bg-[#FAF8FF] p-5">
          <Info
            size={21}
            className="mt-0.5 shrink-0 text-[#592EBD]"
          />

          <div>
            <h2 className="font-semibold text-[#39314A]">
              About these analytics
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#625A6D]">
              These charts use the current frontend demo
              dataset and represent platform engagement only.
              Movement Score, clinical progress analysis and
              cohort conclusions remain unavailable until the
              required algorithms, research data and
              validation processes are implemented.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type AnalyticsTone =
  | "purple"
  | "green"
  | "blue"
  | "amber"
  | "pink";

const analyticsToneClasses: Record<
  AnalyticsTone,
  string
> = {
  purple: "bg-[#EEE8FF] text-[#592EBD]",
  green: "bg-[#E6F7EF] text-[#20A663]",
  blue: "bg-[#E8F2FF] text-[#2879D8]",
  amber: "bg-[#FFF4DD] text-[#E99A17]",
  pink: "bg-[#FFEAF2] text-[#E84A84]",
};

function AnalyticsMetricCard({
  title,
  value,
  helper,
  icon: Icon,
  tone,
  compact = false,
}: {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone: AnalyticsTone;
  compact?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            analyticsToneClasses[tone]
          )}
        >
          <Icon size={20} />
        </span>

        <p className="text-sm font-semibold text-[#393432]">
          {title}
        </p>
      </div>

      <p
        className={cn(
          "mt-5 font-bold tracking-tight text-[#201D1B]",
          compact ? "text-xl" : "text-3xl"
        )}
      >
        {value}
      </p>

      <p className="mt-1.5 text-xs text-[#7D7671]">
        {helper}
      </p>
    </article>
  );
}

function LineChartCard({
  title,
  subtitle,
  data,
  colour,
}: {
  title: string;
  subtitle: string;
  data: AdminAnalyticsPoint[];
  colour: string;
}) {
  const width = 620;
  const height = 250;
  const padding = {
    top: 22,
    right: 20,
    bottom: 46,
    left: 42,
  };

  const innerWidth =
    width - padding.left - padding.right;

  const innerHeight =
    height - padding.top - padding.bottom;

  const maximum = Math.max(
    ...data.map((point) => point.value),
    1
  );

  const roundedMaximum = Math.max(
    5,
    Math.ceil(maximum / 5) * 5
  );

  const x = (index: number) => {
    if (data.length <= 1) {
      return padding.left + innerWidth / 2;
    }

    return (
      padding.left +
      (index / (data.length - 1)) *
        innerWidth
    );
  };

  const y = (value: number) =>
    padding.top +
    innerHeight -
    (value / roundedMaximum) * innerHeight;

  const path = data
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";

      return `${command} ${x(index)} ${y(
        point.value
      )}`;
    })
    .join(" ");

  const areaPath =
    data.length === 0
      ? ""
      : `${path} L ${x(
          data.length - 1
        )} ${padding.top + innerHeight} L ${x(
          0
        )} ${padding.top + innerHeight} Z`;

  const gridValues = [0, 0.25, 0.5, 0.75, 1].map(
    (ratio) =>
      Math.round(roundedMaximum * ratio)
  );

  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
      <h2 className="font-bold text-[#282422]">
        {title}
      </h2>

      <p className="mt-1 text-xs text-[#77706B]">
        {subtitle}
      </p>

      {data.length > 0 ? (
        <div className="mt-5 overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={title}
            className="min-w-[540px] w-full"
          >
            <defs>
              <linearGradient
                id={`gradient-${title.replaceAll(
                  " ",
                  "-"
                )}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={colour}
                  stopOpacity="0.24"
                />

                <stop
                  offset="100%"
                  stopColor={colour}
                  stopOpacity="0.02"
                />
              </linearGradient>
            </defs>

            {gridValues.map((value) => {
              const gridY = y(value);

              return (
                <g key={value}>
                  <line
                    x1={padding.left}
                    x2={width - padding.right}
                    y1={gridY}
                    y2={gridY}
                    stroke="#ECE8E4"
                  />

                  <text
                    x={padding.left - 10}
                    y={gridY + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#8B837E"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            <path
              d={areaPath}
              fill={`url(#gradient-${title.replaceAll(
                " ",
                "-"
              )})`}
            />

            <path
              d={path}
              fill="none"
              stroke={colour}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {data.map((point, index) => (
              <g key={`${point.label}-${index}`}>
                <circle
                  cx={x(index)}
                  cy={y(point.value)}
                  r="4"
                  fill={colour}
                  stroke="white"
                  strokeWidth="2"
                />

                <text
                  x={x(index)}
                  y={height - 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#817A75"
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      ) : (
        <EmptyChartState />
      )}
    </article>
  );
}

function ExerciseDonutChart({
  data,
  total,
}: {
  data: AdminAnalyticsExerciseSegment[];
  total: number;
}) {
  let currentPercentage = 0;

  const sections = data.map((segment) => {
    const start = currentPercentage;
    const end = start + segment.percentage;

    currentPercentage = end;

    return `${segment.colour} ${start}% ${end}%`;
  });

  const gradient =
    total === 0
      ? "#EEEAE6"
      : `conic-gradient(${sections.join(", ")})`;

  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
      <h2 className="font-bold text-[#282422]">
        Sessions by Exercise
      </h2>

      <p className="mt-1 text-xs text-[#77706B]">
        Exercises represented in the current filter
      </p>

      {data.length > 0 ? (
        <div className="mt-6 flex flex-col items-center gap-7 sm:flex-row xl:flex-col 2xl:flex-row">
          <div
            className="relative h-44 w-44 shrink-0 rounded-full"
            style={{ background: gradient }}
          >
            <div className="absolute inset-[29%] flex flex-col items-center justify-center rounded-full bg-white">
              <span className="text-2xl font-bold text-[#282422]">
                {total}
              </span>

              <span className="text-xs text-[#817A75]">
                sessions
              </span>
            </div>
          </div>

          <div className="w-full space-y-3">
            {data.map((segment) => (
              <div
                key={segment.label}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        segment.colour,
                    }}
                  />

                  <span className="truncate text-[#514B47]">
                    {segment.label}
                  </span>
                </div>

                <span className="whitespace-nowrap font-semibold text-[#393432]">
                  {segment.value} (
                  {segment.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyChartState />
      )}
    </article>
  );
}

function MovementScorePlaceholder() {
  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
      <h2 className="font-bold text-[#282422]">
        Movement Score Distribution
      </h2>

      <p className="mt-1 text-xs text-[#77706B]">
        Distribution of movement-performance scores
      </p>

      <div className="mt-6 flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-[#CDC4E4] bg-[#FAF8FF] p-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
          <Gauge size={23} />
        </span>

        <h3 className="mt-4 font-semibold text-[#393432]">
          Movement scoring under development
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[#77706B]">
          This chart will become available after
          accuracy, smoothness, range of motion,
          compensation and speed scoring are
          implemented.
        </p>
      </div>
    </article>
  );
}

function CompletionRateChart({
  exercises,
}: {
  exercises: AdminAnalyticsDataset["exercises"];
}) {
  const sortedExercises = [...exercises]
    .sort(
      (left, right) =>
        right.completionRate -
        left.completionRate
    )
    .slice(0, 6);

  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
      <h2 className="font-bold text-[#282422]">
        Completion Rate by Exercise
      </h2>

      <p className="mt-1 text-xs text-[#77706B]">
        Percentage of demo sessions completed
      </p>

      <div className="mt-6 space-y-5">
        {sortedExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="grid grid-cols-[120px_minmax(0,1fr)_42px] items-center gap-3"
          >
            <p className="truncate text-xs font-medium text-[#514B47]">
              {exercise.title}
            </p>

            <div className="h-3 overflow-hidden rounded-full bg-[#EEEAE6]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#592EBD] to-[#7E4FE0]"
                style={{
                  width: `${exercise.completionRate}%`,
                }}
              />
            </div>

            <p className="text-right text-xs font-semibold text-[#393432]">
              {exercise.completionRate}%
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function UsageHeatmap({
  cells,
}: {
  cells: AdminAnalyticsHeatmapCell[];
}) {
  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  const times = [
    "6am",
    "9am",
    "12pm",
    "3pm",
    "6pm",
    "9pm",
  ];

  const maximum = Math.max(
    ...cells.map((cell) => cell.value),
    1
  );

  const findValue = (
    day: string,
    time: string
  ) =>
    cells.find(
      (cell) =>
        cell.day === day && cell.time === time
    )?.value ?? 0;

  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
      <h2 className="font-bold text-[#282422]">
        Usage by Time of Day
      </h2>

      <p className="mt-1 text-xs text-[#77706B]">
        When demo sessions were recorded
      </p>

      <div className="mt-6 overflow-x-auto">
        <div className="grid min-w-[420px] grid-cols-[36px_repeat(6,1fr)] gap-1.5">
          <span />

          {times.map((time) => (
            <span
              key={time}
              className="pb-1 text-center text-[10px] text-[#817A75]"
            >
              {time}
            </span>
          ))}

          {days.flatMap((day) => [
            <span
              key={`${day}-label`}
              className="flex items-center text-[10px] text-[#625C58]"
            >
              {day}
            </span>,

            ...times.map((time) => {
              const value = findValue(day, time);

              const opacity =
                value === 0
                  ? 0.05
                  : 0.2 +
                    (value / maximum) * 0.75;

              return (
                <div
                  key={`${day}-${time}`}
                  title={`${day} ${time}: ${value} session${value === 1 ? "" : "s"}`}
                  className="h-8 rounded-md border border-white"
                  style={{
                    backgroundColor: `rgba(89, 46, 189, ${opacity})`,
                  }}
                />
              );
            }),
          ])}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-[#817A75]">
        <span>Lower</span>

        {[0.1, 0.3, 0.5, 0.7, 0.95].map(
          (opacity) => (
            <span
              key={opacity}
              className="h-3 w-5 rounded-sm"
              style={{
                backgroundColor: `rgba(89, 46, 189, ${opacity})`,
              }}
            />
          )
        )}

        <span>Higher</span>
      </div>
    </article>
  );
}

function PlatformActivitySummary({
  survivorCount,
  carerCount,
  invitationsSent,
  invitationsAccepted,
}: {
  survivorCount: number;
  carerCount: number;
  invitationsSent: number;
  invitationsAccepted: number;
}) {
  const items = [
    {
      label: "Registered survivors",
      value: survivorCount,
      icon: Users,
      tone: "bg-[#E6F7EF] text-[#20A663]",
    },
    {
      label: "Registered carers",
      value: carerCount,
      icon: HeartHandshake,
      tone: "bg-[#EEE8FF] text-[#592EBD]",
    },
    {
      label: "Invitations sent",
      value: invitationsSent,
      icon: Mail,
      tone: "bg-[#E8F2FF] text-[#2879D8]",
    },
    {
      label: "Invitations accepted",
      value: invitationsAccepted,
      icon: CheckCircle2,
      tone: "bg-[#FFEAF2] text-[#E84A84]",
    },
  ];

  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
      <h2 className="font-bold text-[#282422]">
        Platform Activity Summary
      </h2>

      <div className="mt-5 space-y-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    item.tone
                  )}
                >
                  <Icon size={16} />
                </span>

                <p className="text-xs font-medium text-[#514B47]">
                  {item.label}
                </p>
              </div>

              <p className="font-bold text-[#282422]">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function EngagementInsights({
  total,
  high,
  moderate,
  low,
  notStarted,
}: {
  total: number;
  high: number;
  moderate: number;
  low: number;
  notStarted: number;
}) {
  const items = [
    {
      label: "High Engagement",
      value: high,
      description:
        "Frequent recent platform activity",
      icon: TrendingUp,
      tone: "bg-[#E6F7EF] text-[#20A663]",
    },
    {
      label: "Moderate Engagement",
      value: moderate,
      description:
        "Some recent platform activity",
      icon: Clock3,
      tone: "bg-[#FFF4DD] text-[#E99A17]",
    },
    {
      label: "Low or Inactive",
      value: low,
      description:
        "Limited or no recent activity",
      icon: Activity,
      tone: "bg-[#FFEAE5] text-[#DF5D3B]",
    },
    {
      label: "Not Started",
      value: notStarted,
      description:
        "No rehabilitation session recorded",
      icon: Target,
      tone: "bg-[#E8F2FF] text-[#2879D8]",
    },
  ];

  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
      <h2 className="font-bold text-[#282422]">
        Survivor Engagement Insights
      </h2>

      <p className="mt-1 text-xs text-[#77706B]">
        Platform-engagement categories, not clinical
        assessments
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-[#EEEAE6] p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    item.tone
                  )}
                >
                  <Icon size={17} />
                </span>

                <div>
                  <p className="text-xs font-semibold text-[#393432]">
                    {item.label}
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#282422]">
                    {percentage(
                      item.value,
                      total
                    )}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#77706B]">
                {item.description}
              </p>

              <p className="mt-2 text-xs font-semibold text-[#592EBD]">
                {item.value} survivor
                {item.value === 1 ? "" : "s"}
              </p>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function RecentInsights({
  completionRate,
  mostUsedExercise,
  peakUsage,
  activeSurvivors,
  totalSurvivors,
  acceptedInvitations,
  totalInvitations,
}: {
  completionRate: number;
  mostUsedExercise: string;
  peakUsage: string;
  activeSurvivors: number;
  totalSurvivors: number;
  acceptedInvitations: number;
  totalInvitations: number;
}) {
  const insights = [
    {
      text: `${completionRate}% of sessions in the selected demo period were completed.`,
      icon: TrendingUp,
      tone: "bg-[#E6F7EF] text-[#20A663]",
    },
    {
      text: `${mostUsedExercise} is currently the most-used exercise in the prototype catalogue.`,
      icon: Sparkles,
      tone: "bg-[#EEE8FF] text-[#592EBD]",
    },
    {
      text: `Peak recorded usage occurs around ${peakUsage}.`,
      icon: Clock3,
      tone: "bg-[#E8F2FF] text-[#2879D8]",
    },
    {
      text: `${activeSurvivors} of ${totalSurvivors} survivors recorded activity within the selected period.`,
      icon: Users,
      tone: "bg-[#FFEAF2] text-[#E84A84]",
    },
    {
      text: `${acceptedInvitations} of ${totalInvitations} demo invitations were accepted.`,
      icon: Mail,
      tone: "bg-[#FFF4DD] text-[#E99A17]",
    },
  ];

  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
      <h2 className="font-bold text-[#282422]">
        Recent Insights
      </h2>

      <div className="mt-5 space-y-4">
        {insights.map((insight) => {
          const Icon = insight.icon;

          return (
            <div
              key={insight.text}
              className="flex gap-3"
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  insight.tone
                )}
              >
                <Icon size={16} />
              </span>

              <p className="pt-1 text-sm leading-6 text-[#5F5955]">
                {insight.text}
              </p>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function EmptyChartState() {
  return (
    <div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[#CEC7C2] bg-[#FCFBFA] text-center">
      <BarChart3
        size={27}
        className="text-[#8A837E]"
      />

      <p className="mt-3 text-sm font-semibold text-[#393432]">
        No chart data available
      </p>

      <p className="mt-1 text-xs text-[#77706B]">
        Change the filters or date range.
      </p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="min-w-56 flex-1">
      <span className="text-xs font-semibold text-[#625C58]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-11 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm font-semibold outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
      >
        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          )
        )}
      </select>
    </label>
  );
}

function createSessionsOverTime(
  sessions: AdminSessionSummary[]
): AdminAnalyticsPoint[] {
  const totals = new Map<
    string,
    {
      date: Date;
      count: number;
    }
  >();

  sessions.forEach((session) => {
    const date = parseSessionDate(
      session.dateIso
    );

    const key = date.toISOString().slice(0, 10);

    const current = totals.get(key);

    totals.set(key, {
      date,
      count: (current?.count ?? 0) + 1,
    });
  });

  return [...totals.values()]
    .sort(
      (left, right) =>
        left.date.getTime() -
        right.date.getTime()
    )
    .map((item) => ({
      label: item.date.toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "short",
          timeZone: "UTC",
        }
      ),
      value: item.count,
    }));
}

function createActiveSurvivorsOverTime(
  sessions: AdminSessionSummary[]
): AdminAnalyticsPoint[] {
  const totals = new Map<
    string,
    {
      date: Date;
      survivors: Set<string>;
    }
  >();

  sessions.forEach((session) => {
    const date = parseSessionDate(
      session.dateIso
    );

    const key = date.toISOString().slice(0, 10);

    const current = totals.get(key) ?? {
      date,
      survivors: new Set<string>(),
    };

    current.survivors.add(
      session.participantId
    );

    totals.set(key, current);
  });

  return [...totals.values()]
    .sort(
      (left, right) =>
        left.date.getTime() -
        right.date.getTime()
    )
    .map((item) => ({
      label: item.date.toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "short",
          timeZone: "UTC",
        }
      ),
      value: item.survivors.size,
    }));
}

function createExerciseBreakdown(
  sessions: AdminSessionSummary[]
): AdminAnalyticsExerciseSegment[] {
  const totals = new Map<string, number>();

  sessions.forEach((session) => {
    totals.set(
      session.exerciseName,
      (totals.get(session.exerciseName) ??
        0) + 1
    );
  });

  const totalSessions = sessions.length;

  return [...totals.entries()]
    .sort(
      (left, right) =>
        right[1] - left[1]
    )
    .slice(0, 8)
    .map(([label, value], index) => ({
      label,
      value,
      percentage:
        totalSessions === 0
          ? 0
          : Math.round(
              (value / totalSessions) * 100
            ),
      colour:
        exerciseColours[
          index % exerciseColours.length
        ],
    }));
}

function createUsageHeatmap(
  sessions: AdminSessionSummary[]
): AdminAnalyticsHeatmapCell[] {
  const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const timeBuckets = [
    {
      label: "6am",
      hour: 6,
    },
    {
      label: "9am",
      hour: 9,
    },
    {
      label: "12pm",
      hour: 12,
    },
    {
      label: "3pm",
      hour: 15,
    },
    {
      label: "6pm",
      hour: 18,
    },
    {
      label: "9pm",
      hour: 21,
    },
  ];

  const totals = new Map<string, number>();

  sessions.forEach((session) => {
    const date = parseSessionDate(
      session.dateIso
    );

    const day = days[date.getUTCDay()];

    const hour = date.getUTCHours();

    const nearestBucket =
      timeBuckets.reduce((closest, bucket) => {
        return Math.abs(bucket.hour - hour) <
          Math.abs(closest.hour - hour)
          ? bucket
          : closest;
      });

    const key = `${day}-${nearestBucket.label}`;

    totals.set(
      key,
      (totals.get(key) ?? 0) + 1
    );
  });

  return [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ].flatMap((day) =>
    timeBuckets.map((time) => ({
      day,
      time: time.label,
      value:
        totals.get(`${day}-${time.label}`) ??
        0,
    }))
  );
}

function matchesDateRange(
  session: AdminSessionSummary,
  range: AdminAnalyticsDateRange
): boolean {
  if (range === "All Time") {
    return true;
  }

  const sessionDate = parseSessionDate(
    session.dateIso
  );

  const difference =
    DEMO_REFERENCE_DATE.getTime() -
    sessionDate.getTime();

  const differenceDays =
    difference / (1000 * 60 * 60 * 24);

  const limits: Record<
    Exclude<
      AdminAnalyticsDateRange,
      "All Time"
    >,
    number
  > = {
    "Last 7 Days": 7,
    "Last 30 Days": 30,
    "Last 90 Days": 90,
  };

  return (
    differenceDays >= 0 &&
    differenceDays <= limits[range]
  );
}

function getPeakUsagePeriod(
  cells: AdminAnalyticsHeatmapCell[]
): string {
  const peak = [...cells].sort(
    (left, right) =>
      right.value - left.value
  )[0];

  if (!peak || peak.value === 0) {
    return "no recorded period";
  }

  return `${peak.time} on ${peak.day}`;
}

function percentage(
  value: number,
  total: number
): string {
  if (total === 0) {
    return "0%";
  }

  return `${Math.round(
    (value / total) * 100
  )}%`;
}

function parseSessionDate(
  value: string
): Date {
  return new Date(
    value.endsWith("Z") ? value : `${value}Z`
  );
}