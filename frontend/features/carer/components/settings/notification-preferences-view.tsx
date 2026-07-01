"use client";

import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  Mail,
  MessageCircle,
  MessageSquare,
  Smartphone,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import {
  SettingsPageHeader,
  SettingsToast,
  ToggleSwitch,
} from "@/features/carer/components/settings/settings-ui";

type NotificationPreferences = {
  email: boolean;
  push: boolean;
  sms: boolean;
  progressUpdates: boolean;
  sessionReminders: boolean;
  missedSessionAlerts: boolean;
  invitationUpdates: boolean;
  weeklySummaries: boolean;
};

const initialPreferences: NotificationPreferences = {
  email: true,
  push: false,
  sms: false,
  progressUpdates: true,
  sessionReminders: true,
  missedSessionAlerts: true,
  invitationUpdates: true,
  weeklySummaries: false,
};

type PreferenceRowProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function PreferenceRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: PreferenceRowProps) {
  return (
    <article className="flex items-center gap-4 px-4 py-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F1ECFF] text-[#592EBD]">
        <Icon size={19} />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-[#292522]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-5 text-[#817A75]">
          {description}
        </p>
      </div>

      <ToggleSwitch
        checked={checked}
        onChange={onChange}
        label={`${title} notifications`}
      />
    </article>
  );
}

export function NotificationPreferencesView() {
  const [preferences, setPreferences] =
    useState(initialPreferences);

  const [savedPreferences, setSavedPreferences] =
    useState(initialPreferences);

  const [feedback, setFeedback] =
    useState<string | null>(null);

  function updatePreference(
    field: keyof NotificationPreferences,
    checked: boolean,
  ) {
    setPreferences((current) => ({
      ...current,
      [field]: checked,
    }));
  }

  function handleSave() {
    setSavedPreferences(preferences);
    setFeedback(
      "Notification preferences saved successfully.",
    );
  }

  function handleCancel() {
    setPreferences(savedPreferences);
  }

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <SettingsToast
        message={feedback}
        onDismiss={() => setFeedback(null)}
      />

      <div className="mx-auto max-w-[1240px]">
        <SettingsPageHeader
          title="Notification Preferences"
          description="Choose how and when you want to be notified."
        />

        <div className="mt-8 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="rounded-2xl border border-[#DEDAD6] bg-white p-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)] sm:p-5">
            <section>
              <h2 className="font-semibold text-[#292522]">
                Notification Channels
              </h2>

              <p className="mt-1 text-sm text-[#746D68]">
                Choose where you want to receive
                notifications.
              </p>

              <div className="mt-4 divide-y divide-[#ECE8E4] rounded-2xl border border-[#DEDAD6]">
                <PreferenceRow
                  icon={Mail}
                  title="Email Notifications"
                  description="Receive updates at your account email address."
                  checked={preferences.email}
                  onChange={(checked) =>
                    updatePreference("email", checked)
                  }
                />

                <PreferenceRow
                  icon={Smartphone}
                  title="Push Notifications"
                  description="Receive browser or device notifications."
                  checked={preferences.push}
                  onChange={(checked) =>
                    updatePreference("push", checked)
                  }
                />

                <PreferenceRow
                  icon={MessageSquare}
                  title="SMS Notifications"
                  description="Receive important updates by text message."
                  checked={preferences.sms}
                  onChange={(checked) =>
                    updatePreference("sms", checked)
                  }
                />
              </div>
            </section>

            <section className="mt-6">
              <h2 className="font-semibold text-[#292522]">
                Notification Types
              </h2>

              <p className="mt-1 text-sm text-[#746D68]">
                Choose the rehabilitation updates you want
                to receive.
              </p>

              <div className="mt-4 divide-y divide-[#ECE8E4] rounded-2xl border border-[#DEDAD6]">
                <PreferenceRow
                  icon={Sparkles}
                  title="Progress Updates"
                  description="Updates about linked survivor progress and achievements."
                  checked={preferences.progressUpdates}
                  onChange={(checked) =>
                    updatePreference(
                      "progressUpdates",
                      checked,
                    )
                  }
                />

                <PreferenceRow
                  icon={CalendarDays}
                  title="Session Reminders"
                  description="Reminders for upcoming rehabilitation sessions."
                  checked={preferences.sessionReminders}
                  onChange={(checked) =>
                    updatePreference(
                      "sessionReminders",
                      checked,
                    )
                  }
                />

                <PreferenceRow
                  icon={TriangleAlert}
                  title="Missed Session Alerts"
                  description="Alerts when a linked survivor misses scheduled activity."
                  checked={preferences.missedSessionAlerts}
                  onChange={(checked) =>
                    updatePreference(
                      "missedSessionAlerts",
                      checked,
                    )
                  }
                />

                <PreferenceRow
                  icon={MessageCircle}
                  title="Invitation Updates"
                  description="Updates when invitations are accepted, declined or expire."
                  checked={preferences.invitationUpdates}
                  onChange={(checked) =>
                    updatePreference(
                      "invitationUpdates",
                      checked,
                    )
                  }
                />

                <PreferenceRow
                  icon={Bell}
                  title="Weekly Summaries"
                  description="A weekly overview of linked survivor activity."
                  checked={preferences.weeklySummaries}
                  onChange={(checked) =>
                    updatePreference(
                      "weeklySummaries",
                      checked,
                    )
                  }
                />
              </div>
            </section>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/carer/settings"
                onClick={handleCancel}
                className="inline-flex min-h-12 min-w-[165px] items-center justify-center rounded-full border border-[#DDD8D4] px-6 text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
              >
                Cancel
              </Link>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex min-h-12 min-w-[175px] items-center justify-center rounded-full bg-[#592EBD] px-6 text-sm font-semibold text-white hover:bg-[#4B24A8]"
              >
                Save Preferences
              </button>
            </div>
          </main>

          <aside className="space-y-4 xl:sticky xl:top-[118px]">
            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
                  <Bell size={22} />
                </span>

                <h2 className="text-lg font-semibold text-[#292522]">
                  About Notifications
                </h2>
              </div>

              <div className="mt-5 divide-y divide-[#ECE8E4]">
                {[
                  {
                    title: "Progress notifications",
                    text: "Keep up with milestones and completed sessions.",
                  },
                  {
                    title: "Attention alerts",
                    text: "Surface missed sessions or reported difficulty.",
                  },
                  {
                    title: "Invitation updates",
                    text: "Know when caregiver links change status.",
                  },
                ].map((item) => (
                  <article
                    key={item.title}
                    className="flex gap-3 py-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1ECFF] text-[#592EBD]">
                      <Bell size={17} />
                    </span>

                    <div>
                      <h3 className="text-sm font-semibold text-[#292522]">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-[#746D68]">
                        {item.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
              <h2 className="font-semibold text-[#292522]">
                Give Feedback
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#746D68]">
                Share suggestions about the notifications
                that would be most useful to carers.
              </p>

              <button
                type="button"
                className="mt-5 min-h-12 w-full rounded-full border border-[#DDD8D4] text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
              >
                Send Feedback
              </button>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}