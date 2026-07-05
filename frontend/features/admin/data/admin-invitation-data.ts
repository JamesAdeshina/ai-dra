import type {
  AdminInvitation,
  AdminInvitationStatus,
  AdminInvitationTimelineEvent,
} from "@/features/admin/types/admin-invitation";

type InvitationWithoutTimeline = Omit<
  AdminInvitation,
  "timeline"
>;

const invitationRecords: InvitationWithoutTimeline[] = [
  {
    id: "invitation-00056",
    invitationId: "INV-00056",
    senderName: "Priya Shah",
    senderEmail: "priya.shah@email.com",
    senderInitials: "PS",
    recipientEmail: "survivor@example.com",
    survivorId: "S-004",
    dateSent: "2 Jul 2026",
    timeSent: "10:42 AM",
    dateSentIso: "2026-07-02T10:42:00",
    status: "Pending",
    deliveryStatus: "Delivered",
    lastUpdated: "2 Jul 2026, 10:42 AM",
    expiresOn: "9 Jul 2026, 10:42 AM",
  },
  {
    id: "invitation-00055",
    invitationId: "INV-00055",
    senderName: "Daniel Reed",
    senderEmail: "daniel.reed@email.com",
    senderInitials: "DR",
    recipientEmail: "survivor2@example.com",
    survivorId: "S-006",
    dateSent: "29 Jun 2026",
    timeSent: "04:18 PM",
    dateSentIso: "2026-06-29T16:18:00",
    status: "Accepted",
    deliveryStatus: "Delivered",
    lastUpdated: "30 Jun 2026, 09:20 AM",
    expiresOn: "6 Jul 2026, 04:18 PM",
  },
  {
    id: "invitation-00054",
    invitationId: "INV-00054",
    senderName: "Sarah Jones",
    senderEmail: "sarah.jones@email.com",
    senderInitials: "SJ",
    recipientEmail: "user3@example.com",
    survivorId: "S-007",
    dateSent: "28 Jun 2026",
    timeSent: "11:15 AM",
    dateSentIso: "2026-06-28T11:15:00",
    status: "Declined",
    deliveryStatus: "Delivered",
    lastUpdated: "29 Jun 2026, 08:10 AM",
    expiresOn: "5 Jul 2026, 11:15 AM",
  },
  {
    id: "invitation-00053",
    invitationId: "INV-00053",
    senderName: "Emily Lewis",
    senderEmail: "emily.lewis@email.com",
    senderInitials: "EL",
    recipientEmail: "user4@example.com",
    survivorId: "S-008",
    dateSent: "27 Jun 2026",
    timeSent: "09:03 AM",
    dateSentIso: "2026-06-27T09:03:00",
    status: "Cancelled",
    deliveryStatus: "Not Applicable",
    lastUpdated: "27 Jun 2026, 11:20 AM",
    expiresOn: "4 Jul 2026, 09:03 AM",
  },
  {
    id: "invitation-00052",
    invitationId: "INV-00052",
    senderName: "Michael Brown",
    senderEmail: "michael.brown@email.com",
    senderInitials: "MB",
    recipientEmail: "user5@example.com",
    survivorId: "S-003",
    dateSent: "26 Jun 2026",
    timeSent: "03:50 PM",
    dateSentIso: "2026-06-26T15:50:00",
    status: "Expired",
    deliveryStatus: "Delivered",
    lastUpdated: "3 Jul 2026, 03:50 PM",
    expiresOn: "3 Jul 2026, 03:50 PM",
  },
  {
    id: "invitation-00051",
    invitationId: "INV-00051",
    senderName: "Priya Shah",
    senderEmail: "priya.shah@email.com",
    senderInitials: "PS",
    recipientEmail: "user6@example.com",
    survivorId: "S-009",
    dateSent: "25 Jun 2026",
    timeSent: "01:20 PM",
    dateSentIso: "2026-06-25T13:20:00",
    status: "Pending",
    deliveryStatus: "Failed",
    lastUpdated: "25 Jun 2026, 01:22 PM",
    expiresOn: "2 Jul 2026, 01:20 PM",
  },
  {
    id: "invitation-00050",
    invitationId: "INV-00050",
    senderName: "Daniel Reed",
    senderEmail: "daniel.reed@email.com",
    senderInitials: "DR",
    recipientEmail: "user7@example.com",
    survivorId: "S-010",
    dateSent: "24 Jun 2026",
    timeSent: "12:12 PM",
    dateSentIso: "2026-06-24T12:12:00",
    status: "Accepted",
    deliveryStatus: "Delivered",
    lastUpdated: "25 Jun 2026, 04:40 PM",
    expiresOn: "1 Jul 2026, 12:12 PM",
  },
  {
    id: "invitation-00049",
    invitationId: "INV-00049",
    senderName: "Priya Shah",
    senderEmail: "priya.shah@email.com",
    senderInitials: "PS",
    recipientEmail: "user8@example.com",
    survivorId: "S-011",
    dateSent: "23 Jun 2026",
    timeSent: "10:01 AM",
    dateSentIso: "2026-06-23T10:01:00",
    status: "Declined",
    deliveryStatus: "Delivered",
    lastUpdated: "24 Jun 2026, 09:15 AM",
    expiresOn: "30 Jun 2026, 10:01 AM",
  },
];

