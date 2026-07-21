"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type RegistrationRole =
  | "SURVIVOR"
  | "CARER";

type RegisterFormProps = {
  accountRole?: RegistrationRole;
  loginHref?: string;
  checkEmailHref?: string;
  title?: string;
  description?: string;
};

export function RegisterForm({
  accountRole = "SURVIVOR",
  loginHref = "/auth/login",
  checkEmailHref = "/auth/check-email",
  title = "Create Your Account",
  description = "Let’s get you ready for your rehabilitation journey.",
}: RegisterFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

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

  const [successMessage, setSuccessMessage] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    const cleanFirstName =
      firstName.trim();

    const cleanLastName =
      lastName.trim();

    const cleanEmail =
      email.trim();

    if (
      !cleanFirstName ||
      !cleanLastName
    ) {
      setErrorMessage(
        "Please enter your first and last name."
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "Password must be at least 8 characters."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            first_name:
              cleanFirstName,
            last_name:
              cleanLastName,
            display_name:
              `${cleanFirstName} ${cleanLastName}`,
            role: accountRole,
          },
          emailRedirectTo:
            `${window.location.origin}${loginHref}`,
        },
      });

      if (error) {
        setErrorMessage(
          error.message
        );
        return;
      }

      if (data.session) {
        const destination =
          accountRole === "CARER"
            ? "/carer/dashboard"
            : "/onboarding";

        router.replace(
          destination
        );

        router.refresh();
        return;
      }

      router.push(
        `${checkEmailHref}?email=${encodeURIComponent(
          cleanEmail
        )}`
      );
    } catch (error) {
      console.error(
        "Unexpected registration error:",
        error
      );

      setErrorMessage(
        "Unable to create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-[30px] font-bold leading-tight text-[#010E0E]">
        {title}
      </h1>

      <p className="mt-2 text-[16px] text-[#757575]">
        {description}
      </p>

      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="first-name"
              className="text-sm"
            >
              First name
            </label>

            <Input
              id="first-name"
              className="mt-2 h-16 rounded-xl"
              autoComplete="given-name"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(event) =>
                setFirstName(
                  event.target.value
                )
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="last-name"
              className="text-sm"
            >
              Last name
            </label>

            <Input
              id="last-name"
              className="mt-2 h-16 rounded-xl"
              autoComplete="family-name"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(event) =>
                setLastName(
                  event.target.value
                )
              }
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="text-sm"
          >
            Email address
          </label>

          <Input
            id="register-email"
            className="mt-2 h-16 rounded-xl"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="text-sm"
          >
            Password
          </label>

          <div className="relative mt-2">
            <Input
              id="register-password"
              className="h-16 rounded-xl pr-16"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              minLength={8}
              required
              disabled={isSubmitting}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current
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

      {successMessage && (
        <div
          role="status"
          className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
        >
          <p>{successMessage}</p>

          <Link
            href={loginHref}
            className="mt-2 inline-block font-semibold text-blue-600"
          >
            Go to login
          </Link>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-10 h-16 w-full rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8]"
      >
        {isSubmitting
          ? "Creating account..."
          : "Create Account"}
      </Button>

      <p className="mt-7 text-center text-[16px]">
        Already have an account?{" "}
        <Link
          href={loginHref}
          className="font-semibold text-blue-600"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}