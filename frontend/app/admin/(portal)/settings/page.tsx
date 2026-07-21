import { AdminSettingsOverview } from "@/features/admin/components/settings/admin-settings-overview";
import { getAdminSettingsCategories } from "@/features/admin/data/admin-settings-data";

export default function AdminSettingsPage() {
  return (
    <AdminSettingsOverview
      categories={getAdminSettingsCategories()}
    />
  );
}