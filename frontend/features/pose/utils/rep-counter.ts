import { ExerciseRule } from "./exercise-rules";

export type RepState =
  | "RESTING"
  | "REACHING"
  | "REACHED"
  | "RETURNING";

export type RepCounterResult = {
  state: RepState;
  reps: number;
  feedback: string;
  repComplete: boolean;
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
  }

  return {
    state,
    reps,
    feedback,
    repComplete,
  };
}