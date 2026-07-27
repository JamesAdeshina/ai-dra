import { AcceptSurvivorCarerInvitationView } from "@/features/invitations/components/accept-survivor-carer-invitation-view";
import { getSurvivorCarerInvitationState } from "@/features/invitations/actions/survivor-carer-invitation-accept-actions";

type SurvivorCarerAcceptPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function SurvivorCarerAcceptPage({
  searchParams,
}: SurvivorCarerAcceptPageProps) {
  const { token = "" } = await searchParams;

  const invitation =
    await getSurvivorCarerInvitationState(token);

  return (
    <AcceptSurvivorCarerInvitationView
      token={token}
      invitation={invitation}
    />
  );
}
