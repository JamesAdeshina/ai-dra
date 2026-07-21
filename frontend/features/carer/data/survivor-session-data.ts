import { createClient } from "@/lib/supabase/server";

import type {
  CarerSessionHistoryItem,
  RehabilitationSessionStatus,
} from "@/features/carer/types/session-history";

type SessionRow = {
  id: string;
  survivor_id: string;
  status: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string | null;
  session_summary: Record<string, unknown> | null;
  difficulty_flag: boolean | null;
  difficulty_reason: string | null;
};

export async function getSurvivorSessionsById(
  survivorId: string,
): Promise<CarerSessionHistoryItem[]> {
  const supabase = await createClient();

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(
    ninetyDaysAgo.getDate() - 90,
  );

  const { data, error } = await supabase.rpc(
    "get_my_linked_survivor_sessions_for_carer",
    {
      from_date: ninetyDaysAgo.toISOString(),
    },
  );

  if (error) {
    console.warn(
      "Unable to load linked survivor sessions:",
      error,
    );

    return [];
  }

  return ((data ?? []) as SessionRow[])
    .filter(
      (session) =>
        session.survivor_id === survivorId,
    )
    .map(mapSession)
    .sort(
      (first, second) =>
        new Date(second.dateISO).getTime() -
        new Date(first.dateISO).getTime(),
    );
}

function mapSession(
  session: SessionRow,
): CarerSessionHistoryItem {
  const sessionDate = getSessionDate(session);

  return {
    id: session.id,
    survivorId: session.survivor_id,
    dateLabel: formatDate(
      sessionDate.toISOString(),
    ),
    dateISO: sessionDate.toISOString(),
    exerciseNames: [
      getExerciseName(session),
    ],
    score: getSessionScore(session),
    status: getSessionStatus(session),
    durationMinutes:
      getSessionDurationMinutes(session),
  };
}

function getSessionStatus(
  session: SessionRow,
): RehabilitationSessionStatus {
  const status =
    session.status?.toUpperCase();

  if (status === "COMPLETED") {
    return "COMPLETED";
  }

  if (status === "ENDED_EARLY") {
    return "ENDED_EARLY";
  }

  if (
    status === "PAUSED" ||
    status === "ACTIVE" ||
    status === "IN_PROGRESS" ||
    status === "PARTIAL"
  ) {
    return "PARTIAL";
  }

  return "MISSED";
}

function getExerciseName(session: SessionRow) {
  const summary = session.session_summary ?? {};

  const value =
    summary.exerciseTitle ??
    summary.exercise_title ??
    summary.exerciseName ??
    summary.exercise_name;

  return typeof value === "string" && value.trim()
    ? value
    : "Exercise session";
}

function getSessionDate(session: SessionRow) {
  const rawDate =
    session.ended_at ??
    session.started_at ??
    session.created_at;

  const date = rawDate
    ? new Date(rawDate)
    : new Date();

  return Number.isNaN(date.getTime())
    ? new Date()
    : date;
}

function getSessionDurationMinutes(
  session: SessionRow,
) {
  const startedAt = session.started_at
    ? new Date(session.started_at)
    : null;

  const endedAt = session.ended_at
    ? new Date(session.ended_at)
    : null;

  if (
    startedAt &&
    endedAt &&
    !Number.isNaN(startedAt.getTime()) &&
    !Number.isNaN(endedAt.getTime()) &&
    endedAt.getTime() > startedAt.getTime()
  ) {
    return Math.max(
      1,
      Math.round(
        (endedAt.getTime() -
          startedAt.getTime()) /
          60000,
      ),
    );
  }

  const summaryDuration =
    session.session_summary?.duration_seconds ??
    session.session_summary?.durationSeconds ??
    session.session_summary?.duration;

  if (
    typeof summaryDuration === "number" &&
    summaryDuration > 0
  ) {
    return Math.max(
      1,
      Math.round(summaryDuration / 60),
    );
  }

  return 1;
}

function getSessionScore(session: SessionRow) {
  const summary = session.session_summary ?? {};

  const possibleValues = [
    summary.averageAccuracy,
    summary.average_accuracy,
    summary.accuracy_score,
    summary.accuracyScore,
    summary.averageMovementScore,
    summary.average_movement_score,
    summary.movement_score,
    summary.movementScore,
    summary.score,
  ];

  const score = possibleValues.find(
    (value): value is number =>
      typeof value === "number" &&
      Number.isFinite(value),
  );

  if (typeof score !== "number") {
    return null;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(score)),
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}