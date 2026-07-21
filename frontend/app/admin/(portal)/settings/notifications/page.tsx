import { AdminNotificationSettingsView } from "@/features/admin/components/settings/admin-notification-settings";
import { defaultAdminNotificationPreferences } from "@/features/admin/data/admin-settings-data";

export default function AdminNotificationSettingsPage() {
  return (
    <AdminNotificationSettingsView
      initialSettings={
        defaultAdminNotificationPreferences
      }
    />
  );
}