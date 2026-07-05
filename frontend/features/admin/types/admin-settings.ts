export type AdminSettingsCategoryId =
  | "profile"
  | "security"
  | "notifications"
  | "engagement"
  | "privacy"
  | "export"
  | "system";

export type AdminSettingsIconName =
  | "profile"
  | "security"
  | "notifications"
  | "engagement"
  | "privacy"
  | "export"
  | "system";

export type AdminSettingsTone =
  | "purple"
  | "blue"
  | "pink"
  | "green"
  | "orange"
  | "cyan";

export type AdminSettingsCategory = {
  id: AdminSettingsCategoryId;
  position: number;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  icon: AdminSettingsIconName;
  tone: AdminSettingsTone;
};

export type AdminSettingsBreadcrumbItem = {
  label: string;
  href?: string;
};

export type AdminSettingsNoticeTone =
  | "info"
  | "success"
  | "warning"
  | "danger";

export type AdminProfileSettings = {
  fullName: string;
  role: string;
  email: string;
  phoneNumber: string;
  department: string;
  location: string;
  bio: string;
  languages: string[];
  timezone: string;
  preferredLanguage: string;
  darkMode: boolean;
  profileImageDataUrl: string | null;
};

export type AdminSecuritySettings = {
  loginAlertsEnabled: boolean;
};

export type AdminSecurityDevice = {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
};

export type AdminNotificationPreferenceItem = {
  id: string;
  title: string;
  description: string;
  email: boolean;
  inApp: boolean;
  sms: boolean;
};

export type AdminNotificationPreferences = {
  channels: {
    email: boolean;
    inApp: boolean;
    sms: boolean;
  };
  items: AdminNotificationPreferenceItem[];
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  digestFrequency: "Never" | "Daily" | "Weekly" | "Monthly";
  digestIncludes: string[];
};

export type AdminEngagementSettings = {
  streakTracking: boolean;
  achievementBadges: boolean;
  progressCelebration: boolean;
  weeklyGoalReminders: boolean;
  carerLeaderboard: boolean;
  motivationalMessages: boolean;
  activityNudges: boolean;

  inactivityNudgeDays: string;
  missedSessionReminderHours: string;
  weeklySummaryDay: string;

  defaultWeeklyGoal: number;
  milestoneEvery: string;
};

export type AdminPrivacySettings = {
  collectUsageAnalytics: boolean;
  collectSessionData: boolean;
  collectCameraData: boolean;
  shareResearchData: boolean;
  thirdPartyIntegrations: boolean;

  restrictSurvivorAccess: boolean;
  auditDataAccess: boolean;
  approveExportRequests: boolean;

  accountRetention: string;
  sessionRetention: string;
  analyticsRetention: string;
  deletedDataRetention: string;
  dataRegion: string;
};

export type AdminExportFormat =
  | "CSV"
  | "XLSX"
  | "JSON";

export type AdminExportSettings = {
  categories: string[];
  datePreset: string;
  startDate: string;
  endDate: string;
  format: AdminExportFormat;
};

export type AdminPreparedExport = {
  id: string;
  name: string;
  createdAt: string;
  format: AdminExportFormat;
  categories: string[];
  range: string;
  status: "Prepared";
};

export type AdminSystemServiceStatus =
  | "Available"
  | "Not Verified"
  | "Not Connected";

export type AdminSystemService = {
  id: string;
  name: string;
  description: string;
  status: AdminSystemServiceStatus;
};