"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type CheckEmailCardProps = {
  email: string;
};

export function CheckEmailCard({
  email,
}: CheckEmailCardProps) {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpenEmailApp = () => {
    window.location.href = "mailto:";
  };

  const handleResendEmail = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createClient();

      const { error: resendError } =
        await supabase.auth.resend({
          type: "signup",
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/login`,
          },
        });

      if (resendError) {
        throw resendError;
      }

      setMessage("A new verification email has been sent.");
    } catch (resendError) {
      setError(
        resendError instanceof Error
          ? resendError.message
          : "Unable to resend the verification email."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="">
      <div className="flex-col items-center justify-center">
        <section className="">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full bg-[#F2EFFF]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7B61FF] text-white">
                <Mail className="h-6 w-6" />
              </div>
            </div>

            <h1 className="mt-4 text-[34px] font-bold tracking-[-0.03em] text-[#101010]">
              Check your email
            </h1>

            <p className="mt-1 text-[15px] font-semibold text-[#7B61FF]">
              Verify your email to continue
            </p>

            <div className="mt-7 text-[15px] leading-6 text-[#7A7A7A]">
              <p>We&apos;ve sent a verification link to</p>

              <p className="font-semibold text-[#1E1E1E]">
                {email || "youremail@example.com"}
              </p>

              <p>
                Please check your inbox and click the link to verify your
                email address.
              </p>
            </div>

            <div className="mt-7 flex w-full items-center gap-4 rounded-xl bg-[#F1EEFF] px-5 py-4 text-left">
              <LockKeyhole className="h-6 w-6 shrink-0 text-[#7B61FF]" />

              <p className="text-[14px] leading-5 text-[#262626]">
                Verifying your email helps us keep your account secure
                and protects your data.
              </p>
            </div>

            {message && (
              <div className="mt-5 w-full rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-5 w-full rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleOpenEmailApp}
              className="mt-7 flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#6330CF] text-[16px] font-semibold text-white transition hover:bg-[#5425BA]"
            >
              Open Email App
              <ExternalLink className="h-5 w-5" />
            </button>

            <div className="my-4 flex w-full items-center gap-0">
              <div className="h-px flex-1 bg-[#E5E5E5]" />
              <span className="text-sm text-[#666666]">or</span>
              <div className="h-px flex-1 bg-[#E5E5E5]" />
            </div>

            <Link
              href="/auth/login"
              className="flex h-[54px] w-full items-center justify-center rounded-full border border-[#DCDCDC] text-[16px] font-medium text-[#242424] transition hover:bg-[#F8F8F8]"
            >
              Return to Login
            </Link>

            <p className="mt-12 text-[14px] leading-6 text-[#444444]">
              Didn&apos;t receive the email? Check your spam folder or
              resend the verification email.{" "}
              <button
                type="button"
                disabled={!email || isResending}
                onClick={handleResendEmail}
                className="font-semibold text-[#1769E0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Email"}
              </button>
            </p>
          </div>
        </section>

        <p className="mt-10 text-center text-[14px] text-[#333333]">
          Need help? Contact{" "}
          <a
            href="mailto:support@ai-dra.co.uk"
            className="font-semibold text-[#1769E0]"
          >
            support@ai-dra.co.uk
          </a>
        </p>
      </div>
    </main>
  );
}