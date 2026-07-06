export type DashboardExercise = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  thumbnailUrl: string | null;
  defaultTargetReps: number;
  defaultHoldDurationMs: number | null;
};

export type DashboardSession = {
  id: string;
  exerciseId: string;
  exerciseSlug: string;
  exerciseTitle: string;
  status: string;
  completedReps: number;
  targetReps: number;
  durationSeconds: number;
  startedAt: string;
  completedAt: string | null;
  difficultyFlag: boolean;
  difficultyReason: string | null;
};

export type DashboardScore = {
  sessionId: string;
  exerciseId: string;
  movementScore: number | null;
  accuracyScore: number | null;
  createdAt: string;
};

export type SuggestedExercise = DashboardExercise & {
  reason:
    | "LOWEST_SCORE"
    | "LEAST_PRACTISED"
    | "NOT_PRACTISED_RECENTLY"
    | "DAILY_ROTATION";
  reasonLabel: string;
  averageMovementScore: number | null;
  sessionsCompleted: number;
};

export type DashboardNotification = {
  id: string;
  title: string;
  message: string;
  type: "SUPPORT" | "PROGRESS" | "REMINDER";
  href: string;
  createdAt: string;
};

export type DashboardData = {
  weeklyCompleted: number;
  weeklyTarget: number;
  currentStreak: number;
  suggestedExercise: SuggestedExercise | null;
  recentSession: DashboardSession | null;
  notifications: DashboardNotification[];
};
