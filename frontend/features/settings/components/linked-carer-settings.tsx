"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Link2Off,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  getLinkedCarers,
  unlinkCarer,
  type LinkedCarer,
} from "@/features/settings/services/linked-carer-service";
import { createSurvivorCarerInvitationAction } from "@/features/settings/actions/survivor-carer-invitation-actions";

function formatLinkedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Linked recently";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(carer: LinkedCarer) {
  const initials = [
    carer.firstName,
    carer.lastName,
  ]
    .filter(
      (value): value is string =>
        Boolean(value?.trim())
    )
    .map((value) =>
      value.trim().charAt(0).toUpperCase()
    )
    .join("")
    .slice(0, 2);

  return initials || "AC";
}


type AddCarerForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  message: string;
};

const initialAddCarerForm: AddCarerForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  relationship: "",
  message: "",
};

export function LinkedCarerSettings() {
  const [carers, setCarers] =
    useState<LinkedCarer[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [relationshipToUnlink, setRelationshipToUnlink] =
    useState<string | null>(null);

  const [isUnlinking, setIsUnlinking] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [showAddCarerModal, setShowAddCarerModal] =
    useState(false);

  const [isSendingInvite, setIsSendingInvite] =
    useState(false);

  const [addCarerForm, setAddCarerForm] =
    useState<AddCarerForm>(initialAddCarerForm);

  const loadCarers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getLinkedCarers();
      setCarers(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Linked carers could not be loaded."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCarers();
  }, [loadCarers]);

  const handleUnlink = async () => {
    if (!relationshipToUnlink || isUnlinking) {
      return;
    }

    setIsUnlinking(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await unlinkCarer(relationshipToUnlink);

      setCarers((current) =>
        current.filter(
          (carer) =>
            carer.relationshipId !== relationshipToUnlink
        )
      );

      setRelationshipToUnlink(null);
      setSuccessMessage(
        "The carer has been unlinked and can no longer access your rehabilitation information."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The carer could not be unlinked."
      );
    } finally {
      setIsUnlinking(false);
    }
  };

  const updateAddCarerField = (
    field: keyof AddCarerForm,
    value: string
  ) => {
    setAddCarerForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSendCarerInvite = async () => {
    if (isSendingInvite) {
      return;
    }

    setIsSendingInvite(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result =
      await createSurvivorCarerInvitationAction({
        firstName: addCarerForm.firstName,
        lastName: addCarerForm.lastName,
        email: addCarerForm.email,
        phone: addCarerForm.phone,
        relationship: addCarerForm.relationship,
        message: addCarerForm.message,
      });

    setIsSendingInvite(false);

    if (!result.ok) {
      setErrorMessage(
        result.error ??
          "The carer invitation could not be sent."
      );

      return;
    }

    setShowAddCarerModal(false);
    setAddCarerForm(initialAddCarerForm);

    setSuccessMessage(
      result.warning ??
        "Your invitation has been sent to the carer. They will be linked once they accept."
    );
  };


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[40px] font-bold text-[#1E1E1E] dark:text-white">
          Linked Carer
        </h1>

        <p className="mt-1 text-[20px] text-[#424242] dark:text-[#C7C9CE]">
          Review who can access your rehabilitation information.
        </p>
      </header>

      {successMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p className="text-[14px] leading-[150%]">
            {successMessage}
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">
            <p className="text-[14px] leading-[150%]">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => void loadCarers()}
              className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl bg-white p-6 dark:bg-[#1C1E22] sm:p-8">
          {isLoading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <p className="text-[15px] text-[#666666] dark:text-[#C7C9CE]">
                Loading linked carers...
              </p>
            </div>
          ) : carers.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F2EEFC] text-[#592EBD]">
                <Users size={28} />
              </div>

              <h2 className="mt-5 text-[24px] font-semibold text-[#1E1E1E] dark:text-white">
                No linked carer
              </h2>

              <p className="mt-2 max-w-[440px] text-[15px] leading-[160%] text-[#666666] dark:text-[#C7C9CE]">
                You are not currently sharing rehabilitation information with a carer.
              </p>

              <Button
                type="button"
                onClick={() =>
                  setShowAddCarerModal(true)
                }
                className="mt-6 h-12 rounded-full bg-[#592EBD] px-7 text-white hover:bg-[#4B24A8]"
              >
                <Plus size={18} />
                Add Carer
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <h2 className="text-[26px] font-semibold text-[#1E1E1E] dark:text-white">
                  Your linked {carers.length === 1 ? "carer" : "carers"}
                </h2>

                <p className="mt-1 text-[14px] text-[#666666] dark:text-[#C7C9CE]">
                  Only active linked carers can access the information permitted below.
                </p>
              </div>

              {carers.map((carer) => {
                const isConfirming =
                  relationshipToUnlink === carer.relationshipId;

                return (
                  <article
                    key={carer.relationshipId}
                    className="rounded-2xl border border-[#E7E7E7] p-5 dark:border-[#34373D]"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ECE8FF] text-[18px] font-semibold text-[#592EBD]">
                          {getInitials(carer)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-[20px] font-semibold text-[#1E1E1E] dark:text-white">
                            {carer.displayName}
                          </h3>

                          <div className="mt-3 space-y-2 text-[14px] text-[#666666] dark:text-[#C7C9CE]">
                            {carer.email ? (
                              <p className="flex items-center gap-2">
                                <Mail size={15} />
                                <span className="truncate">
                                  {carer.email}
                                </span>
                              </p>
                            ) : null}

                            {carer.phone ? (
                              <p className="flex items-center gap-2">
                                <Phone size={15} />
                                {carer.phone}
                              </p>
                            ) : null}

                            <p className="flex items-center gap-2">
                              <CalendarDays size={15} />
                              Linked {formatLinkedDate(carer.linkedAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-emerald-700">
                        <CheckCircle2 size={14} />
                        Active
                      </span>
                    </div>

                    <div className="mt-5 border-t border-[#EEEEEE] pt-5 dark:border-[#34373D]">
                      <p className="text-[14px] font-semibold text-[#1E1E1E] dark:text-white">
                        Information this carer can access
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {carer.permissions.view_progress ? (
                          <PermissionPill label="Progress" />
                        ) : null}

                        {carer.permissions.view_sessions ? (
                          <PermissionPill label="Sessions" />
                        ) : null}

                        {carer.permissions.view_exercises ? (
                          <PermissionPill label="Exercises" />
                        ) : null}

                        {carer.permissions.add_notes ? (
                          <PermissionPill label="Shared notes" />
                        ) : null}

                        {carer.permissions.manage_reminders ? (
                          <PermissionPill label="Reminders" />
                        ) : null}
                      </div>
                    </div>

                    {isConfirming ? (
                      <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-600"
                          />

                          <div>
                            <p className="font-semibold text-red-800">
                              Unlink {carer.displayName}?
                            </p>

                            <p className="mt-1 text-[13px] leading-[150%] text-red-700">
                              They will immediately lose access to your rehabilitation information. Your existing session history will not be deleted.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isUnlinking}
                            onClick={() =>
                              setRelationshipToUnlink(null)
                            }
                            className="rounded-full"
                          >
                            Cancel
                          </Button>

                          <Button
                            type="button"
                            disabled={isUnlinking}
                            onClick={() => void handleUnlink()}
                            className="rounded-full bg-red-600 text-white hover:bg-red-700"
                          >
                            {isUnlinking
                              ? "Unlinking..."
                              : "Unlink carer"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setRelationshipToUnlink(
                              carer.relationshipId
                            )
                          }
                          className="rounded-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Link2Off size={17} />
                          Unlink carer
                        </Button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl bg-white p-6 dark:bg-[#1C1E22]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ECE8FF] text-[#592EBD]">
              <UserRound size={22} />
            </div>

            <h2 className="mt-4 text-[20px] font-semibold text-[#1E1E1E] dark:text-white">
              About linked carers
            </h2>

            <p className="mt-2 text-[14px] leading-[160%] text-[#666666] dark:text-[#C7C9CE]">
              A linked carer can support your rehabilitation and view only the information you have permitted.
            </p>

            <Button
              type="button"
              onClick={() =>
                setShowAddCarerModal(true)
              }
              className="mt-5 w-full rounded-full bg-[#592EBD] text-white hover:bg-[#4B24A8]"
            >
              <Plus size={17} />
              Add Carer
            </Button>
          </div>

          <div className="rounded-2xl bg-white p-6 dark:bg-[#1C1E22]">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={22}
                className="mt-0.5 shrink-0 text-[#592EBD]"
              />

              <div>
                <h3 className="font-semibold text-[#1E1E1E] dark:text-white">
                  Your control
                </h3>

                <p className="mt-1 text-[13px] leading-[155%] text-[#666666] dark:text-[#C7C9CE]">
                  You can unlink a carer at any time. Unlinking removes their future access but does not delete your rehabilitation records.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

        {showAddCarerModal ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-carer-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          >
            <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#1C1E22] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="add-carer-title"
                    className="text-[26px] font-bold text-[#1E1E1E] dark:text-white"
                  >
                    Invite a carer
                  </h2>

                  <p className="mt-2 text-[15px] leading-[160%] text-[#666666] dark:text-[#C7C9CE]">
                    Add the carer&apos;s details and AI-DRA will email them an invitation to connect with you.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddCarerModal(false)
                  }
                  className="rounded-full p-2 text-[#666666] hover:bg-[#F2EEFC] hover:text-[#592EBD]"
                  aria-label="Close add carer form"
                >
                  <Link2Off size={20} />
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[14px] font-semibold text-[#1E1E1E] dark:text-white">
                    First name
                  </span>
                  <input
                    value={addCarerForm.firstName}
                    onChange={(event) =>
                      updateAddCarerField(
                        "firstName",
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-[15px] outline-none focus:border-[#592EBD] dark:bg-[#111216]"
                    placeholder="e.g. Grace"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-[14px] font-semibold text-[#1E1E1E] dark:text-white">
                    Last name
                  </span>
                  <input
                    value={addCarerForm.lastName}
                    onChange={(event) =>
                      updateAddCarerField(
                        "lastName",
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-[15px] outline-none focus:border-[#592EBD] dark:bg-[#111216]"
                    placeholder="e.g. Asogbon"
                  />
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-[14px] font-semibold text-[#1E1E1E] dark:text-white">
                    Email address
                  </span>
                  <input
                    type="email"
                    value={addCarerForm.email}
                    onChange={(event) =>
                      updateAddCarerField(
                        "email",
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-[15px] outline-none focus:border-[#592EBD] dark:bg-[#111216]"
                    placeholder="carer@example.com"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-[14px] font-semibold text-[#1E1E1E] dark:text-white">
                    Phone number
                  </span>
                  <input
                    value={addCarerForm.phone}
                    onChange={(event) =>
                      updateAddCarerField(
                        "phone",
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-[15px] outline-none focus:border-[#592EBD] dark:bg-[#111216]"
                    placeholder="Optional"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-[14px] font-semibold text-[#1E1E1E] dark:text-white">
                    Relationship
                  </span>
                  <input
                    value={addCarerForm.relationship}
                    onChange={(event) =>
                      updateAddCarerField(
                        "relationship",
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-[15px] outline-none focus:border-[#592EBD] dark:bg-[#111216]"
                    placeholder="e.g. Daughter, friend, carer"
                  />
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-[14px] font-semibold text-[#1E1E1E] dark:text-white">
                    Message
                  </span>
                  <textarea
                    value={addCarerForm.message}
                    onChange={(event) =>
                      updateAddCarerField(
                        "message",
                        event.target.value
                      )
                    }
                    rows={4}
                    className="w-full rounded-xl border border-[#DDD8D4] bg-white px-4 py-3 text-[15px] outline-none focus:border-[#592EBD] dark:bg-[#111216]"
                    placeholder="Optional message to include in the invitation email"
                  />
                </label>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSendingInvite}
                  onClick={() =>
                    setShowAddCarerModal(false)
                  }
                  className="rounded-full"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  disabled={
                    isSendingInvite ||
                    !addCarerForm.email.trim()
                  }
                  onClick={() =>
                    void handleSendCarerInvite()
                  }
                  className="rounded-full bg-[#592EBD] text-white hover:bg-[#4B24A8]"
                >
                  {isSendingInvite ? (
                    <>
                      <Loader2 className="animate-spin" size={17} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={17} />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </section>
          </div>
        ) : null}
    </div>
  );
}

function PermissionPill({
  label,
}: {
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2EEFC] px-3 py-1.5 text-[12px] font-medium text-[#592EBD]">
      <ShieldCheck size={13} />
      {label}
    </span>
  );
}