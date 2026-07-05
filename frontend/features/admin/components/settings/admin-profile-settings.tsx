"use client";

import Link from "next/link";
import {
  Bell,
  Camera,
  ChevronRight,
  Globe2,
  LockKeyhole,
  RotateCcw,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import type { AdminProfileSettings } from "@/features/admin/types/admin-settings";
import { cn } from "@/lib/utils";

import { SettingsCard } from "./settings-card";
import { SettingsPageHeader } from "./settings-page-header";
import { SettingsSaveNotice } from "./settings-save-notice";
import { SettingsSwitch } from "./settings-switch";

type AdminProfileSettingsProps = {
  initialSettings: AdminProfileSettings;
};

const STORAGE_KEY = "ai-dra-admin-profile-settings";

const availableLanguages = [
  "English",
  "Yoruba",
  "French",
  "Spanish",
];

export function AdminProfileSettingsView({
  initialSettings,
}: AdminProfileSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] =
    useState<AdminProfileSettings>(initialSettings);

  const [savedSettings, setSavedSettings] =
    useState<AdminProfileSettings>(initialSettings);

  const [notice, setNotice] = useState<{
    tone: "success" | "warning" | "danger";
    message: string;
  } | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(
        stored
      ) as AdminProfileSettings;

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

  const updateField = <
    K extends keyof AdminProfileSettings,
  >(
    field: K,
    value: AdminProfileSettings[K]
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setNotice(null);
  };

  const toggleLanguage = (language: string) => {
    const selected =
      settings.languages.includes(language);

    updateField(
      "languages",
      selected
        ? settings.languages.filter(
            (item) => item !== language
          )
        : [...settings.languages, language]
    );
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setNotice({
        tone: "danger",
        message:
          "Select a valid JPG, PNG, WebP or GIF image.",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setNotice({
        tone: "danger",
        message:
          "The profile image must be smaller than 2 MB.",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateField(
        "profileImageDataUrl",
        typeof reader.result === "string"
          ? reader.result
          : null
      );

      setNotice({
        tone: "warning",
        message:
          "The selected image is stored in this browser only until profile storage is connected.",
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (
      !settings.fullName.trim() ||
      !settings.email.trim()
    ) {
      setNotice({
        tone: "danger",
        message:
          "Full name and email address are required.",
      });
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    setSavedSettings(settings);

    setNotice({
      tone: "success",
      message:
        "Profile preferences have been saved in this browser.",
    });
  };

  const handleDiscard = () => {
    setSettings(savedSettings);
    setNotice(null);
  };

  const initials = settings.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1550px]">
        <SettingsPageHeader
          title="Admin Profile"
          description="View and update your personal information and profile preferences."
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
              label: "Profile",
            },
          ]}
          actions={
            <>
              <button
                type="button"
                onClick={handleDiscard}
                disabled={!hasChanges}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#DDD8D4] bg-white px-5 text-sm font-semibold text-[#514B47] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw size={17} />
                Discard Changes
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
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

        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
          <SettingsCard
            title="Profile Information"
            description="Update the information displayed within the admin portal."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <ProfileInput
                label="Full Name"
                required
                value={settings.fullName}
                onChange={(value) =>
                  updateField("fullName", value)
                }
              />

              <ProfileSelect
                label="Role / Position"
                value={settings.role}
                onChange={(value) =>
                  updateField("role", value)
                }
                options={[
                  "Project Lead",
                  "Research Administrator",
                  "Researcher",
                  "Clinical Adviser",
                  "System Administrator",
                ]}
              />

              <ProfileInput
                label="Email Address"
                type="email"
                required
                value={settings.email}
                onChange={(value) =>
                  updateField("email", value)
                }
              />

              <ProfileInput
                label="Phone Number"
                type="tel"
                value={settings.phoneNumber}
                onChange={(value) =>
                  updateField(
                    "phoneNumber",
                    value
                  )
                }
                placeholder="+44"
              />

              <ProfileInput
                label="Department / Team"
                value={settings.department}
                onChange={(value) =>
                  updateField(
                    "department",
                    value
                  )
                }
              />

              <ProfileInput
                label="Location"
                value={settings.location}
                onChange={(value) =>
                  updateField("location", value)
                }
              />
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-[#393432]">
                Bio
              </span>

              <textarea
                value={settings.bio}
                onChange={(event) =>
                  updateField(
                    "bio",
                    event.target.value
                  )
                }
                maxLength={300}
                rows={5}
                className="mt-2 w-full resize-y rounded-xl border border-[#DDD8D4] px-4 py-3 text-sm outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
              />

              <span className="mt-1 block text-right text-xs text-[#817A75]">
                {settings.bio.length}/300
              </span>
            </label>

            <div className="mt-5">
              <p className="text-sm font-semibold text-[#393432]">
                Communication Languages
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {availableLanguages.map(
                  (language) => {
                    const selected =
                      settings.languages.includes(
                        language
                      );

                    return (
                      <button
                        key={language}
                        type="button"
                        onClick={() =>
                          toggleLanguage(language)
                        }
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-semibold transition",
                          selected
                            ? "border-[#592EBD] bg-[#EEE8FF] text-[#592EBD]"
                            : "border-[#DDD8D4] bg-white text-[#625C58]"
                        )}
                      >
                        {language}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <ProfileSelect
                label="Timezone"
                value={settings.timezone}
                onChange={(value) =>
                  updateField("timezone", value)
                }
                options={[
                  "Europe/London",
                  "Africa/Lagos",
                  "UTC",
                ]}
              />

              <ProfileSelect
                label="Preferred Language"
                value={
                  settings.preferredLanguage
                }
                onChange={(value) =>
                  updateField(
                    "preferredLanguage",
                    value
                  )
                }
                options={availableLanguages}
              />
            </div>

            <div className="mt-7 border-t border-[#EEEAE6] pt-6">
              <h3 className="font-bold text-[#282422]">
                Profile Preferences
              </h3>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
                    <Globe2 size={19} />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-[#393432]">
                      Dark Mode Preference
                    </p>

                    <p className="mt-1 text-xs text-[#77706B]">
                      Save the preferred admin
                      appearance for later theme
                      integration.
                    </p>
                  </div>
                </div>

                <SettingsSwitch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    updateField(
                      "darkMode",
                      checked
                    )
                  }
                  label="Dark mode preference"
                />
              </div>
            </div>
          </SettingsCard>

          <aside className="space-y-6">
            <SettingsCard
              title="Profile Picture"
              description="Shown beside your profile and future activity records."
            >
              <div className="flex flex-col items-center">
                {settings.profileImageDataUrl ? (
                  <img
                    src={
                      settings.profileImageDataUrl
                    }
                    alt="Admin profile preview"
                    className="h-36 w-36 rounded-full object-cover ring-8 ring-[#EEE8FF]"
                  />
                ) : (
                  <span className="flex h-36 w-36 items-center justify-center rounded-full bg-[#EEE8FF] text-4xl font-bold text-[#592EBD] ring-8 ring-[#F6F2FF]">
                    {initials || "AD"}
                  </span>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-[#A98CE6] bg-white px-5 text-sm font-semibold text-[#592EBD]"
                >
                  <Camera size={17} />
                  Change Photo
                </button>

                <p className="mt-3 text-center text-xs text-[#817A75]">
                  JPG, PNG, WebP or GIF. Maximum
                  size 2 MB.
                </p>
              </div>
            </SettingsCard>

            <SettingsCard title="Account Details">
              <dl className="space-y-4">
                <AccountDetail
                  label="Account ID"
                  value="ADM-PROTOTYPE-001"
                />

                <AccountDetail
                  label="Account Type"
                  value="Administrator"
                />

                <AccountDetail
                  label="Storage"
                  value="Browser prototype"
                />

                <AccountDetail
                  label="Authentication"
                  value="Not connected yet"
                />

                <AccountDetail
                  label="Status"
                  value="Prototype Active"
                />
              </dl>
            </SettingsCard>

            <SettingsCard title="Quick Links">
              <div className="divide-y divide-[#EEEAE6]">
                <QuickLink
                  href="/admin/settings/security"
                  icon={LockKeyhole}
                  label="Account & Security"
                />

                <QuickLink
                  href="/admin/settings/notifications"
                  icon={Bell}
                  label="Notification Preferences"
                />

                <QuickLink
                  href="/admin/settings/privacy"
                  icon={ShieldCheck}
                  label="Privacy & Data Access"
                />
              </div>
            </SettingsCard>
          </aside>
        </div>

        <div className="mt-6">
          <SettingsSaveNotice
            message="Profile changes are currently stored in this browser only. Supabase profile persistence and administrator permissions will be connected later."
          />
        </div>
      </div>
    </section>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label>
      <span className="text-sm font-semibold text-[#393432]">
        {label}
        {required ? (
          <span className="text-[#D43D3D]">
            {" "}
            *
          </span>
        ) : null}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-12 w-full rounded-xl border border-[#DDD8D4] px-4 text-sm outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
      />
    </label>
  );
}

function ProfileSelect({
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
        className="mt-2 h-12 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function AccountDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 text-sm">
      <dt className="text-[#77706B]">
        {label}
      </dt>

      <dd className="text-right font-semibold text-[#393432]">
        {value}
      </dd>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof UserRound;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
    >
      <Icon
        size={18}
        className="text-[#592EBD]"
      />

      <span className="flex-1 text-sm font-semibold text-[#393432]">
        {label}
      </span>

      <ChevronRight
        size={17}
        className="text-[#817A75]"
      />
    </Link>
  );
}