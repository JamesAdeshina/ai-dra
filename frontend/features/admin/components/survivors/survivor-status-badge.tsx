import type {
  SurvivorAccountStatus,
  SurvivorEngagementStatus,
  SurvivorOnboardingStatus,
} from "@/features/admin/types";
import { cn } from "@/lib/utils";

type BadgeValue =
  | SurvivorAccountStatus
  | SurvivorEngagementStatus
  | SurvivorOnboardingStatus
  | "Completed"
  | "Ended Early"
  | "Paused"
  | "Accepted"
  | "Pending"
  | "Not Available";

type SurvivorStatusBadgeProps = {
  value: BadgeValue;
};

const badgeClasses: Record<BadgeValue, string> = {
  Active: "bg-[#E6F7EF] text-[#18834D]",
  Inactive: "bg-[#F0F2F5] text-[#667085]",
  Pending: "bg-[#FFF4DD] text-[#B16C00]",

  High: "bg-[#E6F7EF] text-[#18834D]",
  Moderate: "bg-[#FFF4D8] text-[#C17A00]",
  Low: "bg-[#FFF0E4] text-[#E56B16]",
  "Not Started": "bg-[#EEF2F8] text-[#667085]",

  Complete: "bg-[#E6F7EF] text-[#18834D]",
  "In Progress": "bg-[#FFF0E4] text-[#E56B16]",

  Completed: "bg-[#E6F7EF] text-[#18834D]",
  "Ended Early": "bg-[#FFF0E4] text-[#E56B16]",
  Paused: "bg-[#FFF4D8] text-[#B87700]",
  Accepted: "bg-[#E6F7EF] text-[#18834D]",
  "Not Available": "bg-[#EEF2F8] text-[#667085]",
};

export function SurvivorStatusBadge({
  value,
}: SurvivorStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
        badgeClasses[value]
      )}
    >
      {value}
    </span>
  );
}