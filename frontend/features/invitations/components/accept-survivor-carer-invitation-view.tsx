"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Loader2,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SurvivorCarerInvitationState } from "@/features/invitations/actions/survivor-carer-invitation-accept-actions";
import {
  acceptSurvivorCarerInvitationAction,
  declineSurvivorCarerInvitationAction,
} from "@/features/invitations/actions/survivor-carer-invitation-accept-actions";

type AcceptSurvivorCarerInvitationViewProps = {
  token: string;
  invitation: SurvivorCarerInvitationState | null;
};

export function AcceptSurvivorCarerInvitationView({
  token,
  invitation,
}: AcceptSurvivorCarerInvitationViewProps) {
  const router = useRouter();

  const [isAccepting, setIsAccepting] =
    useState(false);

  const [isDeclining, setIsDeclining] =
    useState(false);

  const [feedback, setFeedback] =
    useState<string | null>(null);

  if (!invitation) {
    return (
      <InvitationShell>
        <StatusCard
          icon={<XCircle size={34} />}
          title="Invitation not found"
          description="This invitation may have expired, been cancelled, or the link may be incorrect."
          action={
            <Button asChild className="rounded-full bg-[#592EBD]">
              <Link href="/carer/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          }
        />
      </InvitationShell>
    );
  }

  const isExpired =
    new Date(invitation.expiresAt).getTime() <
    Date.now();

  const isPending =
    invitation.status === "PENDING" && !isExpired;

  const loginHref = `/auth/login?redirectTo=${encodeURIComponent(
    `/invitations/survivor/accept?token=${token}`,
  )}`;

  const registerHref = `/carer/auth/register?redirectTo=${encodeURIComponent(
    `/invitations/survivor/accept?token=${token}`,
  )}&email=${encodeURIComponent(
    invitation.inviteeEmail,
  )}`;

  const handleAccept = async () => {
    if (isAccepting || isDeclining) {
      return;
    }

    setIsAccepting(true);
    setFeedback(null);

    const result =
      await acceptSurvivorCarerInvitationAction(token);

    setIsAccepting(false);

    if (!result.ok) {
      setFeedback(
        result.error ??
          "The invitation could not be accepted.",
      );

      return;
    }

    router.push(result.next ?? "/carer/dashboard");
  };

  const handleDecline = async () => {
    if (isAccepting || isDeclining) {
      return;
    }

    setIsDeclining(true);
    setFeedback(null);

    const result =
      await declineSurvivorCarerInvitationAction(token);

    setIsDeclining(false);

    if (!result.ok) {
      setFeedback(
        result.error ??
          "The invitation could not be declined.",
      );

      return;
    }

    router.push(
      result.next ?? "/carer/invitations/manage",
    );
  };

  if (invitation.status === "ACCEPTED") {
    return (
      <InvitationShell>
        <StatusCard
          icon={<CheckCircle2 size={34} />}
          title="Invitation already accepted"
          description="You are already linked to this survivor. You can continue to your carer dashboard."
          action={
            <Button asChild className="rounded-full bg-[#592EBD]">
              <Link href="/carer/dashboard">
                Go to Carer Dashboard
              </Link>
            </Button>
          }
        />
      </InvitationShell>
    );
  }

  if (invitation.status === "DECLINED") {
    return (
      <InvitationShell>
        <StatusCard
          icon={<XCircle size={34} />}
          title="Invitation declined"
          description="You have declined this invitation. If this was a mistake, ask the survivor to send a new invitation."
          action={
            <Button asChild className="rounded-full bg-[#592EBD]">
              <Link href="/carer/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          }
        />
      </InvitationShell>
    );
  }

  if (isExpired) {
    return (
      <InvitationShell>
        <StatusCard
          icon={<Clock3 size={34} />}
          title="Invitation expired"
          description="This invitation has expired. Ask the survivor to send a new invitation."
          action={
            <Button asChild className="rounded-full bg-[#592EBD]">
              <Link href="/carer/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          }
        />
      </InvitationShell>
    );
  }

  if (!invitation.currentUserId) {
    return (
      <InvitationShell>
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECE8FF] text-[#592EBD]">
            <HeartHandshake size={34} />
          </div>

          <h1 className="mt-5 text-center text-[28px] font-bold text-[#1E1E1E]">
            You have been invited to support a survivor
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-center text-[16px] leading-[160%] text-[#666666]">
            {invitation.survivorName} has invited you to connect as their carer on AI-DRA. Please sign in or create a carer account to review this invitation.
          </p>

          <InvitationSummary invitation={invitation} />

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Button
              asChild
              className="h-14 rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8]"
            >
              <Link href={loginHref}>
                Sign in to review
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-14 rounded-full text-[16px]"
            >
              <Link href={registerHref}>
                Create carer account
              </Link>
            </Button>
          </div>
        </div>
      </InvitationShell>
    );
  }

  if (!invitation.currentUserMatchesInvite) {
    return (
      <InvitationShell>
        <StatusCard
          icon={<ShieldCheck size={34} />}
          title="Wrong account signed in"
          description={`This invitation was sent to ${invitation.inviteeEmail}, but you are signed in as ${invitation.currentUserEmail}. Please sign out and use the invited email address.`}
          action={
            <Button asChild className="rounded-full bg-[#592EBD]">
              <Link href={loginHref}>
                Sign in with invited email
              </Link>
            </Button>
          }
        />
      </InvitationShell>
    );
  }

  return (
    <InvitationShell>
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECE8FF] text-[#592EBD]">
          <HeartHandshake size={34} />
        </div>

        <h1 className="mt-5 text-center text-[28px] font-bold text-[#1E1E1E]">
          Review carer invitation
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-center text-[16px] leading-[160%] text-[#666666]">
          {invitation.survivorName} is inviting you to support their rehabilitation on AI-DRA.
        </p>

        <InvitationSummary invitation={invitation} />

        <div className="mt-6 rounded-2xl bg-[#F7F4F2] p-5">
          <p className="text-[15px] font-semibold text-[#1E1E1E]">
            If you accept, you may be able to:
          </p>

          <ul className="mt-3 space-y-2 text-[15px] leading-[150%] text-[#666666]">
            <li>View rehabilitation progress and completed sessions.</li>
            <li>Receive important exercise updates.</li>
            <li>Support the survivor during their recovery journey.</li>
          </ul>
        </div>

        {feedback ? (
          <div className="mt-5 rounded-2xl border border-[#F6CACA] bg-[#FFF4F4] px-4 py-3 text-[14px] font-medium text-[#B42318]">
            {feedback}
          </div>
        ) : null}

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <Button
            type="button"
            disabled={!isPending || isAccepting || isDeclining}
            onClick={() => void handleAccept()}
            className="h-14 rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8]"
          >
            {isAccepting ? (
              <>
                <Loader2 className="animate-spin" size={17} />
                Accepting...
              </>
            ) : (
              "Accept Invitation"
            )}
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-14 rounded-full text-[16px]"
          >
            <Link href="/carer/invitations/manage">
              Not Now
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={!isPending || isAccepting || isDeclining}
            onClick={() => void handleDecline()}
            className="h-14 rounded-full border-[#F6CACA] text-[16px] text-[#B42318] hover:bg-[#FFF4F4]"
          >
            {isDeclining ? (
              <>
                <Loader2 className="animate-spin" size={17} />
                Declining...
              </>
            ) : (
              "Decline"
            )}
          </Button>
        </div>
      </div>
    </InvitationShell>
  );
}

function InvitationSummary({
  invitation,
}: {
  invitation: SurvivorCarerInvitationState;
}) {
  return (
    <div className="mt-6 grid gap-4 rounded-2xl border border-[#E6E1DD] bg-[#FCFBFA] p-5 sm:grid-cols-2">
      <SummaryItem
        icon={<UserRound size={18} />}
        label="Survivor"
        value={invitation.survivorName}
      />

      <SummaryItem
        icon={<HeartHandshake size={18} />}
        label="Relationship"
        value={invitation.relationship || "Carer"}
      />

      {invitation.message ? (
        <div className="sm:col-span-2">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#7875FB]">
            Message
          </p>
          <p className="mt-2 whitespace-pre-line text-[15px] leading-[155%] text-[#444444]">
            {invitation.message}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#592EBD]">
        {icon}
      </span>
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-wide text-[#7875FB]">
          {label}
        </p>
        <p className="mt-1 text-[16px] font-semibold text-[#1E1E1E]">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECE8FF] text-[#592EBD]">
        {icon}
      </div>

      <h1 className="mt-5 text-[28px] font-bold text-[#1E1E1E]">
        {title}
      </h1>

      <p className="mx-auto mt-3 max-w-xl text-[16px] leading-[160%] text-[#666666]">
        {description}
      </p>

      <div className="mt-7">{action}</div>
    </div>
  );
}

function InvitationShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F7F4F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-[15px] font-semibold text-[#592EBD]"
        >
          AI-DRA
        </Link>

        {children}
      </div>
    </main>
  );
}