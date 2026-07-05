import { AdminSystemInformationView } from "@/features/admin/components/settings/admin-system-information";
import { adminSystemServices } from "@/features/admin/data/admin-settings-data";

export default function AdminSystemSettingsPage() {
  return (
    <AdminSystemInformationView
      services={adminSystemServices}
    />
  );
}