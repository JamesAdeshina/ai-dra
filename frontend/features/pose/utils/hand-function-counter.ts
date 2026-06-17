export type HandFunctionState =
  | "OPEN"
  | "CLOSING"
  | "CLOSED"
  | "OPENING";

export type HandFunctionCounterResult = {
  state: HandFunctionState;
  reps: number;
  feedback: string;
  repComplete: boolean;
};

export function updateHandFunctionCounter({
  closureRatio,
  currentState,
  repCount,
}: {
  closureRatio: number;
  currentState: HandFunctionState;
  repCount: number;
}): HandFunctionCounterResult {
  const closeThreshold = 0.6;
  const openThreshold = 0.2;

  let state = currentState;
  let reps = repCount;
  let feedback = "Start with your hand open.";
  let repComplete = false;

  switch (currentState) {
    case "OPEN":
      if (closureRatio >= closeThreshold) {
        state = "CLOSING";
        feedback = "Good. Close your hand fully.";
      }
      break;

    case "CLOSING":
      if (closureRatio >= closeThreshold) {
        state = "CLOSED";
        feedback = "Good close. Now open your hand.";
      } else if (closureRatio <= openThreshold) {
        state = "OPEN";
        feedback = "Start with your hand open.";
      }
      break;

    case "CLOSED":
      if (closureRatio < closeThreshold - 0.1) {
        state = "OPENING";
        feedback = "Open your hand fully.";
      }
      break;

    case "OPENING":
      if (closureRatio <= openThreshold) {
        reps += 1;
        repComplete = true;
        state = "OPEN";
        feedback = "Well done. Hand movement completed.";
      } else {
        feedback = "Keep opening your hand.";
      }
      break;
  }

  return {
    state,
    reps,
    feedback,
    repComplete,
  };
}