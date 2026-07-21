import { createClient } from "@/lib/supabase/server";

import type {
  CarerActivity,
  CarerReminder,
  CarerSurvivorSummary,
  DashboardStat,
  WeeklyProgressPoint,
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

type ProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  weekly_goal_minutes: number | null;
};

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

export type CarerDashboardData = {
  stats: DashboardStat[];
  connectedSurvivors: CarerSurvivorSummary[];
  weeklyProgress: WeeklyProgressPoint[];
  upcomingReminders: CarerReminder[];
  recentActivities: CarerActivity[];
};

const DEFAULT_DAILY_GOAL_MINUTES = 10;
const DEFAULT_TARGET_SESSIONS = 1;

export async function getCarerDashboardData(): Promise<CarerDashboardData> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to view the carer dashboard."
    );
  }

  const profiles = await getLinkedSurvivorProfiles();

  if (profiles.length === 0) {
    return getEmptyDashboardData();
  }

  const survivorIds = profiles.map((profile) => profile.id);
  const sessions = await getRecentSessions();

  const sessionsBySurvivor = groupSessionsBySurvivor(sessions);

  const connectedSurvivors = profiles.map((profile) => {
    const survivorSessions =
      sessionsBySurvivor.get(profile.id) ?? [];

    return buildSurvivorSummary({
      survivorId: profile.id,
      profile,
      sessions: survivorSessions,
    });
  });

  const recentActivities = buildRecentActivities({
    sessions,
    survivors: connectedSurvivors,
  });

  const weeklyProgress = buildWeeklyProgress({
    sessions,
    survivorCount: connectedSurvivors.length,
  });

  const stats = buildDashboardStats({
    survivors: connectedSurvivors,
    sessions,
  });

  return {
    stats,
    connectedSurvivors,
    weeklyProgress,
    upcomingReminders: [],
    recentActivities,
  };
}

async function getLinkedSurvivorProfiles(): Promise<ProfileRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_my_linked_survivors_for_carer"
  );

  if (error) {
    console.error(
      "Failed to load linked survivor profiles:",
      error
    );

    throw new Error(
      "Linked survivors could not be loaded."
    );
  }

  const rows = (data ?? []) as LinkedSurvivorRow[];

  return rows.map((row) => {
    const fullName = [
      row.first_name,
      row.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      id: row.survivor_id,
      first_name: row.first_name,
      last_name: row.last_name,
      display_name:
        fullName ||
        row.email ||
        "Linked Survivor",
      weekly_goal_minutes: null,
    };
  });
}

async function getRecentSessions(): Promise<SessionRow[]> {
  const supabase = await createClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(
    thirtyDaysAgo.getDate() - 30
  );

  const { data, error } = await supabase.rpc(
    "get_my_linked_survivor_sessions_for_carer",
    {
      from_date: thirtyDaysAgo.toISOString(),
    }
  );

  if (error) {
    console.warn(
      "Carer dashboard is using linked-survivor data only because sessions could not be loaded:",
      error
    );

    return [];
  }

  return (data ?? []) as SessionRow[];
}

function buildSurvivorSummary({
  survivorId,
  profile,
  sessions,
}: {
  survivorId: string;
  profile: ProfileRow | undefined;
  sessions: SessionRow[];
}): CarerSurvivorSummary {
  const name = getDisplayName(profile);

  const todaySessions = sessions.filter(
    isTodaySession
  );

  const completedToday = todaySessions.filter(
    isCompletedSession
  );

  const dailyGoalMinutes =
    typeof profile?.weekly_goal_minutes === "number" &&
    profile.weekly_goal_minutes > 0
      ? Math.max(
          Math.round(
            profile.weekly_goal_minutes / 7
          ),
          DEFAULT_DAILY_GOAL_MINUTES
        )
      : DEFAULT_DAILY_GOAL_MINUTES;

  const todayProgressMinutes = Math.min(
    dailyGoalMinutes,
    completedToday.reduce(
      (total, session) =>
        total +
        getSessionDurationMinutes(session),
      0
    )
  );

  const lastCompletedSession =
    sessions.find(isCompletedSession);

  const hasDifficulty = sessions.some(
    (session) =>
      session.difficulty_flag === true
  );

  const status = getSurvivorStatus({
    sessions,
    completedTodayCount:
      completedToday.length,
    hasDifficulty,
  });

  return {
    id: survivorId,
    name,
    initials: getInitials(name),
    avatarUrl: undefined,
    conditionLabel: "Stroke Survivor",
    relationship: "Linked Survivor",
    todayProgressMinutes,
    dailyGoalMinutes,
    completedSessions:
      completedToday.length,
    targetSessions:
      DEFAULT_TARGET_SESSIONS,
    currentStreakDays:
      getCurrentStreakDays(sessions),
    lastCompletedExercise:
      lastCompletedSession
        ? "Exercise session"
        : "No completed session yet",
    lastCompletedTime:
      lastCompletedSession
        ? getRelativeTimeLabel(
            getSessionDate(
              lastCompletedSession
            )
          )
        : "No recent activity",
    status,
  };
}

