import type {
  AdminInvitationDeliveryStatus,
  AdminInvitationStatus,
} from "@/features/admin/types/admin-invitation";
import { cn } from "@/lib/utils";

type InvitationStatusBadgeProps = {
  status: AdminInvitationStatus;
};

const invitationStatusClasses: Record<
  AdminInvitationStatus,
  string
> = {
  Pending: "bg-[#FFF4DD] text-[#B16C00]",
  Accepted: "bg-[#E6F7EF] text-[#18834D]",
  Declined: "bg-[#FFE7E7] text-[#D43D3D]",
  Cancelled: "bg-[#EEF1F5] text-[#667085]",
  Expired: "bg-[#FFF1D8] text-[#C47A00]",
};

export function InvitationStatusBadge({
  status,
}: InvitationStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
        invitationStatusClasses[status]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

type InvitationDeliveryBadgeProps = {
  status: AdminInvitationDeliveryStatus;
};

const deliveryClasses: Record<
  AdminInvitationDeliveryStatus,
  string
> = {
  Delivered: "text-[#18834D]",
  Failed: "text-[#D43D3D]",
  "Not Applicable": "text-[#7C8492]",
};

const deliveryDotClasses: Record<
  AdminInvitationDeliveryStatus,
  string
> = {
  Delivered: "bg-[#20B26B]",
  Failed: "bg-[#F23636]",
  "Not Applicable": "bg-[#A6AFBD]",
};

export function InvitationDeliveryBadge({
  status,
}: InvitationDeliveryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium",
        deliveryClasses[status]
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          deliveryDotClasses[status]
        )}
      />

      {status === "Not Applicable" ? "N/A" : status}
    </span>
  );
}