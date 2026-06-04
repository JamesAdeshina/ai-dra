import { QuickActionsCard } from "./quick-actions-card";
import { StreakCard } from "./streak-card";
import { TodaysSessionCard } from "./todays-session-card";
import { WeeklyProgressCard } from "./weekly-progress-card";
import { WelcomeSection } from "./welcome-section";

export function DashboardView() {
  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-2 items-start gap-8">
        <WelcomeSection />
        <TodaysSessionCard />
      </div>

      <div className="grid grid-cols-3 gap-8">
        <WeeklyProgressCard completed={0} total={5} />
        <StreakCard days={0} />
        <QuickActionsCard />
      </div>
    </div>
  );
}