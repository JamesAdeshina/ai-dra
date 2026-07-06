import { createClient } from "@/lib/supabase/server";

import { suggestExercise } from "@/features/dashboard/utils/exercise-suggestion";

import type {
  DashboardData,
  DashboardExercise,
  DashboardNotification,
  DashboardScore,
  DashboardSession,
} from "@/features/dashboard/types/dashboard-types";

type ExerciseRow = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  thumbnail_url: string | null;
  default_target_reps: number;
  default_hold_duration_ms: number | null;
};

type SessionRow = {
  id: string;
  exercise_id: string;
  status: string;
  completed_reps: number;
  target_reps: number;
  duration_seconds: number;
  started_at: string;
  completed_at: string | null;
  difficulty_flag: boolean;
  difficulty_reason: string | null;
  exercises:
    | {
        slug: string;
        title: string;
      }
    | {
        slug: string;
        title: string;
      }[]
    | null;
};

type ScoreRow = {
  session_id: string;
  movement_score: number | null;
  accuracy_score: number | null;
  created_at: string;
};

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to view the dashboard."
    );
  }

  const [
    exercisesResult,
    sessionsResult,
  ] = await Promise.all([
    supabase
      .from("exercises")
      .select(
        `
          id,
          slug,
          title,
          short_description,
          thumbnail_url,
          default_target_reps,
          default_hold_duration_ms
        `
      )
      .eq("is_active", true)
      .order("title", {
        ascending: true,
      }),

    supabase
      .from("exercise_sessions")
      .select(
        `
          id,
          exercise_id,
          status,
          completed_reps,
          target_reps,
          duration_seconds,
          started_at,
          completed_at,
          difficulty_flag,
          difficulty_reason,
          exercises (
            slug,
            title
          )
        `
      )
      .eq("survivor_id", user.id)
      .order("started_at", {
        ascending: false,
      })
      .limit(100),
  ]);

  if (exercisesResult.error) {
    console.error(
      "Failed to load dashboard exercises:",
      exercisesResult.error
    );

    throw new Error(
      "Dashboard exercises could not be loaded."
    );
  }

  if (sessionsResult.error) {
    console.error(
      "Failed to load dashboard sessions:",
      sessionsResult.error
    );

    throw new Error(
      "Dashboard session data could not be loaded."
    );
  }

  const exercises = (
    (exercisesResult.data ?? []) as ExerciseRow[]
  ).map(mapExercise);

  const sessions = (
    (sessionsResult.data ?? []) as SessionRow[]
  ).map(mapSession);

  const sessionIds = sessions.map(
    (session) => session.id
  );

  let scores: DashboardScore[] = [];

  if (sessionIds.length > 0) {
    const scoreResult = await supabase
      .from("exercise_repetitions")
      .select(
        `
          session_id,
          movement_score,
          accuracy_score,
          created_at
        `
      )
      .in("session_id", sessionIds)
      .order("created_at", {
        ascending: false,
      });

    if (scoreResult.error) {
      console.error(
        "Failed to load dashboard scores:",
        scoreResult.error
      );
    } else {
      const exerciseIdBySession = new Map(
        sessions.map((session) => [
          session.id,
          session.exerciseId,
        ])
      );

      scores = (
        (scoreResult.data ?? []) as ScoreRow[]
      )
        .map((score) => {
          const exerciseId =
            exerciseIdBySession.get(
              score.session_id
            );

          if (!exerciseId) {
            return null;
          }

          return {
            sessionId: score.session_id,
            exerciseId,
            movementScore:
              score.movement_score,
            accuracyScore:
              score.accuracy_score,
            createdAt: score.created_at,
          };
        })
        .filter(
          (
            score
          ): score is DashboardScore =>
            score !== null
        );
    }
  }

  const now = new Date();

  const weeklyCompleted =
    calculateWeeklyCompleted(
      sessions,
      now
    );

  const currentStreak =
    calculateCurrentStreak(
      sessions,
      now
    );

  const suggestedExercise =
    suggestExercise({
      exercises,
      sessions,
      scores,
      userId: user.id,
      now,
    });

  const recentSession =
    sessions.find(
      (session) =>
        session.status === "COMPLETED"
    ) ?? sessions[0] ?? null;

  const notifications =
    buildNotifications({
      sessions,
      scores,
      weeklyCompleted,
      weeklyTarget: 5,
      now,
    });

  return {
    weeklyCompleted,
    weeklyTarget: 5,
    currentStreak,
    suggestedExercise,
    recentSession,
    notifications,
  };
}

function mapExercise(
  row: ExerciseRow
): DashboardExercise {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription:
      row.short_description,
    thumbnailUrl: row.thumbnail_url,
    defaultTargetReps:
      row.default_target_reps,
    defaultHoldDurationMs:
      row.default_hold_duration_ms,
  };
}

