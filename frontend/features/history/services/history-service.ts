import { createClient } from "@/lib/supabase/server";

import type {
  HistorySession,
  HistorySessionStatus,
} from "@/features/history/types";

type SessionRow = {
  id: string;
  exercise_id: string;
  status: HistorySessionStatus;
  target_reps: number;
  completed_reps: number;
  failed_reps: number;
  incomplete_attempts: number;
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

type RepetitionRow = {
  session_id: string;
  movement_score: number | null;
};

function getJoinedExercise(
  value: SessionRow["exercises"]
): {
  slug: string;
  title: string;
} | null {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

export async function getHistorySessions(): Promise<
  HistorySession[]
> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to view session history."
    );
  }

  const {
    data: sessionData,
    error: sessionError,
  } = await supabase
    .from("exercise_sessions")
    .select(
      `
        id,
        exercise_id,
        status,
        target_reps,
        completed_reps,
        failed_reps,
        incomplete_attempts,
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
    });

  if (sessionError) {
    console.error(
      "Failed to load session history:",
      sessionError
    );

    throw new Error(
      "Your session history could not be loaded."
    );
  }

  const sessions =
    (sessionData ?? []) as SessionRow[];

  if (sessions.length === 0) {
    return [];
  }

  const sessionIds = sessions.map(
    (session) => session.id
  );

  const {
    data: repetitionData,
    error: repetitionError,
  } = await supabase
    .from("exercise_repetitions")
    .select(
      `
        session_id,
        movement_score
      `
    )
    .in("session_id", sessionIds);

  if (repetitionError) {
    console.error(
      "Failed to load session scores:",
      repetitionError
    );

    throw new Error(
      "Session performance data could not be loaded."
    );
  }

  const scoresBySession = new Map<
    string,
    number[]
  >();

  (
    (repetitionData ?? []) as RepetitionRow[]
  ).forEach((repetition) => {
    if (
      repetition.movement_score === null ||
      !Number.isFinite(
        repetition.movement_score
      )
    ) {
      return;
    }

    const existing =
      scoresBySession.get(
        repetition.session_id
      ) ?? [];

    existing.push(
      repetition.movement_score
    );

    scoresBySession.set(
      repetition.session_id,
      existing
    );
  });

  return sessions.map((session) => {
    const exercise =
      getJoinedExercise(session.exercises);

    const scores =
      scoresBySession.get(session.id) ?? [];

    const averageMovementScore =
      scores.length > 0
        ? Math.round(
            scores.reduce(
              (total, score) =>
                total + score,
              0
            ) / scores.length
          )
        : null;

    return {
      id: session.id,
      exerciseId: session.exercise_id,
      exerciseSlug:
        exercise?.slug ??
        session.exercise_id,
      exerciseTitle:
        exercise?.title ??
        "Unknown Exercise",
      status: session.status,
      targetReps: session.target_reps,
      completedReps:
        session.completed_reps,
      failedReps: session.failed_reps,
      incompleteAttempts:
        session.incomplete_attempts ?? 0,
      durationSeconds:
        session.duration_seconds ?? 0,
      startedAt: session.started_at,
      completedAt: session.completed_at,
      averageMovementScore,
      difficultyFlag:
        session.difficulty_flag,
      difficultyReason:
        session.difficulty_reason,
    };
  });
}