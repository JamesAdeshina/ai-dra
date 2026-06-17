export type LiftPlaceState =
  | "RESTING"
  | "GRASPED"
  | "LIFTED"
  | "MOVED"
  | "RELEASED";

export type LiftPlaceCounterResult = {
  state: LiftPlaceState;
  reps: number;
  feedback: string;
  repComplete: boolean;
  startX: number | null;
};

export function updateLiftPlaceCounter({
  wristHeight,
  wristX,
  gripValue,
  currentState,
  repCount,
  startX,
}: {
  wristHeight: number;
  wristX: number;
  gripValue: number;
  currentState: LiftPlaceState;
  repCount: number;
  startX: number | null;
}): LiftPlaceCounterResult {
  const gripThreshold = 0.4;
  const releaseThreshold = 0.25;
  const liftThreshold = 0.2;
  const moveThreshold = 0.25;

  let state = currentState;
  let reps = repCount;
  let feedback = "Hold the object, then lift and place it.";
  let repComplete = false;
  let nextStartX = startX;

  switch (currentState) {
    case "RESTING":
      if (gripValue >= gripThreshold) {
        state = "GRASPED";
        feedback = "Good grip. Now lift the object.";
        nextStartX = wristX;
      }
      break;

    case "GRASPED":
      if (gripValue < releaseThreshold) {
        state = "RESTING";
        feedback = "Grip the object before lifting.";
        nextStartX = null;
      } else if (wristHeight >= liftThreshold) {
        state = "LIFTED";
        feedback = "Good lift. Now move the object sideways.";
      } else {
        feedback = "Lift the object higher.";
      }
      break;

    case "LIFTED": {
      if (gripValue < releaseThreshold) {
        state = "RESTING";
        feedback = "Keep holding the object while moving it.";
        nextStartX = null;
        break;
      }

      const distanceMoved = Math.abs(wristX - (startX ?? wristX));

      if (distanceMoved >= moveThreshold) {
        state = "MOVED";
        feedback = "Good placement. Now release the object.";
      } else {
        feedback = "Move the object to the side.";
      }

      break;
    }

    case "MOVED":
      if (gripValue <= releaseThreshold) {
        state = "RELEASED";
        feedback = "Well done. Object placed.";
        reps += 1;
        repComplete = true;
        nextStartX = null;
      } else {
        feedback = "Open your hand to release the object.";
      }
      break;

    case "RELEASED":
      state = "RESTING";
      feedback = "Hold the next object to begin.";
      break;
  }

  return {
    state,
    reps,
    feedback,
    repComplete,
    startX: nextStartX,
  };
}