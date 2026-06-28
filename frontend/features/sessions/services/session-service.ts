export type SessionStatus =
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "ENDED_EARLY"
  | "ABANDONED";

export type ExerciseSession = {
  id: string;
  survivor_id: string;
  exercise_id: string;
  status: SessionStatus;
  target_reps: number;
  completed_reps: number;
  failed_reps: number;
  incomplete_attempts?: number;
  attempt_count?: number;
  duration_seconds: number;
  started_at: string;
  completed_at?: string | null;
  pause_count?: number;
  paused_at?: string | null;
  resume_allowed?: boolean;
  ended_reason?: string | null;
  performed_side?: ExerciseSide | null;
  difficulty_flag?: boolean;
  difficulty_reason?: string | null;
  session_summary?: AnalyticsValues;
  last_activity_at?: string;
};

type CreateExerciseSessionInput = {
  exerciseSlug: string;
  targetReps: number;
};

type CreateExerciseSessionResponse = {
  session: ExerciseSession;
};

export async function createExerciseSession(
  input: CreateExerciseSessionInput
): Promise<ExerciseSession> {
  const response = await fetch("/api/exercise-sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as
    | CreateExerciseSessionResponse
    | { error?: string };

  if (!response.ok || !("session" in data)) {
    throw new Error(
      "error" in data && data.error
        ? data.error
        : "Failed to create exercise session."
    );
  }

  return data.session;
}

export type AttemptResult =
  | "COMPLETED"
  | "INCOMPLETE"
  | "FAILED";

export type HandSide =
  | "LEFT"
  | "RIGHT"
  | "UNKNOWN";

export type ExerciseSide =
  | "LEFT"
  | "RIGHT"
  | "BILATERAL"
  | "UNKNOWN";

export type AnalyticsValues = Record<
  string,
  number | string | boolean | null
>;

export type SaveExerciseAttemptInput = {
  sessionId: string;
  attemptNumber: number;
  completedRepNumber?: number | null;

  result: AttemptResult;
  durationMs: number;
  startedAt?: string | null;
  completedAt?: string | null;

  stateReached?: string | null;
  failureReason?: string | null;

  activeHand?: HandSide | null;
  supportHand?: HandSide | null;
  isBilateral?: boolean;

  movementMetrics?: AnalyticsValues;
  speedMetrics?: AnalyticsValues;
  trackingContext?: AnalyticsValues;

  accuracyScore?: number | null;
  movementScore?: number | null;
};

export type SavedExerciseAttempt = {
  id: string;
  session_id: string;
  attempt_number: number;
  completed_rep_number: number | null;
  result: AttemptResult;
  duration_ms: number | null;
  state_reached: string | null;
  failure_reason: string | null;
  active_hand: HandSide | null;
  support_hand: HandSide | null;
  is_bilateral: boolean;
  movement_metrics: AnalyticsValues;
  speed_metrics: AnalyticsValues;
  tracking_context: AnalyticsValues;
  accuracy_score: number | null;
  movement_score: number | null;
  started_at: string | null;
  completed_at: string | null;
};

type SaveExerciseAttemptResponse = {
  attempt: SavedExerciseAttempt;
  sessionTotals: {
    attemptCount: number;
    completedReps: number;
    failedReps: number;
    incompleteAttempts: number;
    difficultyFlag: boolean;
  };
};

export async function saveExerciseAttempt(
  input: SaveExerciseAttemptInput
): Promise<SaveExerciseAttemptResponse> {
  const response = await fetch("/api/exercise-repetitions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as
    | SaveExerciseAttemptResponse
    | { error?: string };

  if (
    !response.ok ||
    !("attempt" in data) ||
    !("sessionTotals" in data)
  ) {
    throw new Error(
      "error" in data && data.error
        ? data.error
        : "Failed to save exercise attempt."
    );
  }

  return data;
}

export type SessionAction =
  | "PAUSE"
  | "RESUME"
  | "CHECKPOINT"
  | "COMPLETE"
  | "END_EARLY"
  | "ABANDON";

export type UpdateExerciseSessionInput = {
  sessionId: string;
  action: SessionAction;
  completedReps?: number;
  durationSeconds?: number;
  performedSide?: ExerciseSide | null;
  endedReason?: string | null;
  sessionSummary?: AnalyticsValues;
};

type UpdateExerciseSessionResponse = {
  session: ExerciseSession;
};

export async function updateExerciseSession(
  input: UpdateExerciseSessionInput
): Promise<ExerciseSession> {
  const { sessionId, ...body } = input;

  const response = await fetch(
    `/api/exercise-sessions/${sessionId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = (await response.json()) as
    | UpdateExerciseSessionResponse
    | { error?: string };

  if (!response.ok || !("session" in data)) {
    throw new Error(
      "error" in data && data.error
        ? data.error
        : "Failed to update exercise session."
    );
  }

  return data.session;
}