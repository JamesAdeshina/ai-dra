"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bell,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Flame,
  Link2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import { carerNotifications } from "@/features/carer/data/carer-notification-data";
import type {
  CarerNotification,
  CarerNotificationCategory,
  CarerNotificationIcon,
} from "@/features/carer/types/carer-notification";
import { cn } from "@/lib/utils";

type NotificationFilter =
  | "ALL"
  | "ALERT"
  | "REMINDER";

const INITIAL_VISIBLE_COUNT = 8;

const iconPresentation: Record<
  CarerNotificationIcon,
  {
    icon: LucideIcon;
    backgroundClassName: string;
    iconClassName: string;
  }
> = {
  goal: {
    icon: Sparkles,
    backgroundClassName: "bg-[#E8F1FF]",
    iconClassName: "text-[#3478EA]",
  },
  missed: {
    icon: TriangleAlert,
    backgroundClassName: "bg-[#FFF1E6]",
    iconClassName: "text-[#F28A00]",
  },
  reminder: {
    icon: CalendarClock,
    backgroundClassName: "bg-[#EAF8EF]",
    iconClassName: "text-[#2DB36F]",
  },
  progress: {
    icon: TrendingUp,
    backgroundClassName: "bg-[#F1ECFF]",
    iconClassName: "text-[#592EBD]",
  },
  streak: {
    icon: Flame,
    backgroundClassName: "bg-[#FFF7E5]",
    iconClassName: "text-[#F2B322]",
  },
  difficulty: {
    icon: CircleAlert,
    backgroundClassName: "bg-[#FFF0F0]",
    iconClassName: "text-[#F23636]",
  },
  connection: {
    icon: Link2,
    backgroundClassName: "bg-[#EAF3FF]",
    iconClassName: "text-[#3478EA]",
  },
};

const categoryPresentation: Record<
  CarerNotificationCategory,
  {
    label: string;
    className: string;
  }
> = {
  ACTIVITY: {
    label: "Activity",
    className: "bg-[#EAF8EF] text-[#258B55]",
  },
  ALERT: {
    label: "Alert",
    className: "bg-[#FFF0F0] text-[#D33B3B]",
  },
  REMINDER: {
    label: "Reminder",
    className: "bg-[#EAF3FF] text-[#3478EA]",
  },
  SYSTEM: {
    label: "System",
    className: "bg-[#F1EBFF] text-[#7040D4]",
  },
};

