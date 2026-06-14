import { NormalizedLandmark } from "@mediapipe/tasks-vision";

type LandmarkHistory = {
  x: number[];
  y: number[];
  z: number[];
};

export class LandmarkSmoother {
  private history = new Map<number, LandmarkHistory>();

  constructor(private windowSize = 5) {}

  smoothLandmark(
    landmarkId: number,
    landmark: NormalizedLandmark
  ): NormalizedLandmark {
    if (!this.history.has(landmarkId)) {
      this.history.set(landmarkId, { x: [], y: [], z: [] });
    }

    const history = this.history.get(landmarkId)!;

    history.x.push(landmark.x);
    history.y.push(landmark.y);
    history.z.push(landmark.z ?? 0);

    if (history.x.length > this.windowSize) history.x.shift();
    if (history.y.length > this.windowSize) history.y.shift();
    if (history.z.length > this.windowSize) history.z.shift();

    return {
      ...landmark,
      x: average(history.x),
      y: average(history.y),
      z: average(history.z),
    };
  }

  smoothLandmarks(landmarks: NormalizedLandmark[]) {
    return landmarks.map((landmark, index) =>
      this.smoothLandmark(index, landmark)
    );
  }

  reset() {
    this.history.clear();
  }
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}