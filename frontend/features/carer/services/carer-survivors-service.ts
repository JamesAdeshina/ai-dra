import { createClient } from "@/lib/supabase/server";

import type {
  CarerSurvivorDirectoryItem,
  DirectorySurvivorStatus,
} from "@/features/carer/types";

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

export type CarerSurvivorsDirectoryData = {
  survivors: CarerSurvivorDirectoryItem[];
  pendingInviteCount: number;
};

const DEFAULT_DAILY_GOAL_MINUTES = 10;
const DEFAULT_TARGET_SESSIONS = 1;

export async function getCarerSurvivorsDirectoryData(): Promise<CarerSurvivorsDirectoryData> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to view linked survivors.");
  }

  const [linkedSurvivors, sessions, pendingInviteCount] =
    await Promise.all([
      getLinkedSurvivors(),
      getRecentSessions(),
      getPendingInviteCount(user.id),
    ]);

  const sessionsBySurvivor = groupSessionsBySurvivor(sessions);

  return {
    survivors: linkedSurvivors.map((survivor) =>
      buildDirectoryItem({
        survivor,
        sessions: sessionsBySurvivor.get(survivor.survivor_id) ?? [],
      }),
    ),
    pendingInviteCount,
  };
}

async function getLinkedSurvivors(): Promise<LinkedSurvivorRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_my_linked_survivors_for_carer",
  );

  if (error) {
    console.error("Failed to load linked survivors:", error);
    throw new Error("Linked survivors could not be loaded.");
  }

  return (data ?? []) as LinkedSurvivorRow[];
}

async function getRecentSessions(): Promise<SessionRow[]> {
  const supabase = await createClient();

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data, error } = await supabase.rpc(
    "get_my_linked_survivor_sessions_for_carer",
    {
      from_date: ninetyDaysAgo.toISOString(),
    },
  );

  if (error) {
    console.warn(
      "Survivor directory is loading without session activity because sessions could not be loaded:",
      error,
    );

    return [];
  }

  return (data ?? []) as SessionRow[];
}

async function getPendingInviteCount(carerId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("carer_invitations")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("inviter_id", carerId)
    .eq("status", "PENDING");

  if (error) {
    console.warn("Pending carer invitation count could not be loaded:", error);
    return 0;
  }

  return count ?? 0;
}

function buildDirectoryItem({
  survivor,
  sessions,
}: {
  survivor: LinkedSurvivorRow;
  sessions: SessionRow[];
}): CarerSurvivorDirectoryItem {
  const name = getSurvivorName(survivor);
  const completedSessions = sessions.filter(isCompletedSession);
  const todaySessions = sessions.filter(isTodaySession);
  const todayCompletedSessions = completedSessions.filter(isTodaySession);
  const latestSession = sessions[0];

  /*
   * Active today should mean any recorded rehabilitation activity,
   * not only a fully completed session. ENDED_EARLY still means
   * the survivor attempted an exercise today.
   */
  const activeToday = todaySessions.length > 0;

  const todayProgressMinutes = Math.min(
    DEFAULT_DAILY_GOAL_MINUTES,
    todaySessions.reduce(
      (total, session) => total + getSessionDurationMinutes(session),
      0,
    ),
  );

  /*
   * Average Completion must include ENDED_EARLY and partial sessions.
   * Otherwise every fully completed session becomes 100%, and the
   * dashboard hides failed or incomplete attempts.
   */
  const averageScore = getAverageScore(sessions);

  return {
    id: survivor.survivor_id,
    name,
    initials: getInitials(name),
    avatarUrl: undefined,
    age: 0,
    relationship: "Linked Survivor",
    conditionLabel: "Stroke Survivor",
    affectedSide: "RIGHT",
    status: getDirectoryStatus(sessions),
    activeToday,
    linkedAt: survivor.linked_at,
    todayProgressMinutes,
    dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES,
    completedSessions: todayCompletedSessions.length,
    targetSessions: DEFAULT_TARGET_SESSIONS,
    currentStreakDays: getCurrentStreakDays(sessions),
    latestSessionExercise: latestSession
      ? getExerciseName(latestSession)
      : "No session yet",
    latestSessionDateLabel: latestSession
      ? getRelativeDateLabel(getSessionDate(latestSession))
      : "No recent activity",
    latestSessionTime: latestSession
      ? formatTime(getSessionDate(latestSession))
      : "—",
    averageScore,
  };
}

