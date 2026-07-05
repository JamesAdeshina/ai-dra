"use client";

import Link from "next/link";
import {
  Award,
  Bell,
  ChevronRight,
  Flame,
  Info,
  MessageSquare,
  Minus,
  Plus,
  Save,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";

import type { AdminEngagementSettings } from "@/features/admin/types/admin-settings";

import { SettingsCard } from "./settings-card";
import { SettingsPageHeader } from "./settings-page-header";
import { SettingsSaveNotice } from "./settings-save-notice";
import { SettingsSwitch } from "./settings-switch";

type Props = {
  initialSettings: AdminEngagementSettings;
};

type BooleanSettingKey =
  | "streakTracking"
  | "achievementBadges"
  | "progressCelebration"
  | "weeklyGoalReminders"
  | "carerLeaderboard"
  | "motivationalMessages"
  | "activityNudges";

const STORAGE_KEY =
  "ai-dra-admin-engagement-settings";

const features: Array<{
  key: BooleanSettingKey;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    key: "streakTracking",
    title: "Streak Tracking",
    description:
      "Display daily and weekly activity streaks.",
    icon: Flame,
  },
  {
    key: "achievementBadges",
    title: "Achievement Badges",
    description:
      "Show badges for milestones and activity goals.",
    icon: Award,
  },
  {
    key: "progressCelebration",
    title: "Progress Celebration",
    description:
      "Show supportive messages after completed goals.",
    icon: Sparkles,
  },
  {
    key: "weeklyGoalReminders",
    title: "Weekly Goal Reminders",
    description:
      "Remind survivors about their weekly session goal.",
    icon: Bell,
  },
  {
    key: "carerLeaderboard",
    title: "Carer Engagement Ranking",
    description:
      "Optional engagement comparison for carers.",
    icon: Users,
  },
  {
    key: "motivationalMessages",
    title: "Motivational Messages",
    description:
      "Display supportive messages in participant dashboards.",
    icon: MessageSquare,
  },
  {
    key: "activityNudges",
    title: "Activity Nudges",
    description:
      "Prepare reminders after inactivity or missed sessions.",
    icon: Send,
  },
];

