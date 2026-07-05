import type {
  AdminSurvivorDetail,
  AdminSurvivorSummary,
} from "@/features/admin/types";

export const adminSurvivors: AdminSurvivorSummary[] = [
  {
    id: "s-001",
    participantId: "S-001",
    name: "William Carter",
    email: "william.carter@example.com",
    initials: "WC",
    joinedDate: "15 Feb 2026",
    onboardingStatus: "Complete",
    linkStatus: "Linked",
    linkedCarerName: "Priya Shah",
    sessions: 8,
    lastActive: "Today",
    engagementStatus: "High",
    accountStatus: "Active",
    supportStatus: "On Track",
  },
  {
    id: "s-002",
    participantId: "S-002",
    name: "James Wilson",
    email: "james.wilson@example.com",
    initials: "JW",
    joinedDate: "02 Mar 2026",
    onboardingStatus: "Complete",
    linkStatus: "Not Linked",
    linkedCarerName: null,
    sessions: 2,
    lastActive: "8 days ago",
    engagementStatus: "Low",
    accountStatus: "Inactive",
    supportStatus: "No Recent Activity",
  },
  {
    id: "s-003",
    participantId: "S-003",
    name: "Sarah Thompson",
    email: "sarah.thompson@example.com",
    initials: "ST",
    joinedDate: "18 Mar 2026",
    onboardingStatus: "In Progress",
    linkStatus: "Invitation Pending",
    linkedCarerName: null,
    sessions: 1,
    lastActive: "5 days ago",
    engagementStatus: "Moderate",
    accountStatus: "Active",
    supportStatus: "Not Assessed",
  },
  {
    id: "s-004",
    participantId: "S-004",
    name: "David Brown",
    email: "david.brown@example.com",
    initials: "DB",
    joinedDate: "22 Mar 2026",
    onboardingStatus: "Complete",
    linkStatus: "Linked",
    linkedCarerName: "Daniel Reed",
    sessions: 6,
    lastActive: "Yesterday",
    engagementStatus: "High",
    accountStatus: "Active",
    supportStatus: "On Track",
  },
  {
    id: "s-005",
    participantId: "S-005",
    name: "Margaret Evans",
    email: "margaret.evans@example.com",
    initials: "ME",
    joinedDate: "05 Apr 2026",
    onboardingStatus: "Complete",
    linkStatus: "Not Linked",
    linkedCarerName: null,
    sessions: 0,
    lastActive: "14 days ago",
    engagementStatus: "Inactive",
    accountStatus: "Inactive",
    supportStatus: "No Recent Activity",
  },
  {
    id: "s-006",
    participantId: "S-006",
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    initials: "RT",
    joinedDate: "12 Apr 2026",
    onboardingStatus: "In Progress",
    linkStatus: "Invitation Pending",
    linkedCarerName: null,
    sessions: 0,
    lastActive: "Never",
    engagementStatus: "Not Started",
    accountStatus: "Pending",
    supportStatus: "Not Assessed",
  },
  {
    id: "s-007",
    participantId: "S-007",
    name: "Linda Johnson",
    email: "linda.johnson@example.com",
    initials: "LJ",
    joinedDate: "25 Apr 2026",
    onboardingStatus: "Complete",
    linkStatus: "Linked",
    linkedCarerName: "Priya Shah",
    sessions: 3,
    lastActive: "3 days ago",
    engagementStatus: "Moderate",
    accountStatus: "Active",
    supportStatus: "On Track",
  },
  {
    id: "s-008",
    participantId: "S-008",
    name: "Michael Lee",
    email: "michael.lee@example.com",
    initials: "ML",
    joinedDate: "09 May 2026",
    onboardingStatus: "Not Started",
    linkStatus: "Not Linked",
    linkedCarerName: null,
    sessions: 0,
    lastActive: "Never",
    engagementStatus: "Not Started",
    accountStatus: "Pending",
    supportStatus: "Not Assessed",
  },
  {
    id: "s-009",
    participantId: "S-009",
    name: "Patricia White",
    email: "patricia.white@example.com",
    initials: "PW",
    joinedDate: "21 May 2026",
    onboardingStatus: "Complete",
    linkStatus: "Linked",
    linkedCarerName: "Emily Lewis",
    sessions: 7,
    lastActive: "Today",
    engagementStatus: "High",
    accountStatus: "Active",
    supportStatus: "On Track",
  },
  {
    id: "s-010",
    participantId: "S-010",
    name: "Christopher Hall",
    email: "christopher.hall@example.com",
    initials: "CH",
    joinedDate: "03 Jun 2026",
    onboardingStatus: "Complete",
    linkStatus: "Not Linked",
    linkedCarerName: null,
    sessions: 1,
    lastActive: "9 days ago",
    engagementStatus: "Low",
    accountStatus: "Inactive",
    supportStatus: "Needs Support",
  },
];

