import { AdminEngagementSettingsView } from "@/features/admin/components/settings/admin-engagement-settings";
import { defaultAdminEngagementSettings } from "@/features/admin/data/admin-settings-data";

export default function AdminEngagementSettingsPage() {
  return (
    <AdminEngagementSettingsView
      initialSettings={
        defaultAdminEngagementSettings
      }
    />
  );
}