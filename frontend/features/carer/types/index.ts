export type SurvivorStatus =
  | "ON_TRACK"
  | "NEEDS_SUPPORT"
  | "SESSION_MISSED"
  | "NO_RECENT_ACTIVITY"
  | "DIFFICULTY_REPORTED";

export type DashboardStatIcon =
  | "goal"
  | "completed"
  | "streak"
  | "completion";

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  icon: DashboardStatIcon;
};

export type CarerSurvivorSummary = {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  relationship: string;
  conditionLabel: string;
  todayProgressMinutes: number;
  dailyGoalMinutes: number;
  completedSessions: number;
  targetSessions: number;
  currentStreakDays: number;
  lastCompletedExercise: string;
  lastCompletedTime: string;
  status: SurvivorStatus;
};

export type CarerReminder = {
  id: string;
  survivorName: string;
  title: string;
  subtitle: string;
  timeLabel: string;
  iconLabel: string;
};

export type CarerActivity = {
  id: string;
  survivorName: string;
  initials: string;
  avatarUrl?: string;
  description: string;
  timeLabel: string;
};

export type WeeklyProgressPoint = {
  label: string;
  value: number;
};

/*
 * Connected survivors directory
 */

export type DirectorySurvivorStatus =
  | "ON_TRACK"
  | "NEEDS_SUPPORT"
  | "AT_RISK";

export type SurvivorDirectorySort =
  | "RECENTLY_ADDED"
  | "NAME_ASCENDING"
  | "HIGHEST_COMPLETION"
  | "NEEDS_ATTENTION";

export type CarerSurvivorDirectoryItem = {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  age: number;
  relationship: string;
  conditionLabel: string;
  affectedSide: "LEFT" | "RIGHT" | "BOTH";
  status: DirectorySurvivorStatus;
  activeToday: boolean;
  linkedAt: string;
  todayProgressMinutes: number;
  dailyGoalMinutes: number;
  completedSessions: number;
  targetSessions: number;
  currentStreakDays: number;
  latestSessionExercise: string;
  latestSessionDateLabel: string;
  latestSessionTime: string;
  averageScore: number;
};