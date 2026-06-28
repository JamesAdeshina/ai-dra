export type MovementSpeedSample = {
  value: number;
  timestampMs: number;
};

export type MovementSpeedMetrics = {
  totalDurationMs: number;
  activeMovementDurationMs: number;
  totalDistance: number;
  averageVelocity: number | null;
  peakVelocity: number | null;
  sampleCount: number;
};

type MovementSpeedTrackerOptions = {
  minimumMovementDelta?: number;
  maximumSampleGapMs?: number;
};

export class MovementSpeedTracker {
  private samples: MovementSpeedSample[] = [];
  private totalDistance = 0;
  private activeMovementDurationMs = 0;
  private peakVelocity = 0;

  private readonly minimumMovementDelta: number;
  private readonly maximumSampleGapMs: number;

  constructor(options: MovementSpeedTrackerOptions = {}) {
    this.minimumMovementDelta =
      options.minimumMovementDelta ?? 0.002;

    this.maximumSampleGapMs =
      options.maximumSampleGapMs ?? 500;
  }

  addSample(
    value: number,
    timestampMs: number = performance.now()
  ): void {
    if (!Number.isFinite(value) || !Number.isFinite(timestampMs)) {
      return;
    }

    const previousSample =
      this.samples[this.samples.length - 1];

    const currentSample: MovementSpeedSample = {
      value,
      timestampMs,
    };

    if (!previousSample) {
      this.samples.push(currentSample);
      return;
    }

    const durationMs =
      timestampMs - previousSample.timestampMs;

    if (
      durationMs <= 0 ||
      durationMs > this.maximumSampleGapMs
    ) {
      this.samples.push(currentSample);
      return;
    }

    const distance = Math.abs(
      value - previousSample.value
    );

    if (distance >= this.minimumMovementDelta) {
      const durationSeconds = durationMs / 1000;
      const velocity = distance / durationSeconds;

      this.totalDistance += distance;
      this.activeMovementDurationMs += durationMs;
      this.peakVelocity = Math.max(
        this.peakVelocity,
        velocity
      );
    }

    this.samples.push(currentSample);
  }

  getMetrics(): MovementSpeedMetrics {
    const firstSample = this.samples[0];
    const lastSample =
      this.samples[this.samples.length - 1];

    const totalDurationMs =
      firstSample && lastSample
        ? Math.max(
            0,
            lastSample.timestampMs -
              firstSample.timestampMs
          )
        : 0;

    const activeDurationSeconds =
      this.activeMovementDurationMs / 1000;

    const averageVelocity =
      activeDurationSeconds > 0
        ? this.totalDistance / activeDurationSeconds
        : null;

    return {
      totalDurationMs: Math.round(totalDurationMs),
      activeMovementDurationMs: Math.round(
        this.activeMovementDurationMs
      ),
      totalDistance: roundMetric(this.totalDistance),
      averageVelocity:
        averageVelocity === null
          ? null
          : roundMetric(averageVelocity),
      peakVelocity:
        this.peakVelocity > 0
          ? roundMetric(this.peakVelocity)
          : null,
      sampleCount: this.samples.length,
    };
  }

  reset(): void {
    this.samples = [];
    this.totalDistance = 0;
    this.activeMovementDurationMs = 0;
    this.peakVelocity = 0;
  }

  hasSamples(): boolean {
    return this.samples.length > 0;
  }
}

function roundMetric(value: number): number {
  return Number(value.toFixed(6));
}