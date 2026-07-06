"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  BellRing,
  ChartNoAxesColumnIncreasing,
  CircleAlert,
  Clock3,
  X,
} from "lucide-react";

import type {
  DashboardNotification,
} from "@/features/dashboard/types/dashboard-types";

type DashboardNotificationPopoverProps = {
  notifications: DashboardNotification[];
};

export function DashboardNotificationPopover({
  notifications,
}: DashboardNotificationPopoverProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setIsOpen(true)
        }
        className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1E1E1E] shadow-sm transition hover:bg-[#F8F6FD] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/20"
        aria-label={`Open notifications. ${notifications.length} available`}
      >
        <Bell size={21} />

        {notifications.length > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#592EBD] px-1 text-[11px] font-semibold text-white">
            {notifications.length}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[70] bg-black/35 backdrop-blur-[2px] sm:flex sm:items-start sm:justify-end sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dashboard-notifications-title"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setIsOpen(false);
            }
          }}
        >
          <section className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:static sm:w-full sm:max-w-[420px] sm:rounded-[24px]">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2
                  id="dashboard-notifications-title"
                  className="text-[20px] font-semibold text-[#1E1E1E]"
                >
                  Notifications
                </h2>

                <p className="mt-0.5 text-[13px] text-[#777777]">
                  Progress updates and support prompts
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsOpen(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5] transition hover:bg-[#EDEDED] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/20"
                aria-label="Close notifications"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[calc(82vh-82px)] overflow-y-auto px-4 py-4">
              {notifications.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center px-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F2EEFC] text-[#592EBD]">
                    <BellRing size={28} />
                  </div>

                  <h3 className="mt-4 text-[17px] font-semibold">
                    No notifications yet
                  </h3>

                  <p className="mt-2 max-w-[280px] text-[14px] leading-[150%] text-[#777777]">
                    Progress and support updates will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map(
                    (notification) => (
                      <Link
                        key={notification.id}
                        href={notification.href}
                        onClick={() =>
                          setIsOpen(false)
                        }
                        className="flex gap-3 rounded-2xl border border-[#ECECEC] p-4 transition hover:border-[#CFC4EE] hover:bg-[#FAF8FE] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/15"
                      >
                        <NotificationIcon
                          type={
                            notification.type
                          }
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-semibold text-[#1E1E1E]">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-[13px] leading-[150%] text-[#666666]">
                            {notification.message}
                          </p>

                          <p className="mt-2 flex items-center gap-1 text-[11px] text-[#999999]">
                            <Clock3 size={12} />
                            {formatNotificationDate(
                              notification.createdAt
                            )}
                          </p>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function NotificationIcon({
  type,
}: {
  type: DashboardNotification["type"];
}) {
  if (type === "SUPPORT") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <CircleAlert size={20} />
      </div>
    );
  }

  if (type === "PROGRESS") {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <ChartNoAxesColumnIncreasing size={20} />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F2EEFC] text-[#592EBD]">
      <Bell size={20} />
    </div>
  );
}

function formatNotificationDate(
  value: string
): string {
  return new Date(value).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
    }
  );
}
