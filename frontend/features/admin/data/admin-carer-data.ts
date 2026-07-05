import type {
  AdminCarerDetail,
  AdminCarerSummary,
} from "@/features/admin/types/admin-carer";

export const adminCarers: AdminCarerSummary[] = [
  {
    id: "c-001",
    name: "Priya Shah",
    email: "priya.shah@email.com",
    initials: "PS",
    avatarUrl: null,
    joinedDate: "15 Feb 2026",
    linkedSurvivors: 2,
    pendingInvitations: 0,
    acceptedLinks: 2,
    lastActive: "Today",
    status: "Active",
    activityGroup: "Recent",
  },
  {
    id: "c-002",
    name: "Daniel Reed",
    email: "daniel.reed@email.com",
    initials: "DR",
    avatarUrl: null,
    joinedDate: "22 Feb 2026",
    linkedSurvivors: 1,
    pendingInvitations: 1,
    acceptedLinks: 1,
    lastActive: "3 days ago",
    status: "Active",
    activityGroup: "Recent",
  },
  {
    id: "c-003",
    name: "Sarah Jones",
    email: "sarah.jones@email.com",
    initials: "SJ",
    avatarUrl: null,
    joinedDate: "4 Mar 2026",
    linkedSurvivors: 0,
    pendingInvitations: 1,
    acceptedLinks: 0,
    lastActive: "12 days ago",
    status: "Inactive",
    activityGroup: "Older",
  },
  {
    id: "c-004",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    initials: "MB",
    avatarUrl: null,
    joinedDate: "11 Mar 2026",
    linkedSurvivors: 1,
    pendingInvitations: 0,
    acceptedLinks: 1,
    lastActive: "5 days ago",
    status: "Active",
    activityGroup: "Recent",
  },
  {
    id: "c-005",
    name: "Emily Lewis",
    email: "emily.lewis@email.com",
    initials: "EL",
    avatarUrl: null,
    joinedDate: "19 Mar 2026",
    linkedSurvivors: 3,
    pendingInvitations: 0,
    acceptedLinks: 3,
    lastActive: "Today",
    status: "Active",
    activityGroup: "Recent",
  },
  {
    id: "c-006",
    name: "Robert Taylor",
    email: "robert.taylor@email.com",
    initials: "RT",
    avatarUrl: null,
    joinedDate: "2 Apr 2026",
    linkedSurvivors: 0,
    pendingInvitations: 2,
    acceptedLinks: 0,
    lastActive: "15 days ago",
    status: "Inactive",
    activityGroup: "Older",
  },
  {
    id: "c-007",
    name: "Laura White",
    email: "laura.white@email.com",
    initials: "LW",
    avatarUrl: null,
    joinedDate: "14 Apr 2026",
    linkedSurvivors: 1,
    pendingInvitations: 0,
    acceptedLinks: 1,
    lastActive: "7 days ago",
    status: "Active",
    activityGroup: "Recent",
  },
  {
    id: "c-008",
    name: "James Walker",
    email: "james.walker@email.com",
    initials: "JW",
    avatarUrl: null,
    joinedDate: "30 Apr 2026",
    linkedSurvivors: 0,
    pendingInvitations: 1,
    acceptedLinks: 0,
    lastActive: "23 days ago",
    status: "Inactive",
    activityGroup: "Older",
  },
  {
    id: "c-009",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    initials: "OM",
    avatarUrl: null,
    joinedDate: "12 May 2026",
    linkedSurvivors: 2,
    pendingInvitations: 0,
    acceptedLinks: 2,
    lastActive: "Yesterday",
    status: "Active",
    activityGroup: "Recent",
  },
  {
    id: "c-010",
    name: "Arun Patel",
    email: "arun.patel@email.com",
    initials: "AP",
    avatarUrl: null,
    joinedDate: "27 May 2026",
    linkedSurvivors: 1,
    pendingInvitations: 0,
    acceptedLinks: 1,
    lastActive: "4 days ago",
    status: "Active",
    activityGroup: "Recent",
  },
];

const priyaShahDetail: AdminCarerDetail = {
  ...adminCarers[0],
  registeredOn: "15 Feb 2026",
  lastActiveDetailed: "Today, 10:42 AM",
  notesCreated: 4,
  linkedSurvivorRecords: [
    {
      id: "link-001",
      participantId: "S-001",
      linkStatus: "Accepted",
      sessions: 8,
      lastActive: "Today",
    },
    {
      id: "link-002",
      participantId: "S-007",
      linkStatus: "Accepted",
      sessions: 3,
      lastActive: "4 days ago",
    },
  ],
  invitationRecords: [
    {
      id: "invitation-001",
      recipientParticipantId: "S-004",
      sentDate: "1 Jul 2026",
      status: "Pending",
      lastUpdated: "1 Jul 2026",
    },
    {
      id: "invitation-002",
      recipientParticipantId: "S-007",
      sentDate: "24 Jun 2026",
      status: "Accepted",
      lastUpdated: "25 Jun 2026",
    },
  ],
  recentActivity: [
    {
      id: "activity-001",
      type: "Progress Viewed",
      description: "Viewed progress for S-001",
      date: "Today, 10:42 AM",
    },
    {
      id: "activity-002",
      type: "Invitation Sent",
      description: "Sent invitation to S-004",
      date: "1 Jul 2026, 09:15 AM",
    },
    {
      id: "activity-003",
      type: "Link Accepted",
      description: "Accepted link request from S-001",
      date: "28 Jun 2026, 02:30 PM",
    },
    {
      id: "activity-004",
      type: "Progress Viewed",
      description: "Viewed progress for S-007",
      date: "28 Jun 2026, 11:05 AM",
    },
    {
      id: "activity-005",
      type: "Settings Updated",
      description: "Updated notification settings",
      date: "25 Jun 2026, 08:45 AM",
    },
  ],
};

export function getAdminCarers(): AdminCarerSummary[] {
  return adminCarers;
}

export function getAdminCarerById(
  carerId: string
): AdminCarerDetail | null {
  const normalisedId = carerId.toLowerCase();

  if (normalisedId === priyaShahDetail.id) {
    return priyaShahDetail;
  }

  const carer = adminCarers.find(
    (item) => item.id === normalisedId
  );

  if (!carer) {
    return null;
  }

  return {
    ...carer,
    registeredOn: carer.joinedDate,
    lastActiveDetailed: carer.lastActive,
    notesCreated: null,
    linkedSurvivorRecords: [],
    invitationRecords: [],
    recentActivity: [],
  };
}