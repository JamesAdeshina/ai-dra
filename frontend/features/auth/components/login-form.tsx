"use client";

import Link from "next/link";
import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type SupportedLoginRole =
  | "SURVIVOR"
  | "CARER"
  | "ADMIN";

type LoginFormProps = {
  intendedRole?: SupportedLoginRole;
  forgotPasswordHref?: string;
  registerHref?: string | null;
  destination?: string;
  title?: string;
  description?: string;
};

const ROLE_HOME_ROUTES: Record<
  SupportedLoginRole,
  string
> = {
  SURVIVOR: "/dashboard",
  CARER: "/carer/dashboard",
  ADMIN: "/admin/dashboard",
};

function getSafeRedirectPath(
  value: string | null,
) {
  if (!value) {
    return null;
  }

  if (!value.startsWith("/")) {
    return null;
  }

  if (value.startsWith("//")) {
    return null;
  }

  return value;
}

export function LoginForm({
  intendedRole = "SURVIVOR",
  forgotPasswordHref = "/auth/forgot-password",
  registerHref = "/auth/register",
  destination,
  title = "Welcome back",
  description = "Sign in to continue your rehabilitation.",
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const redirectTo = useMemo(
    () =>
      getSafeRedirectPath(
        searchParams.get("redirectTo"),
      ),
    [searchParams],
  );

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const {
        data: signInData,
        error: signInError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email: email.trim(),
            password,
          },
        );

      if (signInError) {
        setErrorMessage(
          signInError.message,
        );
        return;
      }

      const userId =
        signInData.user?.id;

      if (!userId) {
        await supabase.auth.signOut();

        setErrorMessage(
          "Unable to load your account.",
        );
        return;
      }

      const {
        data: roleRows,
        error: roleError,
      } = await supabase
        .from("user_roles")
        .select(
          `
            role,
            is_primary
          `,
        )
        .eq("user_id", userId);

      if (roleError) {
        await supabase.auth.signOut();

        console.error(
          "Unable to load account role:",
          roleError,
        );

        setErrorMessage(
          "Unable to verify your account role.",
        );
        return;
      }

      const roles = (
        roleRows ?? []
      ) as {
        role: SupportedLoginRole;
        is_primary: boolean;
      }[];

      if (roles.length === 0) {
        await supabase.auth.signOut();

        setErrorMessage(
          "This account does not have an assigned portal role.",
        );
        return;
      }

      const intendedRoleRecord =
        roles.find(
          (record) =>
            record.role ===
            intendedRole,
        );

      const primaryRoleRecord =
        roles.find(
          (record) =>
            record.is_primary,
        );

      const resolvedRole =
        intendedRoleRecord?.role ??
        primaryRoleRecord?.role ??
        (roles.length === 1
          ? roles[0].role
          : null);

      if (!resolvedRole) {
        await supabase.auth.signOut();

        setErrorMessage(
          "This account has multiple roles but no primary role has been selected.",
        );
        return;
      }

      const resolvedDestination =
        redirectTo ??
        (destination &&
        resolvedRole === intendedRole
          ? destination
          : ROLE_HOME_ROUTES[
              resolvedRole
            ]);

      router.refresh();

      window.location.assign(
        resolvedDestination,
      );
    } catch (error) {
      console.error(
        "Unexpected login error:",
        error,
      );

      setErrorMessage(
        "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-[30px] font-bold text-[#010E0E]">
        {title}
      </h1>

      <p className="mt-2 text-[16px] text-[#757575]">
        {description}
      </p>

      <div className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="text-sm"
          >
            Email address
          </label>

          <Input
            id="login-email"
            className="mt-2 h-16 rounded-xl"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="text-sm"
          >
            Password
          </label>

          <div className="relative mt-2">
            <Input
              id="login-password"
              className="h-16 rounded-xl pr-16"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              required
              disabled={isSubmitting}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current,
                )
              }
              className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </p>
      )}

      <Link
        href={forgotPasswordHref}
        className="mt-4 block text-[15px] font-medium text-blue-600"
      >
        Forgot Password?
      </Link>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 h-16 w-full rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8]"
      >
        {isSubmitting
          ? "Signing in..."
          : "Sign in"}
      </Button>

      {registerHref ? (
        <p className="mt-7 text-center text-[16px]">
          Don&apos;t have an account?{" "}
          <Link
            href={registerHref}
            className="font-semibold text-blue-600"
          >
            Create Account
          </Link>
        </p>
      ) : null}
    </form>
  );
}