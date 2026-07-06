import type {
  MovementSpeedMetrics,
} from "@/features/pose/utils/movement-speed-tracker";

import type {
  ExerciseRule,
  PrimaryMetric,
} from "@/features/pose/utils/exercise-rules";

export type MetricRange = {
  start: number | null;
  end: number | null;
  minimum: number | null;
  maximum: number | null;
  sampleCount: number;
};

export type AttemptMetricSummary = {
  angle: MetricRange;
  reachValue: MetricRange;
  wristHeight: MetricRange;
  wristX: MetricRange;
  closureRatio: MetricRange;
  pinchRatio: MetricRange;

  holdProgress: number;
  sequenceCompleted: boolean;
  returnedToStart: boolean;

  trackingFrames: number;
  trackedFrames: number;
};

export type AccuracyComponentKey =
  | "targetAchievement"
  | "rangeOfMotion"
  | "movementSequence"
  | "returnControl"
  | "holdControl"
  | "sideMatch"
  | "trackingQuality";

export type ScoreComponent = {
  key: AccuracyComponentKey;
  score: number;
  weight: number;
  available: boolean;
  reason: string;
};

export type AccuracyScoreResult = {
  score: number;
  components: ScoreComponent[];
  primaryMetric: PrimaryMetric;
};

export type MovementScoreBreakdown = {
  accuracy: number;
  completion: number;
  rangeOfMotion: number;
  speed: number;
  smoothness: number;
  holdControl: number;
  compensationPenalty: number;
};

export type MovementScoreResult = {
  score: number;
  breakdown: MovementScoreBreakdown;
  speedClassification:
    | "SLOW"
    | "CONTROLLED"
    | "FAST"
    | "NOT_ASSESSED";
};

export type AttemptScoringInput = {
  exerciseSlug: string;
  rule: ExerciseRule;
  metrics: AttemptMetricSummary;
  speedMetrics: MovementSpeedMetrics;
  completed: boolean;
  activeSide: "LEFT" | "RIGHT" | "UNKNOWN";
  prescribedSide:
    | "LEFT"
    | "RIGHT"
    | "BOTH"
    | null;
};