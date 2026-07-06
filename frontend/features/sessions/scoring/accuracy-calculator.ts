import type {
  AccuracyScoreResult,
  AttemptScoringInput,
  MetricRange,
  ScoreComponent,
} from "./scoring-types";

export function calculateAccuracyScore(
  input: AttemptScoringInput
): AccuracyScoreResult {
  const {
    rule,
    metrics,
    completed,
    activeSide,
    prescribedSide,
  } = input;

  const targetScore =
    calculateTargetAchievement(input);

  const rangeScore =
    calculateRangeOfMotion(input);

  const sequenceScore =
    completed && metrics.sequenceCompleted
      ? 100
      : completed
        ? 80
        : 25;

  const returnScore =
    metrics.returnedToStart
      ? 100
      : completed
        ? 65
        : 20;

  const requiresHold =
    Boolean(rule.holdDurationMs) ||
    rule.primaryMetric === "pinch-zone";

  const holdScore = requiresHold
    ? clampScore(metrics.holdProgress * 100)
    : 100;

  const sideResult = calculateSideScore({
    activeSide,
    prescribedSide,
  });

  const trackingScore =
    calculateTrackingScore(
      metrics.trackedFrames,
      metrics.trackingFrames
    );

  const components: ScoreComponent[] = [
    {
      key: "targetAchievement",
      score: targetScore,
      weight: 30,
      available: true,
      reason:
        "How closely the required movement target was reached.",
    },
    {
      key: "rangeOfMotion",
      score: rangeScore,
      weight: 20,
      available: true,
      reason:
        "How much usable movement range was demonstrated.",
    },
    {
      key: "movementSequence",
      score: sequenceScore,
      weight: 15,
      available: true,
      reason:
        "Whether the expected movement sequence was completed.",
    },
    {
      key: "returnControl",
      score: returnScore,
      weight: 10,
      available: true,
      reason:
        "Whether the movement returned to the expected starting position.",
    },
    {
      key: "holdControl",
      score: holdScore,
      weight: requiresHold ? 10 : 0,
      available: requiresHold,
      reason:
        "How much of the required hold duration was maintained.",
    },
    {
      key: "sideMatch",
      score: sideResult.score,
      weight: sideResult.available ? 5 : 0,
      available: sideResult.available,
      reason: sideResult.reason,
    },
    {
      key: "trackingQuality",
      score: trackingScore,
      weight: 20,
      available: true,
      reason:
        "How consistently the movement was visible to the camera.",
    },
  ];

  const weightedScore =
    calculateWeightedAverage(components);

  return {
    score: applyTrackingConfidenceCap(
      weightedScore,
      trackingScore
    ),
    components,
    primaryMetric: rule.primaryMetric,
  };
}

function calculateTargetAchievement(
  input: AttemptScoringInput
): number {
  const { rule, metrics } = input;

  switch (rule.primaryMetric) {
    case "wrist-reach":
      return scoreHigherIsBetter(
        metrics.reachValue,
        rule.startThreshold,
        rule.completeThreshold
      );

    case "wrist-height":
      return scoreHigherIsBetter(
        metrics.wristHeight,
        0,
        0.2
      );

    case "shoulder-angle":
      return scoreHigherIsBetter(
        metrics.angle,
        rule.startThreshold,
        rule.completeThreshold
      );

    case "hand-closure":
      return scoreHigherIsBetter(
        clampMetricRange(
          metrics.closureRatio,
          0,
          1
        ),
        rule.releaseThreshold ?? 0.2,
        rule.gripThreshold ?? 0.6
      );

    case "hand-open-close": {
      const closureRange = clampMetricRange(
        metrics.closureRatio,
        0,
        1
      );

      const closeScore =
        scoreHigherIsBetter(
          closureRange,
          0.2,
          rule.gripThreshold ?? 0.6
        );

      const openScore =
        scoreLowerIsBetter(
          closureRange,
          rule.gripThreshold ?? 0.6,
          rule.releaseThreshold ?? 0.2
        );

      return Math.round(
        (closeScore + openScore) / 2
      );
    }

    case "pinch-zone":
      return scoreLowerIsBetter(
        clampMetricRange(
          metrics.pinchRatio,
          0,
          1
        ),
        0.45,
        0.25
      );

    default:
      return 0;
  }
}

