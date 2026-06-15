import { ExerciseRule } from "./exercise-rules";

export type RepState =
  | "RESTING"
  | "REACHING"
  | "REACHED"
  | "RETURNING"
  | "OPEN"
  | "GRIPPING"
  | "HOLDING"
  | "RELEASING";

export type RepCounterResult = {
  state: RepState;
  reps: number;
  feedback: string;
  repComplete: boolean;
  holdStartTime?: number | null;
  holdProgress?: number;
};

export function updatePoseRepCounter({
  value,
  currentState,
  repCount,
  rule,
}: {
  value: number;
  currentState: RepState;
  repCount: number;
  rule: ExerciseRule;
}): RepCounterResult {
  const startThreshold = rule.startThreshold;
  const completeThreshold = rule.completeThreshold;
  const returnThreshold = rule.returnThreshold;

  let state = currentState;
  let reps = repCount;
  let feedback = rule.feedback.start;
  let repComplete = false;

  switch (currentState) {
    case "RESTING":
      if (value > startThreshold) {
        state = "REACHING";
        feedback = rule.feedback.progress;
      }
      break;

    case "REACHING":
      if (value >= completeThreshold) {
        state = "REACHED";
        feedback = rule.feedback.complete;
      } else if (value < startThreshold) {
        state = "RESTING";
        feedback = rule.feedback.start;
      } else {
        feedback = rule.feedback.progress;
      }
      break;

    case "REACHED":
      if (value < completeThreshold - 0.05) {
        state = "RETURNING";
        feedback = rule.feedback.return;
      } else {
        feedback = rule.feedback.complete;
      }
      break;

    case "RETURNING":
      if (value <= returnThreshold) {
        reps += 1;
        repComplete = true;
        state = "RESTING";
        feedback = rule.feedback.repComplete;
      } else {
        feedback = rule.feedback.return;
      }
      break;

    default:
      state = "RESTING";
      feedback = rule.feedback.start;
      break;
  }

  return {
    state,
    reps,
    feedback,
    repComplete,
  };
}

export function updateHandClosureRepCounter({
  value,
  currentState,
  repCount,
  rule,
  holdStartTime,
}: {
  value: number;
  currentState: RepState;
  repCount: number;
  rule: ExerciseRule;
  holdStartTime: number | null;
}): RepCounterResult {
  const gripThreshold = rule.gripThreshold ?? 0.6;
  const releaseThreshold = rule.releaseThreshold ?? 0.2;
  const holdDurationMs = rule.holdDurationMs ?? 3000;

  let state = currentState;
  let reps = repCount;
  let feedback = rule.feedback.start;
  let repComplete = false;
  let nextHoldStartTime = holdStartTime;
  let holdProgress = 0;

  switch (currentState) {
    case "OPEN":
      if (value >= gripThreshold) {
        state = "GRIPPING";
        feedback = rule.feedback.progress;
        nextHoldStartTime = null;
      }
      break;

    case "GRIPPING":
      if (value < releaseThreshold) {
        state = "OPEN";
        feedback = rule.feedback.start;
        nextHoldStartTime = null;
      } else if (value >= gripThreshold) {
        state = "HOLDING";
        feedback = rule.feedback.gripping ?? "Good grip. Hold it steady.";
        nextHoldStartTime = Date.now();
      }
      break;

    case "HOLDING": {
      const startedAt = holdStartTime ?? Date.now();
      const elapsed = Date.now() - startedAt;
      holdProgress = Math.min(elapsed / holdDurationMs, 1);

      if (value < gripThreshold - 0.05 && elapsed < holdDurationMs) {
        state = "OPEN";
        feedback =
          rule.feedback.tooEarly ?? "Try to hold the grip a little longer.";
        nextHoldStartTime = null;
        holdProgress = 0;
      } else if (elapsed >= holdDurationMs) {
        state = "RELEASING";
        feedback = rule.feedback.complete;
        nextHoldStartTime = null;
        holdProgress = 1;
      } else {
        state = "HOLDING";
        feedback = rule.feedback.holding ?? "Keep holding...";
        nextHoldStartTime = startedAt;
      }

      break;
    }

    case "RELEASING":
      if (value <= releaseThreshold) {
        reps += 1;
        repComplete = true;
        state = "OPEN";
        feedback = rule.feedback.repComplete;
        nextHoldStartTime = null;
        holdProgress = 0;
      } else {
        feedback = rule.feedback.return;
      }
      break;

    default:
      state = "OPEN";
      feedback = rule.feedback.start;
      nextHoldStartTime = null;
      holdProgress = 0;
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