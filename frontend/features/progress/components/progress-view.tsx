"use client";

import {
  useMemo,
  useState,
} from "react";

import { ProgressStatCard } from "./progress-stat-card";
import { ScoreTrendCard } from "./score-trend-card";
import { TopExercisesCard } from "./top-exercises-card";

import type {
  ProgressData,
  ProgressRange,
  ProgressSessionRecord,
  ProgressSummary,
  ProgressTrendPoint,
  TopExerciseItem,
} from "@/features/progress/types";

type ProgressViewProps = {
  progressData: ProgressData;
};

const RANGE_OPTIONS: {
  label: string;
  value: ProgressRange;
}[] = [
  {
    label: "7 Days",
    value: "7_DAYS",
  },
  {
    label: "30 Days",
    value: "30_DAYS",
  },
  {
    label: "3 Months",
    value: "3_MONTHS",
  },
  {
    label: "All Time",
    value: "ALL_TIME",
  },
];

export function ProgressView({
  progressData,
}: ProgressViewProps) {
  const [selectedRange, setSelectedRange] =
    useState<ProgressRange>("30_DAYS");

  const filteredSessions = useMemo(
    () =>
      filterSessionsByRange(
        progressData.sessions,
        selectedRange
      ),
    [
      progressData.sessions,
      selectedRange,
    ]
  );

  const filteredSessionIds = useMemo(
    () =>
      new Set(
        filteredSessions.map(
          (session) => session.id
        )
      ),
    [filteredSessions]
  );

  const filteredAttempts = useMemo(
    () =>
      progressData.attempts.filter(
        (attempt) =>
          filteredSessionIds.has(
            attempt.sessionId
          )
      ),
    [
      filteredSessionIds,
      progressData.attempts,
    ]
  );

  const summary = useMemo(
    () =>
      calculateSummary(
        filteredSessions,
        filteredAttempts
      ),
    [filteredAttempts, filteredSessions]
  );

  const trend = useMemo(
    () =>
      buildTrend(
        filteredSessions,
        filteredAttempts,
        selectedRange
      ),
    [
      filteredAttempts,
      filteredSessions,
      selectedRange,
    ]
  );

  const topExercises = useMemo(
    () =>
      buildTopExercises(
        filteredSessions,
        filteredAttempts
      ),
    [filteredAttempts, filteredSessions]
  );

  const hasData =
    filteredSessions.length > 0;

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[40px] font-bold text-[#1E1E1E]">
            Your Progress
          </h1>

          <p className="mt-1 text-[20px] text-[#1E1E1E]">
            Track your rehabilitation
            activity over time.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((option) => {
            const isSelected =
              selectedRange === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setSelectedRange(
                    option.value
                  )
                }
                aria-pressed={isSelected}
                className={[
                  "min-h-[50px] rounded-xl border px-5 text-[14px] font-medium transition",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7875FB]/25",
                  isSelected
                    ? "border-[#7875FB] bg-[#7875FB] text-white"
                    : "border-[#06C7A8] bg-transparent text-[#1E1E1E] hover:bg-[#06C7A8]/5",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <ProgressStatCard
          title="Average Movement Score"
          value={
            summary.averageScore === null
              ? "Not assessed"
              : `${summary.averageScore}%`
          }
          helperText={
            summary.averageScore === null
              ? "Movement scoring is not available yet."
              : "Average across assessed attempts."
          }
          hasData={
            summary.averageScore !== null
          }
        />

        <ProgressStatCard
          title="Total Sessions"
          value={String(
            summary.totalSessions
          )}
          helperText={
            hasData
              ? "Sessions recorded in this period."
              : "No sessions recorded yet."
          }
          hasData={hasData}
        />

        <ProgressStatCard
          title="Total Time"
          value={formatDuration(
            summary.totalDurationSeconds
          )}
          helperText={
            hasData
              ? "Recorded rehabilitation time."
              : "No rehabilitation time yet."
          }
          hasData={hasData}
        />

        <ProgressStatCard
          title="Exercises Practised"
          value={String(
            summary.uniqueExercises
          )}
          helperText={
            hasData
              ? "Unique exercises in this period."
              : "No exercises practised yet."
          }
          hasData={hasData}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <ScoreTrendCard
          hasData={hasData}
          trend={trend}
          hasScores={
            summary.averageScore !== null
          }
        />

        <TopExercisesCard
          hasData={hasData}
          exercises={topExercises}
        />
      </div>
    </main>
  );
}

function filterSessionsByRange(
  sessions: ProgressSessionRecord[],
  range: ProgressRange
): ProgressSessionRecord[] {
  if (range === "ALL_TIME") {
    return sessions;
  }

  const now = new Date();

  const cutoff = new Date(now);

  if (range === "7_DAYS") {
    cutoff.setDate(now.getDate() - 7);
  }

  if (range === "30_DAYS") {
    cutoff.setDate(now.getDate() - 30);
  }

  if (range === "3_MONTHS") {
    cutoff.setMonth(now.getMonth() - 3);
  }

  return sessions.filter(
    (session) =>
      new Date(session.startedAt) >= cutoff
  );
}

function calculateSummary(
  sessions: ProgressSessionRecord[],
  attempts: ProgressData["attempts"]
): ProgressSummary {
  const assessedScores = attempts
    .map(
      (attempt) =>
        attempt.movementScore
    )
    .filter(
      (score): score is number =>
        typeof score === "number" &&
        Number.isFinite(score)
    );

  const averageScore =
    assessedScores.length > 0
      ? Math.round(
          assessedScores.reduce(
            (total, score) =>
              total + score,
            0
          ) / assessedScores.length
        )
      : null;

  const totalDurationSeconds =
    sessions.reduce(
      (total, session) =>
        total +
        Math.max(
          0,
          session.durationSeconds
        ),
      0
    );

  const uniqueExercises = new Set(
    sessions.map(
      (session) => session.exerciseId
    )
  ).size;

  return {
    averageScore,
    totalSessions: sessions.length,
    totalDurationSeconds,
    uniqueExercises,
  };
}

function buildTrend(
  sessions: ProgressSessionRecord[],
  attempts: ProgressData["attempts"],
  range: ProgressRange
): ProgressTrendPoint[] {
  const groups = new Map<
    string,
    {
      label: string;
      sessions: number;
      scores: number[];
    }
  >();

  sessions.forEach((session) => {
    const date = new Date(
      session.startedAt
    );

    const key =
      range === "3_MONTHS" ||
      range === "ALL_TIME"
        ? `${date.getFullYear()}-${date.getMonth()}`
        : date.toISOString().slice(0, 10);

    const label =
      range === "3_MONTHS" ||
      range === "ALL_TIME"
        ? date.toLocaleDateString(
            undefined,
            {
              month: "short",
              year: "2-digit",
            }
          )
        : date.toLocaleDateString(
            undefined,
            {
              day: "numeric",
              month: "short",
            }
          );

    const current = groups.get(key) ?? {
      label,
      sessions: 0,
      scores: [],
    };

    current.sessions += 1;

    groups.set(key, current);
  });

  const sessionDates = new Map(
    sessions.map((session) => [
      session.id,
      new Date(session.startedAt),
    ])
  );

  attempts.forEach((attempt) => {
    if (
      attempt.movementScore === null
    ) {
      return;
    }

    const date =
      sessionDates.get(
        attempt.sessionId
      );

    if (!date) {
      return;
    }

    const key =
      range === "3_MONTHS" ||
      range === "ALL_TIME"
        ? `${date.getFullYear()}-${date.getMonth()}`
        : date.toISOString().slice(0, 10);

    const current = groups.get(key);

    if (!current) {
      return;
    }

    current.scores.push(
      attempt.movementScore
    );
  });

  return Array.from(groups.entries())
    .sort(([firstKey], [secondKey]) =>
      firstKey.localeCompare(secondKey)
    )
    .map(([, group]) => ({
      label: group.label,
      sessions: group.sessions,
      score:
        group.scores.length > 0
          ? Math.round(
              group.scores.reduce(
                (total, score) =>
                  total + score,
                0
              ) / group.scores.length
            )
          : null,
    }));
}

function buildTopExercises(
  sessions: ProgressSessionRecord[],
  attempts: ProgressData["attempts"]
): TopExerciseItem[] {
  const attemptsBySession = new Map<
    string,
    number[]
  >();

  attempts.forEach((attempt) => {
    if (
      attempt.movementScore === null
    ) {
      return;
    }

    const current =
      attemptsBySession.get(
        attempt.sessionId
      ) ?? [];

    current.push(attempt.movementScore);

    attemptsBySession.set(
      attempt.sessionId,
      current
    );
  });

  const groups = new Map<
    string,
    {
      exerciseId: string;
      exerciseTitle: string;
      exerciseSlug: string;
      sessions: number;
      completedSessions: number;
      scores: number[];
    }
  >();

  sessions.forEach((session) => {
    const current =
      groups.get(
        session.exerciseId
      ) ?? {
        exerciseId:
          session.exerciseId,
        exerciseTitle:
          session.exerciseTitle,
        exerciseSlug:
          session.exerciseSlug,
        sessions: 0,
        completedSessions: 0,
        scores: [],
      };

    current.sessions += 1;

    if (
      session.status === "COMPLETED"
    ) {
      current.completedSessions += 1;
    }

    current.scores.push(
      ...(
        attemptsBySession.get(
          session.id
        ) ?? []
      )
    );

    groups.set(
      session.exerciseId,
      current
    );
  });

  return Array.from(groups.values())
    .map((group) => ({
      exerciseId: group.exerciseId,
      exerciseTitle:
        group.exerciseTitle,
      exerciseSlug:
        group.exerciseSlug,
      sessions: group.sessions,
      completedSessions:
        group.completedSessions,
      averageScore:
        group.scores.length > 0
          ? Math.round(
              group.scores.reduce(
                (total, score) =>
                  total + score,
                0
              ) / group.scores.length
            )
          : null,
    }))
    .sort((first, second) => {
      if (
        second.sessions !==
        first.sessions
      ) {
        return (
          second.sessions -
          first.sessions
        );
      }

      return (
        second.completedSessions -
        first.completedSessions
      );
    })
    .slice(0, 5);
}

function formatDuration(
  totalSeconds: number
): string {
  const safeSeconds = Math.max(
    0,
    totalSeconds
  );

  const hours = Math.floor(
    safeSeconds / 3600
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}