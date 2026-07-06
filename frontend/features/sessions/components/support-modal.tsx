"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  HeartHandshake,
  House,
  ShieldAlert,
  Stethoscope,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  GENERAL_STROKE_RECOVERY_RESOURCE,
  getExerciseSupportConfig,
  type SupportReason,
} from "@/features/support/nhs-resource-config";

type SupportModalProps = {
  exerciseSlug: string;
  exerciseTitle: string;
  reason?: SupportReason;
  onClose?: () => void;
  onTryAgain?: () => void;
};

export function SupportModal({
  exerciseSlug,
  exerciseTitle,
  reason = "GENERAL_DIFFICULTY",
  onClose,
  onTryAgain,
}: SupportModalProps) {
  const support = getExerciseSupportConfig({
    exerciseSlug,
    reason,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <HeartHandshake
              className="h-7 w-7"
              aria-hidden="true"
            />
          </div>

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5] text-[#424242] transition hover:bg-[#EDEDED] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/25"
              aria-label="Close support information"
            >
              <X size={20} />
            </button>
          ) : null}
        </div>

        <h2
          id="support-modal-title"
          className="mt-4 text-[24px] font-semibold leading-[135%] text-[#1E1E1E]"
        >
          {support.heading}
        </h2>

        <p className="mt-2 text-[15px] leading-[155%] text-[#666666]">
          During <strong>{exerciseTitle}</strong>,{" "}
          {support.observation.charAt(0).toLowerCase() +
            support.observation.slice(1)}
        </p>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
              aria-hidden="true"
            />

            <div>
              <p className="text-[14px] font-semibold text-amber-900">
                What to do now
              </p>

              <p className="mt-1 text-[14px] leading-[155%] text-amber-800">
                {support.immediateSuggestion}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[14px] font-semibold uppercase tracking-wide text-[#7875FB]">
            NHS guidance for this exercise
          </p>

          <a
            href={support.resource.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-start justify-between gap-4 rounded-2xl border border-[#E5E0F5] bg-[#F8F6FD] p-4 transition hover:border-[#B9AAE8] hover:bg-[#F3EFFC] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/20"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#592EBD]">
                <BookOpenText
                  size={21}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[15px] font-semibold leading-[145%] text-[#1E1E1E]">
                  {support.resource.title}
                </p>

                <p className="mt-0.5 text-[12px] font-medium text-[#7875FB]">
                  {support.resource.organisation}
                </p>

                <p className="mt-2 text-[13px] leading-[150%] text-[#666666]">
                  {support.resource.description}
                </p>

                <p className="mt-2 text-[13px] font-semibold text-[#592EBD]">
                  {support.resource.linkLabel}
                </p>
              </div>
            </div>

            <ArrowUpRight
              className="mt-1 h-5 w-5 shrink-0 text-[#592EBD]"
              aria-hidden="true"
            />
          </a>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            href={GENERAL_STROKE_RECOVERY_RESOURCE.url}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[82px] items-center gap-3 rounded-2xl border border-[#E7E7E7] p-4 text-left transition hover:bg-[#FAFAFA] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/20"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2EEFC] text-[#592EBD]">
              <Stethoscope
                size={19}
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-[14px] font-semibold text-[#1E1E1E]">
                General stroke recovery
              </p>

              <p className="mt-1 text-[12px] text-[#777777]">
                Read NHS recovery information
              </p>
            </div>
          </a>

          <div className="flex min-h-[82px] items-center gap-3 rounded-2xl border border-[#E7E7E7] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF8F1] text-[#23875B]">
              <HeartHandshake
                size={19}
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-[14px] font-semibold text-[#1E1E1E]">
                Speak to your rehabilitation professional
              </p>

              <p className="mt-1 text-[12px] leading-[145%] text-[#777777]">
                Especially if difficulty, pain or unusual discomfort continues
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[12px] leading-[155%] text-[#888888]">
          AI-DRA provides prototype movement feedback and does not replace
          advice from your physiotherapist, occupational therapist, GP or
          stroke rehabilitation team.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {onTryAgain ? (
            <Button
              type="button"
              onClick={onTryAgain}
              className="h-[54px] rounded-full bg-[#592EBD] text-[16px] font-medium text-white hover:bg-[#4B24A8]"
            >
              Review and Try Again
            </Button>
          ) : null}

          <Button
            asChild
            variant="outline"
            className="h-[54px] rounded-full border-[#E0E0E0] text-[16px] font-normal text-[#1E1E1E]"
          >
            <Link href="/dashboard">
              <House className="mr-2 h-5 w-5" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
