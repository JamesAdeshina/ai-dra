export type CarerInvitationDraft = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  customRelationship: string;
  message: string;
};

export type PendingCarerInvitation =
  CarerInvitationDraft & {
    status: "PENDING";
    sentAt: string;
    expiresAt: string;
  };