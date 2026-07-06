import type {
  AccuracyScoreResult,
  AttemptScoringInput,
  MovementScoreResult,
} from "./scoring-types";

export function calculateMovementScore({
  input,
  accuracy,
}: {
  input: AttemptScoringInput;
  accuracy: AccuracyScoreResult;
}): MovementScoreResult {
  const completionScore =
    input.completed ? 100 : 0;

  const rangeOfMotionScore =
    getComponentScore(
      accuracy,
      "rangeOfMotion"
    );

  const holdControlScore =
    getComponentScore(
      accuracy,
      "holdControl",
      100
    );

  const speedResult =
    calculateSpeedScore(input);

  const smoothnessScore =
    calculateSmoothnessScore(input);

  const compensationPenalty = 0;

  const rawScore =
    accuracy.score * 0.35 +
    completionScore * 0.15 +
    rangeOfMotionScore * 0.15 +
    speedResult.score * 0.15 +
    smoothnessScore * 0.1 +
    holdControlScore * 0.1 -
    compensationPenalty;

  const trackingScore =
    getComponentScore(
      accuracy,
      "trackingQuality"
    );

  return {
    score: applyConfidenceCaps(
      clampScore(rawScore),
      trackingScore,
      speedResult.score
    ),

    breakdown: {
      accuracy: accuracy.score,
      completion: completionScore,
      rangeOfMotion:
        rangeOfMotionScore,
      speed: speedResult.score,
      smoothness:
        smoothnessScore,
      holdControl:
        holdControlScore,
      compensationPenalty,
    },

    speedClassification:
      speedResult.classification,
  };
}

function calculateSpeedScore(
  input: AttemptScoringInput
): {
  score: number;
  classification:
    | "SLOW"
    | "CONTROLLED"
    | "FAST"
    | "NOT_ASSESSED";
} {
  const duration =
    input.speedMetrics.totalDurationMs;

  if (
    duration <= 0 ||
    input.speedMetrics.sampleCount < 3
  ) {
    return {
      score: 50,
      classification:
        "NOT_ASSESSED",
    };
  }

  const targetRange =
    getTargetDurationRange(
      input.exerciseSlug
    );

  if (duration < targetRange.minimum) {
    const ratio =
      duration / targetRange.minimum;

    if (ratio < 0.4) {
      return {
        score: 35,
        classification: "FAST",
      };
    }

    if (ratio < 0.6) {
      return {
        score: 50,
        classification: "FAST",
      };
    }

    if (ratio < 0.8) {
      return {
        score: 65,
        classification: "FAST",
      };
    }

    return {
      score: 75,
      classification: "FAST",
    };
  }

  if (duration > targetRange.maximum) {
    const ratio =
      targetRange.maximum / duration;

    if (ratio < 0.4) {
      return {
        score: 45,
        classification: "SLOW",
      };
    }

    if (ratio < 0.6) {
      return {
        score: 60,
        classification: "SLOW",
      };
    }

    if (ratio < 0.8) {
      return {
        score: 72,
        classification: "SLOW",
      };
    }

    return {
      score: 82,
      classification: "SLOW",
    };
  }

  const middle =
    (targetRange.minimum +
      targetRange.maximum) /
    2;

  const halfRange =
    (targetRange.maximum -
      targetRange.minimum) /
    2;

  const distanceFromMiddle =
    Math.abs(duration - middle);

  const normalisedDistance =
    halfRange > 0
      ? distanceFromMiddle /
        halfRange
      : 0;

  const controlledScore =
    100 -
    Math.min(10, normalisedDistance * 10);

  return {
    score: clampScore(
      controlledScore
    ),
    classification: "CONTROLLED",
  };
}

function calculateSmoothnessScore(
  input: AttemptScoringInput
): number {
  const {
    averageVelocity,
    peakVelocity,
    activeMovementDurationMs,
    totalDurationMs,
    sampleCount,
  } = input.speedMetrics;

  if (
    averageVelocity === null ||
    peakVelocity === null ||
    totalDurationMs <= 0 ||
    sampleCount < 3
  ) {
    return 50;
  }

  const activeRatio = clamp01(
    activeMovementDurationMs /
      totalDurationMs
  );

  const velocityRatio =
    peakVelocity > 0
      ? clamp01(
          averageVelocity /
            peakVelocity
        )
      : 0;

  const continuityScore =
    clampScore(activeRatio * 100);

  const velocityConsistencyScore =
    clampScore(
      velocityRatio * 100
    );

  return Math.round(
    continuityScore * 0.55 +
      velocityConsistencyScore *
        0.45
  );
}

function applyConfidenceCaps(
  score: number,
  trackingScore: number,
  speedScore: number
): number {
  let cappedScore = score;

  if (trackingScore < 50) {
    cappedScore = Math.min(
      cappedScore,
      50
    );
  } else if (trackingScore < 70) {
    cappedScore = Math.min(
      cappedScore,
      65
    );
  } else if (trackingScore < 85) {
    cappedScore = Math.min(
      cappedScore,
      85
    );
  } else if (trackingScore < 95) {
    cappedScore = Math.min(
      cappedScore,
      95
    );
  }

  if (speedScore <= 35) {
    cappedScore = Math.min(
      cappedScore,
      78
    );
  } else if (speedScore <= 50) {
    cappedScore = Math.min(
      cappedScore,
      84
    );
  } else if (speedScore <= 65) {
    cappedScore = Math.min(
      cappedScore,
      90
    );
  }

  return cappedScore;
}

function getTargetDurationRange(
  exerciseSlug: string
): {
  minimum: number;
  maximum: number;
} {
  switch (exerciseSlug) {
    case "reach-grasp":
      return {
        minimum: 3000,
        maximum: 9000,
      };

    case "button-fastening":
      return {
        minimum: 2500,
        maximum: 12000,
      };

    case "lift-place":
      return {
        minimum: 2500,
        maximum: 10000,
      };

    case "hand-function":
      return {
        minimum: 1500,
        maximum: 7000,
      };

    case "target-touch":
    default:
      return {
        minimum: 1500,
        maximum: 7000,
      };
  }
}

function getComponentScore(
  accuracy: AccuracyScoreResult,
  key:
    | "rangeOfMotion"
    | "holdControl"
    | "trackingQuality",
  fallback = 0
): number {
  return (
    accuracy.components.find(
      (component) =>
        component.key === key &&
        component.available
    )?.score ?? fallback
  );
}

function clamp01(
  value: number
): number {
  return Math.min(
    1,
    Math.max(0, value)
  );
}

function clampScore(
  value: number
): number {
  return Math.round(
    Math.min(
      100,
      Math.max(0, value)
    )
  );
}
