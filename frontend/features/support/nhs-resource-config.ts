export type ExerciseSupportSlug =
  | "target-touch"
  | "reach-grasp"
  | "lift-place"
  | "hand-function"
  | "button-fastening";

export type SupportReason =
  | "LOW_ACCURACY"
  | "LOW_MOVEMENT_SCORE"
  | "FAST_MOVEMENT"
  | "SLOW_MOVEMENT"
  | "LOW_RANGE_OF_MOTION"
  | "TRACKING_DIFFICULTY"
  | "REPEATED_DIFFICULTY"
  | "SESSION_ENDED_EARLY"
  | "GENERAL_DIFFICULTY";

export type NhsSupportResource = {
  title: string;
  organisation: string;
  url: string;
  description: string;
  linkLabel: string;
};

export type ExerciseSupportConfig = {
  heading: string;
  observation: string;
  immediateSuggestion: string;
  resource: NhsSupportResource;
};

const GENERAL_STROKE_RECOVERY_RESOURCE: NhsSupportResource = {
  title: "Recovering from a stroke",
  organisation: "NHS",
  url: "https://www.nhs.uk/conditions/stroke/recovery/",
  description:
    "General NHS information about stroke recovery, rehabilitation and support from your healthcare team.",
  linkLabel: "View NHS stroke recovery guidance",
};

const EXERCISE_RESOURCES: Record<
  ExerciseSupportSlug,
  NhsSupportResource
> = {
  "target-touch": {
    title: "Upper-limb co-ordination and reaching tasks",
    organisation: "North Bristol NHS Trust",
    url: "https://www.nbt.nhs.uk/our-services/a-z-services/physiotherapy/specialist-physiotherapy-service/therapy-erehab-video-resources/therapy-erehab-upper-limb-co-ordination",
    description:
      "NHS rehabilitation videos covering upper-limb co-ordination, reaching and functional object-placement tasks.",
    linkLabel: "View NHS reaching guidance",
  },

  "reach-grasp": {
    title: "Stroke and neurological rehabilitation exercise videos",
    organisation: "Northern Care Alliance NHS Foundation Trust",
    url: "https://www.northerncarealliance.nhs.uk/our-services/stroke-and-neurological-rehabilitation-team/stroke-and-neuro-rehabilitation-exercise-videos",
    description:
      "NHS upper-limb exercise videos including hand flexion and pen-gripping activities.",
    linkLabel: "View NHS grasping guidance",
  },

  "lift-place": {
    title: "Upper-limb co-ordination and functional tasks",
    organisation: "North Bristol NHS Trust",
    url: "https://www.nbt.nhs.uk/our-services/a-z-services/physiotherapy/specialist-physiotherapy-service/therapy-erehab-video-resources/therapy-erehab-upper-limb-co-ordination",
    description:
      "NHS videos demonstrating reaching, picking up and moving objects between targets.",
    linkLabel: "View NHS lift-and-place guidance",
  },

  "hand-function": {
    title: "Active finger exercises",
    organisation: "Cambridge University Hospitals NHS Foundation Trust",
    url: "https://www.cuh.nhs.uk/patient-information/hand-therapy-active-finger-exercises/",
    description:
      "NHS hand-therapy guidance intended to reduce stiffness and improve finger movement.",
    linkLabel: "View NHS hand exercise guidance",
  },

  "button-fastening": {
    title: "Post-stroke sensory re-education",
    organisation: "Cambridge University Hospitals NHS Foundation Trust",
    url: "https://www.cuh.nhs.uk/patient-information/post-stroke-sensory-deficits-and-re-education/",
    description:
      "NHS guidance on progressing from larger objects to smaller items such as coins and buttons.",
    linkLabel: "View NHS fine-motor guidance",
  },
};

const REASON_CONTENT: Record<
  SupportReason,
  {
    heading: string;
    observation: string;
    immediateSuggestion: string;
  }
> = {
  LOW_ACCURACY: {
    heading: "The movement was difficult to complete accurately",
    observation:
      "AI-DRA noticed that several movements did not closely match the current exercise target.",
    immediateSuggestion:
      "Try a smaller, slower movement and focus on the on-screen demonstration. Stop if the movement causes pain or unusual discomfort.",
  },

  LOW_MOVEMENT_SCORE: {
    heading: "You may benefit from extra support",
    observation:
      "AI-DRA noticed a repeated pattern of reduced movement control during this exercise.",
    immediateSuggestion:
      "Take a short break, review the demonstration and try again only when you feel comfortable.",
  },

  FAST_MOVEMENT: {
    heading: "Try moving more slowly",
    observation:
      "AI-DRA detected that the movement was completed faster than the provisional controlled range.",
    immediateSuggestion:
      "Repeat the movement at a comfortable pace and focus on smooth control rather than speed.",
  },

  SLOW_MOVEMENT: {
    heading: "Take your time and use support if prescribed",
    observation:
      "AI-DRA detected that the movement took longer than the provisional controlled range.",
    immediateSuggestion:
      "Rest if needed. Continue only at a comfortable pace and follow any support or positioning advice given by your rehabilitation professional.",
  },

  LOW_RANGE_OF_MOTION: {
    heading: "The target range was difficult to reach",
    observation:
      "AI-DRA noticed that the movement repeatedly remained below the current exercise target.",
    immediateSuggestion:
      "Do not force the movement. Reduce the distance and use only the range that feels comfortable.",
  },

  TRACKING_DIFFICULTY: {
    heading: "AI-DRA could not track the movement consistently",
    observation:
      "The camera did not have a clear enough view for reliable movement scoring.",
    immediateSuggestion:
      "Check the lighting, move the camera back and make sure the relevant arm or hand remains visible.",
  },

  REPEATED_DIFFICULTY: {
    heading: "This exercise appears to be repeatedly difficult",
    observation:
      "AI-DRA noticed difficulty across several attempts rather than a single movement.",
    immediateSuggestion:
      "Consider stopping for now and discussing the exercise with your physiotherapist or rehabilitation professional before increasing the difficulty.",
  },

  SESSION_ENDED_EARLY: {
    heading: "It is okay to stop and rest",
    observation:
      "This session ended before the planned repetitions were completed.",
    immediateSuggestion:
      "Take a break. Return only when you feel ready, and speak with your rehabilitation professional if this exercise repeatedly feels difficult.",
  },

  GENERAL_DIFFICULTY: {
    heading: "Need extra support?",
    observation:
      "It is okay if today’s exercise felt difficult.",
    immediateSuggestion:
      "Take a short break and review the exercise guidance before deciding whether to try again.",
  },
};

export function getExerciseSupportConfig({
  exerciseSlug,
  reason = "GENERAL_DIFFICULTY",
}: {
  exerciseSlug: string;
  reason?: SupportReason;
}): ExerciseSupportConfig {
  const resource =
    exerciseSlug in EXERCISE_RESOURCES
      ? EXERCISE_RESOURCES[
          exerciseSlug as ExerciseSupportSlug
        ]
      : GENERAL_STROKE_RECOVERY_RESOURCE;

  const reasonContent =
    REASON_CONTENT[reason] ??
    REASON_CONTENT.GENERAL_DIFFICULTY;

  return {
    ...reasonContent,
    resource,
  };
}

export {
  GENERAL_STROKE_RECOVERY_RESOURCE,
};
