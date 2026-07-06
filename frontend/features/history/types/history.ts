export type HistoryRange =
  | "7_DAYS"
  | "30_DAYS"
  | "3_MONTHS"
  | "ALL_TIME";

export type HistorySessionStatus =
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "ENDED_EARLY"
  | "ABANDONED";

export type HistorySession = {
  id: string;
  exerciseId: string;
  exerciseSlug: string;
  exerciseTitle: string;
  status: HistorySessionStatus;
  targetReps: number;
  completedReps: number;
  failedReps: number;
  incompleteAttempts: number;
  durationSeconds: number;
  startedAt: string;
  completedAt: string | null;
  averageMovementScore: number | null;
  difficultyFlag: boolean;
  difficultyReason: string | null;
};