function buildDashboardStats({
  survivors,
  sessions,
}: {
  survivors: CarerSurvivorSummary[];
  sessions: SessionRow[];
}): DashboardStat[] {
  const todayCompleted = sessions.filter(
    (session) =>
      isTodaySession(session) &&
      isCompletedSession(session)
  ).length;

  const averageCompletion =
    survivors.length === 0
      ? 0
      : Math.round(
          survivors.reduce(
            (total, survivor) =>
              total +
              Math.min(
                100,
                Math.round(
                  (survivor.todayProgressMinutes /
                    Math.max(
                      survivor.dailyGoalMinutes,
                      1
                    )) *
                    100
                )
              ),
            0
          ) / survivors.length
        );

  const longestStreak =
    survivors.reduce(
      (max, survivor) =>
        Math.max(
          max,
          survivor.currentStreakDays
        ),
      0
    );

  return [
    {
      id: "linked-survivors",
      label: "Linked Survivors",
      value: String(survivors.length),
      icon: "goal",
    },
    {
      id: "completed-today",
      label: "Sessions Completed Today",
      value: String(todayCompleted),
      icon: "completed",
    },
    {
      id: "longest-streak",
      label: "Longest Current Streak",
      value: String(longestStreak),
      suffix:
        longestStreak === 1
          ? "day"
          : "days",
      icon: "streak",
    },
    {
      id: "average-completion",
      label: "Average Completion",
      value: String(averageCompletion),
      suffix: "%",
      icon: "completion",
    },
  ];
}

function buildRecentActivities({
  sessions,
  survivors,
}: {
  sessions: SessionRow[];
  survivors: CarerSurvivorSummary[];
}): CarerActivity[] {
  const survivorById = new Map(
    survivors.map((survivor) => [
      survivor.id,
      survivor,
    ])
  );

  return sessions
    .filter(isCompletedSession)
    .slice(0, 6)
    .map((session) => {
      const survivor = survivorById.get(
        session.survivor_id
      );

      const sessionDate =
        getSessionDate(session);

      return {
        id: session.id,
        survivorName:
          survivor?.name ??
          "Linked survivor",
        initials:
          survivor?.initials ?? "LS",
        avatarUrl:
          survivor?.avatarUrl ?? undefined,
        description:
          "completed an exercise session",
        timeLabel:
          getRelativeTimeLabel(
            sessionDate
          ),
      };
    });
}

function buildWeeklyProgress({
  sessions,
  survivorCount,
}: {
  sessions: SessionRow[];
  survivorCount: number;
}): WeeklyProgressPoint[] {
  const days = getLastSevenDays();

  return days.map((day) => {
    const completedCount =
      sessions.filter((session) => {
        return (
          isCompletedSession(session) &&
          isSameDay(
            getSessionDate(session),
            day.date
          )
        );
      }).length;

    const value =
      survivorCount === 0
        ? 0
        : Math.min(
            100,
            Math.round(
              (completedCount /
                Math.max(
                  survivorCount,
                  1
                )) *
                100
            )
          );

    return {
      label: day.label,
      value,
    };
  });
}

