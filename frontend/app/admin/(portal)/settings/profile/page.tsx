import { AdminProfileSettingsView } from "@/features/admin/components/settings/admin-profile-settings";
import { defaultAdminProfileSettings } from "@/features/admin/data/admin-settings-data";

export default function AdminProfileSettingsPage() {
  return (
    <AdminProfileSettingsView
      initialSettings={
        defaultAdminProfileSettings
      }
    />
  );
}