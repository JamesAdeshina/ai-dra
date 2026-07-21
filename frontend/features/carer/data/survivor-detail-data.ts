import { createClient } from "@/lib/supabase/server";

import type { DirectorySurvivorStatus } from "@/features/carer/types";
import type { SurvivorDetail } from "@/features/carer/types/survivor-detail";

type LinkedSurvivorRow = {
  relationship_id: string;
  survivor_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  linked_at: string;
  permissions: Record<string, boolean> | null;
};

type SessionRow = {
  id: string;
  survivor_id: string;
  exercise_id: string | null;
  exercise_title: string | null;
  exercise_slug: string | null;
  status: string | null;
  target_reps: number | null;
  completed_reps: number | null;
  duration_seconds: number | null;
  started_at: string | null;
  ended_at: string | null;
  completed_at: string | null;
  created_at: string | null;
  session_summary: Record<string, unknown> | null;
  difficulty_flag: boolean | null;
  difficulty_reason: string | null;
};

const DEFAULT_DAILY_GOAL_MINUTES = 10;

export async function getSurvivorDetailById(
  survivorId: string,
): Promise<SurvivorDetail | null> {
  const linkedSurvivor =
    await getLinkedSurvivorById(survivorId);

  if (!linkedSurvivor) {
    return null;
  }

  const sessions =
    await getLinkedSurvivorSessions(survivorId);

  const completedSessions =
    sessions.filter(isCompletedSession);

  const todaySessions =
    sessions.filter(isTodaySession);

  const currentStreakDays =
    getCurrentStreakDays(sessions);

  const averageCompletion =
    getAverageCompletion(sessions);

  const todayProgressMinutes = Math.min(
    DEFAULT_DAILY_GOAL_MINUTES,
    todaySessions.reduce(
      (total, session) =>
        total +
        getSessionDurationMinutes(session),
      0,
    ),
  );

  const latestSession = sessions[0];
  const status = getDirectoryStatus(sessions);
  const weeklyProgress = getWeeklyProgress(sessions);
  const fullName = getLinkedSurvivorName(linkedSurvivor);

  return {
    id: linkedSurvivor.survivor_id,
    name: fullName,
    initials: getInitials(fullName),
    avatarUrl: undefined,
    conditionLabel: "Stroke Survivor",
    status,

    todayProgressMinutes,
    dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES,
    currentStreakDays,
    averageCompletion,

    joinedAtLabel: `Joined ${formatDate(linkedSurvivor.linked_at)}`,
    sessionsCount: sessions.length,
    exercisesCount: new Set(
      sessions
        .map((session) => session.exercise_id)
        .filter(Boolean),
    ).size,
    currentExercise: latestSession
      ? getExerciseName(latestSession)
      : "No active exercise",
    currentExerciseTargetLabel: latestSession
      ? latestSession.status?.replaceAll("_", " ").toLowerCase() ?? "Recent activity"
      : "Awaiting first session",
    statusHelperText: getStatusHelperText(status),

    lastSession: latestSession
      ? {
          dateLabel: formatDate(
            getSessionDate(latestSession).toISOString(),
          ),
          timeLabel: formatTime(
            getSessionDate(latestSession).toISOString(),
          ),
          score: getSessionCompletion(latestSession) ?? 0,
        }
      : {
          dateLabel: "No session",
          timeLabel: "—",
          score: 0,
        },

    weeklyProgress,

    carerNote: {
      content:
        "Private carer notes will be stored here once note persistence is connected.",
      lastUpdatedLabel: "Not saved yet",
    },
  };
}

async function getLinkedSurvivorById(
  survivorId: string,
): Promise<LinkedSurvivorRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_my_linked_survivors_for_carer",
  );

  if (error) {
    console.error(
      "Failed to load linked survivor detail:",
      error,
    );

    throw new Error(
      "Linked survivor details could not be loaded.",
    );
  }

  const rows = (data ?? []) as LinkedSurvivorRow[];

  return (
    rows.find(
      (row) => row.survivor_id === survivorId,
    ) ?? null
  );
}

async function getLinkedSurvivorSessions(
  survivorId: string,
): Promise<SessionRow[]> {
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
      "Survivor detail is loading without session history because sessions could not be loaded:",
      error,
    );

    return [];
  }

  return ((data ?? []) as SessionRow[]).filter(
    (session) =>
      session.survivor_id === survivorId,
  );
}

function getLinkedSurvivorName(
  survivor: LinkedSurvivorRow,
) {
  const name = [
    survivor.first_name,
    survivor.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    name ||
    survivor.email ||
    "Linked Survivor"
  );
}

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) =>
        part.charAt(0).toUpperCase(),
      )
      .join("")
      .slice(0, 2) || "LS"
  );
}