function getEmptyDashboardData(): CarerDashboardData {
  return {
    stats: [
      {
        id: "linked-survivors",
        label: "Linked Survivors",
        value: "0",
        icon: "goal",
      },
      {
        id: "completed-today",
        label: "Sessions Completed Today",
        value: "0",
        icon: "completed",
      },
      {
        id: "longest-streak",
        label: "Longest Current Streak",
        value: "0",
        suffix: "days",
        icon: "streak",
      },
      {
        id: "average-completion",
        label: "Average Completion",
        value: "0",
        suffix: "%",
        icon: "completion",
      },
    ],
    connectedSurvivors: [],
    weeklyProgress:
      getLastSevenDays().map((day) => ({
        label: day.label,
        value: 0,
      })),
    upcomingReminders: [],
    recentActivities: [],
  };
}

function groupSessionsBySurvivor(
  sessions: SessionRow[]
) {
  const map =
    new Map<string, SessionRow[]>();

  sessions.forEach((session) => {
    const current =
      map.get(session.survivor_id) ??
      [];

    current.push(session);

    map.set(
      session.survivor_id,
      current
    );
  });

  return map;
}

function getDisplayName(
  profile: ProfileRow | undefined
) {
  const nameFromFields = [
    profile?.first_name,
    profile?.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    profile?.display_name?.trim() ||
    nameFromFields ||
    "Linked Survivor"
  );
}

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("")
      .slice(0, 2) || "LS"
  );
}

function isCompletedSession(
  session: SessionRow
) {
  return (
    session.status?.toUpperCase() ===
    "COMPLETED"
  );
}

function isTodaySession(
  session: SessionRow
) {
  return isSameDay(
    getSessionDate(session),
    new Date()
  );
}

function getSessionDate(
  session: SessionRow
) {
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
  session: SessionRow
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
          60000
      )
    );
  }

  const summaryDuration =
    session.session_summary
      ?.duration_seconds;

  if (
    typeof summaryDuration === "number" &&
    summaryDuration > 0
  ) {
    return Math.max(
      1,
      Math.round(summaryDuration / 60)
    );
  }

  return 1;
}

function getSurvivorStatus({
  sessions,
  completedTodayCount,
  hasDifficulty,
}: {
  sessions: SessionRow[];
  completedTodayCount: number;
  hasDifficulty: boolean;
}): CarerSurvivorSummary["status"] {
  if (hasDifficulty) {
    return "DIFFICULTY_REPORTED";
  }

  if (completedTodayCount > 0) {
    return "ON_TRACK";
  }

  const lastSession = sessions[0];

  if (!lastSession) {
    return "NO_RECENT_ACTIVITY";
  }

  const daysSinceLastSession =
    getDaysBetween(
      getSessionDate(lastSession),
      new Date()
    );

  if (daysSinceLastSession >= 7) {
    return "NO_RECENT_ACTIVITY";
  }

  return "SESSION_MISSED";
}

function getCurrentStreakDays(
  sessions: SessionRow[]
) {
  const completedDates = new Set(
    sessions
      .filter(isCompletedSession)
      .map((session) =>
        toDateKey(
          getSessionDate(session)
        )
      )
  );

  let streak = 0;
  const cursor = new Date();

  while (
    completedDates.has(
      toDateKey(cursor)
    )
  ) {
    streak += 1;
    cursor.setDate(
      cursor.getDate() - 1
    );
  }

  return streak;
}

function getRelativeTimeLabel(
  date: Date
) {
  const now = new Date();
  const diffMs =
    now.getTime() - date.getTime();

  const diffMinutes = Math.max(
    0,
    Math.floor(diffMs / 60000)
  );

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(
    diffMinutes / 60
  );

  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.floor(
    diffHours / 24
  );

  if (diffDays === 1) {
    return "Yesterday";
  }

  return `${diffDays} days ago`;
}

function getDaysBetween(
  from: Date,
  to: Date
) {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);

  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  return Math.floor(
    (end.getTime() -
      start.getTime()) /
      86400000
  );
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
        date.getDate() -
          (6 - index)
      );

      return {
        date,
        label: formatter.format(date),
      };
    }
  );
}

function isSameDay(
  first: Date,
  second: Date
) {
  return (
    toDateKey(first) ===
    toDateKey(second)
  );
}

function toDateKey(date: Date) {
  return date
    .toISOString()
    .slice(0, 10);
}

