"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const checks = useMemo(
    () => ({
      minimumLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialCharacter:
        /[^A-Za-z0-9]/.test(password),
    }),
    [password]
  );

  const validPassword =
    Object.values(checks).every(Boolean);

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!validPassword) {
      setErrorMessage(
        "Your password must meet all requirements."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "The passwords do not match."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "This reset link is invalid or has expired. Request a new one."
        );
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        throw updateError;
      }

      await supabase.auth.signOut();

      router.replace(
        "/auth/login?passwordUpdated=true"
      );

      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to reset your password."
      );

      setIsSubmitting(false);
    }
  };

  return (
    <main className="">
      <div className="">

        <h1 className=" text-[34px] font-bold text-[#1E1E1E]">
          Create a new password
        </h1>

        <p className=" text-[17px] text-[#666666]">
          Choose a strong password for your AI-DRA account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >
          {errorMessage && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <PasswordInput
            id="new-password"
            label="New Password"
            value={password}
            show={showPassword}
            onToggle={() =>
              setShowPassword(
                (current) => !current
              )
            }
            onChange={(value) => {
              setPassword(value);
              setErrorMessage(null);
            }}
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Requirement
              passed={
                checks.uppercase &&
                checks.lowercase
              }
              label="Uppercase and lowercase"
            />

            <Requirement
              passed={checks.number}
              label="At least one number"
            />

            <Requirement
              passed={checks.specialCharacter}
              label="A special character"
            />

            <Requirement
              passed={checks.minimumLength}
              label="At least 8 characters"
            />
          </div>

          <div className="mt-6">
            <PasswordInput
              id="confirm-password"
              label="Confirm New Password"
              value={confirmPassword}
              show={showConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword(
                  (current) => !current
                )
              }
              onChange={(value) => {
                setConfirmPassword(value);
                setErrorMessage(null);
              }}
            />

            <p
              className={`mt-2 text-sm ${
                confirmPassword.length === 0
                  ? "text-[#777777]"
                  : passwordsMatch
                    ? "text-green-600"
                    : "text-red-600"
              }`}
            >
              {confirmPassword.length === 0
                ? "Make sure both passwords match."
                : passwordsMatch
                  ? "Passwords match."
                  : "Passwords do not match."}
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 h-16 w-full rounded-full bg-[#592EBD] text-[17px] hover:bg-[#4B24A8]"
          >
            {isSubmitting
              ? "Updating Password..."
              : "Reset Password"}
          </Button>
        </form>
      </div>
    </main>
  );
}

type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  show: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
};

function PasswordInput({
  id,
  label,
  value,
  show,
  onChange,
  onToggle,
}: PasswordInputProps) {
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
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          autoComplete="new-password"
          placeholder="Enter your new password"
          className="h-16 rounded-xl pr-14"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-5 top-1/2 -translate-y-1/2"
          aria-label={
            show
              ? "Hide password"
              : "Show password"
          }
        >
          {show ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>
    </div>
  );
}

function Requirement({
  passed,
  label,
}: {
  passed: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          passed
            ? "bg-green-600 text-white"
            : "bg-neutral-200 text-neutral-500"
        }`}
      >
        <Check size={14} />
      </div>

      <span className="text-sm text-[#666666]">
        {label}
      </span>
    </div>
  );
}