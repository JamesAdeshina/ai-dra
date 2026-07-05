import type {
  AdminSessionDetail,
  AdminSessionSummary,
} from "@/features/admin/types/admin-session";

export const adminSessions: AdminSessionSummary[] = [
  {
    id: "session-001",
    participantId: "S-001",
    exerciseId: "target-touch",
    exerciseName: "Target Touch",
    date: "3 Jul 2026",
    time: "10:42 AM",
    dateIso: "2026-07-03T10:42:00",
    status: "Completed",
    durationLabel: "7 min",
    durationSeconds: 435,
    targetRepetitions: 10,
    completedRepetitions: 10,
    difficulty: "None Reported",
  },
  {
    id: "session-002",
    participantId: "S-004",
    exerciseId: "lift-and-place",
    exerciseName: "Lift and Place",
    date: "2 Jul 2026",
    time: "04:18 PM",
    dateIso: "2026-07-02T16:18:00",
    status: "Ended Early",
    durationLabel: "3 min",
    durationSeconds: 198,
    targetRepetitions: 10,
    completedRepetitions: 4,
    difficulty: "Difficulty Reported",
  },
  {
    id: "session-003",
    participantId: "S-006",
    exerciseId: "grasp-and-hold",
    exerciseName: "Grasp and Hold",
    date: "2 Jul 2026",
    time: "09:05 AM",
    dateIso: "2026-07-02T09:05:00",
    status: "Completed",
    durationLabel: "6 min",
    durationSeconds: 372,
    targetRepetitions: 8,
    completedRepetitions: 8,
    difficulty: "None Reported",
  },
  {
    id: "session-004",
    participantId: "S-001",
    exerciseId: "shoulder-flexion",
    exerciseName: "Shoulder Flexion",
    date: "1 Jul 2026",
    time: "03:20 PM",
    dateIso: "2026-07-01T15:20:00",
    status: "Paused",
    durationLabel: "5 min",
    durationSeconds: 301,
    targetRepetitions: 10,
    completedRepetitions: 6,
    difficulty: "Not Assessed",
  },
  {
    id: "session-005",
    participantId: "S-008",
    exerciseId: "target-touch",
    exerciseName: "Target Touch",
    date: "1 Jul 2026",
    time: "11:12 AM",
    dateIso: "2026-07-01T11:12:00",
    status: "Active",
    durationLabel: "2 min",
    durationSeconds: 128,
    targetRepetitions: 10,
    completedRepetitions: 2,
    difficulty: "Not Assessed",
  },
  {
    id: "session-006",
    participantId: "S-003",
    exerciseId: "wrist-extension",
    exerciseName: "Wrist Extension",
    date: "30 Jun 2026",
    time: "02:30 PM",
    dateIso: "2026-06-30T14:30:00",
    status: "Completed",
    durationLabel: "6 min",
    durationSeconds: 366,
    targetRepetitions: 9,
    completedRepetitions: 9,
    difficulty: "None Reported",
  },
  {
    id: "session-007",
    participantId: "S-004",
    exerciseId: "grasp-and-hold",
    exerciseName: "Grasp and Hold",
    date: "30 Jun 2026",
    time: "10:15 AM",
    dateIso: "2026-06-30T10:15:00",
    status: "Ended Early",
    durationLabel: "4 min",
    durationSeconds: 249,
    targetRepetitions: 10,
    completedRepetitions: 3,
    difficulty: "Difficulty Reported",
  },
  {
    id: "session-008",
    participantId: "S-007",
    exerciseId: "lift-and-place",
    exerciseName: "Lift and Place",
    date: "29 Jun 2026",
    time: "05:45 PM",
    dateIso: "2026-06-29T17:45:00",
    status: "Completed",
    durationLabel: "8 min",
    durationSeconds: 487,
    targetRepetitions: 12,
    completedRepetitions: 12,
    difficulty: "None Reported",
  },
  {
    id: "session-009",
    participantId: "S-002",
    exerciseId: "shoulder-abduction",
    exerciseName: "Shoulder Abduction",
    date: "29 Jun 2026",
    time: "09:32 AM",
    dateIso: "2026-06-29T09:32:00",
    status: "Active",
    durationLabel: "3 min",
    durationSeconds: 194,
    targetRepetitions: 10,
    completedRepetitions: 3,
    difficulty: "Not Assessed",
  },
  {
    id: "session-010",
    participantId: "S-009",
    exerciseId: "cup-to-shelf",
    exerciseName: "Cup to Shelf",
    date: "28 Jun 2026",
    time: "04:11 PM",
    dateIso: "2026-06-28T16:11:00",
    status: "Completed",
    durationLabel: "7 min",
    durationSeconds: 424,
    targetRepetitions: 11,
    completedRepetitions: 11,
    difficulty: "None Reported",
  },
];

const targetTouchDetail: AdminSessionDetail = {
  ...adminSessions[0],

  startTime: "3 Jul 2026, 10:42 AM",
  endTime: "3 Jul 2026, 10:49 AM",

  totalAttempts: 10,
  successfulRepetitions: 10,
  failedAttempts: 0,
  incompleteAttempts: 0,

  holdRequirement: "1 sec",
  armMode: "Auto",
  performedSide: "Right",

  accuracy: null,
  movementScore: null,
  speedSummary: null,

  recentAttempts: [
    {
      id: "attempt-001",
      attemptNumber: 1,
      time: "10:42:30 AM",
      result: "Successful",
      holdTime: "1.2 sec",
      notes: "Good hold",
    },
    {
      id: "attempt-002",
      attemptNumber: 2,
      time: "10:43:05 AM",
      result: "Successful",
      holdTime: "1.1 sec",
      notes: "Good hold",
    },
    {
      id: "attempt-003",
      attemptNumber: 3,
      time: "10:43:40 AM",
      result: "Successful",
      holdTime: "1.3 sec",
      notes: "Good hold",
    },
    {
      id: "attempt-004",
      attemptNumber: 4,
      time: "10:44:17 AM",
      result: "Successful",
      holdTime: "1.0 sec",
      notes: "Hold requirement met",
    },
    {
      id: "attempt-005",
      attemptNumber: 5,
      time: "10:44:53 AM",
      result: "Successful",
      holdTime: "1.4 sec",
      notes: "Good hold",
    },
  ],
};

export function getAdminSessions(): AdminSessionSummary[] {
  return adminSessions;
}

export function getAdminSessionById(
  sessionId: string
): AdminSessionDetail | null {
  const normalisedId = sessionId.toLowerCase();

  if (normalisedId === targetTouchDetail.id) {
    return targetTouchDetail;
  }

  const session = adminSessions.find(
    (item) => item.id === normalisedId
  );

  if (!session) {
    return null;
  }

  return {
    ...session,

    startTime: `${session.date}, ${session.time}`,
    endTime:
      session.status === "Active"
        ? null
        : "Not Available Yet",

    totalAttempts: null,
    successfulRepetitions: null,
    failedAttempts: null,
    incompleteAttempts: null,

    holdRequirement: null,
    armMode: null,
    performedSide: null,

    accuracy: null,
    movementScore: null,
    speedSummary: null,

    recentAttempts: [],
  };
}