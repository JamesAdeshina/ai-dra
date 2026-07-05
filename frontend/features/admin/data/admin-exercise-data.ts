import {
  exerciseDetails,
} from "@/features/exercises/data/exercise-details";
import {
  exercises,
} from "@/features/exercises/data/exercises";

import type {
  AdminExerciseDetail,
  AdminExerciseRecentSession,
  AdminExerciseSummary,
} from "@/features/admin/types/admin-exercise";

type ExerciseUsageRecord = {
  status: AdminExerciseSummary["status"];
  catalogueCategory: string;
  totalSessions: number;
  survivorsAttempted: number;
  completedSessions: number;
  endedEarlySessions: number;
  pausedSessions: number;
  completionRate: number;
  averageCompletedRepetitions: number | null;
  averageSessionDuration: string | null;
  lastUpdated: string;
  holdDuration: string | null;
  recommendedSets: string | null;
  equipment: string;
};

const exerciseUsage: Record<string, ExerciseUsageRecord> = {
  "target-touch": {
    status: "Active",
    catalogueCategory: "Reaching",
    totalSessions: 38,
    survivorsAttempted: 21,
    completedSessions: 31,
    endedEarlySessions: 6,
    pausedSessions: 1,
    completionRate: 82,
    averageCompletedRepetitions: 8.4,
    averageSessionDuration: "6 min 12 sec",
    lastUpdated: "2 Jul 2026",
    holdDuration: "1 second",
    recommendedSets: "2–3 sets",
    equipment: "None",
  },

  "reach-grasp": {
    status: "Active",
    catalogueCategory: "Grasping",
    totalSessions: 31,
    survivorsAttempted: 18,
    completedSessions: 23,
    endedEarlySessions: 6,
    pausedSessions: 2,
    completionRate: 74,
    averageCompletedRepetitions: 6.7,
    averageSessionDuration: "5 min 48 sec",
    lastUpdated: "1 Jul 2026",
    holdDuration: "2 seconds",
    recommendedSets: "2 sets",
    equipment: "Light everyday object",
  },

  "lift-place": {
    status: "Active",
    catalogueCategory: "Lifting & Placing",
    totalSessions: 24,
    survivorsAttempted: 15,
    completedSessions: 19,
    endedEarlySessions: 4,
    pausedSessions: 1,
    completionRate: 79,
    averageCompletedRepetitions: 6.5,
    averageSessionDuration: "6 min 05 sec",
    lastUpdated: "1 Jul 2026",
    holdDuration: null,
    recommendedSets: "2 sets",
    equipment: "Light object and target area",
  },

  "hand-function": {
    status: "Active",
    catalogueCategory: "Hand Function",
    totalSessions: 17,
    survivorsAttempted: 12,
    completedSessions: 12,
    endedEarlySessions: 4,
    pausedSessions: 1,
    completionRate: 71,
    averageCompletedRepetitions: 7.1,
    averageSessionDuration: "5 min 22 sec",
    lastUpdated: "28 Jun 2026",
    holdDuration: null,
    recommendedSets: "2 sets",
    equipment: "None",
  },

  "button-fastening": {
    status: "Active",
    catalogueCategory: "Fine Motor",
    totalSessions: 9,
    survivorsAttempted: 7,
    completedSessions: 6,
    endedEarlySessions: 2,
    pausedSessions: 1,
    completionRate: 67,
    averageCompletedRepetitions: 3.2,
    averageSessionDuration: "7 min 10 sec",
    lastUpdated: "25 Jun 2026",
    holdDuration: null,
    recommendedSets: "1–2 sets",
    equipment: "Buttoning practice material",
  },
};

const recentSessionsByExercise: Record<
  string,
  AdminExerciseRecentSession[]
> = {
  "target-touch": [
    {
      id: "exercise-session-1",
      participantId: "S-001",
      date: "2 Jul 2026",
      status: "Completed",
      repetitions: 10,
      duration: "7 min",
    },
    {
      id: "exercise-session-2",
      participantId: "S-004",
      date: "1 Jul 2026",
      status: "Ended Early",
      repetitions: 4,
      duration: "3 min",
    },
    {
      id: "exercise-session-3",
      participantId: "S-006",
      date: "30 Jun 2026",
      status: "Completed",
      repetitions: 8,
      duration: "6 min",
    },
    {
      id: "exercise-session-4",
      participantId: "S-002",
      date: "29 Jun 2026",
      status: "Completed",
      repetitions: 9,
      duration: "7 min",
    },
    {
      id: "exercise-session-5",
      participantId: "S-009",
      date: "28 Jun 2026",
      status: "Paused",
      repetitions: 6,
      duration: "5 min",
    },
  ],

  "reach-grasp": [],
  "lift-place": [],
  "hand-function": [],
  "button-fastening": [],
};

function parseRepetitions(value: string): number | null {
  const parsed = Number.parseInt(value, 10);

  return Number.isNaN(parsed) ? null : parsed;
}

export const adminExercises: AdminExerciseSummary[] =
  exercises.map((exercise) => {
    const usage = exerciseUsage[exercise.id];

    return {
      id: exercise.id,
      title: exercise.title,
      description: exercise.description,
      category: exercise.category,
      catalogueCategory: usage.catalogueCategory,
      level: exercise.level,
      repetitionsLabel: exercise.reps,
      difficulty:
        exercise.difficulty as AdminExerciseSummary["difficulty"],

      thumbnail: exercise.images.thumbnail,
      startImage: exercise.images.states.start,
      activeImage: exercise.images.states.active,

      status: usage.status,
      totalSessions: usage.totalSessions,
      survivorsAttempted: usage.survivorsAttempted,
      completedSessions: usage.completedSessions,
      endedEarlySessions: usage.endedEarlySessions,
      pausedSessions: usage.pausedSessions,
      completionRate: usage.completionRate,
      averageCompletedRepetitions:
        usage.averageCompletedRepetitions,
      averageSessionDuration:
        usage.averageSessionDuration,
      lastUpdated: usage.lastUpdated,
    };
  });

export function getAdminExercises(): AdminExerciseSummary[] {
  return adminExercises;
}

export function getAdminExerciseById(
  exerciseId: string
): AdminExerciseDetail | null {
  const summary = adminExercises.find(
    (exercise) => exercise.id === exerciseId
  );

  if (!summary) {
    return null;
  }

  const detail =
    exerciseDetails[
      exerciseId as keyof typeof exerciseDetails
    ];

  if (!detail) {
    return null;
  }

  const usage = exerciseUsage[exerciseId];

  return {
    ...summary,

    slug: detail.slug,
    duration: detail.duration,
    exerciseType: detail.type,
    aratDomain: detail.aratDomain,
    trackingType: detail.trackingType,
    requiresObject: detail.requiresObject,

    instruction: detail.instruction,
    instructions: detail.steps,
    benefits: detail.benefits,
    activities: detail.activities,

    demoVideo: detail.demoVideo,
    demoFallbackIcon: detail.demoFallbackIcon,
    demoText: detail.demoText,

    targetRepetitions: parseRepetitions(detail.reps),
    holdDuration: usage.holdDuration,
    recommendedSets: usage.recommendedSets,
    equipment: usage.equipment,

    recentSessions:
      recentSessionsByExercise[exerciseId] ?? [],
  };
}