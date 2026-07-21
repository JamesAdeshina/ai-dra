import { AdminSessionsView } from "@/features/admin/components/sessions/admin-sessions-view";
import { getAdminSessions } from "@/features/admin/data/admin-session-data";

export default function AdminSessionsPage() {
  return (
    <AdminSessionsView
      sessions={getAdminSessions()}
    />
  );
}