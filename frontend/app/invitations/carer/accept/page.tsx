import { notFound } from "next/navigation";

import { AcceptCarerInvitationView } from "@/features/invitations/components/accept-carer-invitation-view";
import { getInvitationSuccessState } from "@/features/invitations/actions/carer-invitation-accept-actions";

type AcceptCarerInvitationPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function AcceptCarerInvitationPage({
  searchParams,
}: AcceptCarerInvitationPageProps) {
  const { token } = await searchParams;

  if (!token) {
    notFound();
  }

  const invitation =
    await getInvitationSuccessState(token);

  if (!invitation) {
    notFound();
  }

  return (
    <AcceptCarerInvitationView
      invitation={invitation}
      token={token}
    />
  );
}