function mapSession(
  row: SessionRow
): DashboardSession {
  const joinedExercise =
    Array.isArray(row.exercises)
      ? row.exercises[0] ?? null
      : row.exercises;

  return {
    id: row.id,
    exerciseId: row.exercise_id,
    exerciseSlug:
      joinedExercise?.slug ??
      row.exercise_id,
    exerciseTitle:
      joinedExercise?.title ??
      "Unknown Exercise",
    status: row.status,
    completedReps:
      row.completed_reps,
    targetReps: row.target_reps,
    durationSeconds:
      row.duration_seconds,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    difficultyFlag:
      row.difficulty_flag,
    difficultyReason:
      row.difficulty_reason,
  };
}

function calculateWeeklyCompleted(
  sessions: DashboardSession[],
  now: Date
): number {
  const startOfWeek = new Date(now);

  const day = startOfWeek.getDay();
  const distanceFromMonday =
    day === 0 ? 6 : day - 1;

  startOfWeek.setDate(
    startOfWeek.getDate() -
      distanceFromMonday
  );

  startOfWeek.setHours(0, 0, 0, 0);

  return sessions.filter(
    (session) =>
      session.status === "COMPLETED" &&
      new Date(
        session.completedAt ??
          session.startedAt
      ) >= startOfWeek
  ).length;
}

function calculateCurrentStreak(
  sessions: DashboardSession[],
  now: Date
): number {
  const completedDateKeys = new Set(
    sessions
      .filter(
        (session) =>
          session.status === "COMPLETED"
      )
      .map((session) =>
        toLocalDateKey(
          new Date(
            session.completedAt ??
              session.startedAt
          )
        )
      )
  );

  if (completedDateKeys.size === 0) {
    return 0;
  }

  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);

  const todayKey =
    toLocalDateKey(cursor);

  if (!completedDateKeys.has(todayKey)) {
    cursor.setDate(
      cursor.getDate() - 1
    );
  }

  let streak = 0;

  while (
    completedDateKeys.has(
      toLocalDateKey(cursor)
    )
  ) {
    streak += 1;
    cursor.setDate(
      cursor.getDate() - 1
    );
  }

  return streak;
}

function buildNotifications({
  sessions,
  scores,
  weeklyCompleted,
  weeklyTarget,
  now,
}: {
  sessions: DashboardSession[];
  scores: DashboardScore[];
  weeklyCompleted: number;
  weeklyTarget: number;
  now: Date;
}): DashboardNotification[] {
  const notifications: DashboardNotification[] = [];

  const recentDifficulty =
    sessions.find(
      (session) =>
        session.difficultyFlag
    );

  if (recentDifficulty) {
    notifications.push({
      id: `difficulty-${recentDifficulty.id}`,
      title: "Extra support may help",
      message: `${recentDifficulty.exerciseTitle} was marked as difficult. Review the exercise guidance before your next attempt.`,
      type: "SUPPORT",
      href: `/exercises/${recentDifficulty.exerciseSlug}`,
      createdAt:
        recentDifficulty.completedAt ??
        recentDifficulty.startedAt,
    });
  }

  const recentMovementScores = scores
    .filter(
      (score) =>
        score.movementScore !== null
    )
    .slice(0, 5)
    .map(
      (score) =>
        score.movementScore as number
    );

  if (recentMovementScores.length > 0) {
    const averageScore = Math.round(
      recentMovementScores.reduce(
        (total, score) => total + score,
        0
      ) / recentMovementScores.length
    );

    notifications.push({
      id: "recent-score-summary",
      title: "Recent Movement Score",
      message: `Your recent average Movement Score is ${averageScore}%.`,
      type: "PROGRESS",
      href: "/progress",
      createdAt:
        scores[0]?.createdAt ??
        now.toISOString(),
    });
  }

  if (weeklyCompleted < weeklyTarget) {
    const remaining =
      weeklyTarget - weeklyCompleted;

    notifications.push({
      id: "weekly-target",
      title: "Weekly activity",
      message: `${remaining} more ${
        remaining === 1
          ? "session"
          : "sessions"
      } to reach the current weekly target.`,
      type: "REMINDER",
      href: "/exercises",
      createdAt: now.toISOString(),
    });
  } else {
    notifications.push({
      id: "weekly-target-complete",
      title: "Weekly target reached",
      message:
        "You have reached the current weekly session target.",
      type: "PROGRESS",
      href: "/progress",
      createdAt: now.toISOString(),
    });
  }

  return notifications.slice(0, 5);
}

function toLocalDateKey(
  value: Date
): string {
  const year = value.getFullYear();
  const month = String(
    value.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    value.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
