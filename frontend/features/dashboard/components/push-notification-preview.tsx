"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  BellRing,
  CircleAlert,
  X,
} from "lucide-react";

import type {
  DashboardNotification,
} from "@/features/dashboard/types/dashboard-types";

type PushNotificationPreviewProps = {
  notification: DashboardNotification | null;
};

export function PushNotificationPreview({
  notification,
}: PushNotificationPreviewProps) {
  const [isVisible, setIsVisible] =
    useState(false);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const showTimer = window.setTimeout(
      () => {
        setIsVisible(true);
      },
      1200
    );

    const hideTimer = window.setTimeout(
      () => {
        setIsVisible(false);
      },
      9200
    );

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [notification]);

  if (
    !notification ||
    !isVisible
  ) {
    return null;
  }

  const isSupport =
    notification.type === "SUPPORT";

  return (
    <div
      className={[
        "fixed z-[80] transition-all",
        "bottom-4 left-4 right-4",
        "sm:bottom-auto sm:left-auto sm:right-5 sm:top-5 sm:w-[390px]",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between border-b border-[#EEEEEE] px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full",
                isSupport
                  ? "bg-amber-100 text-amber-700"
                  : "bg-[#F2EEFC] text-[#592EBD]",
              ].join(" ")}
            >
              {isSupport ? (
                <CircleAlert size={17} />
              ) : (
                <BellRing size={17} />
              )}
            </div>

            <div>
              <p className="text-[13px] font-semibold text-[#1E1E1E]">
                AI-DRA
              </p>

              <p className="text-[11px] text-[#8A8A8A]">
                now
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsVisible(false)
            }
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#666666] transition hover:bg-[#F3F3F3] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/20"
            aria-label="Dismiss notification"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-4 py-4">
          <h2 className="text-[16px] font-semibold leading-[140%] text-[#1E1E1E]">
            {notification.title}
          </h2>

          <p className="mt-1 text-[14px] leading-[150%] text-[#666666]">
            {notification.message}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              href={notification.href}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#592EBD] px-5 text-[14px] font-semibold text-white transition hover:bg-[#4B24A8] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/25"
              onClick={() =>
                setIsVisible(false)
              }
            >
              View
            </Link>

            <button
              type="button"
              onClick={() =>
                setIsVisible(false)
              }
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#D9D9D9] px-5 text-[14px] font-medium text-[#1E1E1E] transition hover:bg-[#F7F7F7] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/20"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