function NotificationItem({
  notification,
}: {
  notification: CarerNotification;
}) {
  const icon =
    iconPresentation[notification.icon];

  const category =
    categoryPresentation[notification.category];

  const Icon = icon.icon;

  return (
    <article
      className={cn(
        "grid gap-3 border-b border-[#ECE8E4] py-4 last:border-b-0 sm:grid-cols-[44px_minmax(0,1fr)_100px]",
        notification.unread && "bg-[#FCFBFF]",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full",
          icon.backgroundClassName,
          icon.iconClassName,
        )}
      >
        <Icon size={19} />
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-[#292522]">
            {notification.title}
          </h2>

          {notification.unread ? (
            <span
              className="h-2 w-2 rounded-full bg-[#592EBD]"
              aria-label="Unread"
            />
          ) : null}
        </div>

        <p className="mt-1 text-sm leading-6 text-[#817A75]">
          {notification.message}
        </p>

        <span
          className={cn(
            "mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold",
            category.className,
          )}
        >
          {category.label}
        </span>
      </div>

      <div className="text-left sm:text-right">
        <p className="text-sm font-medium text-[#403B37]">
          {notification.timeLabel}
        </p>

        <p className="mt-1 text-xs text-[#817A75]">
          {notification.dateLabel}
        </p>
      </div>
    </article>
  );
}

function SummaryCard({
  icon: Icon,
  count,
  label,
  helper,
  className,
  iconClassName,
}: {
  icon: LucideIcon;
  count: number;
  label: string;
  helper: string;
  className: string;
  iconClassName: string;
}) {
  return (
    <article
      className={cn(
        "rounded-xl p-4",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full bg-white/60",
            iconClassName,
          )}
        >
          <Icon size={17} />
        </span>

        <div>
          <strong className="text-2xl text-[#292522]">
            {count}
          </strong>

          <p className="mt-1 text-sm font-medium text-[#403B37]">
            {label}
          </p>

          <p className="mt-2 text-xs text-[#817A75]">
            {helper}
          </p>
        </div>
      </div>
    </article>
  );
}

export function CarerNotificationsView() {
  const [activeFilter, setActiveFilter] =
    useState<NotificationFilter>("ALL");

  const [visibleCount, setVisibleCount] = useState(
    INITIAL_VISIBLE_COUNT,
  );

  const alertCount = carerNotifications.filter(
    (notification) =>
      notification.category === "ALERT",
  ).length;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "ALL") {
      return carerNotifications;
    }

    return carerNotifications.filter(
      (notification) =>
        notification.category === activeFilter,
    );
  }, [activeFilter]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeFilter]);

  const visibleNotifications =
    filteredNotifications.slice(0, visibleCount);

  const summaryCounts = {
    activity: carerNotifications.filter(
      (notification) =>
        notification.category === "ACTIVITY",
    ).length,
    reminder: carerNotifications.filter(
      (notification) =>
        notification.category === "REMINDER",
    ).length,
    alert: alertCount,
    system: carerNotifications.filter(
      (notification) =>
        notification.category === "SYSTEM",
    ).length,
  };

  const tabs: Array<{
    id: NotificationFilter;
    label: string;
    count?: number;
  }> = [
    {
      id: "ALL",
      label: "All Notifications",
    },
    {
      id: "ALERT",
      label: "Alerts",
      count: alertCount,
    },
    {
      id: "REMINDER",
      label: "Reminders",
    },
  ];

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1240px]">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#211E1C]">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-[#5F5955]">
            Stay updated on rehabilitation activity,
            reminders and items that may need your
            attention.
          </p>
        </div>

        <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <nav
              className="grid grid-cols-3 border-b border-[#E5E1DD]"
              aria-label="Notification filters"
            >
              {tabs.map((tab) => {
                const active =
                  activeFilter === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveFilter(tab.id)
                    }
                    className={cn(
                      "relative flex min-h-14 items-center justify-center gap-2 px-2 text-sm font-medium transition",
                      active
                        ? "text-[#592EBD]"
                        : "text-[#6A635F] hover:text-[#592EBD]",
                    )}
                  >
                    {tab.label}

                    {tab.count !== undefined ? (
                      <span className="flex min-h-6 min-w-6 items-center justify-center rounded-md bg-[#3478EA] px-1.5 text-xs font-semibold text-white">
                        {tab.count}
                      </span>
                    ) : null}

                    {active ? (
                      <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-[#592EBD]" />
                    ) : null}
                  </button>
                );
              })}
            </nav>

            <section className="px-0">
              {visibleNotifications.length > 0 ? (
                <div >
                  {visibleNotifications.map(
                    (notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    ),
                  )}
                </div>
              ) : (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-[#DEDAD6] bg-white px-6 py-12 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1ECFF] text-[#592EBD]">
                    <Bell size={28} />
                  </span>

                  <h2 className="mt-5 text-xl font-semibold text-[#292522]">
                    No notifications found
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-[#746D68]">
                    New notifications in this category
                    will appear here.
                  </p>
                </div>
              )}

              {visibleCount <
              filteredNotifications.length ? (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((current) =>
                      Math.min(
                        current + 5,
                        filteredNotifications.length,
                      ),
                    )
                  }
                  className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#DDD8D4] bg-white text-sm font-medium text-[#403B37] transition hover:border-[#592EBD] hover:text-[#592EBD]"
                >
                  Load more notifications
                  <ChevronDown size={17} />
                </button>
              ) : null}
            </section>
          </div>

          <aside className="overflow-hidden rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)] xl:sticky xl:top-[118px]">
            <div className="flex items-center justify-between border-b border-[#EEEAE6] px-4 py-4">
              <h2 className="font-semibold text-[#332E2B]">
                Notification Summary
              </h2>

              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#3478EA]"
              >
                This Week
                <ChevronDown size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3">
              <SummaryCard
                icon={Activity}
                count={summaryCounts.activity}
                label="Activity"
                helper="New activities"
                className="bg-[#F1ECFF]"
                iconClassName="text-[#7040D4]"
              />

              <SummaryCard
                icon={CalendarDays}
                count={summaryCounts.reminder}
                label="Reminders"
                helper="Upcoming"
                className="bg-[#EAF8EF]"
                iconClassName="text-[#2DB36F]"
              />

              <SummaryCard
                icon={TriangleAlert}
                count={summaryCounts.alert}
                label="Alerts"
                helper="Needs attention"
                className="bg-[#FFF7E5]"
                iconClassName="text-[#F2B322]"
              />

              <SummaryCard
                icon={ShieldCheck}
                count={summaryCounts.system}
                label="System"
                helper="Account updates"
                className="bg-[#EAF3FF]"
                iconClassName="text-[#3478EA]"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}