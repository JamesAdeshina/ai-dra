export type TrackerType = "pose" | "hand" | "pose-hand";

export type PrimaryMetric =
  | "shoulder-angle"
  | "wrist-reach"
  | "wrist-height"
  | "reach-and-grasp"
  | "hand-open-close"
  | "pinch-zone";

export type ExerciseRule = {
  tracker: TrackerType;
  targetReps: number;
  primaryMetric: PrimaryMetric;

  startThreshold: number;
  completeThreshold: number;
  returnThreshold: number;

  feedback: {
    start: string;
    progress: string;
    complete: string;
    return: string;
    repComplete: string;
  };
};

export const exerciseRules: Record<string, ExerciseRule> = {
  "target-touch": {
    tracker: "pose",
    targetReps: 10,
    primaryMetric: "wrist-reach",

    // Reach distance thresholds
    startThreshold: 0.25,
    completeThreshold: 0.4,
    returnThreshold: 0.28,

    feedback: {
      start: "Start with your arm relaxed.",
      progress: "Reach forward towards the target.",
      complete: "Great reach. Now return slowly.",
      return: "Bring your arm back to the start position.",
      repComplete: "Well done. Rep completed.",
    },
  },

  "lift-place": {
    tracker: "pose",
    targetReps: 8,
    primaryMetric: "wrist-height",

    startThreshold: 0.75,
    completeThreshold: 0.45,
    returnThreshold: 0.7,

    feedback: {
      start: "Start with the object low.",
      progress: "Lift the object steadily.",
      complete: "Good lift. Place it carefully.",
      return: "Return your hand slowly.",
      repComplete: "Well done. Object placed.",
    },
  },

  "reach-grasp": {
    tracker: "pose-hand",
    targetReps: 8,
    primaryMetric: "reach-and-grasp",

    startThreshold: 0,
    completeThreshold: 0,
    returnThreshold: 0,

    feedback: {
      start: "Start with your hand relaxed.",
      progress: "Reach towards the object.",
      complete: "Good grasp. Hold it steady.",
      return: "Release and return slowly.",
      repComplete: "Well done. Grasp completed.",
    },
  },

  "hand-function": {
    tracker: "hand",
    targetReps: 10,
    primaryMetric: "hand-open-close",

    startThreshold: 0,
    completeThreshold: 0,
    returnThreshold: 0,

    feedback: {
      start: "Start with your hand relaxed.",
      progress: "Open your fingers fully.",
      complete: "Good opening. Now close gently.",
      return: "Relax your hand.",
      repComplete: "Well done. Hand movement completed.",
    },
  },

  "button-fastening": {
    tracker: "hand",
    targetReps: 5,
    primaryMetric: "pinch-zone",

    startThreshold: 0,
    completeThreshold: 0,
    returnThreshold: 0,

    feedback: {
      start: "Place your hands near the button.",
      progress: "Bring your thumb and finger together.",
      complete: "Good pinch. Hold it steady.",
      return: "Relax and reposition your hands.",
      repComplete: "Well done. Fastening movement completed.",
    },
  },
};