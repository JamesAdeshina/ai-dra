import { createClient } from "@/lib/supabase/server";

import type {
  ProgressAttemptRecord,
  ProgressData,
  ProgressSessionRecord,
} from "@/features/progress/types";

type ExerciseSessionRow = {
  id: string;
  exercise_id: string;
  status:
    | "ACTIVE"
    | "PAUSED"
    | "COMPLETED"
    | "ENDED_EARLY"
    | "ABANDONED";
  completed_reps: number;
  failed_reps: number;
  incomplete_attempts: number;
  duration_seconds: number;
  started_at: string;
  completed_at: string | null;
  exercises:
    | {
        title: string;
        slug: string;
      }
    | {
        title: string;
        slug: string;
      }[]
    | null;
};

type ExerciseRepetitionRow = {
  id: string;
  session_id: string;
  movement_score: number | null;
  accuracy_score: number | null;
  quality_score: number | null;
  created_at: string;
};

function getJoinedExercise(
  value: ExerciseSessionRow["exercises"]
): {
  title: string;
  slug: string;
} | null {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

function mapSession(
  row: ExerciseSessionRow
): ProgressSessionRecord {
  const exercise =
    getJoinedExercise(row.exercises);

  return {
    id: row.id,
    exerciseId: row.exercise_id,
    exerciseTitle:
      exercise?.title ?? "Unknown Exercise",
    exerciseSlug:
      exercise?.slug ?? row.exercise_id,
    status: row.status,
    completedReps: row.completed_reps,
    failedReps: row.failed_reps,
    incompleteAttempts:
      row.incomplete_attempts ?? 0,
    durationSeconds:
      row.duration_seconds ?? 0,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  };
}

function mapAttempt(
  row: ExerciseRepetitionRow
): ProgressAttemptRecord {
  return {
    id: row.id,
    sessionId: row.session_id,
    movementScore: row.movement_score,
    accuracyScore: row.accuracy_score,
    qualityScore: row.quality_score,
    createdAt: row.created_at,
  };
}

export async function getProgressData(): Promise<ProgressData> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to view progress."
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
        completed_reps,
        failed_reps,
        incomplete_attempts,
        duration_seconds,
        started_at,
        completed_at,
        exercises (
          title,
          slug
        )
      `
    )
    .eq("survivor_id", user.id)
    .order("started_at", {
      ascending: true,
    });

  if (sessionError) {
    console.error(
      "Failed to load progress sessions:",
      sessionError
    );

    throw new Error(
      "Your progress data could not be loaded."
    );
  }

  const sessions = (
    (sessionData ?? []) as ExerciseSessionRow[]
  ).map(mapSession);

  if (sessions.length === 0) {
    return {
      sessions: [],
      attempts: [],
    };
  }

  const sessionIds = sessions.map(
    (session) => session.id
  );

  const {
    data: attemptData,
    error: attemptError,
  } = await supabase
    .from("exercise_repetitions")
    .select(
      `
        id,
        session_id,
        movement_score,
        accuracy_score,
        quality_score,
        created_at
      `
    )
    .in("session_id", sessionIds)
    .order("created_at", {
      ascending: true,
    });

  if (attemptError) {
    console.error(
      "Failed to load progress attempts:",
      attemptError
    );

    throw new Error(
      "Your exercise scores could not be loaded."
    );
  }

  return {
    sessions,
    attempts: (
      (attemptData ??
        []) as ExerciseRepetitionRow[]
    ).map(mapAttempt),
  };
}