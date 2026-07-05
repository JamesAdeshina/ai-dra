import type {
  AdminCarerInvitationStatus,
  AdminCarerStatus,
} from "@/features/admin/types/admin-carer";
import { cn } from "@/lib/utils";

type CarerBadgeValue =
  | AdminCarerStatus
  | AdminCarerInvitationStatus
  | "Accepted Link";

type CarerStatusBadgeProps = {
  value: CarerBadgeValue;
};

const badgeClasses: Record<CarerBadgeValue, string> = {
  Active: "bg-[#E6F7EF] text-[#18834D]",
  Inactive: "bg-[#FFEAE5] text-[#DF5D3B]",
  "Pending Setup": "bg-[#FFF4DD] text-[#B16C00]",
  "No Linked Survivors": "bg-[#EEF2F8] text-[#667085]",
  "Access Revoked": "bg-[#FFE7E7] text-[#C93636]",

  Pending: "bg-[#FFF4DD] text-[#B16C00]",
  Accepted: "bg-[#E6F7EF] text-[#18834D]",
  Declined: "bg-[#FFEAE5] text-[#D65C3B]",
  Expired: "bg-[#EEF2F8] text-[#667085]",
  Cancelled: "bg-[#F1EEEB] text-[#6E6763]",

  "Accepted Link": "bg-[#E6F7EF] text-[#18834D]",
};

export function CarerStatusBadge({
  value,
}: CarerStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
        badgeClasses[value]
      )}
    >
      {value === "Accepted Link" ? "Accepted" : value}
    </span>
  );
}