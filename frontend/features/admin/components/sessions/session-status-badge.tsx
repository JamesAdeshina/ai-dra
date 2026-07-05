import type {
  AdminAttemptResult,
  AdminSessionStatus,
} from "@/features/admin/types/admin-session";
import { cn } from "@/lib/utils";

type SessionBadgeValue =
  | AdminSessionStatus
  | AdminAttemptResult;

type SessionStatusBadgeProps = {
  value: SessionBadgeValue;
};

const statusClasses: Record<SessionBadgeValue, string> = {
  Completed: "bg-[#E6F7EF] text-[#18834D]",
  Active: "bg-[#E8F2FF] text-[#2879D8]",
  Paused: "bg-[#FFF4DD] text-[#B16C00]",
  "Ended Early": "bg-[#FFE7E7] text-[#D43D3D]",

  Successful: "bg-[#E6F7EF] text-[#18834D]",
  Failed: "bg-[#FFE7E7] text-[#D43D3D]",
  Incomplete: "bg-[#FFF4DD] text-[#B16C00]",
};

export function SessionStatusBadge({
  value,
}: SessionStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
        statusClasses[value]
      )}
    >
      {value}
    </span>
  );
}