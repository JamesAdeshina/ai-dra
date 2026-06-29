"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const initialForm: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordSettings() {
  const [form, setForm] =
    useState<PasswordFormState>(initialForm);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const passwordChecks = useMemo(
    () => ({
      minimumLength: form.newPassword.length >= 8,
      uppercase: /[A-Z]/.test(form.newPassword),
      lowercase: /[a-z]/.test(form.newPassword),
      number: /\d/.test(form.newPassword),
      specialCharacter:
        /[^A-Za-z0-9]/.test(form.newPassword),
    }),
    [form.newPassword]
  );

  const passedChecks = Object.values(
    passwordChecks
  ).filter(Boolean).length;

  const passwordStrength =
    passedChecks <= 1
      ? "Weak"
      : passedChecks <= 3
        ? "Moderate"
        : passedChecks === 4
          ? "Strong"
          : "Very Strong";

  const passwordsMatch =
    form.confirmPassword.length > 0 &&
    form.newPassword === form.confirmPassword;

  const isNewPasswordValid =
    Object.values(passwordChecks).every(Boolean);

  const updateField = (
    field: keyof PasswordFormState,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!form.currentPassword) {
      setErrorMessage(
        "Enter your current password."
      );
      return;
    }

    if (!isNewPasswordValid) {
      setErrorMessage(
        "Your new password must meet all password requirements."
      );
      return;
    }

    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      setErrorMessage(
        "The new passwords do not match."
      );
      return;
    }

    if (
      form.currentPassword ===
      form.newPassword
    ) {
      setErrorMessage(
        "Your new password must be different from your current password."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        throw new Error(
          "Unable to verify your signed-in account."
        );
      }

      const {
        error: verificationError,
      } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: form.currentPassword,
        });

      if (verificationError) {
        throw new Error(
          "Your current password is incorrect."
        );
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password: form.newPassword,
        });

      if (updateError) {
        throw new Error(updateError.message);
      }

      setForm(initialForm);

      setSuccessMessage(
        "Your password has been updated successfully."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update your password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_340px] gap-6">
      <div>
        <h1 className="text-[40px] font-bold text-[#1E1E1E]">
          Change Password
        </h1>

        <p className="mt-1 text-[20px] text-[#1E1E1E]">
          Update your password to keep your account secure.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl bg-white p-8"
        >
          {errorMessage && (
            <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <PasswordField
            id="current-password"
            label="Current Password"
            value={form.currentPassword}
            showPassword={showCurrentPassword}
            onToggle={() =>
              setShowCurrentPassword(
                (current) => !current
              )
            }
            onChange={(value) =>
              updateField(
                "currentPassword",
                value
              )
            }
            autoComplete="current-password"
          />

          <Link
            href="/auth/forgot-password"
            className="mt-3 inline-block text-sm font-medium text-[#3478F6] hover:underline"
          >
            Forgot Password?
          </Link>

          <div className="mt-5">
            <PasswordField
              id="new-password"
              label="New Password"
              value={form.newPassword}
              showPassword={showNewPassword}
              onToggle={() =>
                setShowNewPassword(
                  (current) => !current
                )
              }
              onChange={(value) =>
                updateField(
                  "newPassword",
                  value
                )
              }
              autoComplete="new-password"
            />

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#666666]">
                  Password strength:{" "}
                  <span className="font-semibold">
                    {passwordStrength}
                  </span>
                </p>
              </div>

              <div className="mt-2 grid grid-cols-5 gap-1">
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <div
                    key={index}
                    className={
                      index < passedChecks
                        ? "h-1.5 rounded-full bg-[#3478F6]"
                        : "h-1.5 rounded-full bg-[#E5E7EB]"
                    }
                  />
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                <PasswordRequirement
                  passed={
                    passwordChecks.uppercase &&
                    passwordChecks.lowercase
                  }
                  label="Uppercase and lowercase letters"
                />

                <PasswordRequirement
                  passed={passwordChecks.number}
                  label="At least one number"
                />

                <PasswordRequirement
                  passed={
                    passwordChecks.specialCharacter
                  }
                  label="A special character"
                />

                <PasswordRequirement
                  passed={
                    passwordChecks.minimumLength
                  }
                  label="At least 8 characters"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <PasswordField
              id="confirm-password"
              label="Confirm New Password"
              value={form.confirmPassword}
              showPassword={
                showConfirmPassword
              }
              onToggle={() =>
                setShowConfirmPassword(
                  (current) => !current
                )
              }
              onChange={(value) =>
                updateField(
                  "confirmPassword",
                  value
                )
              }
              autoComplete="new-password"
            />

            <p
              className={`mt-2 text-sm ${
                form.confirmPassword.length === 0
                  ? "text-[#777777]"
                  : passwordsMatch
                    ? "text-green-600"
                    : "text-red-600"
              }`}
            >
              {form.confirmPassword.length === 0
                ? "Make sure both passwords match."
                : passwordsMatch
                  ? "Passwords match."
                  : "Passwords do not match."}
            </p>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="h-14 min-w-[165px] rounded-full"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 min-w-[180px] rounded-full bg-[#592EBD] hover:bg-[#4B24A8]"
            >
              {isSubmitting
                ? "Updating..."
                : "Update Password"}
            </Button>
          </div>
        </form>
      </div>

      <PasswordSecurityCard />
    </div>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  showPassword: boolean;
  autoComplete:
    | "current-password"
    | "new-password";
  onChange: (value: string) => void;
  onToggle: () => void;
};

function PasswordField({
  id,
  label,
  value,
  showPassword,
  autoComplete,
  onChange,
  onToggle,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm text-[#666666]"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <Input
          id={id}
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          autoComplete={autoComplete}
          placeholder="Enter your password"
          className="h-16 rounded-xl pr-14"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          className="absolute right-5 top-1/2 -translate-y-1/2 text-[#555555]"
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>
    </div>
  );
}

type PasswordRequirementProps = {
  passed: boolean;
  label: string;
};

function PasswordRequirement({
  passed,
  label,
}: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          passed
            ? "bg-[#2FB36D] text-white"
            : "bg-[#E5E7EB] text-[#888888]"
        }`}
      >
        <Check size={15} />
      </div>

      <p className="text-sm text-[#666666]">
        {label}
      </p>
    </div>
  );
}

function PasswordSecurityCard() {
  return (
    <aside className="rounded-2xl bg-white p-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF1FF] text-[#4169E1]">
          <ShieldCheck size={38} />
        </div>

        <h2 className="mt-5 text-[22px] font-semibold text-[#1E1E1E]">
          Keep Your Account Secure
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[#777777]">
          A strong password helps protect your personal
          information and rehabilitation data.
        </p>
      </div>

      <div className="mt-8 border-t">
        <SecurityTip
          icon={LockKeyhole}
          title="Use a unique password"
          description="Avoid using your name or common words."
        />

        <SecurityTip
          icon={Sparkles}
          title="Make it strong"
          description="Use a mix of letters, numbers and special characters."
        />

        <SecurityTip
          icon={ShieldCheck}
          title="Keep it private"
          description="Never share your password with anyone."
          last
        />
      </div>
    </aside>
  );
}

type SecurityTipProps = {
  icon: typeof LockKeyhole;
  title: string;
  description: string;
  last?: boolean;
};

function SecurityTip({
  icon: Icon,
  title,
  description,
  last = false,
}: SecurityTipProps) {
  return (
    <div
      className={`flex gap-4 py-6 ${
        last ? "" : "border-b"
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF1FF] text-[#4169E1]">
        <Icon size={21} />
      </div>

      <div>
        <h3 className="font-semibold text-[#1E1E1E]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-[#777777]">
          {description}
        </p>
      </div>
    </div>
  );
}