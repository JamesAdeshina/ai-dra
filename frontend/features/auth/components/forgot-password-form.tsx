"use client";

import {
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type ForgotPasswordFormProps = {
  loginHref?: string;
  registerHref?: string | null;
};

export function ForgotPasswordForm({
  loginHref = "/auth/login",
  registerHref = "/auth/register",
}: ForgotPasswordFormProps) {
  const [email, setEmail] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage(
        "Enter your email address."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const supabase =
        createClient();

      const redirectTo =
        `${window.location.origin}/auth/callback?next=/auth/reset-password`;

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo,
          }
        );

      if (error) {
        throw error;
      }

      setSuccessMessage(
        "If an account exists for that email address, a password reset link has been sent."
      );
    } catch (error) {
      console.error(
        "Password reset request failed:",
        error
      );

      setErrorMessage(
        "Unable to send a password reset email right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-[30px] font-bold text-[#010E0E]">
        Reset Password
      </h1>

      <p className="mt-2 text-[16px] text-[#757575]">
        Enter your email address and we&apos;ll send you a reset link.
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

        {successMessage && (
          <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <label
          htmlFor="reset-email"
          className="text-sm"
        >
          Email Address
        </label>

        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(
              event.target.value
            );
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          autoComplete="email"
          className="mt-2 h-16 rounded-xl"
          placeholder="Enter your email address"
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-24 h-16 w-full rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Sending..."
            : "Send Reset Link"}
        </Button>
      </form>

      <p className="mt-6 text-center">
        <Link
          href={loginHref}
          className="font-semibold text-blue-600"
        >
          Back to login
        </Link>
      </p>

      {registerHref ? (
        <p className="mt-3 text-center text-sm text-[#757575]">
          Don&apos;t have an account?{" "}
          <Link
            href={registerHref}
            className="font-semibold text-[#592EBD]"
          >
            Register
          </Link>
        </p>
      ) : null}
    </div>
  );
}