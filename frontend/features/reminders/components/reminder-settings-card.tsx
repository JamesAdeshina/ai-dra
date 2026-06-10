import { Switch } from "@/components/ui/switch";

export function ReminderSettingsCard() {
  return (
    <div className="rounded-2xl bg-white p-6">
      <h3 className="text-lg font-semibold">
        Rehabilitation Reminders
      </h3>

      <div className="mt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Exercise Reminder</p>
            <p className="text-sm text-[#9E9E9E]">
              Every day at 10:00 AM
            </p>
          </div>

          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Break Reminder</p>
            <p className="text-sm text-[#9E9E9E]">
              Every day at 10:00 AM
            </p>
          </div>

          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Evening Reminder</p>
            <p className="text-sm text-[#9E9E9E]">
              Every day at 10:00 AM
            </p>
          </div>

          <Switch />
        </div>
      </div>
    </div>
  );
}