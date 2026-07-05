import type {
  AdminNotificationCategory,
  AdminNotificationSeverity,
} from "@/features/admin/types/admin-notification";
import { cn } from "@/lib/utils";

type NotificationCategoryBadgeProps = {
  category: AdminNotificationCategory;
};

const categoryClasses: Record<
  AdminNotificationCategory,
  string
> = {
  Engagement: "bg-[#E8F2FF] text-[#2879D8]",
  Invitation: "bg-[#FFF4DD] text-[#B16C00]",
  Session: "bg-[#FFE7E7] text-[#D43D3D]",
  System: "bg-[#EEE8FF] text-[#592EBD]",
};

export function NotificationCategoryBadge({
  category,
}: NotificationCategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        categoryClasses[category]
      )}
    >
      {category}
    </span>
  );
}

type NotificationSeverityBadgeProps = {
  severity: AdminNotificationSeverity;
};

const severityClasses: Record<
  AdminNotificationSeverity,
  string
> = {
  Information: "bg-[#E8F2FF] text-[#2879D8]",
  Attention: "bg-[#FFF4DD] text-[#B16C00]",
  Important: "bg-[#FFE7E7] text-[#D43D3D]",
};

export function NotificationSeverityBadge({
  severity,
}: NotificationSeverityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        severityClasses[severity]
      )}
    >
      {severity}
    </span>
  );
}