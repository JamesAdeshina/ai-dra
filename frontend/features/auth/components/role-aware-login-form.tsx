"use client";

import {
  useMemo,
  useState,
  useTransition,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { createClient } from "@/lib/supabase/client";

import {
  resolveAuthenticatedPortal,
} from "@/features/auth/services/auth-redirect-service";

import {
  getPortalForgotPasswordRoute,
  getPortalRegisterRoute,
  getRoleLabel,
} from "@/features/auth/utils/portal-routes";

import type {
  RoleAwareLoginFormProps,
} from "@/features/auth/types/auth-role";

export function RoleAwareLoginForm({
  intendedRole,
  registerHref,
  forgotPasswordHref,
  heading,
  description,
  submitLabel,
}: RoleAwareLoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);
  const [isPending, startTransition] =
    useTransition();

  const roleLabel =
    getRoleLabel(intendedRole);

  const resolvedRegisterHref =
    registerHref === undefined
      ? getPortalRegisterRoute(
          intendedRole
        )
      : registerHref;

  const resolvedForgotPasswordHref =
    forgotPasswordHref ??
    getPortalForgotPasswordRoute(
      intendedRole
    );

  const defaultHeading = useMemo(
    () =>
      intendedRole === "SURVIVOR"
        ? "Welcome back"
        : `${roleLabel} Portal`,
    [intendedRole, roleLabel]
  );

  const defaultDescription =
    intendedRole === "SURVIVOR"
      ? "Sign in to continue your rehabilitation journey."
      : `Sign in to access the ${roleLabel.toLowerCase()} portal.`;

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage(null);

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMessage(
        "Enter your email address and password."
      );
      return;
    }

    startTransition(() => {
      void signInAndRedirect({
        email: cleanEmail,
        password,
      });
    });
  };

  const signInAndRedirect = async ({
    email: loginEmail,
    password: loginPassword,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const supabase = createClient();

      const { error: signInError } =
        await supabase.auth.signInWithPassword(
          {
            email: loginEmail,
            password: loginPassword,
          }
        );

      if (signInError) {
        setErrorMessage(
          normaliseAuthError(
            signInError.message
          )
        );
        return;
      }

      const resolution =
        await resolveAuthenticatedPortal(
          intendedRole
        );

      if (
        resolution.reason ===
        "NO_ROLE_ASSIGNED"
      ) {
        await supabase.auth.signOut();

        setErrorMessage(
          "Your account does not have an assigned portal role. Contact support or an administrator."
        );
        return;
      }

      router.refresh();

      window.location.href =
        resolution.destination;
    } catch (error) {
      console.error(
        "Role-aware login failed:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Sign-in could not be completed."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-6"
    >
      <div>
        <h1 className="text-[32px] font-semibold text-[#1E1E1E]">
          {heading ?? defaultHeading}
        </h1>

        <p className="mt-2 text-[15px] leading-[150%] text-[#666666]">
          {description ??
            defaultDescription}
        </p>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-[14px] leading-[150%]">
            {errorMessage}
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        <label
          htmlFor={`${intendedRole.toLowerCase()}-email`}
          className="text-[14px] font-medium text-[#1E1E1E]"
        >
          Email address
        </label>

        <Input
          id={`${intendedRole.toLowerCase()}-email`}
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          disabled={isPending}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
          placeholder="Enter your email address"
          className="h-12 rounded-xl"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor={`${intendedRole.toLowerCase()}-password`}
            className="text-[14px] font-medium text-[#1E1E1E]"
          >
            Password
          </label>

          <Link
            href={
              resolvedForgotPasswordHref
            }
            className="text-[13px] font-medium text-[#592EBD] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <Input
            id={`${intendedRole.toLowerCase()}-password`}
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="current-password"
            value={password}
            disabled={isPending}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            placeholder="Enter your password"
            className="h-12 rounded-xl pr-12"
            required
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) =>
                  !current
              )
            }
            disabled={isPending}
            data-icon-button="true"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#666666] transition hover:bg-[#F3F3F3]"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-full bg-[#592EBD] text-[15px] font-semibold text-white hover:bg-[#4B24A8]"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            {submitLabel ??
              `Sign in as ${roleLabel}`}
          </>
        )}
      </Button>

      {resolvedRegisterHref ? (
        <p className="text-center text-[14px] text-[#666666]">
          Need an account?{" "}
          <Link
            href={
              resolvedRegisterHref
            }
            className="font-semibold text-[#592EBD] hover:underline"
          >
            Register
          </Link>
        </p>
      ) : null}

      <p className="text-center text-[12px] leading-[150%] text-[#999999]">
        After sign-in, AI-DRA checks your assigned role and redirects you to the correct portal.
      </p>
    </form>
  );
}

function normaliseAuthError(
  message: string
): string {
  const normalised =
    message.toLowerCase();

  if (
    normalised.includes(
      "invalid login credentials"
    )
  ) {
    return "The email address or password is incorrect.";
  }

  if (
    normalised.includes(
      "email not confirmed"
    )
  ) {
    return "Confirm your email address before signing in.";
  }

  if (
    normalised.includes(
      "too many requests"
    )
  ) {
    return "Too many sign-in attempts. Wait a moment and try again.";
  }

  return message;
}