function groupSessionsBySurvivor(sessions: SessionRow[]) {
  const map = new Map<string, SessionRow[]>();

  sessions.forEach((session) => {
    const current = map.get(session.survivor_id) ?? [];
    current.push(session);
    map.set(session.survivor_id, current);
  });

  return map;
}

function getSurvivorName(survivor: LinkedSurvivorRow) {
  const name = [survivor.first_name, survivor.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || survivor.email || "Linked Survivor";
}

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2) || "LS"
  );
}

function isCompletedSession(session: SessionRow) {
  return session.status?.toUpperCase() === "COMPLETED";
}

function isTodaySession(session: SessionRow) {
  return isSameDay(getSessionDate(session), new Date());
}

function getSessionDate(session: SessionRow) {
  const rawDate =
    session.completed_at ??
    session.ended_at ??
    session.started_at ??
    session.created_at;

  const date = rawDate ? new Date(rawDate) : new Date();

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function getSessionDurationMinutes(session: SessionRow) {
  if (typeof session.duration_seconds === "number" && session.duration_seconds > 0) {
    return Math.max(1, Math.round(session.duration_seconds / 60));
  }

  const startedAt = session.started_at ? new Date(session.started_at) : null;
  const endedAt = (session.completed_at ?? session.ended_at)
    ? new Date(session.completed_at ?? session.ended_at ?? "")
    : null;

  if (
    startedAt &&
    endedAt &&
    !Number.isNaN(startedAt.getTime()) &&
    !Number.isNaN(endedAt.getTime()) &&
    endedAt.getTime() > startedAt.getTime()
  ) {
    return Math.max(1, Math.round((endedAt.getTime() - startedAt.getTime()) / 60000));
  }

  const summary = session.session_summary ?? {};
  const summaryDuration =
    summary.durationSeconds ??
    summary.duration_seconds ??
    summary.duration;

  if (typeof summaryDuration === "number" && summaryDuration > 0) {
    return Math.max(1, Math.round(summaryDuration / 60));
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

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  const slug =
    session.exercise_slug ??
    (typeof summary.exerciseSlug === "string" ? summary.exerciseSlug : null) ??
    (typeof summary.exercise_slug === "string" ? summary.exercise_slug : null);

  return slug ? titleFromSlug(slug) : "Exercise session";
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getSessionCompletionScore(session: SessionRow) {
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
    return Math.max(0, Math.min(100, Math.round((completedReps / targetReps) * 100)));
  }

  return null;
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
      typeof value === "number" && Number.isFinite(value),
  );

  if (typeof score === "number") {
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  return getSessionCompletionScore(session);
}

function getAverageScore(sessions: SessionRow[]) {
  const scores = sessions
    .map(getSessionScore)
    .filter((score): score is number => typeof score === "number");

  if (scores.length === 0) {
    return 0;
  }

  return Math.round(
    scores.reduce((total, score) => total + score, 0) / scores.length,
  );
}

function getDirectoryStatus(sessions: SessionRow[]): DirectorySurvivorStatus {
  if (sessions.some((session) => session.difficulty_flag === true)) {
    return "NEEDS_SUPPORT";
  }

  const completedToday = sessions.some(
    (session) => isCompletedSession(session) && isTodaySession(session),
  );

  if (completedToday) {
    return "ON_TRACK";
  }

  const latestSession = sessions[0];

  if (!latestSession) {
    return "AT_RISK";
  }

  const daysSinceLatest = getDaysBetween(getSessionDate(latestSession), new Date());

  if (daysSinceLatest >= 7) {
    return "AT_RISK";
  }

  return "NEEDS_SUPPORT";
}

function getCurrentStreakDays(sessions: SessionRow[]) {
  const completedDates = new Set(
    sessions
      .filter(isCompletedSession)
      .map((session) => toDateKey(getSessionDate(session))),
  );

  let streak = 0;
  const cursor = new Date();

  while (completedDates.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getRelativeDateLabel(date: Date) {
  if (isSameDay(date, new Date())) {
    return "Today";
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, yesterday)) {
    return "Yesterday";
  }

  const daysAgo = getDaysBetween(date, new Date());

  if (daysAgo > 1 && daysAgo < 7) {
    return `${daysAgo} days ago`;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getDaysBetween(from: Date, to: Date) {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);

  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  return Math.floor((end.getTime() - start.getTime()) / 86400000);
}

function isSameDay(first: Date, second: Date) {
  return toDateKey(first) === toDateKey(second);
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : null;
}