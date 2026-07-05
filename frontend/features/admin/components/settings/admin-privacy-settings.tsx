"use client";

import {
  BarChart3,
  Camera,
  CheckCircle2,
  Database,
  FileCheck2,
  Info,
  LockKeyhole,
  Save,
  ShieldCheck,
  Share2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";

import type { AdminPrivacySettings } from "@/features/admin/types/admin-settings";

import { SettingsCard } from "./settings-card";
import { SettingsPageHeader } from "./settings-page-header";
import { SettingsSaveNotice } from "./settings-save-notice";
import { SettingsSwitch } from "./settings-switch";

type Props = {
  initialSettings: AdminPrivacySettings;
};

type BooleanKey =
  | "collectUsageAnalytics"
  | "collectSessionData"
  | "collectCameraData"
  | "shareResearchData"
  | "thirdPartyIntegrations"
  | "restrictSurvivorAccess"
  | "auditDataAccess"
  | "approveExportRequests";

const STORAGE_KEY =
  "ai-dra-admin-privacy-settings";

export function AdminPrivacySettingsView({
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
      ) as AdminPrivacySettings;

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

  const updateBoolean = (
    key: BooleanKey,
    checked: boolean
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: checked,
    }));

    setSaved(false);
  };

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
          title="Privacy & Data Access"
          description="Review privacy, data collection and access-control preferences for the AI-DRA prototype."
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
              label: "Privacy & Data Access",
            },
          ]}
          actions={
            <button
              type="button"
              onClick={saveSettings}
              disabled={!hasChanges}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white disabled:opacity-45"
            >
              <Save size={17} />
              Save Changes
            </button>
          }
        />

        {saved ? (
          <div className="mt-6">
            <SettingsSaveNotice
              tone="success"
              message="Privacy preferences have been saved in this browser."
            />
          </div>
        ) : null}

        <section className="mt-7 rounded-2xl border border-[#DDD5F0] bg-gradient-to-r from-[#FAF8FF] to-white p-7">
          <div className="flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
              <ShieldCheck size={30} />
            </span>

            <div>
              <h2 className="text-xl font-bold text-[#282422]">
                Protecting Participant Privacy
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-[#625C58]">
                These controls represent the intended privacy
                configuration. Legal compliance, consent,
                retention and access policies must be
                formally approved before research deployment.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <SettingsCard
              title="Data Collection & Usage"
              description="Choose which data categories the prototype may process."
            >
              <PrivacyToggle
                icon={BarChart3}
                title="Collect Usage Analytics"
                description="Collect platform interaction data for engagement monitoring."
                checked={
                  settings.collectUsageAnalytics
                }
                onChange={(checked) =>
                  updateBoolean(
                    "collectUsageAnalytics",
                    checked
                  )
                }
              />

              <PrivacyToggle
                icon={Database}
                title="Collect Session Data"
                description="Store session status, repetitions, duration and attempt records."
                checked={
                  settings.collectSessionData
                }
                onChange={(checked) =>
                  updateBoolean(
                    "collectSessionData",
                    checked
                  )
                }
              />

              <PrivacyToggle
                icon={Camera}
                title="Process Camera Data"
                description="Allow camera-based pose and hand tracking during exercises."
                checked={
                  settings.collectCameraData
                }
                onChange={(checked) =>
                  updateBoolean(
                    "collectCameraData",
                    checked
                  )
                }
              />

              <PrivacyToggle
                icon={Users}
                title="Share De-identified Research Data"
                description="Permit approved de-identified data use in future research."
                checked={
                  settings.shareResearchData
                }
                onChange={(checked) =>
                  updateBoolean(
                    "shareResearchData",
                    checked
                  )
                }
              />

              <PrivacyToggle
                icon={Share2}
                title="Third-Party Integrations"
                description="Permit approved external service integrations."
                checked={
                  settings.thirdPartyIntegrations
                }
                onChange={(checked) =>
                  updateBoolean(
                    "thirdPartyIntegrations",
                    checked
                  )
                }
              />
            </SettingsCard>

            <SettingsCard
              title="Data Access Controls"
              description="Control administrative access to participant information."
            >
              <PrivacyToggle
                icon={LockKeyhole}
                title="Restrict Survivor Data Access"
                description="Limit detailed participant records to authorised roles."
                checked={
                  settings.restrictSurvivorAccess
                }
                onChange={(checked) =>
                  updateBoolean(
                    "restrictSurvivorAccess",
                    checked
                  )
                }
              />

              <PrivacyToggle
                icon={FileCheck2}
                title="Audit Data Access"
                description="Record authorised access to sensitive participant information."
                checked={settings.auditDataAccess}
                onChange={(checked) =>
                  updateBoolean(
                    "auditDataAccess",
                    checked
                  )
                }
              />

              <PrivacyToggle
                icon={ShieldCheck}
                title="Approve Export Requests"
                description="Require authorisation before sensitive data exports."
                checked={
                  settings.approveExportRequests
                }
                onChange={(checked) =>
                  updateBoolean(
                    "approveExportRequests",
                    checked
                  )
                }
              />
            </SettingsCard>
          </div>

          <div className="space-y-6">
            <SettingsCard
              title="User Consent Management"
              description="Consent workflows require approved wording and database records."
            >
              <PlannedPrivacyAction
                title="Consent Settings"
                description="Configure approved consent types and presentation rules."
              />

              <PlannedPrivacyAction
                title="Consent History"
                description="Review consent records and participant withdrawals."
              />
            </SettingsCard>

            <SettingsCard
              title="Data Retention"
              description="Prototype retention preferences for future policy implementation."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <PrivacySelect
                  label="User Account Data"
                  value={settings.accountRetention}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      accountRetention: value,
                    }))
                  }
                  options={[
                    "Until account deletion",
                    "1 year",
                    "2 years",
                    "5 years",
                  ]}
                />

                <PrivacySelect
                  label="Session & Activity Data"
                  value={settings.sessionRetention}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      sessionRetention: value,
                    }))
                  }
                  options={[
                    "6 months",
                    "1 year",
                    "2 years",
                    "5 years",
                  ]}
                />

                <PrivacySelect
                  label="Analytics Data"
                  value={settings.analyticsRetention}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      analyticsRetention: value,
                    }))
                  }
                  options={[
                    "1 year",
                    "2 years",
                    "3 years",
                    "5 years",
                  ]}
                />

                <PrivacySelect
                  label="Deleted User Data"
                  value={
                    settings.deletedDataRetention
                  }
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      deletedDataRetention: value,
                    }))
                  }
                  options={[
                    "Delete immediately",
                    "Delete after 7 days",
                    "Delete after 30 days",
                    "Delete after 90 days",
                  ]}
                />
              </div>
            </SettingsCard>

            <SettingsCard
              title="Data Region & Governance"
              description="Document the intended storage region and governance targets."
            >
              <PrivacySelect
                label="Preferred Data Region"
                value={settings.dataRegion}
                onChange={(value) =>
                  setSettings((current) => ({
                    ...current,
                    dataRegion: value,
                  }))
                }
                options={[
                  "United Kingdom",
                  "European Union",
                  "Not selected",
                ]}
              />

              <div className="mt-5">
                <p className="text-sm font-semibold text-[#393432]">
                  Governance Targets
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <GovernanceBadge label="UK GDPR review required" />
                  <GovernanceBadge label="Data Protection Act review required" />
                  <GovernanceBadge label="University approval required" />
                </div>
              </div>
            </SettingsCard>
          </div>
        </div>

        <div className="mt-6">
          <SettingsSaveNotice
            tone="warning"
            title="Policy approval required"
            message="Saving these prototype preferences does not establish legal compliance. Formal privacy, consent, retention, ethics and information-governance approval is still required."
          />
        </div>
      </div>
    </section>
  );
}

function PrivacyToggle({
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
    <div className="flex items-center justify-between gap-5 border-b border-[#EEEAE6] py-4 first:pt-0 last:border-0 last:pb-0">
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

function PlannedPrivacyAction({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      disabled
      className="flex w-full items-center gap-4 border-b border-[#EEEAE6] py-4 text-left last:border-0 disabled:opacity-65"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
        <FileCheck2 size={18} />
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
    </button>
  );
}

function PrivacySelect({
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
    <label>
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

function GovernanceBadge({
  label,
}: {
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF4DD] px-3 py-2 text-xs font-semibold text-[#8A5A08]">
      <Info size={13} />
      {label}
    </span>
  );
}