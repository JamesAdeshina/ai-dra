import type { AdminCarerSummary } from "@/features/admin/types/admin-carer";
import type { AdminExerciseSummary } from "@/features/admin/types/admin-exercise";
import type { AdminInvitation } from "@/features/admin/types/admin-invitation";
import type {
  AdminSessionStatus,
  AdminSessionSummary,
} from "@/features/admin/types/admin-session";
import type { AdminSurvivorSummary } from "@/features/admin/types";

export type AdminAnalyticsDateRange =
  | "Last 7 Days"
  | "Last 30 Days"
  | "Last 90 Days"
  | "All Time";

export type AdminAnalyticsSessionStatus =
  | AdminSessionStatus
  | "All";

export type AdminAnalyticsDataset = {
  survivors: AdminSurvivorSummary[];
  carers: AdminCarerSummary[];
  sessions: AdminSessionSummary[];
  exercises: AdminExerciseSummary[];
  invitations: AdminInvitation[];
};

export type AdminAnalyticsPoint = {
  label: string;
  value: number;
};

export type AdminAnalyticsExerciseSegment = {
  label: string;
  value: number;
  percentage: number;
  colour: string;
};

export type AdminAnalyticsHeatmapCell = {
  day: string;
  time: string;
  value: number;
};