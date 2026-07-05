export type AdminExerciseStatus =
  | "Active"
  | "Inactive"
  | "Draft"
  | "Archived";

export type AdminExerciseDifficulty =
  | "Easy"
  | "Medium"
  | "Hard";

export type AdminExerciseSessionStatus =
  | "Completed"
  | "Ended Early"
  | "Paused";

export type AdminExerciseRecentSession = {
  id: string;
  participantId: string;
  date: string;
  status: AdminExerciseSessionStatus;
  repetitions: number;
  duration: string;
};

export type AdminExerciseSummary = {
  id: string;
  title: string;
  description: string;
  category: string;
  catalogueCategory: string;
  level: string;
  repetitionsLabel: string;
  difficulty: AdminExerciseDifficulty;

  thumbnail: string;
  startImage: string;
  activeImage: string;

  status: AdminExerciseStatus;
  totalSessions: number;
  survivorsAttempted: number;
  completedSessions: number;
  endedEarlySessions: number;
  pausedSessions: number;
  completionRate: number;
  averageCompletedRepetitions: number | null;
  averageSessionDuration: string | null;
  lastUpdated: string;
};

export type AdminExerciseDetail = AdminExerciseSummary & {
  slug: string;
  duration: string;
  exerciseType: string;
  aratDomain: string;
  trackingType: string;
  requiresObject: boolean;

  instruction: string;
  instructions: string[];
  benefits: string[];
  activities: string[];

  demoVideo: string;
  demoFallbackIcon: string;
  demoText: string;

  targetRepetitions: number | null;
  holdDuration: string | null;
  recommendedSets: string | null;
  equipment: string;

  recentSessions: AdminExerciseRecentSession[];
};

export type AdminExerciseDraft = {
  title: string;
  slug: string;
  description: string;
  category: string;
  exerciseType: string;
  aratDomain: string;
  trackingType: string;
  requiresObject: "yes" | "no" | "";

  level: string;
  difficulty: AdminExerciseDifficulty | "";
  progressionOrder: string;
  targetRepetitions: string;
  estimatedDuration: string;
  holdDuration: string;
  primaryMovementFocus: string;
  secondaryMovementFocus: string;

  shortInstruction: string;
  detailedInstructions: string;
  exerciseSteps: string;
  safetyNotes: string;
  coachingCues: string;

  benefits: string;
  activities: string;

  thumbnailName: string;
  startImageName: string;
  activeImageName: string;
  demonstrationVideoName: string;
  demoFallbackIcon: string;
  demoHelperText: string;
  demoCaption: string;

  publicationStatus: "Draft" | "Published";
  visibilityScope: string;
  availableFrom: string;
  availableUntil: string;

  confidenceThreshold: string;
  minimumRangeOfMotion: string;
  minimumHoldTime: string;
  maximumMovementSpeed: string;
  compensationSensitivity: string;
};