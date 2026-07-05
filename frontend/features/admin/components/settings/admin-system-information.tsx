"use client";

import {
  Activity,
  CheckCircle2,
  CircleAlert,
  Cloud,
  Database,
  HardDrive,
  Info,
  RefreshCw,
  Server,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import type {
  AdminSystemService,
  AdminSystemServiceStatus,
} from "@/features/admin/types/admin-settings";

import { SettingsCard } from "./settings-card";
import { SettingsPageHeader } from "./settings-page-header";
import { SettingsSaveNotice } from "./settings-save-notice";

type Props = {
  services: AdminSystemService[];
};

export function AdminSystemInformationView({
  services,
}: Props) {
  const [lastChecked, setLastChecked] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  const checkStatus = () => {
    setLastChecked(
      new Date().toLocaleString("en-GB")
    );

    setMessage(
      "The frontend responded successfully. Database, authentication, storage and email services were not actively tested."
    );
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <SettingsPageHeader
          title="System Information"
          description="Review the prototype configuration, planned services and connection status."
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
              label: "System",
            },
          ]}
          actions={
            <button
              type="button"
              onClick={checkStatus}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white"
            >
              <RefreshCw size={17} />
              Check Status
            </button>
          }
        />

        {message ? (
          <div className="mt-6">
            <SettingsSaveNotice
              tone="success"
              message={message}
            />
          </div>
        ) : null}

        <section className="mt-7 rounded-2xl border border-[#DDD5F0] bg-gradient-to-r from-[#FAF8FF] to-white p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
                <Activity size={29} />
              </span>

              <div>
                <h2 className="text-xl font-bold text-[#282422]">
                  Frontend Status: Available
                </h2>

                <p className="mt-2 text-sm text-[#625C58]">
                  The current Next.js administrator
                  interface is running.
                </p>
              </div>
            </div>

            <div className="text-sm">
              <p className="font-semibold text-[#18834D]">
                ● Frontend operational
              </p>

              <p className="mt-1 text-[#77706B]">
                {lastChecked
                  ? `Last checked ${lastChecked}`
                  : "Not checked during this visit"}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <SettingsCard title="Platform Overview">
            <SystemLine
              label="Application"
              value="AI-DRA Web Platform"
            />

            <SystemLine
              label="Application Type"
              value="Next.js prototype"
            />

            <SystemLine
              label="Deployment"
              value="Local development or Vercel"
            />

            <SystemLine
              label="Database"
              value="Supabase planned"
            />

            <SystemLine
              label="Authentication"
              value="Supabase Auth planned"
            />

            <SystemLine
              label="Email"
              value="Resend planned"
            />
          </SettingsCard>

          <SettingsCard title="Connected Services">
            <div className="space-y-4">
              {services.map((service) => (
                <ServiceStatus
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          </SettingsCard>

          <SettingsCard title="System Health Checks">
            <HealthLine
              label="Web Application"
              status="Available"
            />

            <HealthLine
              label="Database"
              status="Not Verified"
            />

            <HealthLine
              label="Authentication"
              status="Not Verified"
            />

            <HealthLine
              label="File Storage"
              status="Not Verified"
            />

            <HealthLine
              label="Email Delivery"
              status="Not Connected"
            />

            <HealthLine
              label="Analytics Interface"
              status="Available"
            />
          </SettingsCard>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <SettingsCard
            title="System Configuration"
            description="Planned configuration areas."
          >
            <ConfigurationRow
              icon={Settings2}
              title="General Settings"
            />

            <ConfigurationRow
              icon={ShieldCheck}
              title="Security Settings"
            />

            <ConfigurationRow
              icon={Cloud}
              title="Integrations"
            />

            <ConfigurationRow
              icon={Server}
              title="Feature Flags"
            />
          </SettingsCard>

          <SettingsCard
            title="System Resources"
            description="Real resource monitoring is not connected."
          >
            <ResourcePlaceholder
              icon={Server}
              title="Application Runtime"
              value="Not Measured"
            />

            <ResourcePlaceholder
              icon={Database}
              title="Database Connections"
              value="Not Measured"
            />

            <ResourcePlaceholder
              icon={HardDrive}
              title="Storage Usage"
              value="Not Measured"
            />
          </SettingsCard>

          <SettingsCard title="Deployment Information">
            <SystemLine
              label="Environment"
              value="Prototype"
            />

            <SystemLine
              label="Region"
              value="Not verified"
            />

            <SystemLine
              label="Base URL"
              value="Determined at deployment"
            />

            <SystemLine
              label="Last Deployment"
              value="Not available"
            />

            <SystemLine
              label="Backup Schedule"
              value="Not configured"
            />

            <SystemLine
              label="Timezone"
              value="Europe/London"
            />
          </SettingsCard>
        </div>

        <div className="mt-6">
          <SettingsSaveNotice
            tone="warning"
            title="Monitoring limitations"
            message="This page does not currently query Vercel, Supabase, Resend or any infrastructure monitoring service. Only the frontend application status is known."
          />
        </div>
      </div>
    </section>
  );
}

function SystemLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-[#EEEAE6] py-3 first:pt-0 last:border-0 last:pb-0">
      <span className="text-sm text-[#77706B]">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-[#393432]">
        {value}
      </span>
    </div>
  );
}

function ServiceStatus({
  service,
}: {
  service: AdminSystemService;
}) {
  return (
    <div className="flex items-start gap-3">
      <StatusIcon status={service.status} />

      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#393432]">
            {service.name}
          </p>

          <StatusBadge status={service.status} />
        </div>

        <p className="mt-1 text-xs leading-5 text-[#77706B]">
          {service.description}
        </p>
      </div>
    </div>
  );
}

function HealthLine({
  label,
  status,
}: {
  label: string;
  status: AdminSystemServiceStatus;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <StatusIcon status={status} />

        <span className="text-sm font-medium text-[#514B47]">
          {label}
        </span>
      </div>

      <StatusBadge status={status} />
    </div>
  );
}

function StatusIcon({
  status,
}: {
  status: AdminSystemServiceStatus;
}) {
  return status === "Available" ? (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E6F7EF] text-[#20A663]">
      <CheckCircle2 size={15} />
    </span>
  ) : (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF4DD] text-[#E99A17]">
      <CircleAlert size={15} />
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: AdminSystemServiceStatus;
}) {
  const classes =
    status === "Available"
      ? "bg-[#E6F7EF] text-[#18834D]"
      : status === "Not Connected"
        ? "bg-[#FFE7E7] text-[#D43D3D]"
        : "bg-[#FFF4DD] text-[#B16C00]";

  return (
    <span
      className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold ${classes}`}
    >
      {status}
    </span>
  );
}

function ConfigurationRow({
  icon: Icon,
  title,
}: {
  icon: typeof Info;
  title: string;
}) {
  return (
    <button
      type="button"
      disabled
      className="flex w-full items-center gap-3 border-b border-[#EEEAE6] py-4 text-left last:border-0 disabled:opacity-65"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
        <Icon size={17} />
      </span>

      <span className="flex-1 text-sm font-semibold text-[#393432]">
        {title}
      </span>

      <span className="rounded-full bg-[#EEE8FF] px-2 py-1 text-[10px] font-semibold text-[#592EBD]">
        Planned
      </span>
    </button>
  );
}

function ResourcePlaceholder({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Server;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-[#EEEAE6] py-4 first:pt-0 last:border-0 last:pb-0">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
        <Icon size={18} />
      </span>

      <div className="flex-1">
        <p className="text-sm font-semibold text-[#393432]">
          {title}
        </p>

        <p className="mt-1 text-xs text-[#77706B]">
          {value}
        </p>
      </div>
    </div>
  );
}