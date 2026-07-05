import type {
  AdminActivityItem,
  AdminActivityStatus,
} from "@/features/admin/types";
import { cn } from "@/lib/utils";

type RecentActivityTableProps = {
  activities: AdminActivityItem[];
};

const statusClasses = {
  Completed: "bg-[#E6F7EF] text-[#16854D]",
  "Ended Early": "bg-[#FFE9E9] text-[#D73C3C]",
  Pending: "bg-[#FFF5DF] text-[#A96D09]",
  Accepted: "bg-[#E8F2FF] text-[#3372C8]",
  Registered: "bg-[#EEE8FF] text-[#592EBD]",
} satisfies Record<AdminActivityStatus, string>;

export function RecentActivityTable({
  activities,
}: RecentActivityTableProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E8E4E1] bg-white shadow-[0_2px_10px_rgba(35,30,28,0.035)]">
      <div className="border-b border-[#EEEAE6] px-5 py-4">
        <h2 className="text-base font-semibold text-[#282422]">
          Recent Activity
        </h2>

        <p className="mt-1 text-sm text-[#7D7671]">
          Latest sessions, registrations and connection events.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="bg-[#FCFBFA] text-left">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#746D68]">
                Date
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#746D68]">
                Participant
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#746D68]">
                Activity
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#746D68]">
                Details
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#746D68]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {activities.map((activity) => (
              <tr
                key={activity.id}
                className="border-t border-[#F0ECE9] transition hover:bg-[#FCFBFA]"
              >
                <td className="whitespace-nowrap px-5 py-4 text-sm text-[#554F4B]">
                  {activity.date}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#2C2825]">
                  {activity.participant}
                </td>

                <td className="px-5 py-4 text-sm text-[#393432]">
                  {activity.activity}
                </td>

                <td className="px-5 py-4 text-sm text-[#6D6662]">
                  {activity.detail}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      statusClasses[activity.status]
                    )}
                  >
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}