export function AdminEngagementSettingsView({
  initialSettings,
}: Props) {
  const [settings, setSettings] =
    useState(initialSettings);

  const [savedSettings, setSavedSettings] =
    useState(initialSettings);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored =
      window.localStorage.getItem(STORAGE_KEY);

    if (!stored) return;

    try {
      const parsed = JSON.parse(
        stored
      ) as AdminEngagementSettings;

      setSettings(parsed);
      setSavedSettings(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const hasChanges = useMemo(
    () =>
      JSON.stringify(settings) !==
      JSON.stringify(savedSettings),
    [settings, savedSettings]
  );

  const saveSettings = () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    setSavedSettings(settings);
    setSaved(true);
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <SettingsPageHeader
          title="Engagement Settings"
          description="Configure features and reminders intended to support consistent platform activity."
          breadcrumbs={[
            {
              label: "Admin",
              href: "/admin",
            },
            {
              label: "Settings",
              href: "/admin/settings",
            },
            {
              label: "Engagement",
            },
          ]}
          actions={
            <>
              <Link
                href="/admin/analytics"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#A98CE6] bg-white px-5 text-sm font-semibold text-[#592EBD]"
              >
                <TrendingUp size={17} />
                View Analytics
              </Link>

              <button
                type="button"
                onClick={saveSettings}
                disabled={!hasChanges}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white disabled:opacity-45"
              >
                <Save size={17} />
                Save Changes
              </button>
            </>
          }
        />

        {saved ? (
          <div className="mt-6">
            <SettingsSaveNotice
              tone="success"
              message="Engagement preferences have been saved in this browser."
            />
          </div>
        ) : null}

        <section className="mt-7 rounded-2xl border border-[#DDD5F0] bg-gradient-to-r from-[#FAF8FF] to-white p-7">
          <div className="flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
              <TrendingUp size={29} />
            </span>

            <div>
              <h2 className="text-xl font-bold text-[#282422]">
                Engagement Overview
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-[#625C58]">
                These controls define the intended
                engagement experience. Reminder delivery and
                personalised recommendations still require
                backend scheduling and participant consent.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <SettingsCard
              title="Engagement Features"
              description="Enable or disable engagement features across the platform."
            >
              <div className="divide-y divide-[#EEEAE6]">
                {features.map((feature) => (
                  <FeatureToggle
                    key={feature.key}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    checked={settings[feature.key]}
                    onChange={(checked) =>
                      setSettings((current) => ({
                        ...current,
                        [feature.key]: checked,
                      }))
                    }
                  />
                ))}
              </div>
            </SettingsCard>

            <SettingsCard
              title="Goal & Milestone Settings"
              description="Configure default activity targets."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-[#393432]">
                    Default Weekly Goal
                  </p>

                  <p className="mt-1 text-xs text-[#77706B]">
                    Number of rehabilitation sessions per
                    week.
                  </p>

                  <div className="mt-4 inline-flex items-center rounded-xl border border-[#DDD8D4]">
                    <button
                      type="button"
                      onClick={() =>
                        setSettings((current) => ({
                          ...current,
                          defaultWeeklyGoal: Math.max(
                            1,
                            current.defaultWeeklyGoal - 1
                          ),
                        }))
                      }
                      className="flex h-11 w-11 items-center justify-center"
                    >
                      <Minus size={17} />
                    </button>

                    <span className="flex h-11 min-w-14 items-center justify-center border-x border-[#DDD8D4] font-bold">
                      {settings.defaultWeeklyGoal}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setSettings((current) => ({
                          ...current,
                          defaultWeeklyGoal: Math.min(
                            14,
                            current.defaultWeeklyGoal + 1
                          ),
                        }))
                      }
                      className="flex h-11 w-11 items-center justify-center"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                </div>

                <SelectSetting
                  label="Milestone Celebration"
                  value={settings.milestoneEvery}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      milestoneEvery: value,
                    }))
                  }
                  options={[
                    "3 sessions",
                    "5 sessions",
                    "10 sessions",
                    "15 sessions",
                  ]}
                />
              </div>
            </SettingsCard>
          </div>

          <div className="space-y-6">
            <SettingsCard
              title="Reminder & Nudge Settings"
              description="Configure intended reminder timings."
            >
              <div className="space-y-5">
                <SelectSetting
                  label="Inactivity Nudge"
                  value={settings.inactivityNudgeDays}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      inactivityNudgeDays: value,
                    }))
                  }
                  options={[
                    "1 day",
                    "2 days",
                    "3 days",
                    "7 days",
                    "Disabled",
                  ]}
                />

                <SelectSetting
                  label="Missed Session Reminder"
                  value={
                    settings.missedSessionReminderHours
                  }
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      missedSessionReminderHours: value,
                    }))
                  }
                  options={[
                    "6 hours",
                    "12 hours",
                    "24 hours",
                    "48 hours",
                    "Disabled",
                  ]}
                />

                <SelectSetting
                  label="Weekly Summary Day"
                  value={settings.weeklySummaryDay}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      weeklySummaryDay: value,
                    }))
                  }
                  options={[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ]}
                />
              </div>

              <div className="mt-5 flex gap-3 rounded-xl bg-[#FAF8FF] p-4 text-sm text-[#625A6D]">
                <Info
                  size={18}
                  className="shrink-0 text-[#592EBD]"
                />
                Reminder delivery must respect each
                participant’s notification preferences and
                consent.
              </div>
            </SettingsCard>

            <SettingsCard
              title="Engagement Content"
              description="Planned content libraries for participant support."
            >
              <ContentLink
                icon={MessageSquare}
                title="Motivational Messages"
                description="Manage supportive dashboard messages."
              />

              <ContentLink
                icon={Info}
                title="Tips & Advice"
                description="Manage educational guidance."
              />

              <ContentLink
                icon={Target}
                title="Success Stories"
                description="Manage approved participant stories."
              />
            </SettingsCard>
          </div>
        </div>

        <div className="mt-6">
          <SettingsSaveNotice
            message="Engagement settings are configuration preferences only. Their effectiveness must be evaluated through approved co-design and research activities."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureToggle({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
          <Icon size={18} />
        </span>

        <div>
          <p className="text-sm font-semibold text-[#393432]">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#77706B]">
            {description}
          </p>
        </div>
      </div>

      <SettingsSwitch
        checked={checked}
        onCheckedChange={onChange}
        label={title}
      />
    </div>
  );
}

function SelectSetting({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#393432]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-11 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ContentLink({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      disabled
      className="flex w-full items-center gap-4 border-b border-[#EEEAE6] py-4 text-left last:border-0 last:pb-0 disabled:opacity-65"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
        <Icon size={18} />
      </span>

      <span className="flex-1">
        <span className="block text-sm font-semibold text-[#393432]">
          {title}
        </span>

        <span className="mt-1 block text-xs text-[#77706B]">
          {description}
        </span>
      </span>

      <span className="rounded-full bg-[#EEE8FF] px-2 py-1 text-[10px] font-semibold text-[#592EBD]">
        Planned
      </span>

      <ChevronRight size={17} />
    </button>
  );
}