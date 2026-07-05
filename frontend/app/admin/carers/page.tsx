import { AdminCarersView } from "@/features/admin/components/carers/admin-carers-view";
import { getAdminCarers } from "@/features/admin/data/admin-carer-data";

export default function AdminCarersPage() {
  return <AdminCarersView carers={getAdminCarers()} />;
}