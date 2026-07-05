import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CircleHelp,
  Download,
  Info,
  Laptop,
  LockKeyhole,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  AdminSettingsCategory,
  AdminSettingsIconName,
  AdminSettingsTone,
} from "@/features/admin/types/admin-settings";
import { cn } from "@/lib/utils";

import { SettingsPageHeader } from "./settings-page-header";
import { SettingsSaveNotice } from "./settings-save-notice";

type AdminSettingsOverviewProps = {
  categories: AdminSettingsCategory[];
};

const iconMap: Record<
  AdminSettingsIconName,
  LucideIcon
> = {
  profile: UserRound,
  security: LockKeyhole,
  notifications: Bell,
  engagement: TrendingUp,
  privacy: ShieldCheck,
  export: Download,
  system: Info,
};

const toneClasses: Record<
  AdminSettingsTone,
  {
    icon: string;
    number: string;
  }
> = {
  purple: {
    icon: "bg-[#EEE8FF] text-[#592EBD]",
    number: "bg-[#F1ECFF] text-[#592EBD]",
  },
  blue: {
    icon: "bg-[#E8F2FF] text-[#2879D8]",
    number: "bg-[#EDF4FF] text-[#2879D8]",
  },
  pink: {
    icon: "bg-[#FFEAF2] text-[#E84A84]",
    number: "bg-[#FFF0F5] text-[#E84A84]",
  },
  green: {
    icon: "bg-[#E6F7EF] text-[#20A663]",
    number: "bg-[#ECFAF2] text-[#18834D]",
  },
  orange: {
    icon: "bg-[#FFF0E3] text-[#F28322]",
    number: "bg-[#FFF4EA] text-[#D96F13]",
  },
  cyan: {
    icon: "bg-[#E5F8FA] text-[#13A7B7]",
    number: "bg-[#EBFAFC] text-[#0E8F9D]",
  },
};

export function AdminSettingsOverview({
  categories,
}: AdminSettingsOverviewProps) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <SettingsPageHeader
          title="Settings Overview"
          description="Manage your admin account, preferences and platform configuration."
          actions={
            <Link
              href="/admin/settings/system"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#D9D0F0] bg-white px-4 text-sm font-semibold text-[#592EBD] transition hover:bg-[#FAF8FF]"
            >
              <CircleHelp size={17} />
              Need help?
            </Link>
          }
        />

        <section className="relative mt-8 overflow-hidden rounded-2xl border border-[#DDD5F0] bg-gradient-to-r from-[#FAF8FF] via-white to-[#F7F4FF] px-6 py-7 shadow-sm sm:px-8">
          <div className="relative z-10 flex max-w-3xl items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
              <ShieldCheck size={30} />
            </span>

            <div>
              <h2 className="text-xl font-bold text-[#282422]">
                Secure. Personalised. In Control.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#625C58] sm:text-base">
                Use these settings to manage your account,
                control notifications, configure engagement
                preferences and review data-access options
                across the AI-DRA platform.
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-6 hidden h-full w-[330px] items-end justify-center lg:flex">
            <div className="relative mb-[-10px]">
              <div className="relative flex h-32 w-52 items-center justify-center rounded-t-2xl border-[7px] border-[#D5D8E0] bg-white shadow-sm">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
                  <Settings2 size={31} />
                </span>

                <div className="absolute right-5 top-7 space-y-3">
                  <span className="block h-2 w-12 rounded-full bg-[#EBE8EF]" />
                  <span className="block h-2 w-9 rounded-full bg-[#EBE8EF]" />
                  <span className="block h-2 w-14 rounded-full bg-[#EBE8EF]" />
                </div>
              </div>

              <div className="mx-auto h-3 w-64 rounded-b-full bg-[#C9CDD6]" />

              <div className="absolute -right-16 bottom-0 w-36 rounded-xl border border-[#E1DDEA] bg-white p-4 shadow-lg">
                <div className="space-y-3">
                  <ControlLine enabled />
                  <ControlLine enabled />
                  <ControlLine enabled />
                </div>
              </div>

              <Laptop
                size={20}
                className="absolute bottom-6 left-5 text-[#B4AEC0]"
              />
            </div>
          </div>

          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#EEE8FF]/45 blur-3xl" />
        </section>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-[#282422]">
            Settings Categories
          </h2>

          <p className="mt-1 text-sm text-[#77706B]">
            Select a category to review and manage your
            preferences.
          </p>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {categories.map((category) => (
            <SettingsCategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>

        <div className="mt-6">
          <SettingsSaveNotice
            message="Settings pages currently use frontend prototype data. Changes will be saved locally until authentication, permissions and Supabase settings tables are connected."
          />
        </div>
      </div>
    </section>
  );
}

function SettingsCategoryCard({
  category,
}: {
  category: AdminSettingsCategory;
}) {
  const Icon = iconMap[category.icon];
  const tone = toneClasses[category.tone];

  return (
    <article className="group flex min-h-[270px] flex-col rounded-2xl border border-[#E4DFDB] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#CBBDEB] hover:shadow-md">
      <div className="flex flex-1 flex-col items-center text-center">
        <span
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full",
            tone.icon
          )}
        >
          <Icon size={34} />
        </span>

        <h3 className="mt-5 text-lg font-bold text-[#282422]">
          {category.title}
        </h3>

        <p className="mt-3 max-w-sm text-sm leading-6 text-[#77706B]">
          {category.description}
        </p>

        <Link
          href={category.href}
          className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[#592EBD]"
        >
          {category.actionLabel}

          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}

function ControlLine({
  enabled,
}: {
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="h-2 w-14 rounded-full bg-[#ECE9F0]" />

      <span
        className={cn(
          "relative h-5 w-9 rounded-full",
          enabled
            ? "bg-[#592EBD]"
            : "bg-[#D7DCE6]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white",
            enabled ? "right-0.5" : "left-0.5"
          )}
        />
      </span>
    </div>
  );
}