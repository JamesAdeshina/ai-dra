"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BellRing,
  BrainCircuit,
  Copy,
  MessageCircle,
  TrendingUp,
  University,
  UsersRound,
} from "lucide-react";

import {
  SettingsPageHeader,
  SettingsToast,
} from "@/features/carer/components/settings/settings-ui";

const projectContactEmail = "support@ai-dra.co.uk";

export function AboutCarerPortalView() {
  const [feedback, setFeedback] =
    useState<string | null>(null);

  async function copyProjectEmail() {
    try {
      await navigator.clipboard.writeText(
        projectContactEmail,
      );

      setFeedback(
        "Project contact email copied.",
      );
    } catch {
      setFeedback(
        `Project contact: ${projectContactEmail}`,
      );
    }
  }

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <SettingsToast
        message={feedback}
        onDismiss={() => setFeedback(null)}
      />

      <div className="mx-auto max-w-[1240px]">
        <SettingsPageHeader
          title="About AI-DRA Carer Portal"
          description="Learn about the project and the role of the carer portal."
        />

        <div className="mt-8 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="space-y-5">
            <section className="grid gap-5 rounded-2xl border border-[#DEDAD6] bg-white p-5 shadow-[0_1px_4px_rgba(28,23,20,0.04)] lg:grid-cols-[80px_minmax(0,1fr)_160px] lg:items-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1ECFF] text-[#592EBD]">
                <BrainCircuit size={31} />
              </span>

              <div>
                <h2 className="font-semibold text-[#292522]">
                  Our Mission
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#746D68]">
                  AI-DRA, the AI Digital Rehabilitation
                  Assistant, is designed to support stroke
                  survivors completing upper-limb
                  rehabilitation activities.
                </p>

                <p className="mt-3 text-sm leading-6 text-[#746D68]">
                  The carer portal helps trusted supporters
                  remain informed, provide encouragement and
                  respond to rehabilitation activity without
                  replacing clinical care.
                </p>
              </div>

              <span className="flex h-32 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#592EBD]">
                <BrainCircuit size={64} />
              </span>
            </section>

            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
              <h2 className="font-semibold text-[#292522]">
                What is the AI-DRA Carer Portal?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#746D68]">
                The portal provides secure access to
                permitted survivor information, including
                rehabilitation activity, exercises,
                progress summaries and caregiver support
                tools.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {[
                  {
                    icon: UsersRound,
                    title: "Manage Survivors",
                    description:
                      "Invite, link and manage survivor connections.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Track Progress",
                    description:
                      "Review sessions, exercises and rehabilitation trends.",
                  },
                  {
                    icon: BellRing,
                    title: "Stay Involved",
                    description:
                      "Receive updates that support consistent encouragement.",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className={
                        index > 0
                          ? "border-t border-[#E7E3DF] pt-5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0"
                          : ""
                      }
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
                        <Icon size={22} />
                      </span>

                      <h3 className="mt-4 font-semibold text-[#292522]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#746D68]">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="flex gap-4 rounded-2xl border border-[#DEDAD6] bg-white p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F1ECFF] text-[#592EBD]">
                <University size={22} />
              </span>

              <div>
                <h2 className="font-semibold text-[#292522]">
                  University of Derby Research Project
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#746D68]">
                  AI-DRA is a research and development
                  project being developed at the University
                  of Derby with ongoing feedback from carers,
                  survivors and the project research team.
                </p>
              </div>
            </section>
          </main>

          <aside className="space-y-5 xl:sticky xl:top-[118px]">
            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
                  <BrainCircuit size={22} />
                </span>

                <h2 className="text-lg font-semibold text-[#292522]">
                  Version Information
                </h2>
              </div>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm font-medium text-[#746D68]">
                    Portal Version
                  </dt>

                  <dd className="text-sm text-[#514B47]">
                    Prototype 0.1.0
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm font-medium text-[#746D68]">
                    Last Updated
                  </dt>

                  <dd className="text-sm text-[#514B47]">
                    30 June 2026
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() =>
                  setFeedback(
                    "Release notes will be added later.",
                  )
                }
                className="mt-5 flex w-full items-center justify-between text-sm font-semibold text-[#403B37]"
              >
                What’s new in this version?
                <ArrowUpRight size={17} />
              </button>
            </section>

            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5">
              <div className="flex gap-3">
                <MessageCircle
                  size={21}
                  className="mt-0.5 shrink-0 text-[#592EBD]"
                />

                <div>
                  <h2 className="font-semibold text-[#292522]">
                    Give Feedback
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#746D68]">
                    Share suggestions to help improve the
                    carer portal.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFeedback(
                    "Feedback submission will be connected later.",
                  )
                }
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#DDD8D4] text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
              >
                Send Feedback
                <ArrowUpRight size={16} />
              </button>
            </section>

            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5">
              <div className="flex gap-3">
                <University
                  size={21}
                  className="mt-0.5 shrink-0 text-[#592EBD]"
                />

                <div>
                  <h2 className="font-semibold text-[#292522]">
                    Project Contact
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#746D68]">
                    AI-DRA Research Team
                    <br />
                    University of Derby
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={copyProjectEmail}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#DDD8D4] px-4 text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
              >
                <span className="truncate">
                  {projectContactEmail}
                </span>

                <Copy size={16} className="shrink-0" />
              </button>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}