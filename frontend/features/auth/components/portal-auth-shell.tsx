"use client";

import Link from "next/link";

import {
  HeartPulse,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";

import type {
  AppRole,
} from "@/features/auth/types/auth-role";

type PortalAuthShellProps = {
  role: AppRole;
  children: React.ReactNode;
};

const PORTAL_COPY: Record<
  AppRole,
  {
    eyebrow: string;
    title: string;
    description: string;
    icon: React.ReactNode;
  }
> = {
  SURVIVOR: {
    eyebrow: "Survivor Portal",
    title: "Continue your rehabilitation journey",
    description:
      "Access guided exercises, progress tracking, reminders, and personalised rehabilitation support.",
    icon: <HeartPulse className="h-6 w-6" />,
  },
  CARER: {
    eyebrow: "Carer Portal",
    title: "Support the people connected to you",
    description:
      "Review linked survivor activity, sessions, progress, exercises, invitations, and shared notes.",
    icon: <Users className="h-6 w-6" />,
  },
  ADMIN: {
    eyebrow: "Administration Portal",
    title: "Manage the AI-DRA platform",
    description:
      "Access survivor, carer, invitation, exercise, session, notification, analytics, and system administration tools.",
    icon: <ShieldCheck className="h-6 w-6" />,
  },
  CLINICIAN: {
    eyebrow: "Clinician Portal",
    title: "Review rehabilitation activity",
    description:
      "Access clinically relevant rehabilitation information for people connected to your professional account.",
    icon: <HeartPulse className="h-6 w-6" />,
  },
};

export function PortalAuthShell({
  role,
  children,
}: PortalAuthShellProps) {
  const copy = PORTAL_COPY[role];

  return (
    <main className="min-h-screen bg-[#F7F4F2] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1180px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(41,28,79,0.12)] lg:grid-cols-[1fr_0.9fr]">
        <section className="hidden bg-[#592EBD] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Link
            href="/"
            className="w-fit"
            aria-label="Go to AI-DRA home"
          >
            <Logo />
          </Link>

          <div className="max-w-[470px]">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-[13px] font-semibold">
              {copy.icon}
              {copy.eyebrow}
            </div>

            <h1 className="mt-6 text-[42px] font-semibold leading-[115%]">
              {copy.title}
            </h1>

            <p className="mt-5 text-[16px] leading-[165%] text-white/78">
              {copy.description}
            </p>
          </div>

          <p className="text-[12px] leading-[150%] text-white/65">
            AI-DRA uses one secure account system across all portals. Your assigned roles determine which portal you can access.
          </p>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-[440px]">
            <div className="mb-8 lg:hidden">
              <Link
                href="/"
                className="inline-flex"
                aria-label="Go to AI-DRA home"
              >
                <Logo />
              </Link>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F2EEFC] px-4 py-2 text-[13px] font-semibold text-[#592EBD]">
                {copy.icon}
                {copy.eyebrow}
              </div>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
