"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Info,
  Mail,
  Pencil,
  RotateCcw,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
  cancelPendingInvitation,
  consumeInvitationNotice,
  getPendingInvitation,
  resendPendingInvitation,
  saveInvitationDraft,
} from "@/features/carer/data/carer-invitation-storage";
import {
  cancelCarerInvitationAction,
  resendCarerInvitationAction,
} from "@/features/carer/actions/carer-invitation-actions";
import type { PendingCarerInvitation } from "@/features/carer/types/carer-invitation";
import { cn } from "@/lib/utils";

const relationshipLabels: Record<string, string> = {
  PARENT: "Parent",
  SPOUSE_PARTNER: "Spouse or Partner",
  CHILD: "Child",
  SIBLING: "Sibling",
  RELATIVE: "Other Relative",
  FAMILY_FRIEND: "Family Friend",
  FRIEND: "Friend",
  PROFESSIONAL_CARER: "Professional Carer",
  OTHER: "Other",
};

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function PendingProgress() {
  const steps = [
    {
      number: 1,
      label: "Enter Details",
      complete: true,
    },
    {
      number: 2,
      label: "Send Invitation",
      complete: true,
    },
    {
      number: 3,
      label: "Pending Acceptance",
      complete: false,
    },
  ];

  return (
    <section className="rounded-2xl border border-[#DEDAD6] bg-white px-5 py-4">
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-0">
        {steps.map((step, index) => {
          const active = step.number === 3;

          return (
            <div
              key={step.label}
              className="relative flex items-center gap-3 sm:pr-4"
            >
              <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#592EBD] text-sm font-semibold text-white">
                {step.complete ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  step.number
                )}
              </span>

              <span
                className={cn(
                  "relative z-10 bg-white pr-3 text-sm font-semibold",
                  active
                    ? "text-[#592EBD]"
                    : "text-[#4E4844]",
                )}
              >
                {step.label}
              </span>

              {index < steps.length - 1 ? (
                <span className="absolute left-11 right-0 top-1/2 hidden h-px bg-[#E8E4E0] sm:block" />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function InvitationSummary() {
  const items = [
    {
      label: "Details entered",
      state: "complete",
    },
    {
      label: "Invitation sent",
      state: "complete",
    },
    {
      label: "Waiting for acceptance",
      state: "active",
    },
    {
      label: "Account will be linked",
      state: "pending",
    },
  ];

  return (
    <section className="rounded-2xl border border-[#DEDAD6] bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
          <UserRound size={20} />
        </span>

        <h2 className="text-lg font-semibold text-[#292522]">
          Invitation Summary
        </h2>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3"
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full",
                item.state === "complete" &&
                  "bg-[#2DB36F] text-white",
                item.state === "active" &&
                  "bg-[#592EBD] text-white",
                item.state === "pending" &&
                  "bg-[#E8F5ED] text-white",
              )}
            >
              {item.state === "active" ? (
                <Clock3 size={12} />
              ) : (
                <Check size={13} strokeWidth={3} />
              )}
            </span>

            <p
              className={cn(
                "text-sm",
                item.state === "pending"
                  ? "text-[#A09A96]"
                  : "text-[#514B47]",
              )}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function InvitationHelpCard() {
  return (
    <section className="rounded-2xl border border-[#DEDAD6] bg-white p-4">
      <div className="flex gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
          <Info size={20} />
        </span>

        <div>
          <h2 className="text-lg font-semibold text-[#292522]">
            Invitation Help
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#746D68]">
            Learn more about securely inviting and
            linking survivors.
          </p>

          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#592EBD]"
          >
            View Guide
            <ExternalLink size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

type PendingInvitationViewProps = {
  initialInvitation?: (PendingCarerInvitation & {
    id?: string;
  }) | null;
};

export function PendingInvitationView({
  initialInvitation = null,
}: PendingInvitationViewProps) {
  const router = useRouter();

  const [invitation, setInvitation] =
    useState<PendingCarerInvitation | null>(null);

  const [loaded, setLoaded] = useState(false);

  const [feedback, setFeedback] =
    useState<string | null>(null);

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  useEffect(() => {
    setInvitation(
      initialInvitation ?? getPendingInvitation(),
    );
    setFeedback(consumeInvitationNotice());
    setLoaded(true);
  }, [initialInvitation]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFeedback(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [feedback]);

  const relationshipLabel = useMemo(() => {
    if (!invitation) {
      return "";
    }

    if (
      invitation.relationship === "OTHER" &&
      invitation.customRelationship
    ) {
      return invitation.customRelationship;
    }

    return (
      relationshipLabels[
        invitation.relationship
      ] ?? invitation.relationship
    );
  }, [invitation]);

  const personalMessage = useMemo(() => {
    if (!invitation) {
      return "";
    }

    if (invitation.message.trim()) {
      return invitation.message;
    }

    return `Hi ${invitation.firstName},

I’d like to support you during your rehabilitation journey using AI-DRA. Please accept my invitation so we can connect and work together.

Best regards,
Haruna`;
  }, [invitation]);

  async function handleResend() {
    if (!invitation) {
      return;
    }

    const invitationId = (
      invitation as PendingCarerInvitation & {
        id?: string;
      }
    ).id;

    if (invitationId) {
      const result =
        await resendCarerInvitationAction(invitationId);

      if (!result.ok) {
        setFeedback(
          result.error ??
            "The invitation could not be resent.",
        );

        return;
      }

      const updatedInvitation = {
        ...invitation,
        sentAt: new Date().toISOString(),
      };

      setInvitation(updatedInvitation);

      setFeedback(
        `Invitation resent to ${updatedInvitation.firstName} ${updatedInvitation.lastName}.`,
      );

      return;
    }

    const updatedInvitation =
      resendPendingInvitation();

    if (!updatedInvitation) {
      return;
    }

    setInvitation(updatedInvitation);

    setFeedback(
      `Invitation resent to ${updatedInvitation.firstName} ${updatedInvitation.lastName}.`,
    );
  }

  function handleEdit() {
    if (!invitation) {
      return;
    }

    saveInvitationDraft({
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      email: invitation.email,
      phone: invitation.phone,
      relationship: invitation.relationship,
      customRelationship:
        invitation.customRelationship,
      message: invitation.message,
    });

    router.push("/carer/invitations");
  }

  async function handleCancel() {
    if (!invitation) {
      return;
    }

    const invitationId = (
      invitation as PendingCarerInvitation & {
        id?: string;
      }
    ).id;

    if (invitationId) {
      const result =
        await cancelCarerInvitationAction(invitationId);

      if (!result.ok) {
        setShowCancelModal(false);

        setFeedback(
          result.error ??
            "The pending invitation could not be cancelled.",
        );

        return;
      }
    } else {
      cancelPendingInvitation();
    }

    setShowCancelModal(false);

    setFeedback(
      "The pending invitation has been cancelled.",
    );

    window.setTimeout(() => {
      router.push("/carer/invitations");
    }, 900);
  }

  if (!loaded) {
    return null;
  }

  if (!invitation) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[420px] max-w-2xl flex-col items-center justify-center rounded-2xl border border-[#DEDAD6] bg-white px-6 text-center">
          <Mail size={30} className="text-[#592EBD]" />

          <h1 className="mt-4 text-xl font-semibold text-[#292522]">
            No pending invitation
          </h1>

          <p className="mt-2 text-sm text-[#746D68]">
            Send a survivor invitation before viewing
            its acceptance status.
          </p>

          <Link
            href="/carer/invitations"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#592EBD] px-7 text-sm font-semibold text-white"
          >
            Invite a Survivor
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {feedback ? (
        <div
          role="status"
          className="fixed right-4 top-24 z-50 flex w-[calc(100%-2rem)] max-w-md items-center gap-3 rounded-xl border border-[#BCE8CE] bg-[#ECFAF2] px-4 py-3 text-[#18774A] shadow-lg"
        >
          <CheckCircle2 size={20} />

          <p className="flex-1 text-sm font-medium">
            {feedback}
          </p>

          <button
            type="button"
            onClick={() => setFeedback(null)}
            aria-label="Dismiss notification"
          >
            <X size={18} />
          </button>
        </div>
      ) : null}

      <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#211E1C]">
                Invite / Link Survivor
              </h1>

              <p className="mt-1 text-sm text-[#5F5955]">
                The invitation has been sent and is
                awaiting the survivor’s response.
              </p>
            </div>

            <Link
              href="/carer/invitations/manage"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#592EBD] px-8 text-sm font-semibold text-white hover:bg-[#4B24A8]"
            >
              Manage Linked Survivor(s)
            </Link>
          </div>

          <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 space-y-4">
              <PendingProgress />

              <section className="rounded-2xl border border-[#DEDAD6] bg-white p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-[#292522]">
                  Survivor Information
                </h2>

                <p className="mt-1 text-sm text-[#746D68]">
                  The invitation remains pending until
                  the survivor accepts or it expires.
                </p>

                <article className="mt-5 grid gap-5 rounded-2xl border border-[#DEDAD6] p-4 lg:grid-cols-[minmax(0,1fr)_210px_190px] lg:items-center">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#EEE9FB] text-xl font-bold text-[#3478EA]">
                      {invitation.firstName
                        .charAt(0)
                        .toUpperCase()}
                      {invitation.lastName
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold text-[#292522]">
                        {invitation.firstName}{" "}
                        {invitation.lastName}
                      </h3>

                      <p className="mt-3 flex items-center gap-2 text-sm text-[#746D68]">
                        <Mail size={16} />
                        {invitation.email}
                      </p>

                      <p className="mt-2 flex items-center gap-2 text-sm text-[#746D68]">
                        <UserRound size={16} />
                        {relationshipLabel}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#ECE8E4] pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                    <p className="text-sm font-medium text-[#403B37]">
                      Invited on
                    </p>

                    <p className="mt-3 flex items-center gap-2 text-sm text-[#514B47]">
                      <CalendarDays size={16} />
                      {formatDate(invitation.sentAt)}
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm text-[#514B47]">
                      <Clock3 size={16} />
                      {formatTime(invitation.sentAt)}
                    </p>
                  </div>

                  <div className="border-t border-[#ECE8E4] pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                    <p className="text-sm font-medium text-[#403B37]">
                      Status
                    </p>

                    <span className="mt-3 inline-flex rounded-full bg-[#F1EBFF] px-3 py-1.5 text-xs font-semibold text-[#7040D4]">
                      Pending Acceptance
                    </span>

                    <p className="mt-3 text-xs text-[#746D68]">
                      Expires{" "}
                      {formatDate(
                        invitation.expiresAt,
                      )}
                    </p>
                  </div>
                </article>

                <div className="mt-5 border-t border-[#E8E4E0] pt-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#292522]">
                    Your Personal Message
                  </p>

                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#746D68]">
                    {personalMessage}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#592EBD] px-7 text-sm font-semibold text-white hover:bg-[#4B24A8]"
                  >
                    <RotateCcw size={17} />
                    Resend Invitation
                  </button>

                  <button
                    type="button"
                    onClick={handleEdit}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#DDD8D4] px-7 text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
                  >
                    <Pencil size={17} />
                    Edit Invitation
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCancelModal(true)
                    }
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#F23636] px-7 text-sm font-semibold text-[#F23636] hover:bg-[#FFF0F0]"
                  >
                    <Trash2 size={17} />
                    Cancel Invitation
                  </button>
                </div>

                <div className="mt-5 flex gap-3 rounded-xl border border-[#C9D8FF] bg-[#F3F6FF] p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E5ECFF] text-[#3478EA]">
                    <Info size={20} />
                  </span>

                  <div>
                    <h3 className="font-semibold text-[#292522]">
                      What happens next?
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#746D68]">
                      {invitation.firstName} will receive
                      an email
                      {invitation.phone
                        ? " and SMS"
                        : ""}{" "}
                      with instructions to accept the
                      invitation. You will be notified
                      when the account is linked.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-[118px]">
              <InvitationSummary />
              <InvitationHelpCard />
            </aside>
          </div>
        </div>
      </section>

      {showCancelModal ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-invitation-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0F0] text-[#F23636]">
              <Trash2 size={25} />
            </span>

            <h2
              id="cancel-invitation-title"
              className="mt-5 text-xl font-semibold text-[#292522]"
            >
              Cancel this invitation?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#746D68]">
              The survivor will no longer be able to
              accept this invitation. You can send a new
              invitation later.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setShowCancelModal(false)
                }
                className="min-h-11 rounded-full border border-[#DDD8D4] px-6 text-sm font-semibold text-[#403B37]"
              >
                Keep Invitation
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="min-h-11 rounded-full bg-[#F23636] px-6 text-sm font-semibold text-white hover:bg-[#D92D2D]"
              >
                Cancel Invitation
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}