import { Bell } from "lucide-react";

export function ReminderNotificationCard() {
  return (
    <div className="rounded-2xl bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5]">
          <Bell className="h-4 w-4 text-[#592EBD]" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#1E1E1E]">
            Time for your exercise session!
          </h3>

          <p className="mt-1 text-sm text-[#9E9E9E]">
            Ready for your next exercise session?
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4 border-t pt-4">
        <div>
          <p className="text-xs text-[#7875FB]">Next Reminder</p>
          <p className="mt-1 text-sm font-medium">Tomorrow</p>
          <p className="text-xs text-[#9E9E9E]">10:00 AM</p>
        </div>

        <div>
          <p className="text-xs text-[#7875FB]">Type</p>
          <p className="mt-1 text-sm font-medium">Exercise Reminder</p>
        </div>

        <div>
          <p className="text-xs text-[#7875FB]">Next Reminder</p>
          <p className="mt-1 text-sm font-medium">Mon - Fri</p>
        </div>
      </div>
    </div>
  );
}