function calculateRangeOfMotion(
  input: AttemptScoringInput
): number {
  const { rule, metrics } = input;

  switch (rule.primaryMetric) {
    case "wrist-reach":
      return scoreRangeTravel(
        metrics.reachValue,
        Math.abs(
          rule.completeThreshold -
            rule.startThreshold
        )
      );

    case "wrist-height":
      return scoreRangeTravel(
        metrics.wristHeight,
        0.2
      );

    case "shoulder-angle":
      return scoreRangeTravel(
        metrics.angle,
        Math.abs(
          rule.completeThreshold -
            rule.startThreshold
        )
      );

    case "hand-closure":
    case "hand-open-close":
      return scoreRangeTravel(
        clampMetricRange(
          metrics.closureRatio,
          0,
          1
        ),
        Math.abs(
          (rule.gripThreshold ?? 0.6) -
            (rule.releaseThreshold ?? 0.2)
        )
      );

    case "pinch-zone":
      return scoreRangeTravel(
        clampMetricRange(
          metrics.pinchRatio,
          0,
          1
        ),
        0.2
      );

    default:
      return 0;
  }
}

function scoreHigherIsBetter(
  range: MetricRange,
  baseline: number,
  target: number
): number {
  if (range.maximum === null) {
    return 0;
  }

  const denominator = target - baseline;

  if (denominator <= 0) {
    return range.maximum >= target
      ? 100
      : 0;
  }

  return clampScore(
    ((range.maximum - baseline) /
      denominator) *
      100
  );
}

function scoreLowerIsBetter(
  range: MetricRange,
  baseline: number,
  target: number
): number {
  if (range.minimum === null) {
    return 0;
  }

  const denominator = baseline - target;

  if (denominator <= 0) {
    return range.minimum <= target
      ? 100
      : 0;
  }

  return clampScore(
    ((baseline - range.minimum) /
      denominator) *
      100
  );
}

function scoreRangeTravel(
  range: MetricRange,
  expectedTravel: number
): number {
  if (
    range.minimum === null ||
    range.maximum === null ||
    expectedTravel <= 0
  ) {
    return 0;
  }

  const actualTravel = Math.abs(
    range.maximum - range.minimum
  );

  return clampScore(
    (actualTravel / expectedTravel) * 100
  );
}

function calculateTrackingScore(
  trackedFrames: number,
  trackingFrames: number
): number {
  if (trackingFrames <= 0) {
    return 0;
  }

  return clampScore(
    (trackedFrames / trackingFrames) * 100
  );
}

function applyTrackingConfidenceCap(
  score: number,
  trackingScore: number
): number {
  if (trackingScore < 50) {
    return Math.min(score, 50);
  }

  if (trackingScore < 70) {
    return Math.min(score, 65);
  }

  if (trackingScore < 85) {
    return Math.min(score, 85);
  }

  if (trackingScore < 95) {
    return Math.min(score, 95);
  }

  return score;
}

function clampMetricRange(
  range: MetricRange,
  minimum: number,
  maximum: number
): MetricRange {
  return {
    start:
      range.start === null
        ? null
        : clampValue(
            range.start,
            minimum,
            maximum
          ),
    end:
      range.end === null
        ? null
        : clampValue(
            range.end,
            minimum,
            maximum
          ),
    minimum:
      range.minimum === null
        ? null
        : clampValue(
            range.minimum,
            minimum,
            maximum
          ),
    maximum:
      range.maximum === null
        ? null
        : clampValue(
            range.maximum,
            minimum,
            maximum
          ),
    sampleCount: range.sampleCount,
  };
}

function calculateSideScore({
  activeSide,
  prescribedSide,
}: {
  activeSide:
    | "LEFT"
    | "RIGHT"
    | "UNKNOWN";
  prescribedSide:
    | "LEFT"
    | "RIGHT"
    | "BOTH"
    | null;
}): {
  score: number;
  available: boolean;
  reason: string;
} {
  if (
    !prescribedSide ||
    prescribedSide === "BOTH"
  ) {
    return {
      score: 100,
      available: false,
      reason:
        "No single prescribed side was provided.",
    };
  }

  if (activeSide === "UNKNOWN") {
    return {
      score: 0,
      available: false,
      reason:
        "The active side could not be identified reliably.",
    };
  }

  return {
    score:
      activeSide === prescribedSide
        ? 100
        : 0,
    available: true,
    reason:
      activeSide === prescribedSide
        ? "The detected active side matched the prescribed side."
        : "The detected active side did not match the prescribed side.",
  };
}

function calculateWeightedAverage(
  components: ScoreComponent[]
): number {
  const availableComponents =
    components.filter(
      (component) =>
        component.available &&
        component.weight > 0
    );

  const totalWeight =
    availableComponents.reduce(
      (total, component) =>
        total + component.weight,
      0
    );

  if (totalWeight === 0) {
    return 0;
  }

  const weightedTotal =
    availableComponents.reduce(
      (total, component) =>
        total +
        component.score *
          component.weight,
      0
    );

  return Math.round(
    weightedTotal / totalWeight
  );
}

function clampValue(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
}

function clampScore(
  value: number
): number {
  return Math.round(
    clampValue(value, 0, 100)
  );
}
