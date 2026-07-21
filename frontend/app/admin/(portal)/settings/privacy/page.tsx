import { AdminPrivacySettingsView } from "@/features/admin/components/settings/admin-privacy-settings";
import { defaultAdminPrivacySettings } from "@/features/admin/data/admin-settings-data";

export default function AdminPrivacySettingsPage() {
  return (
    <AdminPrivacySettingsView
      initialSettings={defaultAdminPrivacySettings}
    />
  );
}