function isCompletedSession(session: SessionRow) {
  return (
    session.status?.toUpperCase() ===
    "COMPLETED"
  );
}

function isTodaySession(session: SessionRow) {
  return isSameDay(
    getSessionDate(session),
    new Date(),
  );
}

function getSessionDate(session: SessionRow) {
  const rawDate =
    session.completed_at ??
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
  if (
    typeof session.duration_seconds === "number" &&
    session.duration_seconds > 0
  ) {
    return Math.max(
      1,
      Math.round(session.duration_seconds / 60),
    );
  }

  const summaryDuration =
    session.session_summary?.durationSeconds ??
    session.session_summary?.duration_seconds ??
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

function getExerciseName(session: SessionRow) {
  if (session.exercise_title?.trim()) {
    return session.exercise_title;
  }

  const summary = session.session_summary ?? {};

  const value =
    summary.exerciseTitle ??
    summary.exercise_title ??
    summary.exerciseName ??
    summary.exercise_name;

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value;
  }

  const slug =
    session.exercise_slug ??
    (typeof summary.exerciseSlug === "string"
      ? summary.exerciseSlug
      : null) ??
    (typeof summary.exercise_slug === "string"
      ? summary.exercise_slug
      : null);

  return slug
    ? titleFromSlug(slug)
    : "Exercise session";
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function getSessionCompletion(session: SessionRow) {
  const summary = session.session_summary ?? {};

  const completedReps =
    session.completed_reps ??
    getNumber(summary.completedReps) ??
    getNumber(summary.completed_reps);

  const targetReps =
    session.target_reps ??
    getNumber(summary.targetReps) ??
    getNumber(summary.target_reps);

  if (
    typeof completedReps === "number" &&
    typeof targetReps === "number" &&
    targetReps > 0
  ) {
    return Math.max(
      0,
      Math.min(
        100,
        Math.round(
          (completedReps / targetReps) * 100,
        ),
      ),
    );
  }

  return null;
}

function getAverageCompletion(
  sessions: SessionRow[],
) {
  const scores = sessions
    .map(getSessionCompletion)
    .filter(
      (score): score is number =>
        typeof score === "number",
    );

  if (scores.length === 0) {
    return 0;
  }

  return Math.round(
    scores.reduce(
      (total, score) => total + score,
      0,
    ) / scores.length,
  );
}

function getDirectoryStatus(
  sessions: SessionRow[],
): DirectorySurvivorStatus {
  if (
    sessions.some(
      (session) =>
        session.difficulty_flag === true,
    )
  ) {
    return "NEEDS_SUPPORT";
  }

  const completedToday = sessions.some(
    (session) =>
      isCompletedSession(session) &&
      isTodaySession(session),
  );

  if (completedToday) {
    return "ON_TRACK";
  }

  const latestSession = sessions[0];

  if (!latestSession) {
    return "AT_RISK";
  }

  const daysSinceLatest =
    getDaysBetween(
      getSessionDate(latestSession),
      new Date(),
    );

  if (daysSinceLatest >= 7) {
    return "AT_RISK";
  }

  return "NEEDS_SUPPORT";
}

function getStatusHelperText(
  status: DirectorySurvivorStatus,
) {
  if (status === "ON_TRACK") {
    return "Recent progress looks consistent.";
  }

  if (status === "NEEDS_SUPPORT") {
    return "May need encouragement or support.";
  }

  return "No recent activity has been recorded.";
}

function getCurrentStreakDays(
  sessions: SessionRow[],
) {
  const completedDates = new Set(
    sessions
      .filter(isCompletedSession)
      .map((session) =>
        toDateKey(getSessionDate(session)),
      ),
  );

  let streak = 0;
  const cursor = new Date();

  while (completedDates.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getWeeklyProgress(
  sessions: SessionRow[],
) {
  const days = getLastSevenDays();

  return days.map((day) => {
    const daySessions = sessions.filter(
      (session) =>
        isSameDay(
          getSessionDate(session),
          day.date,
        ),
    );

    const value =
      daySessions.length === 0
        ? 0
        : getAverageCompletion(daySessions);

    return {
      label: day.label,
      value,
    };
  });
}

function getLastSevenDays() {
  const formatter =
    new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
    });

  return Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date();

      date.setDate(
        date.getDate() - (6 - index),
      );

      return {
        date,
        label: formatter.format(date),
      };
    },
  );
}

function getDaysBetween(from: Date, to: Date) {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);

  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  return Math.floor(
    (end.getTime() - start.getTime()) /
      86400000,
  );
}

function isSameDay(first: Date, second: Date) {
  return toDateKey(first) === toDateKey(second);
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getNumber(value: unknown) {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : null;
}