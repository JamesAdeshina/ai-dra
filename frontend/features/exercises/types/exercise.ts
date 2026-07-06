export type ExerciseStep = {
  id: string;
  exerciseId: string;
  stepNumber: number;
  title: string | null;
  instruction: string;
  imageUrl: string | null;
  createdAt: string;
};

export type Exercise = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  benefits: string[];
  dailyActivities: string[];
  safetyInformation: string | null;
  trackerType: string;
  primaryMetric: string;
  defaultTargetReps: number;
  defaultStartThreshold: number | null;
  defaultCompleteThreshold: number | null;
  defaultReturnThreshold: number | null;
  defaultGripThreshold: number | null;
  defaultReleaseThreshold: number | null;
  defaultHoldDurationMs: number | null;
  thresholdsAreProvisional: boolean;
  thumbnailUrl: string | null;
  startImageUrl: string | null;
  activeImageUrl: string | null;
  demoVideoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  steps: ExerciseStep[];
  dailyActivityImages: string[];
};

export type ExerciseSummary = Pick<
  Exercise,
  | "id"
  | "slug"
  | "title"
  | "shortDescription"
  | "description"
  | "trackerType"
  | "primaryMetric"
  | "defaultTargetReps"
  | "thumbnailUrl"
>;