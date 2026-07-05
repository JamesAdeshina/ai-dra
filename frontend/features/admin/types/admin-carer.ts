export type AdminCarerStatus =
  | "Active"
  | "Inactive"
  | "Pending Setup"
  | "No Linked Survivors"
  | "Access Revoked";

export type AdminCarerActivityGroup =
  | "Recent"
  | "Older"
  | "Never";

export type AdminCarerSummary = {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarUrl: string | null;
  joinedDate: string;
  linkedSurvivors: number;
  pendingInvitations: number;
  acceptedLinks: number;
  lastActive: string;
  status: AdminCarerStatus;
  activityGroup: AdminCarerActivityGroup;
};

export type AdminLinkedSurvivorRecord = {
  id: string;
  participantId: string;
  linkStatus: "Accepted" | "Pending";
  sessions: number | null;
  lastActive: string;
};

export type AdminCarerInvitationStatus =
  | "Pending"
  | "Accepted"
  | "Declined"
  | "Expired"
  | "Cancelled";

export type AdminCarerInvitationRecord = {
  id: string;
  recipientParticipantId: string;
  sentDate: string;
  status: AdminCarerInvitationStatus;
  lastUpdated: string;
};

export type AdminCarerActivityType =
  | "Progress Viewed"
  | "Invitation Sent"
  | "Link Accepted"
  | "Settings Updated";

export type AdminCarerActivityRecord = {
  id: string;
  type: AdminCarerActivityType;
  description: string;
  date: string;
};

export type AdminCarerDetail = AdminCarerSummary & {
  registeredOn: string;
  lastActiveDetailed: string;
  notesCreated: number | null;
  linkedSurvivorRecords: AdminLinkedSurvivorRecord[];
  invitationRecords: AdminCarerInvitationRecord[];
  recentActivity: AdminCarerActivityRecord[];
};