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
  ExternalLink,
  Info,
  Mail,
  Save,
  Send,
  UserRound,
  X,
} from "lucide-react";

import {
  getInvitationDraft,
  saveInvitationDraft,
  saveInvitationNotice,
} from "@/features/carer/data/carer-invitation-storage";
import { createCarerInvitationAction } from "@/features/carer/actions/carer-invitation-actions";
import type { CarerInvitationDraft } from "@/features/carer/types/carer-invitation";
import { cn } from "@/lib/utils";


type ProfileResponse = {
  profile?: {
    first_name?: string | null;
    last_name?: string | null;
    display_name?: string | null;
  } | null;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
};

function getCarerNameFromProfile(data: ProfileResponse) {
  const profile = data.profile ?? data;

  const displayName =
    profile.display_name?.trim();

  if (displayName) {
    return displayName;
  }

  const fullName = [
    profile.first_name,
    profile.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "your carer";
}

async function loadCurrentCarerName() {
  try {
    const response = await fetch("/api/profile", {
      cache: "no-store",
    });

    if (!response.ok) {
      return "your carer";
    }

    const data =
      (await response.json()) as ProfileResponse;

    return getCarerNameFromProfile(data);
  } catch {
    return "your carer";
  }
}


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

function InvitationProgress() {
  const steps = [
    {
      number: 1,
      label: "Enter Details",
      complete: true,
      active: false,
    },
    {
      number: 2,
      label: "Send Invitation",
      complete: false,
      active: true,
    },
    {
      number: 3,
      label: "Pending Acceptance",
      complete: false,
      active: false,
    },
  ];

  return (
    <section className="rounded-2xl border border-[#DEDAD6] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-0">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="relative flex items-center gap-3 sm:pr-4"
          >
            <span
              className={cn(
                "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                step.active || step.complete
                  ? "bg-[#592EBD] text-white"
                  : "bg-[#F1F0EF] text-[#403B37]",
              )}
            >
              {step.complete ? (
                <Check size={18} strokeWidth={3} />
              ) : (
                step.number
              )}
            </span>

            <span
              className={cn(
                "relative z-10 bg-white pr-3 text-sm font-semibold",
                step.active || step.complete
                  ? "text-[#592EBD]"
                  : "text-[#292522]",
              )}
            >
              {step.label}
            </span>

            {index < steps.length - 1 ? (
              <span className="absolute left-11 right-0 top-1/2 hidden h-px bg-[#E8E4E0] sm:block" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function InvitationSummary() {
  const summaryItems = [
    {
      label: "Details entered",
      complete: true,
    },
    {
      label: "Invitation ready",
      complete: true,
    },
    {
      label: "Waiting for acceptance",
      complete: false,
    },
    {
      label: "Account will be linked",
      complete: false,
    },
  ];

  return (
    <section className="rounded-2xl border border-[#DEDAD6] bg-white p-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
          <UserRound size={20} />
        </span>

        <h2 className="text-lg font-semibold text-[#292522]">
          Invitation Summary
        </h2>
      </div>

      <div className="mt-5 space-y-4">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3"
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full",
                item.complete
                  ? "bg-[#2DB36F] text-white"
                  : "bg-[#E8F5ED] text-white",
              )}
            >
              <Check size={13} strokeWidth={3} />
            </span>

            <p
              className={cn(
                "text-sm",
                item.complete
                  ? "text-[#514B47]"
                  : "text-[#A09A96]",
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
    <section className="rounded-2xl border border-[#DEDAD6] bg-white p-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="flex gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
          <Info size={20} />
        </span>

        <div>
          <h2 className="text-lg font-semibold text-[#292522]">
            Invitation Help
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#746D68]">
            Learn more about inviting and linking
            survivors securely.
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

export function SendInvitationView() {
  const router = useRouter();

  const [carerName, setCarerName] =
    useState("your carer");

  const [draft, setDraft] =
    useState<CarerInvitationDraft | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [feedback, setFeedback] = useState<
    string | null
  >(null);

  useEffect(() => {
    setDraft(getInvitationDraft());
    setLoaded(true);
  }, []);

  useEffect(() => {
    loadCurrentCarerName().then(setCarerName);
  }, []);

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
    if (!draft) {
      return "";
    }

    if (
      draft.relationship === "OTHER" &&
      draft.customRelationship
    ) {
      return draft.customRelationship;
    }

    return (
      relationshipLabels[draft.relationship] ??
      draft.relationship
    );
  }, [draft, carerName]);

  const personalMessage = useMemo(() => {
    if (!draft) {
      return "";
    }

    if (draft.message.trim()) {
      return draft.message.trim();
    }

    return `Hi ${draft.firstName},

I’d like to support you during your rehabilitation journey using AI-DRA. Please accept my invitation so we can connect and work together.

Best regards,
${carerName}`;
  }, [draft, carerName]);

  function handleSaveDraft() {
    if (!draft) {
      return;
    }

    saveInvitationDraft(draft);

    setFeedback("Invitation saved as a draft.");
  }

  async function handleSendInvitation() {
    if (!draft || isSending) {
      return;
    }

    setIsSending(true);

    const result =
      await createCarerInvitationAction({
        firstName: draft.firstName,
        lastName: draft.lastName,
        email: draft.email,
        phone: draft.phone,
        relationship: draft.relationship,
        customRelationship:
          draft.customRelationship,
        message: draft.message,
      });

    if (!result.ok || !result.invitationId) {
      setIsSending(false);

      setFeedback(
        result.error ??
          "The invitation could not be sent. Please try again.",
      );

      return;
    }

    saveInvitationNotice(
      result.warning ??
        `Invitation sent to ${draft.firstName} ${draft.lastName}.`,
    );

    router.push(
      `/carer/invitations/pending?invitationId=${result.invitationId}`,
    );
  }

  if (!loaded) {
    return null;
  }

  if (!draft) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[420px] max-w-2xl flex-col items-center justify-center rounded-2xl border border-[#DEDAD6] bg-white px-6 text-center">
          <Info
            size={30}
            className="text-[#592EBD]"
          />

          <h1 className="mt-4 text-xl font-semibold text-[#292522]">
            No invitation details found
          </h1>

          <p className="mt-2 text-sm text-[#746D68]">
            Enter the survivor’s information before
            reviewing the invitation.
          </p>

          <Link
            href="/carer/invitations"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#592EBD] px-7 text-sm font-semibold text-white"
          >
            Enter Survivor Details
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {feedback ? (
        <div
          role="status"
          className="fixed right-4 top-24 z-50 flex w-[calc(100%-2rem)] max-w-sm items-center gap-3 rounded-xl border border-[#BCE8CE] bg-[#ECFAF2] px-4 py-3 text-[#18774A] shadow-lg"
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

      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#211E1C]">
              Invite / Link Survivor
            </h1>

            <p className="mt-1 text-sm text-[#5F5955]">
              Review the invitation before sending it
              to the survivor.
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
            <InvitationProgress />

            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)] sm:p-5">
              <h2 className="text-lg font-semibold text-[#292522]">
                Survivor Information
              </h2>

              <p className="mt-1 text-sm text-[#746D68]">
                Confirm the details below before sending
                the invitation.
              </p>

              <article className="mt-5 grid gap-4 rounded-2xl border border-[#DEDAD6] p-4 sm:grid-cols-[minmax(0,1fr)_165px] sm:items-center">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#EEE9FB] text-xl font-bold text-[#3478EA]">
                    {draft.firstName
                      .charAt(0)
                      .toUpperCase()}
                    {draft.lastName
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-[#292522]">
                      {draft.firstName} {draft.lastName}
                    </h3>

                    <p className="mt-3 flex items-center gap-2 break-all text-sm text-[#746D68]">
                      <Mail size={16} />
                      {draft.email}
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm text-[#746D68]">
                      <UserRound size={16} />
                      {relationshipLabel}
                    </p>

                    {draft.phone ? (
                      <p className="mt-2 flex items-center gap-2 text-sm text-[#746D68]">
                        <CalendarDays size={16} />
                        {draft.phone}
                      </p>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/carer/invitations")
                  }
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#DDD8D4] px-6 text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
                >
                  Edit
                </button>
              </article>

              <div className="mt-5 border-t border-[#E8E4E0] pt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#292522]">
                  Your Personal Message
                </p>

                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#746D68]">
                  {personalMessage}
                </p>
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
                    Once sent, {draft.firstName} will
                    receive an email
                    {draft.phone ? " and SMS" : ""} with
                    instructions to accept and link their
                    account. You will be notified after
                    acceptance.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() =>
                    router.push("/carer/invitations")
                  }
                  className="inline-flex min-h-12 min-w-[165px] items-center justify-center rounded-full border border-[#DDD8D4] px-6 text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
                >
                  Back
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSending}
                    className="inline-flex min-h-12 min-w-[165px] items-center justify-center gap-2 rounded-full border border-[#DDD8D4] px-6 text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={17} />
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    onClick={handleSendInvitation}
                    disabled={isSending}
                    className="inline-flex min-h-12 min-w-[180px] items-center justify-center gap-2 rounded-full bg-[#592EBD] px-6 text-sm font-semibold text-white hover:bg-[#4B24A8] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send size={17} />

                    {isSending
                      ? "Sending..."
                      : "Send Invitation"}
                  </button>
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
  );
}