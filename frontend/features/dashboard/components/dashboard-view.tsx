import { PushNotificationPreview } from "./push-notification-preview";
import { StreakCard } from "./streak-card";
import { TodaysSessionCard } from "./todays-session-card";
import { WeeklyProgressCard } from "./weekly-progress-card";
import { WelcomeSection } from "./welcome-section";

import type {
  DashboardData,
} from "@/features/dashboard/types/dashboard-types";

type DashboardViewProps = {
  dashboardData: DashboardData;
};

export function DashboardView({
  dashboardData,
}: DashboardViewProps) {
  const previewNotification =
    dashboardData.notifications[0] ?? null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex items-center">
          <WelcomeSection />
        </div>

        <WeeklyProgressCard
          completed={
            dashboardData.weeklyCompleted
          }
          total={
            dashboardData.weeklyTarget
          }
        />

        <StreakCard
          days={
            dashboardData.currentStreak
          }
        />
      </div>

      <TodaysSessionCard
        exercise={
          dashboardData.suggestedExercise
        }
      />

      <PushNotificationPreview
        notification={
          previewNotification
        }
      />
    </div>
  );
}
