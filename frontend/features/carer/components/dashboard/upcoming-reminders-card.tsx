import Link from "next/link";
import { Bell } from "lucide-react";

import type { CarerReminder } from "@/features/carer/types";

type UpcomingRemindersCardProps = {
  reminders: CarerReminder[];
};

export function UpcomingRemindersCard({
  reminders,
}: UpcomingRemindersCardProps) {
  return (
    <section className="rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="flex items-center justify-between border-b border-[#EEEAE6] px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F0F8] text-[#592EBD]">
            <Bell size={18} />
          </span>
          <h2 className="font-semibold text-[#332E2B]">Upcoming Reminders</h2>
        </div>
        <Link
          href="/carer/notifications"
          className="text-xs font-semibold text-[#4C7BFF] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-[#F0ECE8] px-4">
        {reminders.map((reminder) => (
          <article key={reminder.id} className="flex gap-3 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F2FA] text-[11px] font-bold text-[#592EBD]">
              {reminder.iconLabel}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-5 text-[#3B3633]">
                {reminder.survivorName}
                {reminder.title !== "Summary will be ready" &&
                  ` – ${reminder.title}`}
              </p>
              <p className="mt-0.5 text-xs leading-5 text-[#817A75]">
                {reminder.subtitle}
              </p>
            </div>

            <time className="shrink-0 pt-0.5 text-xs text-[#817A75]">
              {reminder.timeLabel}
            </time>
          </article>
        ))}
      </div>
    </section>
  );
}
