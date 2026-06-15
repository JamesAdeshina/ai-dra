export const exerciseDetails = {
  "target-touch": {
    slug: "target-touch",
    title: "Target Touch",
    category: "Functional Upper Limb Task",
    description:
      "Target Touch helps improve controlled reaching by guiding the user to move their arm towards a visible target.",
    level: "Level 1",
    reps: "10 reps",
    duration: "5 minutes",
    difficulty: "Easy",
    type: "Gross Arm Movement",
    aratDomain: "Gross Arm Movement",
    trackingType: "Pose Tracking",
    requiresObject: false,
    instruction: "Reach forward and touch the target.",
    images: {
      thumbnail: "/exercises/target-touch/target-touch-thumbnail.png",
      states: {
        start: "/exercises/target-touch/target-touch-start.png",
        active: "/exercises/target-touch/target-touch-active.png",
      },
    },
    demoVideo: "/video/Shoulder Flexion video.mp4",
    demoFallbackIcon: "🎯",
    demoText:
      "This task supports reaching movements used in everyday activities.",
    benefits: [
      "Improve reaching ability",
      "Support shoulder and arm control",
      "Build confidence using the affected arm",
    ],
    activities: [
      "Reaching for a cup",
      "Touching a light switch",
      "Reaching for items on a table",
      "Selecting objects nearby",
    ],
    steps: [
      "Sit upright and face the target.",
      "Keep your arm relaxed at the start.",
      "Reach forward slowly towards the target.",
      "Touch the target gently.",
      "Return your arm to the starting position.",
    ],
  },

  "reach-grasp": {
    slug: "reach-grasp",
    title: "Grasp and Hold Object",
    category: "Functional Hand Task",
    description:
      "Grasp and Hold Object helps improve hand control by practising reaching for and holding everyday objects such as a bottle, cup, or ball.",
    level: "Level 2",
    reps: "8 reps",
    duration: "5 minutes",
    difficulty: "Medium",
    type: "Grasp / Grip",
    aratDomain: "Grasp / Grip",
    trackingType: "Hand Tracking",
    requiresObject: true,
    instruction: "Reach forward and grasp the object steadily.",
    images: {
      thumbnail: "/exercises/reach-grasp/reach-grasp-thumbnail.png",
      states: {
        start: "/exercises/reach-grasp/reach-grasp-start.png",
        active: "/exercises/reach-grasp/reach-grasp-active.png",
      },
    },
    demoVideo: "",
    demoFallbackIcon: "✊",
    demoText:
      "This task supports object handling and functional hand use.",
    benefits: [
      "Improve grip control",
      "Support object handling",
      "Increase independence with daily items",
    ],
    activities: [
      "Holding a cup",
      "Holding a phone",
      "Holding a bottle",
      "Holding a small ball",
    ],
    steps: [
      "Place the object in front of you.",
      "Start with your arm relaxed.",
      "Reach towards the object.",
      "Close your hand around the object.",
      "Hold it steadily, then release safely.",
    ],
  },

  "lift-place": {
    slug: "lift-place",
    title: "Lift and Place Object",
    category: "Functional Object Task",
    description:
      "Lift and Place helps improve movement control by practising lifting an object and placing it in a target location.",
    level: "Level 2",
    reps: "8 reps",
    duration: "5 minutes",
    difficulty: "Medium",
    type: "Grasp + Gross Arm Movement",
    aratDomain: "Grasp + Gross Arm Movement",
    trackingType: "Pose + Object Task",
    requiresObject: true,
    instruction: "Lift the object and place it on the target area.",
    images: {
      thumbnail: "/exercises/lift-place/lift-place-thumbnail.png",
      states: {
        start: "/exercises/lift-place/lift-place-start.png",
        active: "/exercises/lift-place/lift-place-active.png",
      },
    },
    demoVideo: "",
    demoFallbackIcon: "📦",
    demoText:
      "This task supports lifting, transporting, and placing objects during daily activities.",
    benefits: [
      "Improve lifting control",
      "Develop coordination",
      "Support task completion",
    ],
    activities: [
      "Placing a cup on a table",
      "Moving household items",
      "Putting items onto a shelf",
      "Organising objects at home",
    ],
    steps: [
      "Hold the object securely.",
      "Start with the object near your side.",
      "Lift the object slowly.",
      "Move it towards the target area.",
      "Place it down safely.",
    ],
  },

  "hand-function": {
    slug: "hand-function",
    title: "Hand Function Task",
    category: "Hand and Finger Exercise",
    description:
      "Hand Function tasks help improve hand opening, closing, finger movement, and grip strength.",
    level: "Level 2",
    reps: "10 reps",
    duration: "5 minutes",
    difficulty: "Medium",
    type: "Grip / Pinch",
    aratDomain: "Grip / Pinch",
    trackingType: "Hand Tracking",
    requiresObject: false,
    instruction: "Open and close your hand slowly.",
    images: {
      thumbnail: "/exercises/hand-function/hand-function-thumbnail.png",
      states: {
        start: "/exercises/hand-function/hand-function-start.png",
        active: "/exercises/hand-function/hand-function-active.png",
      },
    },
    demoVideo: "",
    demoFallbackIcon: "🖐️",
    demoText:
      "This task supports hand control, grip strength, and finger movement.",
    benefits: [
      "Improve hand control",
      "Support grip and release",
      "Increase finger mobility",
    ],
    activities: [
      "Opening your hand",
      "Closing your hand",
      "Squeezing a soft ball",
      "Releasing small objects",
    ],
    steps: [
      "Rest your arm comfortably.",
      "Keep your hand relaxed at the start.",
      "Lift your hand forward.",
      "Open your fingers slowly.",
      "Relax your hand and repeat.",
    ],
  },

  "button-fastening": {
    slug: "button-fastening",
    title: "Buttoning and Fastening",
    category: "Fine Motor Task",
    description:
      "Buttoning and Fastening helps practise fine hand movements used for dressing and daily independence.",
    level: "Level 3",
    reps: "5 reps",
    duration: "5 minutes",
    difficulty: "Hard",
    type: "Pinch / Fine Dexterity",
    aratDomain: "Pinch / Fine Dexterity",
    trackingType: "Fine Hand Tracking",
    requiresObject: true,
    instruction: "Practise fastening or unfastening a button slowly.",
    images: {
      thumbnail: "/exercises/button-fastening/button-fastening-thumbnail.png",
      states: {
        start: "/exercises/button-fastening/button-fastening-start.png",
        active: "/exercises/button-fastening/button-fastening-active.png",
      },
    },
    demoVideo: "",
    demoFallbackIcon: "👕",
    demoText:
      "This task supports dressing-related independence and fine hand control.",
    benefits: [
      "Improve fine motor control",
      "Support dressing activities",
      "Build independence in daily routines",
    ],
    activities: [
      "Buttoning a shirt",
      "Fastening clothing",
      "Using zips or small fasteners",
      "Managing dressing tasks",
    ],
    steps: [
      "Stand or sit comfortably.",
      "Place both hands near the button.",
      "Use your fingers to guide the button.",
      "Fasten the button carefully.",
      "Relax your hands and repeat.",
    ],
  },
};