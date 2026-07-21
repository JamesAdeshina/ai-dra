"use client";

import {
  useMemo,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { InvitationSuccessState } from "@/features/invitations/actions/carer-invitation-accept-actions";
import { setPasswordForInvitedSurvivorAction } from "@/features/invitations/actions/carer-invitation-accept-actions";

type AcceptCarerInvitationViewProps = {
  invitation: InvitationSuccessState;
  token: string;
};

export function AcceptCarerInvitationView({
  invitation,
  token,
}: AcceptCarerInvitationViewProps) {
  const router = useRouter();

  const [showPasswordForm, setShowPasswordForm] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [isPending, startTransition] =
    useTransition();

  const passwordChecks = useMemo(
    () => ({
      letters:
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password),
      number: /\d/.test(password),
      special:
        /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]';`~]/.test(
          password,
        ),
      length: password.length >= 8,
    }),
    [password],
  );

  const canSavePassword =
    Object.values(passwordChecks).every(Boolean) &&
    password === confirmPassword &&
    !isPending;

  const loginUrl = `/auth/login?email=${encodeURIComponent(
    invitation.inviteeEmail,
  )}`;

  const resetPasswordUrl = `/auth/forgot-password?email=${encodeURIComponent(
    invitation.inviteeEmail,
  )}`;

  const handleSetPassword = () => {
    setError(null);

    startTransition(async () => {
      const result =
        await setPasswordForInvitedSurvivorAction({
          token,
          email: invitation.inviteeEmail,
          firstName: invitation.firstName,
          lastName: invitation.lastName,
          phone: invitation.phone,
          password,
        });

      if (!result.ok) {
        setError(
          result.error ??
            "Password could not be saved.",
        );
        return;
      }

      router.push(result.next ?? loginUrl);
    });
  };

  if (showPasswordForm) {
    return (
      <AuthShell>
        <div className="rounded-[24px] bg-white px-8 py-10 shadow-sm">
          <h1 className="text-[36px] font-bold leading-tight text-[#081111]">
            Set your Password
          </h1>

          <p className="mt-3 text-sm text-[#7D7773]">
            Create a secure password to continue to AI-DRA.
          </p>

          <div className="mt-8">
            <PasswordField
              label="New Password"
              value={password}
              show={showPassword}
              onShowChange={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              onChange={setPassword}
            />

            <div className="mt-5 space-y-4">
              <PasswordRule
                valid={passwordChecks.letters}
                text="Mix of uppercase & lowercase letters"
              />

              <PasswordRule
                valid={passwordChecks.number}
                text="Include at least one number"
              />

              <PasswordRule
                valid={passwordChecks.special}
                text="Add a special character (!@#$%^&*)"
              />

              <PasswordRule
                valid={passwordChecks.length}
                text="Make it at least 8 characters long"
              />
            </div>

            <div className="mt-8">
              <PasswordField
                label="Confirm New Password"
                value={confirmPassword}
                show={showConfirmPassword}
                onShowChange={() =>
                  setShowConfirmPassword(
                    (current) => !current,
                  )
                }
                onChange={setConfirmPassword}
                helperText="Make sure both passwords match."
              />
            </div>

            {confirmPassword &&
            password !== confirmPassword ? (
              <p className="mt-3 text-sm text-red-600">
                Passwords do not match.
              </p>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button
              type="button"
              disabled={!canSavePassword}
              onClick={handleSetPassword}
              className="mt-10 h-14 w-full rounded-full bg-[#5B2CCB] text-base font-semibold text-white hover:bg-[#4B24A4]"
            >
              Save Password
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="rounded-[24px] bg-white px-8 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#EAF8F0]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#35B970] text-white">
            <Check size={24} strokeWidth={3} />
          </div>
        </div>

        <h1 className="mt-10 text-[36px] font-bold leading-tight text-[#081111]">
          You’re all set!
        </h1>

        <p className="mx-auto mt-3 max-w-[430px] text-base leading-6 text-[#7D7773]">
          You have successfully accepted the invitation from{" "}
          <span className="font-semibold text-[#5B2CCB]">
            {invitation.inviterName}
          </span>
          . You have now linked, and your carer can support and view your progress throughout your rehabilitation journey.
        </p>

        <div className="mt-7 rounded-2xl bg-[#F0EEFF] px-5 py-4 text-left">
          <p className="text-sm font-medium leading-6 text-[#171717]">
            {invitation.accountExists
              ? "Since you already have an existing account you can sign in to continue to your dashboard."
              : "Since you’re new here, create your password to activate your account to access your dashboard."}
          </p>
        </div>

        {invitation.accountExists ? (
          <>
            <Button
              asChild
              className="mt-7 h-14 w-full rounded-full bg-[#5B2CCB] text-base font-semibold text-white hover:bg-[#4B24A4]"
            >
              <Link href={loginUrl}>
                Sign In
              </Link>
            </Button>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E4DFDA]" />
              <span className="text-sm text-[#504A46]">
                or
              </span>
              <div className="h-px flex-1 bg-[#E4DFDA]" />
            </div>

            <Button
              asChild
              variant="outline"
              className="h-14 w-full rounded-full border-[#DDD6D0] bg-white text-base font-medium text-[#25211E]"
            >
              <Link href={resetPasswordUrl}>
                Reset Password
              </Link>
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={() =>
              setShowPasswordForm(true)
            }
            className="mt-7 h-14 w-full rounded-full bg-[#5B2CCB] text-base font-semibold text-white hover:bg-[#4B24A4]"
          >
            Set Password
          </Button>
        )}
      </div>
    </AuthShell>
  );
}

function AuthShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F7F3EE] px-4 py-12">
      <div className="mx-auto max-w-[520px]">
        <div className="mb-9 flex justify-center">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.svg"
              alt="AI-DRA"
              className="h-14 w-14"
            />

            <div className="text-left">
              <p className="text-2xl font-bold text-[#5B2CCB]">
                AI-DRA
              </p>

              <p className="text-sm text-[#7D7773]">
                Digital Rehabilitation Assistant
              </p>
            </div>
          </div>
        </div>

        {children}

        <p className="mt-24 text-center text-base text-[#25211E]">
          Need help? Contact{" "}
          <a
            href="mailto:support@ai-dra.co.uk"
            className="font-semibold text-[#0066FF]"
          >
            support@ai-dra.co.uk
          </a>
        </p>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  value,
  show,
  onShowChange,
  onChange,
  helperText,
}: {
  label: string;
  value: string;
  show: boolean;
  onShowChange: () => void;
  onChange: (value: string) => void;
  helperText?: string;
}) {
  return (
    <label className="block text-left">
      <span className="text-sm font-medium text-[#081111]">
        {label}
      </span>

      <div className="mt-2 flex h-16 items-center rounded-xl border border-[#DDD6D0] bg-white px-5">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="Enter your password"
          className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#7D7773]"
        />

        <button
          type="button"
          onClick={onShowChange}
          className="ml-3 text-sm font-semibold text-[#504A46]"
        >
          {show ? (
            <span className="inline-flex items-center gap-1">
              <EyeOff size={16} />
              Hide
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Eye size={16} />
              Show
            </span>
          )}
        </button>
      </div>

      {helperText ? (
        <p className="mt-2 text-sm text-[#7D7773]">
          {helperText}
        </p>
      ) : null}
    </label>
  );
}

function PasswordRule({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-left">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          valid
            ? "bg-[#35B970] text-white"
            : "bg-[#E8E2DC] text-[#8A817B]"
        }`}
      >
        <Check size={15} strokeWidth={3} />
      </span>

      <span className="text-sm text-[#7D7773]">
        {text}
      </span>
    </div>
  );
}