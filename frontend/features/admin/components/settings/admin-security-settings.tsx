"use client";

import {
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Laptop,
  LockKeyhole,
  LogOut,
  Save,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AdminSecurityDevice,
  AdminSecuritySettings,
} from "@/features/admin/types/admin-settings";
import { cn } from "@/lib/utils";

import { SettingsCard } from "./settings-card";
import { SettingsPageHeader } from "./settings-page-header";
import { SettingsSaveNotice } from "./settings-save-notice";
import { SettingsSwitch } from "./settings-switch";

type AdminSecuritySettingsProps = {
  initialSettings: AdminSecuritySettings;
  devices: AdminSecurityDevice[];
};

const STORAGE_KEY =
  "ai-dra-admin-security-settings";

export function AdminSecuritySettingsView({
  initialSettings,
  devices,
}: AdminSecuritySettingsProps) {
  const [settings, setSettings] =
    useState(initialSettings);

  const [savedSettings, setSavedSettings] =
    useState(initialSettings);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPasswords, setShowPasswords] =
    useState(false);

  const [notice, setNotice] = useState<{
    tone:
      | "success"
      | "warning"
      | "danger";
    message: string;
  } | null>(null);

  useEffect(() => {
    const stored =
      window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(
        stored
      ) as AdminSecuritySettings;

      setSettings(parsed);
      setSavedSettings(parsed);
    } catch {
      window.localStorage.removeItem(
        STORAGE_KEY
      );
    }
  }, []);

  const passwordChecks = useMemo(
    () => ({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special:
        /[^A-Za-z0-9]/.test(newPassword),
    }),
    [newPassword]
  );

  const passwordValid = Object.values(
    passwordChecks
  ).every(Boolean);

  const hasPreferenceChanges =
    settings.loginAlertsEnabled !==
    savedSettings.loginAlertsEnabled;

  const savePreferences = () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    setSavedSettings(settings);

    setNotice({
      tone: "success",
      message:
        "Security notification preferences have been saved in this browser.",
    });
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword) {
      setNotice({
        tone: "danger",
        message:
          "Enter the current password before continuing.",
      });
      return;
    }

    if (!passwordValid) {
      setNotice({
        tone: "danger",
        message:
          "The new password does not meet all password requirements.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotice({
        tone: "danger",
        message:
          "The new password and confirmation do not match.",
      });
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setNotice({
      tone: "warning",
      message:
        "Password validation passed, but no password was changed because secure authentication updates are not connected yet.",
    });
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1550px]">
        <SettingsPageHeader
          title="Account & Security"
          description="Review password options, login alerts and signed-in device information."
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
              label: "Security",
            },
          ]}
          actions={
            <button
              type="button"
              onClick={savePreferences}
              disabled={
                !hasPreferenceChanges
              }
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Save size={17} />
              Save Preferences
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

        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_480px]">
          <div className="space-y-6">
            <SettingsCard
              title="Change Password"
              description="Password updates require secure authentication integration."
            >
              <div className="max-w-3xl">
                <PasswordInput
                  label="Current Password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  show={showPasswords}
                  onToggle={() =>
                    setShowPasswords(
                      (current) => !current
                    )
                  }
                />

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <PasswordInput
                    label="New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                    show={showPasswords}
                    onToggle={() =>
                      setShowPasswords(
                        (current) =>
                          !current
                      )
                    }
                  />

                  <PasswordInput
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={
                      setConfirmPassword
                    }
                    show={showPasswords}
                    onToggle={() =>
                      setShowPasswords(
                        (current) =>
                          !current
                      )
                    }
                  />
                </div>

                <div className="mt-5 rounded-xl border border-[#E4DFDB] bg-[#FCFBFA] p-4">
                  <p className="text-sm font-semibold text-[#393432]">
                    Password must contain:
                  </p>

                  <div className="mt-3 space-y-2">
                    <PasswordCheck
                      valid={
                        passwordChecks.length
                      }
                      label="At least 8 characters"
                    />

                    <PasswordCheck
                      valid={
                        passwordChecks.uppercase
                      }
                      label="One uppercase letter"
                    />

                    <PasswordCheck
                      valid={
                        passwordChecks.lowercase
                      }
                      label="One lowercase letter"
                    />

                    <PasswordCheck
                      valid={
                        passwordChecks.number
                      }
                      label="One number"
                    />

                    <PasswordCheck
                      valid={
                        passwordChecks.special
                      }
                      label="One special character"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={
                      handlePasswordUpdate
                    }
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white"
                  >
                    <KeyRound size={17} />
                    Validate Password Change
                  </button>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard
              title="Two-Factor Authentication"
              description="Add another authentication step when signing into the admin portal."
              actions={
                <span className="rounded-full bg-[#FFF4DD] px-3 py-1 text-xs font-semibold text-[#B16C00]">
                  Not Connected
                </span>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <SecurityFeatureCard
                  title="Authentication App"
                  description="Connect an authenticator application such as Microsoft Authenticator or Google Authenticator."
                  action="Configure 2FA"
                />

                <SecurityFeatureCard
                  title="Backup Codes"
                  description="Generate recovery codes for situations where the authenticator is unavailable."
                  action="Generate Codes"
                />
              </div>
            </SettingsCard>

            <SettingsCard>
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
                    <ShieldCheck size={20} />
                  </span>

                  <div>
                    <h2 className="font-bold text-[#282422]">
                      Login Alerts
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-[#77706B]">
                      Save whether the admin
                      should receive an alert when
                      a new device or location is
                      detected.
                    </p>
                  </div>
                </div>

                <SettingsSwitch
                  checked={
                    settings.loginAlertsEnabled
                  }
                  onCheckedChange={(checked) => {
                    setSettings({
                      loginAlertsEnabled:
                        checked,
                    });

                    setNotice(null);
                  }}
                  label="Login alerts"
                />
              </div>
            </SettingsCard>
          </div>

          <aside className="space-y-6">
            <SettingsCard
              title="Active Sessions"
              description="Prototype examples of how signed-in devices may be displayed."
            >
              <div className="space-y-4">
                {devices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                  />
                ))}
              </div>

              <button
                type="button"
                disabled
                title="Requires authentication-session integration."
                className="mt-5 inline-flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#F1B4B4] text-sm font-semibold text-[#D43D3D] opacity-55"
              >
                <LogOut size={17} />
                Log Out All Other Sessions
              </button>
            </SettingsCard>

            <SettingsCard title="Account Security Summary">
              <div className="space-y-5">
                <SecuritySummary
                  title="Password status unavailable"
                  description="Authentication provider not connected."
                  warning
                />

                <SecuritySummary
                  title="Two-factor authentication not configured"
                  description="Requires Supabase Auth or another identity provider."
                  warning
                />

                <SecuritySummary
                  title={
                    settings.loginAlertsEnabled
                      ? "Login alert preference enabled"
                      : "Login alert preference disabled"
                  }
                  description="Stored locally in this browser."
                />
              </div>
            </SettingsCard>
          </aside>
        </div>

        <div className="mt-6">
          <SettingsSaveNotice
            tone="warning"
            title="Security prototype"
            message="The page demonstrates the intended security interface. It does not currently update passwords, enable two-factor authentication, inspect real IP addresses or terminate real login sessions."
          />
        </div>
      </div>
    </section>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#393432]">
        {label}
      </span>

      <span className="relative mt-2 block">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-12 w-full rounded-xl border border-[#DDD8D4] px-4 pr-12 text-sm outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            show
              ? "Hide password"
              : "Show password"
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#817A75]"
        >
          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </span>
    </label>
  );
}

