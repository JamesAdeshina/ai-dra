export type Point = {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
};

export type PoseLandmarks = {
  leftShoulder?: Point;
  rightShoulder?: Point;
  leftElbow?: Point;
  rightElbow?: Point;
  leftWrist?: Point;
  rightWrist?: Point;
  leftHip?: Point;
  rightHip?: Point;
};

export type PoseStats = {
  angle: number;
  reps: number;
  isTracking: boolean;
};