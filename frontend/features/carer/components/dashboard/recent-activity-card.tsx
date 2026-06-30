import Link from "next/link";
import { Check, TrendingUp } from "lucide-react";

import type { CarerActivity } from "@/features/carer/types";

type RecentActivityCardProps = {
  activities: CarerActivity[];
};

export function RecentActivityCard({
  activities,
}: RecentActivityCardProps) {
  return (
    <section className="rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="flex items-center justify-between border-b border-[#EEEAE6] px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F0F8] text-[#592EBD]">
            <TrendingUp size={18} />
          </span>
          <h2 className="font-semibold text-[#332E2B]">Recent Activity</h2>
        </div>
        <Link
          href="/carer/survivors"
          className="text-xs font-semibold text-[#4C7BFF] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-[#F0ECE8] px-4">
        {activities.map((activity) => (
          <article key={activity.id} className="flex items-center gap-3 py-4">
            {activity.avatarUrl ? (
              <img
                src={activity.avatarUrl}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[11px] font-bold text-[#4D67CE]">
                {activity.initials}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm leading-5 text-[#3B3633]">
                <span className="font-medium">{activity.survivorName}</span>{" "}
                {activity.description}
              </p>
              <p className="mt-0.5 text-xs text-[#817A75]">
                {activity.timeLabel}
              </p>
            </div>

            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#BFEED1] text-[#228D53]">
              <Check size={12} strokeWidth={3} />
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
