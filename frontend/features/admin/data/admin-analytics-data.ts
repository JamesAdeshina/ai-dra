import { adminCarers } from "@/features/admin/data/admin-carer-data";
import { adminExercises } from "@/features/admin/data/admin-exercise-data";
import { adminInvitations } from "@/features/admin/data/admin-invitation-data";
import { adminSessions } from "@/features/admin/data/admin-session-data";
import { adminSurvivors } from "@/features/admin/data/admin-survivor-data";

import type { AdminAnalyticsDataset } from "@/features/admin/types/admin-analytics";

export function getAdminAnalyticsData(): AdminAnalyticsDataset {
  return {
    survivors: adminSurvivors,
    carers: adminCarers,
    sessions: adminSessions,
    exercises: adminExercises,
    invitations: adminInvitations,
  };
}