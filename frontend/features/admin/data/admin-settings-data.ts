
import type {
  AdminProfileSettings,
  AdminSecurityDevice,
  AdminSecuritySettings,
  AdminSettingsCategory,
  AdminEngagementSettings,
  AdminNotificationPreferences,
  AdminPrivacySettings,
  AdminSystemService,
} from "@/features/admin/types/admin-settings";


export const adminSettingsCategories: AdminSettingsCategory[] = [
  {
    id: "profile",
    position: 1,
    title: "Admin Profile",
    description:
      "View and update your personal information and profile preferences.",
    actionLabel: "Manage Profile",
    href: "/admin/settings/profile",
    icon: "profile",
    tone: "purple",
  },
  {
    id: "security",
    position: 2,
    title: "Account & Security",
    description:
      "Review password options, account protection and signed-in devices.",
    actionLabel: "Manage Security",
    href: "/admin/settings/security",
    icon: "security",
    tone: "blue",
  },
  {
    id: "notifications",
    position: 3,
    title: "Notification Preferences",
    description:
      "Choose how and when you want to receive platform notifications.",
    actionLabel: "Manage Notifications",
    href: "/admin/settings/notifications",
    icon: "notifications",
    tone: "pink",
  },
  {
    id: "engagement",
    position: 4,
    title: "Engagement Settings",
    description:
      "Configure reminders, engagement features and communication defaults.",
    actionLabel: "Manage Engagement",
    href: "/admin/settings/engagement",
    icon: "engagement",
    tone: "green",
  },
  {
    id: "privacy",
    position: 5,
    title: "Privacy & Data Access",
    description:
      "Review data-access controls, consent options and retention preferences.",
    actionLabel: "Manage Privacy",
    href: "/admin/settings/privacy",
    icon: "privacy",
    tone: "orange",
  },
  {
    id: "export",
    position: 6,
    title: "Data Export",
    description:
      "Prepare platform data selections for reporting, analysis or backup.",
    actionLabel: "Export Data",
    href: "/admin/settings/export",
    icon: "export",
    tone: "cyan",
  },
  {
    id: "system",
    position: 7,
    title: "System Information",
    description:
      "View platform configuration, connected services and deployment details.",
    actionLabel: "View System Info",
    href: "/admin/settings/system",
    icon: "system",
    tone: "purple",
  },
];

export function getAdminSettingsCategories(): AdminSettingsCategory[] {
  return adminSettingsCategories;
}

export const defaultAdminProfileSettings: AdminProfileSettings = {
  fullName: "James Adeshina",
  role: "Project Lead",
  email: "james.adeshina@derby.ac.uk",
  phoneNumber: "",
  department: "AI-DRA Research Team",
  location: "University of Derby, UK",
  bio: "Leading the AI-DRA project to develop an intelligent rehabilitation platform that supports stroke survivors and their carers.",
  languages: ["English", "Yoruba"],
  timezone: "Europe/London",
  preferredLanguage: "English",
  darkMode: false,
  profileImageDataUrl: null,
};

export const defaultAdminSecuritySettings: AdminSecuritySettings = {
  loginAlertsEnabled: true,
};

export const adminSecurityDevices: AdminSecurityDevice[] = [
  {
    id: "device-001",
    device: "Windows Computer",
    browser: "Chrome",
    location: "United Kingdom",
    ipAddress: "Not collected in prototype",
    lastActive: "Current browser session",
    isCurrent: true,
  },
  {
    id: "device-002",
    device: "Mobile Device",
    browser: "Safari",
    location: "Demo record",
    ipAddress: "Not available",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "device-003",
    device: "Laptop",
    browser: "Chrome",
    location: "Demo record",
    ipAddress: "Not available",
    lastActive: "Yesterday",
    isCurrent: false,
  },
];

export const defaultAdminNotificationPreferences: AdminNotificationPreferences =
  {
    channels: {
      email: true,
      inApp: true,
      sms: false,
    },

    items: [
      {
        id: "new-survivor",
        title: "New Survivor Registrations",
        description:
          "When a new survivor account is created.",
        email: true,
        inApp: true,
        sms: false,
      },
      {
        id: "new-carer",
        title: "New Carer Registrations",
        description:
          "When a new carer account is created.",
        email: true,
        inApp: true,
        sms: false,
      },
      {
        id: "invitations",
        title: "Invitation Updates",
        description:
          "When invitations are sent, accepted, declined or expire.",
        email: true,
        inApp: true,
        sms: false,
      },
      {
        id: "sessions",
        title: "Session Updates",
        description:
          "Session completions, pauses and early endings.",
        email: true,
        inApp: true,
        sms: false,
      },
      {
        id: "engagement",
        title: "Engagement Alerts",
        description:
          "When platform activity may require attention.",
        email: true,
        inApp: true,
        sms: false,
      },
      {
        id: "system",
        title: "System Alerts",
        description:
          "Important integration and platform warnings.",
        email: true,
        inApp: true,
        sms: false,
      },
      {
        id: "weekly-report",
        title: "Weekly Reports",
        description:
          "Summary of engagement and rehabilitation activity.",
        email: true,
        inApp: false,
        sms: false,
      },
    ],

    quietHoursEnabled: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    digestFrequency: "Weekly",
    digestIncludes: [
      "Survivor progress summaries",
      "Session activity highlights",
      "Engagement insights",
      "System updates",
    ],
  };

export const defaultAdminEngagementSettings: AdminEngagementSettings =
  {
    streakTracking: true,
    achievementBadges: true,
    progressCelebration: true,
    weeklyGoalReminders: true,
    carerLeaderboard: false,
    motivationalMessages: true,
    activityNudges: true,

    inactivityNudgeDays: "2 days",
    missedSessionReminderHours: "24 hours",
    weeklySummaryDay: "Monday",

    defaultWeeklyGoal: 3,
    milestoneEvery: "5 sessions",
  };

export const defaultAdminPrivacySettings: AdminPrivacySettings =
  {
    collectUsageAnalytics: true,
    collectSessionData: true,
    collectCameraData: true,
    shareResearchData: false,
    thirdPartyIntegrations: false,

    restrictSurvivorAccess: true,
    auditDataAccess: true,
    approveExportRequests: true,

    accountRetention: "Until account deletion",
    sessionRetention: "2 years",
    analyticsRetention: "3 years",
    deletedDataRetention: "Delete after 30 days",
    dataRegion: "United Kingdom",
  };

export const adminSystemServices: AdminSystemService[] = [
  {
    id: "frontend",
    name: "Web Application",
    description:
      "Next.js administrator and participant interfaces.",
    status: "Available",
  },
  {
    id: "database",
    name: "Database",
    description:
      "Supabase PostgreSQL connection and data storage.",
    status: "Not Verified",
  },
  {
    id: "authentication",
    name: "Authentication",
    description:
      "Supabase authentication and administrator access controls.",
    status: "Not Verified",
  },
  {
    id: "storage",
    name: "File Storage",
    description:
      "Exercise illustrations, videos and profile images.",
    status: "Not Verified",
  },
  {
    id: "email",
    name: "Email Delivery",
    description:
      "Transactional email delivery through Resend.",
    status: "Not Connected",
  },
  {
    id: "analytics",
    name: "Analytics Interface",
    description:
      "Frontend engagement and monitoring visualisations.",
    status: "Available",
  },
];