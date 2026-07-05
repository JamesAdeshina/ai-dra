export type AdminSessionStatus =
  | "Completed"
  | "Active"
  | "Paused"
  | "Ended Early";

export type AdminAttemptResult =
  | "Successful"
  | "Failed"
  | "Incomplete";

export type AdminSessionDifficulty =
  | "None Reported"
  | "Difficulty Reported"
  | "Not Assessed";

export type AdminSessionDateRange =
  | "All"
  | "Last 7 Days"
  | "Last 30 Days"
  | "Last 90 Days";

export type AdminSessionSummary = {
  id: string;
  participantId: string;
  exerciseId: string;
  exerciseName: string;

  date: string;
  time: string;
  dateIso: string;

  status: AdminSessionStatus;

  durationLabel: string;
  durationSeconds: number | null;

  targetRepetitions: number | null;
  completedRepetitions: number;

  difficulty: AdminSessionDifficulty;
};

export type AdminSessionAttempt = {
  id: string;
  attemptNumber: number;
  time: string;
  result: AdminAttemptResult;
  holdTime: string | null;
  notes: string;
};

export type AdminSessionDetail = AdminSessionSummary & {
  startTime: string;
  endTime: string | null;

  totalAttempts: number | null;
  successfulRepetitions: number | null;
  failedAttempts: number | null;
  incompleteAttempts: number | null;

  holdRequirement: string | null;
  armMode: string | null;
  performedSide: string | null;

  accuracy: string | null;
  movementScore: string | null;
  speedSummary: string | null;

  recentAttempts: AdminSessionAttempt[];
};