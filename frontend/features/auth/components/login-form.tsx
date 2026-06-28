"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Unexpected login error:", error);
      setErrorMessage("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-[30px] font-bold text-[#010E0E]">
        Welcome back
      </h1>

      <p className="mt-2 text-[16px] text-[#757575]">
        Sign in to continue your rehabilitation.
      </p>

      <div className="mt-8 space-y-4">
        <div>
          <label htmlFor="login-email" className="text-sm">
            Email address
          </label>

          <Input
            id="login-email"
            className="mt-2 h-16 rounded-xl"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="login-password" className="text-sm">
            Password
          </label>

          <div className="relative mt-2">
            <Input
              id="login-password"
              className="h-16 rounded-xl pr-16"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isSubmitting}
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
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
        href="/auth/forgot-password"
        className="mt-4 block text-[15px] font-medium text-blue-600"
      >
        Forgot Password?
      </Link>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 h-16 w-full rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8]"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <p className="mt-7 text-center text-[16px]">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-blue-600"
        >
          Create Account
        </Link>
      </p>
    </form>
  );
}