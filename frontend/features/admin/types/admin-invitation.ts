export type AdminInvitationStatus =
  | "Pending"
  | "Accepted"
  | "Declined"
  | "Cancelled"
  | "Expired";

export type AdminInvitationDeliveryStatus =
  | "Delivered"
  | "Failed"
  | "Not Applicable";

export type AdminInvitationTimelineType =
  | "Sent"
  | "Delivered"
  | "Delivery Failed"
  | "Awaiting Response"
  | "Accepted"
  | "Declined"
  | "Cancelled"
  | "Expired";

export type AdminInvitationTimelineEvent = {
  id: string;
  type: AdminInvitationTimelineType;
  title: string;
  description: string;
};

export type AdminInvitation = {
  id: string;
  invitationId: string;

  senderName: string;
  senderEmail: string;
  senderInitials: string;

  recipientEmail: string;
  survivorId: string;

  dateSent: string;
  timeSent: string;
  dateSentIso: string;

  status: AdminInvitationStatus;
  deliveryStatus: AdminInvitationDeliveryStatus;

  lastUpdated: string;
  expiresOn: string;

  timeline: AdminInvitationTimelineEvent[];
};

export type AdminInvitationDateRange =
  | "All"
  | "Last 7 Days"
  | "Last 30 Days"
  | "Last 90 Days";