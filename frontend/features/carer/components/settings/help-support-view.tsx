"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  FileWarning,
  HeartPulse,
  MessageCircle,
  TriangleAlert,
} from "lucide-react";

import {
  SettingsPageHeader,
  SettingsToast,
} from "@/features/carer/components/settings/settings-ui";
import { cn } from "@/lib/utils";

const faqs = [
  {
    id: "link-survivor",
    question: "How do I link a survivor account?",
    answer:
      "Open Invite / Link Survivor, enter the survivor’s details, review the invitation and send it. Access begins only after the survivor accepts.",
  },
  {
    id: "information-visible",
    question: "What rehabilitation information can I view?",
    answer:
      "You can view the information permitted by the survivor, such as rehabilitation sessions, assigned exercises, progress summaries and shared notes.",
  },
  {
    id: "clinical-decisions",
    question: "Can carers make clinical decisions in AI-DRA?",
    answer:
      "No. The carer portal supports encouragement, organisation and progress awareness. Clinical assessment and treatment decisions remain with qualified healthcare professionals.",
  },
  {
    id: "notes",
    question: "What is the difference between private and shared notes?",
    answer:
      "The yellow sidebar note is private to the carer. Notes added through the Notes tab are intended to be visible to the survivor when backend sharing is connected.",
  },
  {
    id: "remove-access",
    question: "How can a caregiver connection be removed?",
    answer:
      "Open the survivor profile or linked-survivor management page and choose the unlink or cancel option. The survivor can also revoke caregiver access.",
  },
];

export function HelpSupportView() {
  const [openFaqId, setOpenFaqId] =
    useState<string | null>(faqs[0].id);

  const [feedback, setFeedback] =
    useState<string | null>(null);

  function showPrototypeMessage(message: string) {
    setFeedback(message);
  }

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <SettingsToast
        message={feedback}
        onDismiss={() => setFeedback(null)}
      />

      <div className="mx-auto max-w-[1240px]">
        <SettingsPageHeader
          title="Help & Support"
          description="Find answers, report issues and access support resources."
        />

        <div className="mt-8 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-h-[600px] rounded-3xl bg-[#F8F7F6] p-4 sm:p-5">
            <h2 className="text-xl font-semibold text-[#292522]">
              Frequently Asked Questions
            </h2>

            <div className="mt-4 divide-y divide-[#E7E3DF]">
              {faqs.map((faq) => {
                const open = openFaqId === faq.id;

                return (
                  <article key={faq.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqId(
                          open ? null : faq.id,
                        )
                      }
                      className="flex min-h-[72px] w-full items-center gap-4 py-3 text-left"
                      aria-expanded={open}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0EFEE] text-[#625C57]">
                        <CircleHelp size={19} />
                      </span>

                      <span className="flex-1 text-sm font-medium text-[#403B37]">
                        {faq.question}
                      </span>

                      {open ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all",
                        open
                          ? "max-h-40 pb-5"
                          : "max-h-0",
                      )}
                    >
                      <p className="pl-[60px] pr-4 text-sm leading-6 text-[#746D68]">
                        {faq.answer}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </main>

          <aside className="space-y-5 xl:sticky xl:top-[118px]">
            <section className="rounded-2xl bg-[#F23636] p-5 text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <TriangleAlert size={22} />
              </span>

              <h2 className="mt-4 font-semibold">
                Emergency Notice
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/90">
                AI-DRA is not an emergency service. For an
                urgent medical concern, stop the activity
                and contact emergency services or the
                survivor’s healthcare professional.
              </p>
            </section>

            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5">
              <div className="flex gap-3">
                <MessageCircle
                  size={21}
                  className="mt-0.5 shrink-0 text-[#592EBD]"
                />

                <div>
                  <h2 className="font-semibold text-[#292522]">
                    Contact Research Team
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#746D68]">
                    Ask a question about the prototype or
                    request additional support.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  showPrototypeMessage(
                    "Research-team contact will be connected later.",
                  )
                }
                className="mt-5 min-h-12 w-full rounded-full border border-[#DDD8D4] text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
              >
                Contact Research Team
              </button>
            </section>

            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5">
              <div className="flex gap-3">
                <FileWarning
                  size={21}
                  className="mt-0.5 shrink-0 text-[#592EBD]"
                />

                <div>
                  <h2 className="font-semibold text-[#292522]">
                    Report an Issue
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#746D68]">
                    Report bugs or unexpected behaviour in
                    the carer portal.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  showPrototypeMessage(
                    "Issue reporting will be connected later.",
                  )
                }
                className="mt-5 min-h-12 w-full rounded-full border border-[#DDD8D4] text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
              >
                Report Issue
              </button>
            </section>

            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5">
              <div className="flex gap-3">
                <HeartPulse
                  size={21}
                  className="mt-0.5 shrink-0 text-[#592EBD]"
                />

                <div>
                  <h2 className="font-semibold text-[#292522]">
                    Rehabilitation Resources
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#746D68]">
                    Access trusted rehabilitation support
                    information when resource links are
                    connected.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  showPrototypeMessage(
                    "Rehabilitation resources will be connected later.",
                  )
                }
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#DDD8D4] text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
              >
                View Resources
                <ExternalLink size={16} />
              </button>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}