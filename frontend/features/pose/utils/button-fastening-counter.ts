export type ButtonFasteningState =
  | "RESTING"
  | "POSITIONED"
  | "PINCHED"
  | "HOLDING"
  | "RELEASING";

export type ButtonFasteningCounterResult = {
  state: ButtonFasteningState;
  reps: number;
  feedback: string;
  repComplete: boolean;
  holdStartTime: number | null;
  holdProgress: number;
};

export function updateButtonFasteningCounter({
  pinchRatio,
  currentState,
  repCount,
  holdStartTime,
}: {
  pinchRatio: number;
  currentState: ButtonFasteningState;
  repCount: number;
  holdStartTime: number | null;
}): ButtonFasteningCounterResult {
  const pinchThreshold = 0.25;
  const releaseThreshold = 0.45;
  const holdDurationMs = 2000;

  let state = currentState;
  let reps = repCount;
  let feedback = "Place your hand near the button area.";
  let repComplete = false;
  let nextHoldStartTime = holdStartTime;
  let holdProgress = 0;

  switch (currentState) {
    case "RESTING":
      state = "POSITIONED";
      feedback = "Bring your thumb and index finger together.";
      break;

    case "POSITIONED":
      if (pinchRatio <= pinchThreshold) {
        state = "PINCHED";
        feedback = "Good pinch. Hold it steady.";
        nextHoldStartTime = null;
      } else {
        feedback = "Bring your thumb and index finger together.";
      }
      break;

    case "PINCHED":
      if (pinchRatio > releaseThreshold) {
        state = "POSITIONED";
        feedback = "Try to keep the pinch steady.";
        nextHoldStartTime = null;
      } else {
        state = "HOLDING";
        feedback = "Hold the pinch...";
        nextHoldStartTime = Date.now();
      }
      break;

    case "HOLDING": {
      const startedAt = holdStartTime ?? Date.now();
      const elapsed = Date.now() - startedAt;

      holdProgress = Math.min(elapsed / holdDurationMs, 1);

      if (pinchRatio > releaseThreshold && elapsed < holdDurationMs) {
        state = "POSITIONED";
        feedback = "Try to hold the pinch a little longer.";
        nextHoldStartTime = null;
        holdProgress = 0;
      } else if (elapsed >= holdDurationMs) {
        state = "RELEASING";
        feedback = "Good. Now release the pinch.";
        nextHoldStartTime = null;
        holdProgress = 1;
      } else {
        state = "HOLDING";
        feedback = "Keep holding the pinch...";
        nextHoldStartTime = startedAt;
      }

      break;
    }

    case "RELEASING":
      if (pinchRatio >= releaseThreshold) {
        reps += 1;
        repComplete = true;
        state = "POSITIONED";
        feedback = "Well done. Fastening movement completed.";
        nextHoldStartTime = null;
        holdProgress = 0;
      } else {
        feedback = "Open your fingers to release.";
      }
      break;
  }

  return {
    state,
    reps,
    feedback,
    repComplete,
    holdStartTime: nextHoldStartTime,
    holdProgress,
  };
}