function createTimeline(
  invitation: InvitationWithoutTimeline
): AdminInvitationTimelineEvent[] {
  const events: AdminInvitationTimelineEvent[] = [
    {
      id: `${invitation.id}-sent`,
      type: "Sent",
      title: "Invitation sent",
      description: `${invitation.dateSent}, ${invitation.timeSent}`,
    },
  ];

  if (invitation.deliveryStatus === "Delivered") {
    events.push({
      id: `${invitation.id}-delivered`,
      type: "Delivered",
      title: "Email delivered",
      description: `${invitation.dateSent}, ${invitation.timeSent}`,
    });
  }

  if (invitation.deliveryStatus === "Failed") {
    events.push({
      id: `${invitation.id}-failed`,
      type: "Delivery Failed",
      title: "Email delivery failed",
      description: invitation.lastUpdated,
    });
  }

  const finalEvent = createFinalTimelineEvent(invitation);

  if (finalEvent) {
    events.push(finalEvent);
  }

  return events;
}

function createFinalTimelineEvent(
  invitation: InvitationWithoutTimeline
): AdminInvitationTimelineEvent | null {
  const descriptions: Record<AdminInvitationStatus, string> = {
    Pending: `Expires on ${invitation.expiresOn}`,
    Accepted: invitation.lastUpdated,
    Declined: invitation.lastUpdated,
    Cancelled: invitation.lastUpdated,
    Expired: invitation.expiresOn,
  };

  const titles: Record<AdminInvitationStatus, string> = {
    Pending:
      invitation.deliveryStatus === "Failed"
        ? "Delivery requires review"
        : "Awaiting response",
    Accepted: "Invitation accepted",
    Declined: "Invitation declined",
    Cancelled: "Invitation cancelled",
    Expired: "Invitation expired",
  };

  const eventTypes: Record<
    AdminInvitationStatus,
    AdminInvitationTimelineEvent["type"]
  > = {
    Pending: "Awaiting Response",
    Accepted: "Accepted",
    Declined: "Declined",
    Cancelled: "Cancelled",
    Expired: "Expired",
  };

  return {
    id: `${invitation.id}-status`,
    type: eventTypes[invitation.status],
    title: titles[invitation.status],
    description: descriptions[invitation.status],
  };
}

export const adminInvitations: AdminInvitation[] =
  invitationRecords.map((invitation) => ({
    ...invitation,
    timeline: createTimeline(invitation),
  }));

export function getAdminInvitations(): AdminInvitation[] {
  return adminInvitations;
}