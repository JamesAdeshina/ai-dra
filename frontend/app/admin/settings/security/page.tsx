import { AdminSecuritySettingsView } from "@/features/admin/components/settings/admin-security-settings";
import {
  adminSecurityDevices,
  defaultAdminSecuritySettings,
} from "@/features/admin/data/admin-settings-data";

export default function AdminSecuritySettingsPage() {
  return (
    <AdminSecuritySettingsView
      initialSettings={
        defaultAdminSecuritySettings
      }
      devices={adminSecurityDevices}
    />
  );
}