const williamCarterDetail: AdminSurvivorDetail = {
  ...adminSurvivors[0],
  registeredOn: "15 Feb 2026",
  affectedSide: "Not Available Yet",
  completedSessions: 6,
  endedEarlySessions: 2,
  pausedSessions: 1,
  totalExercisesAttempted: 6,
  totalCompletedRepetitions: 98,
  averageSessionDuration: "6 min 24 sec",
  difficultyFlags: 1,
  exerciseBreakdown: [
    {
      id: "exercise-1",
      exercise: "Target Touch",
      sessions: 5,
      completedRepetitions: 42,
      lastAttempted: "2 Jul 2026",
    },
    {
      id: "exercise-2",
      exercise: "Grasp and Hold",
      sessions: 2,
      completedRepetitions: 16,
      lastAttempted: "29 Jun 2026",
    },
    {
      id: "exercise-3",
      exercise: "Lift and Place",
      sessions: 3,
      completedRepetitions: 24,
      lastAttempted: "1 Jul 2026",
    },
    {
      id: "exercise-4",
      exercise: "Hand Function Task",
      sessions: 2,
      completedRepetitions: 12,
      lastAttempted: "28 Jun 2026",
    },
    {
      id: "exercise-5",
      exercise: "Buttoning and Fastening",
      sessions: 1,
      completedRepetitions: 4,
      lastAttempted: "25 Jun 2026",
    },
    {
      id: "exercise-6",
      exercise: "Wrist Extension",
      sessions: 1,
      completedRepetitions: 0,
      lastAttempted: "15 Jun 2026",
    },
  ],
  recentSessions: [
    {
      id: "session-1",
      date: "2 Jul 2026",
      exercise: "Target Touch",
      status: "Completed",
      duration: "7 min",
      completedRepetitions: 10,
    },
    {
      id: "session-2",
      date: "29 Jun 2026",
      exercise: "Grasp and Hold",
      status: "Ended Early",
      duration: "3 min",
      completedRepetitions: 4,
    },
    {
      id: "session-3",
      date: "27 Jun 2026",
      exercise: "Lift and Place",
      status: "Completed",
      duration: "6 min",
      completedRepetitions: 8,
    },
    {
      id: "session-4",
      date: "25 Jun 2026",
      exercise: "Target Touch",
      status: "Completed",
      duration: "7 min",
      completedRepetitions: 10,
    },
    {
      id: "session-5",
      date: "22 Jun 2026",
      exercise: "Hand Function Task",
      status: "Paused",
      duration: "4 min",
      completedRepetitions: 6,
    },
  ],
  linkAcceptedDate: "15 Feb 2026",
  invitationStatus: "Accepted",
  invitationSentDate: "14 Feb 2026",
};

export function getAdminSurvivors(): AdminSurvivorSummary[] {
  return adminSurvivors;
}

export function getAdminSurvivorById(
  survivorId: string
): AdminSurvivorDetail | null {
  const normalisedId = survivorId.toLowerCase();

  if (normalisedId === williamCarterDetail.id) {
    return williamCarterDetail;
  }

  const survivor = adminSurvivors.find(
    (item) => item.id === normalisedId
  );

  if (!survivor) {
    return null;
  }

  return {
    ...survivor,
    registeredOn: survivor.joinedDate,
    affectedSide: null,
    completedSessions: null,
    endedEarlySessions: null,
    pausedSessions: null,
    totalExercisesAttempted: null,
    totalCompletedRepetitions: null,
    averageSessionDuration: null,
    difficultyFlags: null,
    exerciseBreakdown: [],
    recentSessions: [],
    linkAcceptedDate:
      survivor.linkStatus === "Linked"
        ? "Not Available Yet"
        : null,
    invitationStatus:
      survivor.linkStatus === "Linked"
        ? "Accepted"
        : survivor.linkStatus === "Invitation Pending"
          ? "Pending"
          : "Not Available",
    invitationSentDate:
      survivor.linkStatus === "Invitation Pending"
        ? "Not Available Yet"
        : null,
  };
}