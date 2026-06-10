import { ReminderNotificationCard } from "./reminder-notification-card";
import { ReminderSettingsCard } from "./reminder-settings-card";
import { TipsCard } from "./tips-card";
import { WeeklyProgressCard } from "./weekly-progress-card";

type RemindersViewProps = {
  hasData?: boolean;
};

export function RemindersView({ hasData = false }: RemindersViewProps) {
  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-[40px] font-bold text-[#1E1E1E]">Reminders</h1>
        <p className="mt-1 text-[20px] text-[#1E1E1E]">
          Manage rehabilitation reminders and notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-2xl bg-white p-6">
            <div>
              <p className="font-medium text-[#1E1E1E]">Enable Reminders</p>
              <p className="text-sm text-[#9E9E9E]">
                Receive notifications to stay on track
              </p>
            </div>

            <div className="h-7 w-12 rounded-full bg-[#D9D9D9] p-1">
              <div className="h-5 w-5 rounded-full bg-white" />
            </div>
          </div>

          <ReminderSettingsCard />

          <div className="rounded-2xl bg-white p-6">
            <h3 className="text-lg font-semibold">Motivational Reminder</h3>

            <div className="mt-6 space-y-6">
              {["Encouraging Messages", "Weekly Progression Summary"].map(
                (item) => (
                  <div key={item} className="flex items-center justify-between">
                    <p className="font-medium">{item}</p>

                    <div className="h-7 w-12 rounded-full bg-[#D9D9D9] p-1">
                      <div className="h-5 w-5 rounded-full bg-white" />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {hasData && <ReminderNotificationCard />}
          <WeeklyProgressCard />
          <TipsCard />
        </div>
      </div>
    </main>
  );
}