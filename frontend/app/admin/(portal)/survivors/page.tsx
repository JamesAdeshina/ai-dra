import { AdminSurvivorsView } from "@/features/admin/components/survivors/admin-survivors-view";
import { getAdminSurvivors } from "@/features/admin/data/admin-survivor-data";

export default function AdminSurvivorsPage() {
  return <AdminSurvivorsView survivors={getAdminSurvivors()} />;
}