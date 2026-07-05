import { AdminInvitationsView } from "@/features/admin/components/invitations/admin-invitations-view";
import { getAdminInvitations } from "@/features/admin/data/admin-invitation-data";

export default function AdminInvitationsPage() {
  return (
    <AdminInvitationsView
      invitations={getAdminInvitations()}
    />
  );
}