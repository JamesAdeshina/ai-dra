"use client";

import {
  Bell,
  Clock3,
  Info,
  Mail,
  MessageSquare,
  Save,
  Send,
  Smartphone,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type {
  AdminNotificationPreferenceItem,
  AdminNotificationPreferences,
} from "@/features/admin/types/admin-settings";

import { SettingsCard } from "./settings-card";
import { SettingsPageHeader } from "./settings-page-header";
import { SettingsSaveNotice } from "./settings-save-notice";
import { SettingsSwitch } from "./settings-switch";

type Props = {
  initialSettings: AdminNotificationPreferences;
};

type ItemChannel = "email" | "inApp" | "sms";

const STORAGE_KEY =
  "ai-dra-admin-notification-preferences";

export function AdminNotificationSettingsView({
  initialSettings,
}: Props) {
  const [settings, setSettings] =
    useState(initialSettings);

  const [savedSettings, setSavedSettings] =
    useState(initialSettings);

  const [notice, setNotice] = useState<{
    tone: "success" | "warning";
    message: string;
  } | null>(null);

  useEffect(() => {
    const stored =
      window.localStorage.getItem(STORAGE_KEY);

    if (!stored) return;

    try {
      const parsed = JSON.parse(
        stored
      ) as AdminNotificationPreferences;

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

  const updateChannel = (
    channel: keyof AdminNotificationPreferences["channels"],
    checked: boolean
  ) => {
    setSettings((current) => ({
      ...current,
      channels: {
        ...current.channels,
        [channel]: checked,
      },
    }));

    setNotice(null);
  };

  const updateItem = (
    id: string,
    channel: ItemChannel,
    checked: boolean
  ) => {
    setSettings((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? {
              ...item,
              [channel]: checked,
            }
          : item
      ),
    }));

    setNotice(null);
  };

  const toggleDigestItem = (item: string) => {
    setSettings((current) => ({
      ...current,
      digestIncludes:
        current.digestIncludes.includes(item)
          ? current.digestIncludes.filter(
              (value) => value !== item
            )
          : [...current.digestIncludes, item],
    }));
  };

  const saveSettings = () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    setSavedSettings(settings);

    setNotice({
      tone: "success",
      message:
        "Notification preferences have been saved in this browser.",
    });
  };

  const simulateTest = () => {
    setNotice({
      tone: "warning",
      message:
        "A test notification was simulated in the frontend. No email, SMS or push notification was sent.",
    });
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <SettingsPageHeader
          title="Notification Preferences"
          description="Manage how and when you receive monitoring notifications from AI-DRA."
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
              label: "Notifications",
            },
          ]}
          actions={
            <>
              <button
                type="button"
                onClick={simulateTest}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#A98CE6] bg-white px-5 text-sm font-semibold text-[#592EBD]"
              >
                <Send size={17} />
                Test Notification
              </button>

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

        {notice ? (
          <div className="mt-6">
            <SettingsSaveNotice
              tone={notice.tone}
              message={notice.message}
            />
          </div>
        ) : null}

        <div className="mt-7">
          <SettingsCard
            title="Notification Channels"
            description="Choose which communication channels may be used."
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <ChannelCard
                icon={Mail}
                title="Email Notifications"
                description="Receive monitoring alerts by email."
                checked={settings.channels.email}
                onChange={(checked) =>
                  updateChannel("email", checked)
                }
              />

              <ChannelCard
                icon={Bell}
                title="In-App Notifications"
                description="Receive alerts inside the admin portal."
                checked={settings.channels.inApp}
                onChange={(checked) =>
                  updateChannel("inApp", checked)
                }
              />

              <ChannelCard
                icon={Smartphone}
                title="SMS Notifications"
                description="SMS delivery requires a messaging provider."
                checked={settings.channels.sms}
                onChange={(checked) =>
                  updateChannel("sms", checked)
                }
                planned
              />
            </div>
          </SettingsCard>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_470px]">
          <SettingsCard
            title="Notification Types"
            description="Select which types of events should use each enabled channel."
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-[#EEEAE6] text-left">
                    <th className="pb-4 text-sm font-semibold text-[#625C58]">
                      Notification
                    </th>
                    <th className="pb-4 text-center text-sm font-semibold text-[#625C58]">
                      Email
                    </th>
                    <th className="pb-4 text-center text-sm font-semibold text-[#625C58]">
                      In-App
                    </th>
                    <th className="pb-4 text-center text-sm font-semibold text-[#625C58]">
                      SMS
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {settings.items.map((item) => (
                    <NotificationRow
                      key={item.id}
                      item={item}
                      channels={settings.channels}
                      onChange={updateItem}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </SettingsCard>

          <aside className="space-y-6">
            <SettingsCard
              title="Quiet Hours"
              description="Pause non-urgent notifications during selected hours."
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Clock3
                    size={19}
                    className="text-[#592EBD]"
                  />

                  <span className="text-sm font-semibold text-[#393432]">
                    Enable Quiet Hours
                  </span>
                </div>

                <SettingsSwitch
                  checked={
                    settings.quietHoursEnabled
                  }
                  onCheckedChange={(checked) =>
                    setSettings((current) => ({
                      ...current,
                      quietHoursEnabled: checked,
                    }))
                  }
                  label="Enable quiet hours"
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <TimeField
                  label="Start Time"
                  value={settings.quietHoursStart}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      quietHoursStart: value,
                    }))
                  }
                />

                <TimeField
                  label="End Time"
                  value={settings.quietHoursEnd}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      quietHoursEnd: value,
                    }))
                  }
                />
              </div>

              <div className="mt-5 flex gap-3 rounded-xl bg-[#FAF8FF] p-4 text-sm text-[#625A6D]">
                <Info
                  size={18}
                  className="shrink-0 text-[#592EBD]"
                />
                Important platform alerts may still appear
                during quiet hours.
              </div>
            </SettingsCard>

            <SettingsCard
              title="Digest Preferences"
              description="Choose how often summary reports should be prepared."
            >
              <label className="block">
                <span className="text-sm font-semibold text-[#393432]">
                  Digest Frequency
                </span>

                <select
                  value={settings.digestFrequency}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      digestFrequency:
                        event.target
                          .value as AdminNotificationPreferences["digestFrequency"],
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm"
                >
                  <option>Never</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </label>

              <div className="mt-5 space-y-3">
                {[
                  "Survivor progress summaries",
                  "Session activity highlights",
                  "Engagement insights",
                  "System updates",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 text-sm text-[#514B47]"
                  >
                    <input
                      type="checkbox"
                      checked={settings.digestIncludes.includes(
                        item
                      )}
                      onChange={() =>
                        toggleDigestItem(item)
                      }
                      className="h-4 w-4 accent-[#592EBD]"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </SettingsCard>
          </aside>
        </div>

        <div className="mt-6">
          <SettingsSaveNotice
            message="These preferences are stored locally. Actual email, SMS and scheduled digest delivery require backend notification services."
          />
        </div>
      </div>
    </section>
  );
}

function ChannelCard({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  planned = false,
}: {
  icon: typeof Mail;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  planned?: boolean;
}) {
  return (
    <article className="rounded-xl border border-[#E4DFDB] p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
          <Icon size={20} />
        </span>

        <SettingsSwitch
          checked={checked}
          onCheckedChange={onChange}
          label={title}
        />
      </div>

      <h3 className="mt-4 font-semibold text-[#393432]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#77706B]">
        {description}
      </p>

      {planned ? (
        <span className="mt-3 inline-flex rounded-full bg-[#FFF4DD] px-3 py-1 text-xs font-semibold text-[#B16C00]">
          Provider required
        </span>
      ) : null}
    </article>
  );
}

function NotificationRow({
  item,
  channels,
  onChange,
}: {
  item: AdminNotificationPreferenceItem;
  channels: AdminNotificationPreferences["channels"];
  onChange: (
    id: string,
    channel: ItemChannel,
    checked: boolean
  ) => void;
}) {
  return (
    <tr className="border-b border-[#EEEAE6] last:border-0">
      <td className="py-4 pr-4">
        <p className="text-sm font-semibold text-[#393432]">
          {item.title}
        </p>

        <p className="mt-1 text-xs text-[#77706B]">
          {item.description}
        </p>
      </td>

      <td className="py-4 text-center">
        <SettingsSwitch
          checked={item.email}
          disabled={!channels.email}
          onCheckedChange={(checked) =>
            onChange(item.id, "email", checked)
          }
          label={`${item.title} email`}
        />
      </td>

      <td className="py-4 text-center">
        <SettingsSwitch
          checked={item.inApp}
          disabled={!channels.inApp}
          onCheckedChange={(checked) =>
            onChange(item.id, "inApp", checked)
          }
          label={`${item.title} in-app`}
        />
      </td>

      <td className="py-4 text-center">
        <SettingsSwitch
          checked={item.sms}
          disabled={!channels.sms}
          onCheckedChange={(checked) =>
            onChange(item.id, "sms", checked)
          }
          label={`${item.title} SMS`}
        />
      </td>
    </tr>
  );
}

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="text-xs font-semibold text-[#625C58]">
        {label}
      </span>

      <input
        type="time"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-11 w-full rounded-xl border border-[#DDD8D4] px-3 text-sm"
      />
    </label>
  );
}