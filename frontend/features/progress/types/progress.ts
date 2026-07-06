export type ProgressRange =
  | "7_DAYS"
  | "30_DAYS"
  | "3_MONTHS"
  | "ALL_TIME";

export type ProgressSessionRecord = {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  exerciseSlug: string;
  status:
    | "ACTIVE"
    | "PAUSED"
    | "COMPLETED"
    | "ENDED_EARLY"
    | "ABANDONED";
  completedReps: number;
  failedReps: number;
  incompleteAttempts: number;
  durationSeconds: number;
  startedAt: string;
  completedAt: string | null;
};

export type ProgressAttemptRecord = {
  id: string;
  sessionId: string;
  movementScore: number | null;
  accuracyScore: number | null;
  qualityScore: number | null;
  createdAt: string;
};

export type ProgressData = {
  sessions: ProgressSessionRecord[];
  attempts: ProgressAttemptRecord[];
};

export type ProgressSummary = {
  averageScore: number | null;
  totalSessions: number;
  totalDurationSeconds: number;
  uniqueExercises: number;
};

export type ProgressTrendPoint = {
  label: string;
  score: number | null;
  sessions: number;
};

export type TopExerciseItem = {
  exerciseId: string;
  exerciseTitle: string;
  exerciseSlug: string;
  sessions: number;
  completedSessions: number;
  averageScore: number | null;
};