import { carerSurvivors } from "@/features/carer/data/carer-survivors-data";
import type { SurvivorDetail } from "@/features/carer/types/survivor-detail";

type SurvivorDetailExtra = Omit<
  SurvivorDetail,
  | "id"
  | "name"
  | "initials"
  | "avatarUrl"
  | "conditionLabel"
  | "status"
  | "todayProgressMinutes"
  | "dailyGoalMinutes"
  | "currentStreakDays"
  | "averageCompletion"
>;

const survivorDetailExtras: Record<string, SurvivorDetailExtra> = {
  "william-carter": {
    joinedAtLabel: "Joined 15 Feb 2026",
    sessionsCount: 2,
    exercisesCount: 5,
    currentExercise: "Target Touch",
    currentExerciseTargetLabel: "10 repetitions",
    statusHelperText: "Great job!",
    lastSession: {
      dateLabel: "Today",
      timeLabel: "6:35 PM",
      score: 83,
    },
    weeklyProgress: [
      { label: "Mon", value: 66 },
      { label: "Tue", value: 68 },
      { label: "Wed", value: 72 },
      { label: "Thu", value: 75 },
      { label: "Fri", value: 77 },
      { label: "Sat", value: 69 },
      { label: "Sun", value: 76 },
    ],
    carerNote: {
      content:
        "William completed his recent exercises independently and appeared more confident with the Target Touch activity.",
      lastUpdatedLabel: "27 June 2026",
    },
  },

  "margaret-wilson": {
    joinedAtLabel: "Joined 03 Mar 2026",
    sessionsCount: 1,
    exercisesCount: 4,
    currentExercise: "Lift and Place Object",
    currentExerciseTargetLabel: "8 repetitions",
    statusHelperText: "May need encouragement.",
    lastSession: {
      dateLabel: "Yesterday",
      timeLabel: "4:20 PM",
      score: 68,
    },
    weeklyProgress: [
      { label: "Mon", value: 61 },
      { label: "Tue", value: 64 },
      { label: "Wed", value: 62 },
      { label: "Thu", value: 67 },
      { label: "Fri", value: 65 },
      { label: "Sat", value: 58 },
      { label: "Sun", value: 64 },
    ],
    carerNote: {
      content:
        "Margaret needed a short break during her last session. She completed the activity after some encouragement.",
      lastUpdatedLabel: "29 June 2026",
    },
  },

  "robert-singh": {
    joinedAtLabel: "Joined 21 Apr 2026",
    sessionsCount: 0,
    exercisesCount: 3,
    currentExercise: "Hand Function Task",
    currentExerciseTargetLabel: "10 repetitions",
    statusHelperText: "Recent sessions have been missed.",
    lastSession: {
      dateLabel: "5 days ago",
      timeLabel: "11:10 AM",
      score: 48,
    },
    weeklyProgress: [
      { label: "Mon", value: 54 },
      { label: "Tue", value: 52 },
      { label: "Wed", value: 49 },
      { label: "Thu", value: 47 },
      { label: "Fri", value: 48 },
      { label: "Sat", value: 44 },
      { label: "Sun", value: 48 },
    ],
    carerNote: {
      content:
        "Robert has not completed a rehabilitation session recently. Consider checking whether he needs assistance.",
      lastUpdatedLabel: "30 June 2026",
    },
  },
};

export function getSurvivorDetailById(
  survivorId: string,
): SurvivorDetail | null {
  const survivor = carerSurvivors.find(
    (item) => item.id === survivorId,
  );

  if (!survivor) {
    return null;
  }

  const detail = survivorDetailExtras[survivorId];

  if (!detail) {
    return null;
  }

  return {
    id: survivor.id,
    name: survivor.name,
    initials: survivor.initials,
    avatarUrl: survivor.avatarUrl,
    conditionLabel: survivor.conditionLabel,
    status: survivor.status,

    todayProgressMinutes: survivor.todayProgressMinutes,
    dailyGoalMinutes: survivor.dailyGoalMinutes,
    currentStreakDays: survivor.currentStreakDays,
    averageCompletion: survivor.averageScore,

    ...detail,
  };
}