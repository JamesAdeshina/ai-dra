import { StreakCard } from "./streak-card";
import { TodaysSessionCard } from "./todays-session-card";
import { WeeklyProgressCard } from "./weekly-progress-card";
import { WelcomeSection } from "./welcome-section";

export function DashboardView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex items-center">
          <WelcomeSection />
        </div>

        <WeeklyProgressCard completed={3} total={5} />
        <StreakCard days={23} />
      </div>

      <TodaysSessionCard />
    </div>
  );
}