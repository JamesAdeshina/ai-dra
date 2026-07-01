"use client";

import Link from "next/link";
import {
  type FormEvent,
  useMemo,
  useState,
} from "react";
import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  SettingsPageHeader,
  SettingsToast,
} from "@/features/carer/components/settings/settings-ui";
import { cn } from "@/lib/utils";

type PasswordFields = {
  current: boolean;
  next: boolean;
  confirm: boolean;
};

const initialVisibility: PasswordFields = {
  current: false,
  next: false,
  confirm: false,
};

export function ChangePasswordView() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [visible, setVisible] =
    useState<PasswordFields>(initialVisibility);

  const [feedback, setFeedback] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const requirements = useMemo(
    () => ({
      mixedCase:
        /[a-z]/.test(newPassword) &&
        /[A-Z]/.test(newPassword),
      number: /\d/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
      length: newPassword.length >= 8,
    }),
    [newPassword],
  );

  const passedRequirements =
    Object.values(requirements).filter(Boolean).length;

  const strengthLabel =
    passedRequirements === 4
      ? "Strong"
      : passedRequirements >= 2
        ? "Moderate"
        : "Weak";

  function toggleVisibility(
    field: keyof PasswordFields,
  ) {
    setVisible((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }

    if (!Object.values(requirements).every(Boolean)) {
      setError(
        "Your new password does not meet all requirements.",
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setFeedback("Password updated successfully.");
  }

  function PasswordInput({
    label,
    value,
    onChange,
    field,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    field: keyof PasswordFields;
    placeholder: string;
  }) {
    return (
      <label className="block">
        <span className="text-sm font-medium text-[#514B47]">
          {label}
        </span>

        <span className="relative mt-2 block">
          <input
            type={visible[field] ? "text" : "password"}
            value={value}
            onChange={(event) =>
              onChange(event.target.value)
            }
            placeholder={placeholder}
            className="h-14 w-full rounded-xl border border-[#DEDAD6] bg-white px-4 pr-20 text-sm text-[#302C29] outline-none focus:border-[#592EBD] focus:ring-2 focus:ring-[#E9E3F8]"
          />

          <button
            type="button"
            onClick={() => toggleVisibility(field)}
            className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center gap-2 text-sm font-medium text-[#514B47]"
          >
            {visible[field] ? (
              <EyeOff size={17} />
            ) : (
              <Eye size={17} />
            )}

            {visible[field] ? "Hide" : "Show"}
          </button>
        </span>
      </label>
    );
  }

  const requirementItems = [
    {
      label: "Mix uppercase and lowercase letters",
      passed: requirements.mixedCase,
    },
    {
      label: "Include at least one number",
      passed: requirements.number,
    },
    {
      label: "Add a special character",
      passed: requirements.special,
    },
    {
      label: "Use at least 8 characters",
      passed: requirements.length,
    },
  ];

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <SettingsToast
        message={feedback}
        onDismiss={() => setFeedback(null)}
      />

      <SettingsToast
        message={error}
        tone="error"
        onDismiss={() => setError(null)}
      />

      <div className="mx-auto max-w-[1240px]">
        <SettingsPageHeader
          title="Change Password"
          description="Update your password to keep your account secure."
        />

        <div className="mt-8 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-[#F8F7F6] p-4 sm:p-5"
          >
            <h2 className="text-xs font-bold uppercase tracking-wide text-[#292522]">
              Update Your Password
            </h2>

            <p className="mt-1 text-sm text-[#746D68]">
              Choose a strong password that you do not use
              for other accounts.
            </p>

            <div className="mt-5">
              <PasswordInput
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
                field="current"
                placeholder="Enter your current password"
              />

              <Link
                href="/forgot-password"
                className="mt-3 inline-block text-sm font-medium text-[#3478EA] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="mt-5">
              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                field="next"
                placeholder="Enter your new password"
              />

              <div className="mt-3 flex items-center gap-3">
                <p className="text-xs text-[#746D68]">
                  Password strength:
                  <span
                    className={cn(
                      "ml-1 font-semibold",
                      strengthLabel === "Strong"
                        ? "text-[#258B55]"
                        : strengthLabel === "Moderate"
                          ? "text-[#AD7200]"
                          : "text-[#F23636]",
                    )}
                  >
                    {strengthLabel}
                  </span>
                </p>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-1">
                {Array.from(
                  { length: 4 },
                  (_, index) => (
                    <span
                      key={index}
                      className={cn(
                        "h-1.5 rounded-full",
                        index < passedRequirements
                          ? "bg-[#3478EA]"
                          : "bg-[#E2E2E2]",
                      )}
                    />
                  ),
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {requirementItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        item.passed
                          ? "bg-[#2DB36F] text-white"
                          : "bg-[#E6E3E0] text-[#918A85]",
                      )}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>

                    <p className="text-xs text-[#746D68]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <PasswordInput
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                field="confirm"
                placeholder="Confirm your new password"
              />

              <p className="mt-2 text-xs text-[#817A75]">
                Make sure both new password fields match.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/carer/settings"
                className="inline-flex min-h-12 min-w-[165px] items-center justify-center rounded-full border border-[#DDD8D4] bg-white px-6 text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex min-h-12 min-w-[175px] items-center justify-center rounded-full bg-[#592EBD] px-6 text-sm font-semibold text-white hover:bg-[#4B24A8]"
              >
                Update Password
              </button>
            </div>
          </form>

          <aside className="rounded-2xl border border-[#DEDAD6] bg-white p-5 shadow-[0_1px_4px_rgba(28,23,20,0.04)] xl:sticky xl:top-[118px]">
            <div className="text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF0FF] text-[#3478EA]">
                <ShieldCheck size={36} />
              </span>

              <h2 className="mt-5 text-lg font-semibold text-[#292522]">
                Keep Your Account Secure
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#746D68]">
                A strong password helps protect your personal
                information and linked survivor data.
              </p>
            </div>

            <div className="mt-6 divide-y divide-[#ECE8E4] border-t border-[#ECE8E4]">
              {[
                {
                  title: "Use a unique password",
                  description:
                    "Avoid using your name or common words.",
                },
                {
                  title: "Make it strong",
                  description:
                    "Use letters, numbers and special characters.",
                },
                {
                  title: "Keep it private",
                  description:
                    "Never share your password with anyone.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="flex gap-3 py-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF0FF] text-[#3478EA]">
                    <LockKeyhole size={19} />
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-[#292522]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-[#746D68]">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}