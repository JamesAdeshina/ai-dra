import { Point } from "./pose-types";

export function calculateAngle(
  pointA: Point,
  pointB: Point,
  pointC: Point
): number {
  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);

  let angle = Math.abs((radians * 180) / Math.PI);

  if (angle > 180) {
    angle = 360 - angle;
  }

  return Math.round(angle);
}