"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Info,
  Mail,
  RotateCcw,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import { linkedSurvivors as initialLinkedSurvivors } from "@/features/carer/data/linked-survivor-data";
import type {
  LinkedSurvivorRecord,
  LinkedSurvivorStatus,
} from "@/features/carer/types/linked-survivor";
import { cn } from "@/lib/utils";

const statusPresentation: Record<
  LinkedSurvivorStatus,
  {
    label: string;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending Acceptance",
    className: "bg-[#FFF7E5] text-[#AD7200]",
  },
  ACCEPTED: {
    label: "Invite Accepted",
    className: "bg-[#EAF8EF] text-[#258B55]",
  },
  EXPIRED: {
    label: "Invite Expired",
    className: "bg-[#FFF0F0] text-[#D33B3B]",
  },
};

function LinkedSurvivorCard({
  survivor,
  onResend,
}: {
  survivor: LinkedSurvivorRecord;
  onResend: (survivor: LinkedSurvivorRecord) => void;
}) {
  const status = statusPresentation[survivor.status];

  return (
    <article className="grid gap-5 rounded-2xl border border-[#DEDAD6] bg-white p-4 sm:grid-cols-[minmax(0,1.4fr)_150px_170px_145px] sm:items-center sm:p-5">
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative shrink-0">
          {survivor.avatarUrl ? (
            <img
              src={survivor.avatarUrl}
              alt=""
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EEE9FB] text-xl font-bold text-[#592EBD]">
              {survivor.initials}
            </span>
          )}

          <span className="absolute bottom-1 right-0 h-4 w-4 rounded-full border-[3px] border-white bg-[#F23636]" />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-[#292522]">
            {survivor.name}
          </h2>

          <p className="mt-2 text-sm text-[#514B47]">
            Age {survivor.age} • {survivor.conditionLabel}
          </p>

          <p className="mt-3 flex items-center gap-2 text-xs text-[#746D68]">
            <CalendarDays size={15} />
            Joined {survivor.joinedAtLabel}
          </p>

          <p className="mt-2 flex items-center gap-2 break-all text-xs text-[#746D68]">
            <Mail size={15} />
            {survivor.email}
          </p>
        </div>
      </div>

      <div className="border-t border-[#ECE8E4] pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
        <p className="text-xs text-[#817A75]">Role</p>
        <p className="mt-2 text-sm font-semibold text-[#292522]">
          Survivor
        </p>

        {survivor.linkedAtLabel ? (
          <>
            <p className="mt-4 text-xs text-[#817A75]">
              Linked On
            </p>

            <p className="mt-2 flex items-center gap-2 text-xs text-[#514B47]">
              <CalendarDays size={15} />
              {survivor.linkedAtLabel}
            </p>
          </>
        ) : null}
      </div>

      <div className="border-t border-[#ECE8E4] pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
        <p className="text-sm font-medium text-[#403B37]">
          Status
        </p>

        <span
          className={cn(
            "mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold",
            status.className,
          )}
        >
          {status.label}
        </span>
      </div>

      <div className="sm:text-right">
        {survivor.status === "ACCEPTED" &&
        survivor.survivorId ? (
          <Link
            href={`/carer/survivors/${survivor.survivorId}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#DDD8D4] px-5 text-sm font-semibold text-[#403B37] transition hover:border-[#592EBD] hover:text-[#592EBD]"
          >
            View Profile
          </Link>
        ) : null}

        {survivor.status === "PENDING" ? (
          <button
            type="button"
            disabled
            className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-full border border-[#DDD8D4] px-5 text-sm font-semibold text-[#918A85]"
          >
            Awaiting Response
          </button>
        ) : null}

        {survivor.status === "EXPIRED" ? (
          <button
            type="button"
            onClick={() => onResend(survivor)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#DDD8D4] px-5 text-sm font-semibold text-[#403B37] transition hover:border-[#592EBD] hover:text-[#592EBD]"
          >
            <RotateCcw size={16} />
            Resend Invite
          </button>
        ) : null}
      </div>
    </article>
  );
}

type ManageLinkedSurvivorsViewProps = {
  initialSurvivors?: LinkedSurvivorRecord[];
};

export function ManageLinkedSurvivorsView({
  initialSurvivors = initialLinkedSurvivors,
}: ManageLinkedSurvivorsViewProps) {
  const [survivors, setSurvivors] = useState(
    initialSurvivors,
  );

  const [message, setMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setSurvivors(initialSurvivors);
  }, [initialSurvivors]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [message]);

  function handleResend(survivor: LinkedSurvivorRecord) {
    setSurvivors((current) =>
      current.map((item) =>
        item.id === survivor.id
          ? {
              ...item,
              status: "PENDING",
            }
          : item,
      ),
    );

    setMessage(
      `Invitation resent to ${survivor.name}.`,
    );
  }

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {message ? (
        <div className="fixed right-4 top-24 z-50 flex w-[calc(100%-2rem)] max-w-sm items-center gap-3 rounded-xl border border-[#BCE8CE] bg-[#ECFAF2] px-4 py-3 text-[#18774A] shadow-lg">
          <CheckCircle2 size={20} />

          <p className="flex-1 text-sm font-medium">
            {message}
          </p>

          <button
            type="button"
            onClick={() => setMessage(null)}
            aria-label="Dismiss message"
          >
            <X size={18} />
          </button>
        </div>
      ) : null}

      <div className="mx-auto max-w-[1240px]">
        <Link
          href="/carer/invitations"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#7652EF] hover:text-[#592EBD]"
        >
          <ArrowLeft size={18} />
          Back to Invitations
        </Link>

        <div className="mt-3">
          <h1 className="text-3xl font-bold text-[#211E1C]">
            Manage Linked Survivors
          </h1>

          <p className="mt-1 text-sm text-[#5F5955]">
            View accepted, pending and expired survivor
            invitations.
          </p>
        </div>

        <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-3 rounded-2xl border border-[#DEDAD6] bg-white p-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)] sm:p-5">
            <div>
              <h2 className="text-lg font-semibold text-[#292522]">
                Survivor Information
              </h2>

              <p className="mt-1 text-sm text-[#746D68]">
                Invitations become active links only after
                the survivor accepts them.
              </p>
            </div>

            {survivors.map((survivor) => (
              <LinkedSurvivorCard
                key={survivor.id}
                survivor={survivor}
                onResend={handleResend}
              />
            ))}
          </div>

          <aside className="space-y-4 xl:sticky xl:top-[118px]">
            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
                  <UsersRound size={20} />
                </span>

                <h2 className="text-lg font-semibold text-[#292522]">
                  About Linked Survivors
                </h2>
              </div>

              <p className="mt-5 text-sm leading-6 text-[#746D68]">
                When a survivor accepts your invitation,
                their rehabilitation information becomes
                available according to the permissions they
                grant.
              </p>
            </section>

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
          </aside>
        </div>
      </div>
    </section>
  );
}