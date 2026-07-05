import type {
  AdminActivityItem,
  AdminAttentionItem,
  AdminDashboardMetric,
  AdminSessionStatus,
  AdminTrendPoint,
} from "@/features/admin/types";

export const adminDashboardMetrics: AdminDashboardMetric[] = [
  {
    id: "registered-survivors",
    label: "Registered Survivors",
    value: "12",
    helper: "2 joined this month",
    icon: "survivors",
    tone: "purple",
  },
  {
    id: "registered-carers",
    label: "Registered Carers",
    value: "8",
    helper: "6 linked accounts",
    icon: "carers",
    tone: "blue",
  },
  {
    id: "active-users",
    label: "Active This Week",
    value: "7",
    helper: "Survivors with recent activity",
    icon: "active-users",
    tone: "teal",
  },
  {
    id: "completed-sessions",
    label: "Completed Sessions",
    value: "24",
    helper: "Within the demo period",
    icon: "completed-sessions",
    tone: "green",
  },
  {
    id: "ended-early",
    label: "Sessions Ended Early",
    value: "3",
    helper: "Requires monitoring",
    icon: "ended-early",
    tone: "red",
  },
  {
    id: "pending-invitations",
    label: "Pending Invitations",
    value: "2",
    helper: "Awaiting a response",
    icon: "invitations",
    tone: "amber",
  },
  {
    id: "difficulty-flags",
    label: "Difficulty Flags",
    value: "4",
    helper: "Reported during sessions",
    icon: "difficulty",
    tone: "amber",
  },
  {
    id: "no-recent-activity",
    label: "No Recent Activity",
    value: "3",
    helper: "No activity in 7 days",
    icon: "inactive",
    tone: "red",
  },
];

export const adminSessionTrend: AdminTrendPoint[] = [
  {
    label: "Mon",
    sessionsStarted: 5,
    sessionsCompleted: 4,
    activeSurvivors: 3,
  },
  {
    label: "Tue",
    sessionsStarted: 7,
    sessionsCompleted: 5,
    activeSurvivors: 4,
  },
  {
    label: "Wed",
    sessionsStarted: 4,
    sessionsCompleted: 4,
    activeSurvivors: 3,
  },
  {
    label: "Thu",
    sessionsStarted: 8,
    sessionsCompleted: 6,
    activeSurvivors: 5,
  },
  {
    label: "Fri",
    sessionsStarted: 6,
    sessionsCompleted: 5,
    activeSurvivors: 4,
  },
  {
    label: "Sat",
    sessionsStarted: 3,
    sessionsCompleted: 2,
    activeSurvivors: 2,
  },
  {
    label: "Sun",
    sessionsStarted: 5,
    sessionsCompleted: 4,
    activeSurvivors: 3,
  },
];

export const adminSessionStatuses: AdminSessionStatus[] = [
  {
    label: "Completed",
    value: 24,
    colour: "#22A765",
  },
  {
    label: "Ended Early",
    value: 3,
    colour: "#F4A623",
  },
  {
    label: "Paused",
    value: 2,
    colour: "#4F8DE8",
  },
  {
    label: "Active",
    value: 1,
    colour: "#6ED8CB",
  },
];

export const adminRecentActivity: AdminActivityItem[] = [
  {
    id: "activity-1",
    date: "03 Jul 2026",
    participant: "S-001",
    activity: "Rehabilitation session",
    detail: "Completed Target Touch",
    status: "Completed",
  },
  {
    id: "activity-2",
    date: "03 Jul 2026",
    participant: "C-003",
    activity: "Invitation accepted",
    detail: "Carer connection accepted",
    status: "Accepted",
  },
  {
    id: "activity-3",
    date: "02 Jul 2026",
    participant: "S-004",
    activity: "Rehabilitation session",
    detail: "Lift and Place ended early",
    status: "Ended Early",
  },
  {
    id: "activity-4",
    date: "02 Jul 2026",
    participant: "S-008",
    activity: "New registration",
    detail: "Survivor onboarding started",
    status: "Registered",
  },
  {
    id: "activity-5",
    date: "01 Jul 2026",
    participant: "C-006",
    activity: "Invitation sent",
    detail: "Awaiting survivor response",
    status: "Pending",
  },
];

export const adminAttentionItems: AdminAttentionItem[] = [
  {
    id: "attention-1",
    title: "Three survivors have no recent activity",
    description:
      "No rehabilitation activity has been recorded during the last seven days.",
    href: "/admin/survivors",
    level: "Attention",
  },
  {
    id: "attention-2",
    title: "Two invitations are awaiting a response",
    description:
      "Review pending invitations and identify any that may require follow-up.",
    href: "/admin/invitations",
    level: "Information",
  },
  {
    id: "attention-3",
    title: "Three sessions ended early",
    description:
      "Review the associated sessions for repeated difficulty or incomplete attempts.",
    href: "/admin/sessions",
    level: "Important",
  },
  {
    id: "attention-4",
    title: "One carer has no linked survivor",
    description:
      "The account is registered but does not currently have an accepted connection.",
    href: "/admin/carers",
    level: "Information",
  },
];