function PasswordCheck({
  valid,
  label,
}: {
  valid: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full",
          valid
            ? "bg-[#E6F7EF] text-[#18834D]"
            : "bg-[#EEEAE6] text-[#817A75]"
        )}
      >
        <Check size={12} />
      </span>

      <span
        className={
          valid
            ? "text-[#337153]"
            : "text-[#77706B]"
        }
      >
        {label}
      </span>
    </div>
  );
}

function SecurityFeatureCard({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: string;
}) {
  return (
    <article className="rounded-xl border border-[#E4DFDB] p-5">
      <h3 className="font-semibold text-[#393432]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#77706B]">
        {description}
      </p>

      <button
        type="button"
        disabled
        className="mt-5 inline-flex h-10 cursor-not-allowed items-center rounded-xl border border-[#A98CE6] px-4 text-sm font-semibold text-[#592EBD] opacity-55"
      >
        {action}
        <span className="ml-2 rounded-full bg-[#EEE8FF] px-2 py-0.5 text-[10px]">
          Planned
        </span>
      </button>
    </article>
  );
}

function DeviceCard({
  device,
}: {
  device: AdminSecurityDevice;
}) {
  const Icon = device.device
    .toLowerCase()
    .includes("mobile")
    ? Smartphone
    : Laptop;

  return (
    <article
      className={cn(
        "rounded-xl border p-4",
        device.isCurrent
          ? "border-[#BDE8D0] bg-[#F3FBF7]"
          : "border-[#E4DFDB] bg-white"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            device.isCurrent
              ? "bg-[#E6F7EF] text-[#20A663]"
              : "bg-[#F1EEEB] text-[#625C58]"
          )}
        >
          <Icon size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[#393432]">
              {device.device} ·{" "}
              {device.browser}
            </p>

            {device.isCurrent ? (
              <span className="rounded-full bg-[#DDF5E7] px-2 py-1 text-[10px] font-semibold text-[#18834D]">
                Current Session
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-xs text-[#77706B]">
            {device.location}
          </p>

          <p className="mt-1 text-xs text-[#77706B]">
            {device.lastActive}
          </p>

          <p className="mt-1 text-xs text-[#817A75]">
            {device.ipAddress}
          </p>
        </div>
      </div>
    </article>
  );
}

function SecuritySummary({
  title,
  description,
  warning = false,
}: {
  title: string;
  description: string;
  warning?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          warning
            ? "bg-[#FFF4DD] text-[#E99A17]"
            : "bg-[#E6F7EF] text-[#20A663]"
        )}
      >
        {warning ? (
          <AlertTriangle size={15} />
        ) : (
          <Check size={15} />
        )}
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
  );
}