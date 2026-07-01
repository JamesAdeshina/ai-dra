export type CarerNotificationCategory =
  | "ACTIVITY"
  | "ALERT"
  | "REMINDER"
  | "SYSTEM";

export type CarerNotificationIcon =
  | "goal"
  | "missed"
  | "reminder"
  | "progress"
  | "streak"
  | "difficulty"
  | "connection";

export type CarerNotification = {
  id: string;
  survivorId?: string;
  survivorName?: string;
  title: string;
  message: string;
  category: CarerNotificationCategory;
  icon: CarerNotificationIcon;
  timeLabel: string;
  dateLabel: string;
  createdAt: string;
  unread: boolean;
};