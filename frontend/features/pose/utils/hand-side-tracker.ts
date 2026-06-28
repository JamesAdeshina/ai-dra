export type StableHandSide =
  | "LEFT"
  | "RIGHT"
  | "UNKNOWN";

type HandSideTrackerOptions = {
  minimumDetections?: number;
  dominanceRatio?: number;
};

export class HandSideTracker {
  private leftCount = 0;
  private rightCount = 0;
  private unknownCount = 0;

  private readonly minimumDetections: number;
  private readonly dominanceRatio: number;

  constructor(options: HandSideTrackerOptions = {}) {
    this.minimumDetections =
      options.minimumDetections ?? 3;

    this.dominanceRatio =
      options.dominanceRatio ?? 0.6;
  }

  addDetection(
    handedness:
      | "Left"
      | "Right"
      | string
      | null
      | undefined
  ): void {
    if (handedness === "Left") {
      this.leftCount += 1;
      return;
    }

    if (handedness === "Right") {
      this.rightCount += 1;
      return;
    }

    this.unknownCount += 1;
  }

  addDetections(
    handednessValues: Array<
      string | null | undefined
    >
  ): void {
    for (const handedness of handednessValues) {
      this.addDetection(handedness);
    }
  }

  getDominantSide(): StableHandSide {
    const knownDetections =
      this.leftCount + this.rightCount;

    if (
      knownDetections <
      this.minimumDetections
    ) {
      return "UNKNOWN";
    }

    const leftRatio =
      this.leftCount / knownDetections;

    const rightRatio =
      this.rightCount / knownDetections;

    if (
      leftRatio >= this.dominanceRatio &&
      this.leftCount > this.rightCount
    ) {
      return "LEFT";
    }

    if (
      rightRatio >= this.dominanceRatio &&
      this.rightCount > this.leftCount
    ) {
      return "RIGHT";
    }

    return "UNKNOWN";
  }

  getSummary() {
    const knownDetections =
      this.leftCount + this.rightCount;

    const totalDetections =
      knownDetections + this.unknownCount;

    return {
      dominantSide:
        this.getDominantSide(),

      leftDetections:
        this.leftCount,

      rightDetections:
        this.rightCount,

      unknownDetections:
        this.unknownCount,

      knownDetections,

      totalDetections,

      leftRatio:
        knownDetections > 0
          ? roundMetric(
              this.leftCount /
                knownDetections
            )
          : 0,

      rightRatio:
        knownDetections > 0
          ? roundMetric(
              this.rightCount /
                knownDetections
            )
          : 0,
    };
  }

  reset(): void {
    this.leftCount = 0;
    this.rightCount = 0;
    this.unknownCount = 0;
  }
}

function roundMetric(
  value: number
): number {
  return Number(value.toFixed(4));
}