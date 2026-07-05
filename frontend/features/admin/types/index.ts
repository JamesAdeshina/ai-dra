export type AdminMetricIcon =
  | "survivors"
  | "carers"
  | "active-users"
  | "completed-sessions"
  | "ended-early"
  | "invitations"
  | "difficulty"
  | "inactive";

export type AdminMetricTone =
  | "purple"
  | "green"
  | "blue"
  | "amber"
  | "red"
  | "teal";

export type AdminDashboardMetric = {
  id: string;
  label: string;
  value: string;
  helper: string;
  icon: AdminMetricIcon;
  tone: AdminMetricTone;
};

export type AdminTrendPoint = {
  label: string;
  sessionsStarted: number;
  sessionsCompleted: number;
  activeSurvivors: number;
};

export type AdminSessionStatus = {
  label: string;
  value: number;
  colour: string;
};

export type AdminActivityStatus =
  | "Completed"
  | "Ended Early"
  | "Pending"
  | "Accepted"
  | "Registered";

export type AdminActivityItem = {
  id: string;
  date: string;
  participant: string;
  activity: string;
  detail: string;
  status: AdminActivityStatus;
};

export type AdminAttentionLevel =
  | "Information"
  | "Attention"
  | "Important";

export type AdminAttentionItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  level: AdminAttentionLevel;
};

export type SurvivorOnboardingStatus =
  | "Complete"
  | "In Progress"
  | "Not Started";

export type SurvivorEngagementStatus =
  | "High"
  | "Moderate"
  | "Low"
  | "Inactive"
  | "Not Started";

export type SurvivorAccountStatus =
  | "Active"
  | "Inactive"
  | "Pending";

export type SurvivorLinkStatus =
  | "Linked"
  | "Invitation Pending"
  | "Not Linked";

export type SurvivorSupportStatus =
  | "On Track"
  | "Needs Support"
  | "No Recent Activity"
  | "Difficulty Reported"
  | "Not Assessed";

export type AdminSurvivorSummary = {
  id: string;
  participantId: string;
  name: string;
  email: string;
  initials: string;
  joinedDate: string;
  onboardingStatus: SurvivorOnboardingStatus;
  linkStatus: SurvivorLinkStatus;
  linkedCarerName: string | null;
  sessions: number;
  lastActive: string;
  engagementStatus: SurvivorEngagementStatus;
  accountStatus: SurvivorAccountStatus;
  supportStatus: SurvivorSupportStatus;
};

export type AdminExerciseBreakdown = {
  id: string;
  exercise: string;
  sessions: number;
  completedRepetitions: number | null;
  lastAttempted: string;
};

export type AdminSurvivorSession = {
  id: string;
  date: string;
  exercise: string;
  status: "Completed" | "Ended Early" | "Paused";
  duration: string | null;
  completedRepetitions: number | null;
};

export type AdminSurvivorDetail = AdminSurvivorSummary & {
  registeredOn: string;
  affectedSide: string | null;
  completedSessions: number | null;
  endedEarlySessions: number | null;
  pausedSessions: number | null;
  totalExercisesAttempted: number | null;
  totalCompletedRepetitions: number | null;
  averageSessionDuration: string | null;
  difficultyFlags: number | null;
  exerciseBreakdown: AdminExerciseBreakdown[];
  recentSessions: AdminSurvivorSession[];
  linkAcceptedDate: string | null;
  invitationStatus:
    | "Accepted"
    | "Pending"
    | "Not Available";
  invitationSentDate: string | null;
};