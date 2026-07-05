"use client";

import {
  CalendarDays,
  CheckCircle2,
  Database,
  Download,
  FileJson,
  FileSpreadsheet,
  Info,
  LockKeyhole,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type {
  AdminExportFormat,
  AdminExportSettings,
  AdminPreparedExport,
} from "@/features/admin/types/admin-settings";

import { SettingsCard } from "./settings-card";
import { SettingsPageHeader } from "./settings-page-header";
import { SettingsSaveNotice } from "./settings-save-notice";

const SETTINGS_KEY =
  "ai-dra-admin-export-settings";

const HISTORY_KEY =
  "ai-dra-admin-prepared-exports";

const exportCategories = [
  {
    id: "survivors",
    title: "Survivor Engagement Data",
    description:
      "Participant IDs, onboarding and engagement summaries.",
  },
  {
    id: "carers",
    title: "Carer Monitoring Data",
    description:
      "Carer accounts and link-status summaries.",
  },
  {
    id: "sessions",
    title: "Session Data",
    description:
      "Session dates, statuses, duration and repetitions.",
  },
  {
    id: "exercises",
    title: "Exercise Data",
    description:
      "Exercise catalogue and usage summaries.",
  },
  {
    id: "analytics",
    title: "Analytics Summary",
    description:
      "Aggregated platform engagement indicators.",
  },
  {
    id: "system",
    title: "System & Audit Logs",
    description:
      "Requires backend audit-log integration.",
  },
];

const initialSettings: AdminExportSettings = {
  categories: [
    "survivors",
    "carers",
    "sessions",
    "exercises",
    "analytics",
  ],
  datePreset: "Last 30 Days",
  startDate: "",
  endDate: "",
  format: "CSV",
};

export function AdminExportSettingsView() {
  const [settings, setSettings] =
    useState(initialSettings);

  const [history, setHistory] = useState<
    AdminPreparedExport[]
  >([]);

  const [notice, setNotice] = useState<{
    tone: "success" | "danger";
    message: string;
  } | null>(null);

  useEffect(() => {
    const storedSettings =
      window.localStorage.getItem(SETTINGS_KEY);

    const storedHistory =
      window.localStorage.getItem(HISTORY_KEY);

    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch {
        window.localStorage.removeItem(
          SETTINGS_KEY
        );
      }
    }

    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch {
        window.localStorage.removeItem(
          HISTORY_KEY
        );
      }
    }
  }, []);

  const selectedCount =
    settings.categories.length;

  const selectedNames = useMemo(
    () =>
      exportCategories
        .filter((category) =>
          settings.categories.includes(
            category.id
          )
        )
        .map((category) => category.title),
    [settings.categories]
  );

  const toggleCategory = (id: string) => {
    setSettings((current) => ({
      ...current,
      categories: current.categories.includes(id)
        ? current.categories.filter(
            (value) => value !== id
          )
        : [...current.categories, id],
    }));

    setNotice(null);
  };

  const prepareExport = () => {
    if (settings.categories.length === 0) {
      setNotice({
        tone: "danger",
        message:
          "Select at least one data category.",
      });
      return;
    }

    if (
      settings.datePreset === "Custom Range" &&
      (!settings.startDate ||
        !settings.endDate)
    ) {
      setNotice({
        tone: "danger",
        message:
          "Choose both dates for a custom range.",
      });
      return;
    }

    const createdAt =
      new Date().toLocaleString("en-GB");

    const prepared: AdminPreparedExport = {
      id: crypto.randomUUID(),
      name: `AI-DRA Prototype Export ${history.length + 1}`,
      createdAt,
      format: settings.format,
      categories: selectedNames,
      range:
        settings.datePreset === "Custom Range"
          ? `${settings.startDate} to ${settings.endDate}`
          : settings.datePreset,
      status: "Prepared",
    };

    const nextHistory = [
      prepared,
      ...history,
    ].slice(0, 5);

    setHistory(nextHistory);

    window.localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );

    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(nextHistory)
    );

    setNotice({
      tone: "success",
      message:
        "A prototype export request has been prepared. No participant file was generated or downloaded.",
    });
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <SettingsPageHeader
          title="Data Export"
          description="Prepare data selections for future reporting, analysis or approved backup workflows."
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
              label: "Data Export",
            },
          ]}
          actions={
            <button
              type="button"
              onClick={prepareExport}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white"
            >
              <Plus size={17} />
              Prepare Export
            </button>
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

        <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_1fr_480px]">
          <SettingsCard
            title="1. Choose Data"
            description="Select the categories to include."
          >
            <div className="space-y-4">
              {exportCategories.map(
                (category) => (
                  <label
                    key={category.id}
                    className="flex items-start gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={settings.categories.includes(
                        category.id
                      )}
                      onChange={() =>
                        toggleCategory(category.id)
                      }
                      className="mt-1 h-4 w-4 accent-[#592EBD]"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-[#393432]">
                        {category.title}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-[#77706B]">
                        {category.description}
                      </span>
                    </span>
                  </label>
                )
              )}
            </div>

            <p className="mt-6 border-t border-[#EEEAE6] pt-4 text-sm font-semibold text-[#592EBD]">
              {selectedCount} categories selected
            </p>
          </SettingsCard>

          <div className="space-y-6">
            <SettingsCard
              title="2. Choose Date Range"
              description="Define the period covered by the request."
            >
              <label>
                <span className="text-sm font-semibold text-[#393432]">
                  Preset Range
                </span>

                <select
                  value={settings.datePreset}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      datePreset:
                        event.target.value,
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm"
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>All Time</option>
                  <option>Custom Range</option>
                </select>
              </label>

              {settings.datePreset ===
              "Custom Range" ? (
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <DateInput
                    label="Start Date"
                    value={settings.startDate}
                    onChange={(value) =>
                      setSettings((current) => ({
                        ...current,
                        startDate: value,
                      }))
                    }
                  />

                  <DateInput
                    label="End Date"
                    value={settings.endDate}
                    onChange={(value) =>
                      setSettings((current) => ({
                        ...current,
                        endDate: value,
                      }))
                    }
                  />
                </div>
              ) : null}
            </SettingsCard>

            <SettingsCard
              title="3. Export Format"
              description="Choose the intended file format."
            >
              <div className="space-y-3">
                {(
                  [
                    "CSV",
                    "XLSX",
                    "JSON",
                  ] as AdminExportFormat[]
                ).map((format) => (
                  <label
                    key={format}
                    className="flex items-center gap-3 rounded-xl border border-[#E4DFDB] p-4"
                  >
                    <input
                      type="radio"
                      name="format"
                      checked={
                        settings.format === format
                      }
                      onChange={() =>
                        setSettings((current) => ({
                          ...current,
                          format,
                        }))
                      }
                      className="h-4 w-4 accent-[#592EBD]"
                    />

                    {format === "JSON" ? (
                      <FileJson
                        size={19}
                        className="text-[#592EBD]"
                      />
                    ) : (
                      <FileSpreadsheet
                        size={19}
                        className="text-[#592EBD]"
                      />
                    )}

                    <span className="text-sm font-semibold text-[#393432]">
                      {format}
                    </span>
                  </label>
                ))}
              </div>

              <button
                type="button"
                onClick={prepareExport}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#592EBD] text-sm font-semibold text-white"
              >
                <Download size={17} />
                Prepare Prototype Export
              </button>
            </SettingsCard>
          </div>

          <SettingsCard
            title="Recent Export Requests"
            description="Requests prepared in this browser."
          >
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-[#E4DFDB] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F7EF] text-[#20A663]">
                        <CheckCircle2 size={18} />
                      </span>

                      <div>
                        <p className="text-sm font-semibold text-[#393432]">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-[#77706B]">
                          {item.format} ·{" "}
                          {item.range}
                        </p>

                        <p className="mt-1 text-xs text-[#817A75]">
                          {item.createdAt}
                        </p>

                        <span className="mt-2 inline-flex rounded-full bg-[#E6F7EF] px-2 py-1 text-[10px] font-semibold text-[#18834D]">
                          Request Prepared
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <Database
                  size={28}
                  className="mx-auto text-[#817A75]"
                />

                <p className="mt-4 text-sm font-semibold text-[#393432]">
                  No export requests yet
                </p>

                <p className="mt-2 text-xs text-[#77706B]">
                  Prepared requests will appear
                  here.
                </p>
              </div>
            )}
          </SettingsCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <ExportInformation
            icon={LockKeyhole}
            title="Authorised Access"
            description="Sensitive exports should only be available to approved project staff."
          />

          <ExportInformation
            icon={CalendarDays}
            title="Processing Time"
            description="Large exports will require asynchronous backend processing."
          />

          <ExportInformation
            icon={Info}
            title="Data Protection"
            description="Export approval and retention rules must follow the approved project policy."
          />
        </div>

        <div className="mt-6">
          <SettingsSaveNotice
            tone="warning"
            message="This page currently prepares export requests only. It does not generate or download participant data."
          />
        </div>
      </div>
    </section>
  );
}

function DateInput({
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
        type="date"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-11 w-full rounded-xl border border-[#DDD8D4] px-3 text-sm"
      />
    </label>
  );
}

function ExportInformation({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Info;
  title: string;
  description: string;
}) {
  return (
    <SettingsCard>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
          <Icon size={19} />
        </span>

        <div>
          <h3 className="font-semibold text-[#393432]">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#77706B]">
            {description}
          </p>
        </div>
      </div>
    </SettingsCard>
  );
}