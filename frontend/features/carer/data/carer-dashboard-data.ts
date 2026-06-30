import type {
  CarerActivity,
  CarerReminder,
  CarerSurvivorSummary,
  DashboardStat,
  WeeklyProgressPoint,
} from "@/features/carer/types";

export const dashboardStats: DashboardStat[] = [
  {
    id: "goal",
    label: "Today’s Goal",
    value: "18/30",
    suffix: "mins",
    icon: "goal",
  },
  {
    id: "sessions",
    label: "Sessions Completed",
    value: "3",
    suffix: "sessions",
    icon: "completed",
  },
  {
    id: "streak",
    label: "Current Streak",
    value: "5",
    suffix: "days",
    icon: "streak",
  },
  {
    id: "completion",
    label: "Weekly Completion",
    value: "76%",
    icon: "completion",
  },
];

export const connectedSurvivors: CarerSurvivorSummary[] = [
  {
    id: "william-carter",
    name: "William Carter",
    initials: "WC",
    relationship: "Father",
    conditionLabel: "Stroke Survivor",
    todayProgressMinutes: 18,
    dailyGoalMinutes: 30,
    completedSessions: 2,
    targetSessions: 3,
    currentStreakDays: 5,
    lastCompletedExercise: "Grasp and Hold Object",
    lastCompletedTime: "6:30 PM",
    status: "ON_TRACK",
  },
  {
    id: "margaret-wilson",
    name: "Margaret Wilson",
    initials: "MW",
    relationship: "Family Friend",
    conditionLabel: "Stroke Survivor",
    todayProgressMinutes: 18,
    dailyGoalMinutes: 30,
    completedSessions: 1,
    targetSessions: 3,
    currentStreakDays: 2,
    lastCompletedExercise: "Lift and Place Object",
    lastCompletedTime: "6:30 PM",
    status: "NEEDS_SUPPORT",
  },
];

export const upcomingReminders: CarerReminder[] = [
  {
    id: "reminder-1",
    survivorName: "Margaret Wilson",
    title: "Exercise Session",
    subtitle: "Grasp and Hold Object",
    timeLabel: "4:00 PM",
    iconLabel: "GH",
  },
  {
    id: "reminder-2",
    survivorName: "Margaret Wilson",
    title: "Exercise Session",
    subtitle: "Lift and Place Object",
    timeLabel: "4:00 PM",
    iconLabel: "LP",
  },
  {
    id: "reminder-3",
    survivorName: "Weekly Progress Report",
    title: "Summary will be ready",
    subtitle: "Review progress across linked survivors",
    timeLabel: "Tomorrow",
    iconLabel: "WR",
  },
];

export const recentActivities: CarerActivity[] = [
  {
    id: "activity-1",
    survivorName: "William Carter",
    initials: "WC",
    description: "completed Target Touch",
    timeLabel: "10:15 AM",
  },
  {
    id: "activity-2",
    survivorName: "Margaret Wilson",
    initials: "MW",
    description: "completed Grasp and Hold Object",
    timeLabel: "Yesterday, 6:30 PM",
  },
  {
    id: "activity-3",
    survivorName: "Margaret Wilson",
    initials: "MW",
    description: "completed Hand Function Task",
    timeLabel: "Yesterday, 6:30 PM",
  },
];

export const weeklyProgress: WeeklyProgressPoint[] = [
  { label: "Mon", value: 66 },
  { label: "Tue", value: 68 },
  { label: "Wed", value: 72 },
  { label: "Thu", value: 75 },
  { label: "Fri", value: 77 },
  { label: "Sat", value: 69 },
  { label: "Sun", value: 76 },
];
