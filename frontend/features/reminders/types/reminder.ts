export type ReminderType =
  | "EXERCISE"
  | "BREAK"
  | "EVENING"
  | "MOTIVATIONAL"
  | "WEEKLY_SUMMARY"
  | "CUSTOM";

export type ReminderFrequency =
  | "ONCE"
  | "DAILY"
  | "WEEKDAYS"
  | "WEEKLY"
  | "CUSTOM_DAYS";

export type ReminderPreferences = {
  id: string;
  survivorId: string;
  remindersEnabled: boolean;
  encouragingMessagesEnabled: boolean;
  weeklySummaryEnabled: boolean;
  pushNotificationsEnabled: boolean;
  timezone: string;
  createdAt: string;
  updatedAt: string;
};

export type Reminder = {
  id: string;
  survivorId: string;
  title: string;
  message: string;
  reminderType: ReminderType;
  frequency: ReminderFrequency;
  timeOfDay: string;
  scheduledDate: string | null;
  daysOfWeek: number[];
  isEnabled: boolean;
  isDefault: boolean;
  nextTriggerAt: string | null;
  lastTriggeredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReminderWeeklyProgress = {
  sessionsCompleted: number;
  sessionTarget: number;
  minutesCompleted: number;
  currentStreak: number;
};

export type ReminderPageData = {
  preferences: ReminderPreferences;
  reminders: Reminder[];
  nextReminder: Reminder | null;
  weeklyProgress: ReminderWeeklyProgress;
};

export type CreateReminderInput = {
  title: string;
  message: string;
  reminderType: ReminderType;
  frequency: ReminderFrequency;
  timeOfDay: string;
  scheduledDate?: string | null;
  daysOfWeek?: number[];
  isEnabled?: boolean;
};

export type UpdateReminderInput = {
  reminderId: string;
  title?: string;
  message?: string;
  reminderType?: ReminderType;
  frequency?: ReminderFrequency;
  timeOfDay?: string;
  scheduledDate?: string | null;
  daysOfWeek?: number[];
  isEnabled?: boolean;
};

export type UpdateReminderPreferencesInput = {
  remindersEnabled?: boolean;
  encouragingMessagesEnabled?: boolean;
  weeklySummaryEnabled?: boolean;
  pushNotificationsEnabled?: boolean;
  timezone?: string;
};

export type ReminderScheduleInput = {
  frequency: ReminderFrequency;
  timeOfDay: string;
  scheduledDate?: string | null;
  daysOfWeek?: number[];
  timezone: string;
  fromDate?: Date;
};

export type DefaultReminderDefinition = {
  title: string;
  message: string;
  reminderType: Exclude<ReminderType, "CUSTOM">;
  frequency: ReminderFrequency;
  timeOfDay: string;
  scheduledDate: string | null;
  daysOfWeek: number[];
  isEnabled: boolean;
  isDefault: true;
};

export const WEEKDAY_OPTIONS = [
  { value: 1, shortLabel: "Mon", label: "Monday" },
  { value: 2, shortLabel: "Tue", label: "Tuesday" },
  { value: 3, shortLabel: "Wed", label: "Wednesday" },
  { value: 4, shortLabel: "Thu", label: "Thursday" },
  { value: 5, shortLabel: "Fri", label: "Friday" },
  { value: 6, shortLabel: "Sat", label: "Saturday" },
  { value: 0, shortLabel: "Sun", label: "Sunday" },
] as const;
