import { AdminNotificationsView } from "@/features/admin/components/notifications/admin-notifications-view";
import { getAdminNotifications } from "@/features/admin/data/admin-notification-data";

export default function AdminNotificationsPage() {
  return (
    <AdminNotificationsView
      notifications={getAdminNotifications()}
    />
  );
}