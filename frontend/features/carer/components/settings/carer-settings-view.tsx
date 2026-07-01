"use client";

import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Info,
  Languages,
  LockKeyhole,
  LogOut,
  Moon,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

type SettingsLinkItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const accountSettings: SettingsLinkItem[] = [
  {
    title: "Profile Information",
    description: "Update your personal details",
    href: "/carer/settings/profile",
    icon: UserRound,
  },
  {
    title: "Change Password",
    description: "Update your account password",
    href: "/carer/settings/password",
    icon: LockKeyhole,
  },
  {
    title: "Notification Preferences",
    description: "Choose how and when you’re notified",
    href: "/carer/settings/notifications",
    icon: Bell,
  },
];

const supportSettings: SettingsLinkItem[] = [
  {
    title: "Help & Support",
    description: "FAQs, resources and contact options",
    href: "/carer/settings/help",
    icon: CircleHelp,
  },
  {
    title: "About AI-DRA Carer Portal",
    description: "Project, version and research information",
    href: "/carer/settings/about",
    icon: Info,
  },
];

function SettingsLink({
  item,
}: {
  item: SettingsLinkItem;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="flex min-h-[72px] items-center gap-4 rounded-xl px-3 transition hover:bg-white"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#592EBD]">
        <Icon size={19} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[#292522]">
          {item.title}
        </span>

        <span className="mt-1 block text-sm text-[#817A75]">
          {item.description}
        </span>
      </span>

      <ChevronRight
        size={20}
        className="shrink-0 text-[#292522]"
      />
    </Link>
  );
}

export function CarerSettingsView() {
  const [appearance, setAppearance] = useState<
    "LIGHT" | "DARK"
  >("LIGHT");

  const [language, setLanguage] =
    useState("English");

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1240px]">
        <header>
          <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#211E1C]">
            Settings
          </h1>

          <p className="mt-1 text-base text-[#5F5955]">
            Manage your account, preferences and app
            settings.
          </p>
        </header>

        <div className="mt-8 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="rounded-3xl bg-[#F8F7F6] p-4 sm:p-5">
            <section>
              <h2 className="px-3 text-xs font-bold uppercase tracking-wide text-[#292522]">
                Account Settings
              </h2>

              <div className="mt-1">
                {accountSettings.map((item) => (
                  <SettingsLink
                    key={item.href}
                    item={item}
                  />
                ))}
              </div>
            </section>

            <section className="mt-3">
              <h2 className="px-3 text-xs font-bold uppercase tracking-wide text-[#292522]">
                App Settings
              </h2>

              <div className="mt-1 space-y-1">
                <article className="flex min-h-[72px] flex-col gap-4 rounded-xl px-3 py-3 sm:flex-row sm:items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#592EBD]">
                    <Moon size={19} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-[#292522]">
                      Appearance
                    </h3>

                    <p className="mt-1 text-sm text-[#817A75]">
                      Choose your preferred display mode
                    </p>
                  </div>

                  <div className="flex overflow-hidden rounded-xl border border-[#DDD8D4] bg-white">
                    {(["LIGHT", "DARK"] as const).map(
                      (option) => {
                        const active =
                          appearance === option;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setAppearance(option)
                            }
                            className={cn(
                              "min-h-10 min-w-[82px] px-4 text-sm font-medium transition",
                              active
                                ? "border border-[#592EBD] text-[#592EBD]"
                                : "text-[#403B37]",
                            )}
                          >
                            {option === "LIGHT"
                              ? "Light"
                              : "Dark"}
                          </button>
                        );
                      },
                    )}
                  </div>
                </article>

                <article className="flex min-h-[72px] flex-col gap-4 rounded-xl px-3 py-3 sm:flex-row sm:items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#592EBD]">
                    <Languages size={19} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-[#292522]">
                      Language
                    </h3>

                    <p className="mt-1 text-sm text-[#817A75]">
                      Select your preferred language
                    </p>
                  </div>

                  <label className="relative">
                    <span className="sr-only">
                      Select language
                    </span>

                    <select
                      value={language}
                      onChange={(event) =>
                        setLanguage(event.target.value)
                      }
                      className="h-11 min-w-[150px] appearance-none rounded-xl border border-[#DDD8D4] bg-white px-4 pr-10 text-sm text-[#403B37] outline-none focus:border-[#592EBD]"
                    >
                      <option>English</option>
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                    />
                  </label>
                </article>
              </div>
            </section>

            <section className="mt-3">
              <h2 className="px-3 text-xs font-bold uppercase tracking-wide text-[#292522]">
                Support & About
              </h2>

              <div className="mt-1">
                {supportSettings.map((item) => (
                  <SettingsLink
                    key={item.href}
                    item={item}
                  />
                ))}
              </div>
            </section>

            <div className="mt-3 border-t border-[#E3DFDB] pt-3">
              <button
                type="button"
                className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl text-sm font-semibold text-[#292522] transition hover:bg-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0F0] text-[#F23636]">
                  <LogOut size={18} />
                </span>

                Log Out
              </button>
            </div>
          </main>

          <aside className="space-y-4 xl:sticky xl:top-[118px]">
            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
                  <UserRound size={22} />
                </span>

                <h2 className="text-lg font-semibold text-[#292522]">
                  Profile Summary
                </h2>
              </div>

              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="text-sm text-[#514B47]">
                    Member Since
                  </dt>

                  <dd className="mt-1 text-lg font-medium text-[#292522]">
                    23 May 2026
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-[#514B47]">
                    Email address
                  </dt>

                  <dd className="mt-1 break-all text-lg font-medium text-[#292522]">
                    harunanayaya37@gmail.com
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-[#514B47]">
                    Role
                  </dt>

                  <dd className="mt-1 text-lg font-medium text-[#292522]">
                    Carer
                  </dd>
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <dt className="text-sm text-[#514B47]">
                      Phone
                    </dt>

                    <dd className="mt-1 text-lg font-medium text-[#292522]">
                      +44 7700 900 184
                    </dd>
                  </div>

                  <Link
                    href="/carer/settings/profile"
                    className="inline-flex min-h-11 min-w-[82px] items-center justify-center rounded-full border border-[#DDD8D4] px-5 text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
                  >
                    Edit
                  </Link>
                </div>

                <div>
                  <dt className="text-sm text-[#514B47]">
                    Location
                  </dt>

                  <dd className="mt-1 text-lg font-medium text-[#292522]">
                    Derby, United Kingdom
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
              <h2 className="font-semibold text-[#292522]">
                Report an issue
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#746D68]">
                Report technical issues, bugs or unexpected
                behaviour encountered while using AI-DRA.
              </p>

              <button
                type="button"
                className="mt-5 min-h-12 w-full rounded-full border border-[#DDD8D4] text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
              >
                Report Issue
              </button>
            </section>

            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
              <h2 className="font-semibold text-[#292522]">
                Contact Research Team
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#746D68]">
                Have a question about AI-DRA or need
                additional support? Contact the research
                team for assistance.
              </p>

              <button
                type="button"
                className="mt-5 min-h-12 w-full rounded-full border border-[#DDD8D4] text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
              >
                Contact Research Team
              </button>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}