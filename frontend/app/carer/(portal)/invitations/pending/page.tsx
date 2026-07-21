import { PendingInvitationView } from "@/features/carer/components/invitations/pending-invitation-view";
import { getPendingCarerInvitationById } from "@/features/carer/services/carer-invitation-service";

type PendingInvitationPageProps = {
  searchParams: Promise<{
    invitationId?: string;
  }>;
};

export default async function PendingInvitationPage({
  searchParams,
}: PendingInvitationPageProps) {
  const { invitationId } = await searchParams;

  const invitation =
    await getPendingCarerInvitationById(invitationId);

  return (
    <PendingInvitationView
      initialInvitation={invitation}
    />
  );
}
