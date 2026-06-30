import type { DirectorySurvivorStatus } from "@/features/carer/types";

export type SurvivorWeeklyProgressPoint = {
  label: string;
  value: number;
};

export type SurvivorLastSession = {
  dateLabel: string;
  timeLabel: string;
  score: number;
};

export type SurvivorCarerNote = {
  content: string;
  lastUpdatedLabel: string;
};

export type SurvivorDetail = {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  conditionLabel: string;
  joinedAtLabel: string;
  status: DirectorySurvivorStatus;

  sessionsCount: number;
  exercisesCount: number;

  todayProgressMinutes: number;
  dailyGoalMinutes: number;

  currentExercise: string;
  currentExerciseTargetLabel: string;

  currentStreakDays: number;
  statusHelperText: string;

  lastSession: SurvivorLastSession;
  averageCompletion: number;

  weeklyProgress: SurvivorWeeklyProgressPoint[];
  carerNote: SurvivorCarerNote;
};