"use client";

import type { ReactNode } from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Loader2,
  X,
} from "lucide-react";

import { unlinkSurvivorFromCarer } from "@/features/carer/actions/unlink-survivor-action";
import { SurvivorDetailSidebar } from "@/features/carer/components/survivors/survivor-detail-sidebar";
import type { DirectorySurvivorStatus } from "@/features/carer/types";
import type { SurvivorDetail } from "@/features/carer/types/survivor-detail";
import { cn } from "@/lib/utils";

type SurvivorDetailShellProps = {
  survivor: SurvivorDetail;
  children: ReactNode;
};

const statusPresentation: Record<
  DirectorySurvivorStatus,
  {
    label: string;
    className: string;
  }
> = {
  ON_TRACK: {
    label: "On Track",
    className: "bg-[#EAF8EF] text-[#258B55]",
  },
  NEEDS_SUPPORT: {
    label: "Needs Support",
    className: "bg-[#FFF7E5] text-[#AD7200]",
  },
  AT_RISK: {
    label: "At Risk",
    className: "bg-[#FFF0F0] text-[#D33B3B]",
  },
};

export function SurvivorDetailShell({
  survivor,
  children,
}: SurvivorDetailShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showUnlinkModal, setShowUnlinkModal] =
    useState(false);
  const [unlinkError, setUnlinkError] =
    useState<string | null>(null);
  const [isPending, startTransition] =
    useTransition();

  const basePath = `/carer/survivors/${survivor.id}`;
  const status = statusPresentation[survivor.status];

  const tabs = [
    {
      label: "Overview",
      href: basePath,
      count: null,
    },
    {
      label: "Sessions",
      href: `${basePath}/sessions`,
      count: survivor.sessionsCount,
    },
    {
      label: "Exercises",
      href: `${basePath}/exercises`,
      count: null,
    },
    {
      label: "Notes",
      href: `${basePath}/notes`,
      count: null,
    },
  ];

  function isTabActive(href: string) {
    const normalisePath = (value: string) =>
      value.replace(/\/+$/, "");

    const currentPath = normalisePath(pathname);
    const tabPath = normalisePath(href);
    const overviewPath = normalisePath(basePath);

    if (tabPath === overviewPath) {
      return currentPath === overviewPath;
    }

    return (
      currentPath === tabPath ||
      currentPath.startsWith(`${tabPath}/`)
    );
  }

  function handleConfirmUnlink() {
    if (isPending) {
      return;
    }

    setUnlinkError(null);

    startTransition(async () => {
      const result =
        await unlinkSurvivorFromCarer(survivor.id);

      if (!result.ok) {
        setUnlinkError(result.error);
        return;
      }

      setShowUnlinkModal(false);
      router.push("/carer/survivors");
      router.refresh();
    });
  }

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/carer/survivors"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#7652EF] transition hover:text-[#592EBD]"
          >
            <ArrowLeft size={18} />
            Back to Survivors
          </Link>

          <button
            type="button"
            onClick={() => {
              setUnlinkError(null);
              setShowUnlinkModal(true);
            }}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F23636] px-8 text-sm font-semibold text-white transition hover:bg-[#D92D2D]"
          >
            Unlink Survivor
          </button>
        </div>

        <div className="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <article className="grid gap-5 rounded-2xl border border-[#DEDAD6] bg-white p-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)] sm:p-5 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-center">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative shrink-0">
                  {survivor.avatarUrl ? (
                    <img
                      src={survivor.avatarUrl}
                      alt=""
                      className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
                    />
                  ) : (
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EEE9FB] text-xl font-bold text-[#592EBD] sm:h-24 sm:w-24">
                      {survivor.initials}
                    </span>
                  )}

                  <span
                    className="absolute bottom-1 right-0 h-4 w-4 rounded-full border-[3px] border-white bg-[#F23636]"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-semibold text-[#272320]">
                    {survivor.name}
                  </h1>

                  <p className="mt-2 flex items-center gap-2 text-sm text-[#4E4844]">
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-[#F23636]"
                      aria-hidden="true"
                    />

                    {survivor.conditionLabel}
                  </p>

                  <p className="mt-3 flex items-center gap-2 text-sm text-[#59534F]">
                    <CalendarDays size={17} />
                    {survivor.joinedAtLabel}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 border-t border-[#ECE8E4] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                <div>
                  <p className="text-sm font-medium text-[#403A36]">
                    Current Status
                  </p>

                  <span
                    className={cn(
                      "mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold",
                      status.className,
                    )}
                  >
                    {status.label}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#403A36]">
                    Today&apos;s Goal
                  </p>

                  <p className="mt-2 text-2xl font-bold text-[#3478EA]">
                    {survivor.todayProgressMinutes}/
                    {survivor.dailyGoalMinutes}
                  </p>

                  <p className="mt-1 text-xs text-[#817A75]">
                    mins completed
                  </p>
                </div>
              </div>
            </article>

            <nav
              className="mt-4 grid grid-cols-4 border-b border-[#E5E1DD]"
              aria-label={`${survivor.name} profile sections`}
            >
              {tabs.map((tab) => {
                const active = isTabActive(tab.href);

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={cn(
                      "relative flex min-h-14 items-center justify-center gap-2 px-2 text-sm font-medium transition",
                      active
                        ? "text-[#592EBD]"
                        : "text-[#6A635F] hover:text-[#592EBD]",
                    )}
                  >
                    {tab.label}

                    {tab.count !== null ? (
                      <span className="flex min-h-6 min-w-6 items-center justify-center rounded-md bg-[#3478EA] px-1.5 text-xs font-semibold text-white">
                        {tab.count}
                      </span>
                    ) : null}

                    {active ? (
                      <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-[#592EBD]" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <main className="mt-4 min-w-0">
              {children}
            </main>
          </div>

          <SurvivorDetailSidebar survivor={survivor} />
        </div>
      </div>
      {showUnlinkModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="unlink-survivor-title"
        >
          <div className="w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF0F0] text-[#D33B3B]">
                  <AlertTriangle size={24} />
                </span>

                <div>
                  <h2
                    id="unlink-survivor-title"
                    className="text-xl font-semibold text-[#272320]"
                  >
                    Unlink {survivor.name}?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#5F5752]">
                    This removes {survivor.name} from your carer view immediately. You will no longer be able to access their rehabilitation progress, sessions, exercises, or notes.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowUnlinkModal(false)}
                disabled={isPending}
                className="rounded-full p-2 text-[#817A75] transition hover:bg-[#F5F2EF] hover:text-[#332E2B]"
                aria-label="Close unlink confirmation"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-[#FFF8E8] p-4 text-sm leading-6 text-[#6B4B00]">
              The survivor will be notified through the notification queue. Email and push rows will also be queued for delivery.
            </div>

            {unlinkError ? (
              <div className="mt-4 rounded-2xl bg-[#FFF0F0] p-4 text-sm leading-6 text-[#B42318]">
                {unlinkError}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowUnlinkModal(false)}
                disabled={isPending}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#DEDAD6] px-6 text-sm font-semibold text-[#3B3633] transition hover:bg-[#F7F4F1] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmUnlink}
                disabled={isPending}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#F23636] px-6 text-sm font-semibold text-white transition hover:bg-[#D92D2D] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={17} />
                ) : null}

                {isPending ? "Unlinking..." : "Yes, unlink survivor"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}