import type {
  AttemptMetricSummary,
  MetricRange,
} from "./scoring-types";

type AttemptMetricSample = {
  angle: number;
  reachValue: number;
  wristHeight: number;
  wristX: number;
  closureRatio: number;
  pinchRatio: number;
  holdProgress: number;
  isTracking: boolean;
};

function createMetricRange(): MetricRange {
  return {
    start: null,
    end: null,
    minimum: null,
    maximum: null,
    sampleCount: 0,
  };
}

function updateMetricRange(
  range: MetricRange,
  value: number
): MetricRange {
  if (!Number.isFinite(value)) {
    return range;
  }

  return {
    start:
      range.start === null
        ? value
        : range.start,
    end: value,
    minimum:
      range.minimum === null
        ? value
        : Math.min(
            range.minimum,
            value
          ),
    maximum:
      range.maximum === null
        ? value
        : Math.max(
            range.maximum,
            value
          ),
    sampleCount:
      range.sampleCount + 1,
  };
}

export class AttemptMetricTracker {
  private angle = createMetricRange();
  private reachValue = createMetricRange();
  private wristHeight = createMetricRange();
  private wristX = createMetricRange();
  private closureRatio =
    createMetricRange();
  private pinchRatio =
    createMetricRange();

  private maximumHoldProgress = 0;
  private sequenceCompleted = false;
  private returnedToStart = false;

  private trackingFrames = 0;
  private trackedFrames = 0;

  addSample(
    sample: AttemptMetricSample
  ): void {
    this.trackingFrames += 1;

    if (!sample.isTracking) {
      return;
    }

    this.trackedFrames += 1;

    this.angle = updateMetricRange(
      this.angle,
      sample.angle
    );

    this.reachValue = updateMetricRange(
      this.reachValue,
      sample.reachValue
    );

    this.wristHeight = updateMetricRange(
      this.wristHeight,
      sample.wristHeight
    );

    this.wristX = updateMetricRange(
      this.wristX,
      sample.wristX
    );

    this.closureRatio =
      updateMetricRange(
        this.closureRatio,
        sample.closureRatio
      );

    this.pinchRatio =
      updateMetricRange(
        this.pinchRatio,
        sample.pinchRatio
      );

    this.maximumHoldProgress = Math.max(
      this.maximumHoldProgress,
      clamp(sample.holdProgress, 0, 1)
    );
  }

  markSequenceCompleted(): void {
    this.sequenceCompleted = true;
  }

  markReturnedToStart(): void {
    this.returnedToStart = true;
  }

  getSummary(): AttemptMetricSummary {
    return {
      angle: this.angle,
      reachValue: this.reachValue,
      wristHeight: this.wristHeight,
      wristX: this.wristX,
      closureRatio: this.closureRatio,
      pinchRatio: this.pinchRatio,

      holdProgress:
        this.maximumHoldProgress,

      sequenceCompleted:
        this.sequenceCompleted,

      returnedToStart:
        this.returnedToStart,

      trackingFrames:
        this.trackingFrames,

      trackedFrames:
        this.trackedFrames,
    };
  }

  reset(): void {
    this.angle = createMetricRange();
    this.reachValue =
      createMetricRange();
    this.wristHeight =
      createMetricRange();
    this.wristX =
      createMetricRange();
    this.closureRatio =
      createMetricRange();
    this.pinchRatio =
      createMetricRange();

    this.maximumHoldProgress = 0;
    this.sequenceCompleted = false;
    this.returnedToStart = false;

    this.trackingFrames = 0;
    this.trackedFrames = 0;
  }
}

function clamp(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
}