export type AdminNotificationCategory =
  | "Engagement"
  | "Invitation"
  | "Session"
  | "System";

export type AdminNotificationSeverity =
  | "Information"
  | "Attention"
  | "Important";

export type AdminNotificationStatus =
  | "Read"
  | "Unread";

export type AdminNotification = {
  id: string;
  title: string;
  description: string;
  details: string;

  category: AdminNotificationCategory;
  participantId: string;

  dateLabel: string;
  dateIso: string;

  severity: AdminNotificationSeverity;
  status: AdminNotificationStatus;

  relatedHref: string | null;
  relatedLabel: string | null;
};