import type { AdminNotification } from "@/features/admin/types/admin-notification";

export const adminNotifications: AdminNotification[] = [
  {
    id: "notification-001",
    title: "Survivor inactive for 8 days",
    description:
      "No rehabilitation activity has been recorded during the last 8 days.",
    details:
      "Participant S-002 has not recorded a rehabilitation session or other platform activity during the current monitoring period.",
    category: "Engagement",
    participantId: "S-002",
    dateLabel: "Today, 09:41",
    dateIso: "2026-07-04T09:41:00Z",
    severity: "Attention",
    status: "Unread",
    relatedHref: "/admin/survivors/s-002",
    relatedLabel: "View survivor",
  },
  {
    id: "notification-002",
    title: "Invitation awaiting response",
    description:
      "A carer-survivor invitation has been pending for more than 5 days.",
    details:
      "The invitation associated with participant S-006 has not yet been accepted, declined or cancelled.",
    category: "Invitation",
    participantId: "S-006",
    dateLabel: "Yesterday, 16:20",
    dateIso: "2026-07-03T16:20:00Z",
    severity: "Information",
    status: "Read",
    relatedHref: "/admin/invitations",
    relatedLabel: "View invitations",
  },
  {
    id: "notification-003",
    title: "Session ended early repeatedly",
    description:
      "The survivor has ended multiple rehabilitation sessions early.",
    details:
      "Participant S-004 has recorded repeated ended-early sessions. This alert is for engagement monitoring and does not represent a clinical conclusion.",
    category: "Session",
    participantId: "S-004",
    dateLabel: "1 Jul 2026",
    dateIso: "2026-07-01T15:12:00Z",
    severity: "Important",
    status: "Unread",
    relatedHref: "/admin/sessions/session-002",
    relatedLabel: "View session",
  },
  {
    id: "notification-004",
    title: "Missing completion data",
    description:
      "A session record does not contain complete completion information.",
    details:
      "A rehabilitation session associated with participant S-008 has incomplete duration or completion fields and may require a data-quality review.",
    category: "Session",
    participantId: "S-008",
    dateLabel: "1 Jul 2026",
    dateIso: "2026-07-01T11:18:00Z",
    severity: "Attention",
    status: "Unread",
    relatedHref: "/admin/sessions/session-005",
    relatedLabel: "View session",
  },
  {
    id: "notification-005",
    title: "Invitation declined",
    description:
      "A carer-survivor invitation was declined.",
    details:
      "The invitation associated with participant S-007 was declined by the recipient. No administrative action is required.",
    category: "Invitation",
    participantId: "S-007",
    dateLabel: "30 Jun 2026",
    dateIso: "2026-06-30T14:25:00Z",
    severity: "Information",
    status: "Read",
    relatedHref: "/admin/invitations",
    relatedLabel: "View invitations",
  },
  {
    id: "notification-006",
    title: "Survivor inactive for 14 days",
    description:
      "No rehabilitation activity has been recorded during the last 14 days.",
    details:
      "Participant S-009 has not recorded recent rehabilitation activity. The status should be reviewed as an engagement indicator only.",
    category: "Engagement",
    participantId: "S-009",
    dateLabel: "30 Jun 2026",
    dateIso: "2026-06-30T09:10:00Z",
    severity: "Important",
    status: "Unread",
    relatedHref: "/admin/survivors/s-009",
    relatedLabel: "View survivor",
  },
  {
    id: "notification-007",
    title: "Email delivery failed",
    description:
      "An invitation email could not be delivered.",
    details:
      "The invitation email associated with participant S-010 returned a failed delivery status in the prototype monitoring data.",
    category: "System",
    participantId: "S-010",
    dateLabel: "29 Jun 2026",
    dateIso: "2026-06-29T18:45:00Z",
    severity: "Attention",
    status: "Read",
    relatedHref: "/admin/invitations",
    relatedLabel: "View invitation monitoring",
  },
  {
    id: "notification-008",
    title: "Multiple incomplete attempts",
    description:
      "Multiple incomplete movement attempts were recorded.",
    details:
      "Participant S-003 recorded several incomplete attempts. Detailed movement interpretation will only be available after the scoring system is implemented.",
    category: "Session",
    participantId: "S-003",
    dateLabel: "29 Jun 2026",
    dateIso: "2026-06-29T13:30:00Z",
    severity: "Important",
    status: "Unread",
    relatedHref: "/admin/sessions/session-006",
    relatedLabel: "View session",
  },
  {
    id: "notification-009",
    title: "Registered but no first session",
    description:
      "A survivor account has completed registration but has not started a session.",
    details:
      "Participant S-005 is registered on the platform but does not currently have a recorded rehabilitation session.",
    category: "Engagement",
    participantId: "S-005",
    dateLabel: "28 Jun 2026",
    dateIso: "2026-06-28T16:05:00Z",
    severity: "Attention",
    status: "Read",
    relatedHref: "/admin/survivors/s-005",
    relatedLabel: "View survivor",
  },
  {
    id: "notification-010",
    title: "Database connection issue",
    description:
      "Intermittent prototype database connection errors were recorded.",
    details:
      "This is a demonstration system alert showing how infrastructure or integration warnings may later appear in the admin monitoring portal.",
    category: "System",
    participantId: "System",
    dateLabel: "28 Jun 2026",
    dateIso: "2026-06-28T11:40:00Z",
    severity: "Important",
    status: "Unread",
    relatedHref: "/admin/settings",
    relatedLabel: "View system settings",
  },
  {
    id: "notification-011",
    title: "Invitation accepted",
    description:
      "A survivor and carer link was successfully accepted.",
    details:
      "The invitation associated with participant S-001 was accepted and the linked-carer relationship is now active.",
    category: "Invitation",
    participantId: "S-001",
    dateLabel: "27 Jun 2026",
    dateIso: "2026-06-27T10:30:00Z",
    severity: "Information",
    status: "Unread",
    relatedHref: "/admin/survivors/s-001",
    relatedLabel: "View linked survivor",
  },
  {
    id: "notification-012",
    title: "Exercise asset requires review",
    description:
      "An exercise media asset is unavailable in the prototype library.",
    details:
      "One demonstration or illustration asset could not be resolved. The exercise catalogue should be reviewed before public deployment.",
    category: "System",
    participantId: "System",
    dateLabel: "27 Jun 2026",
    dateIso: "2026-06-27T08:15:00Z",
    severity: "Attention",
    status: "Read",
    relatedHref: "/admin/exercises",
    relatedLabel: "View exercises",
  },
];

export function getAdminNotifications(): AdminNotification[] {
  return adminNotifications;
}