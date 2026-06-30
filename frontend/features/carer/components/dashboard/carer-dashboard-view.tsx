import {
  connectedSurvivors,
  dashboardStats,
  recentActivities,
  upcomingReminders,
  weeklyProgress,
} from "@/features/carer/data/carer-dashboard-data";

import { DashboardFilters } from "./dashboard-filters";
import { DashboardSummary } from "./dashboard-summary";
import { RecentActivityCard } from "./recent-activity-card";
import { SurvivorOverviewCard } from "./survivor-overview-card";
import { UpcomingRemindersCard } from "./upcoming-reminders-card";
import { WeeklyProgressCard } from "./weekly-progress-card";

export function CarerDashboardView() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_336px]">
          <div className="min-w-0 space-y-4">
            <DashboardFilters />
            <DashboardSummary stats={dashboardStats} />
            <SurvivorOverviewCard survivors={connectedSurvivors} />
            <WeeklyProgressCard points={weeklyProgress} />
          </div>

          <aside className="space-y-4">
            <UpcomingRemindersCard reminders={upcomingReminders} />
            <RecentActivityCard activities={recentActivities} />
          </aside>
        </div>
      </div>
    </div>
  );
}
