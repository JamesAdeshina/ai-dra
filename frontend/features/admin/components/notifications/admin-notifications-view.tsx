"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Info,
  Mail,
  MoreVertical,
  RefreshCw,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AdminNotification,
  AdminNotificationCategory,
  AdminNotificationSeverity,
  AdminNotificationStatus,
} from "@/features/admin/types/admin-notification";
import { cn } from "@/lib/utils";

import {
  NotificationCategoryBadge,
  NotificationSeverityBadge,
} from "./notification-badges";

type AdminNotificationsViewProps = {
  notifications: AdminNotification[];
};

const PAGE_SIZE = 8;

export function AdminNotificationsView({
  notifications,
}: AdminNotificationsViewProps) {
  const router = useRouter();

  const [items, setItems] =
    useState<AdminNotification[]>(notifications);

  const [category, setCategory] = useState<
    AdminNotificationCategory | "All"
  >("All");

  const [status, setStatus] = useState<
    AdminNotificationStatus | "All"
  >("All");

  const [severity, setSeverity] = useState<
    AdminNotificationSeverity | "All"
  >("All");

  const [participant, setParticipant] =
    useState("All");

  const [selectedIds, setSelectedIds] = useState<
    string[]
  >([]);

  const [selectedNotification, setSelectedNotification] =
    useState<AdminNotification | null>(null);

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const participants = useMemo(
    () =>
      Array.from(
        new Set(
          items.map(
            (notification) =>
              notification.participantId
          )
        )
      ).sort(),
    [items]
  );

  const filteredItems = useMemo(
    () =>
      items.filter((notification) => {
        const matchesCategory =
          category === "All" ||
          notification.category === category;

        const matchesStatus =
          status === "All" ||
          notification.status === status;

        const matchesSeverity =
          severity === "All" ||
          notification.severity === severity;

        const matchesParticipant =
          participant === "All" ||
          notification.participantId ===
            participant;

        return (
          matchesCategory &&
          matchesStatus &&
          matchesSeverity &&
          matchesParticipant
        );
      }),
    [
      items,
      category,
      status,
      severity,
      participant,
    ]
  );

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [
    category,
    status,
    severity,
    participant,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex =
    (currentPage - 1) * PAGE_SIZE;

  const visibleItems = filteredItems.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const unreadCount = items.filter(
    (notification) =>
      notification.status === "Unread"
  ).length;

  const attentionCount = items.filter(
    (notification) =>
      notification.severity !== "Information"
  ).length;

  const informationCount = items.filter(
    (notification) =>
      notification.severity === "Information"
  ).length;

  const activeFilterCount = [
    category !== "All",
    status !== "All",
    severity !== "All",
    participant !== "All",
  ].filter(Boolean).length;

  const allVisibleSelected =
    visibleItems.length > 0 &&
    visibleItems.every((notification) =>
      selectedIds.includes(notification.id)
    );

  const categoryCounts = {
    Engagement: items.filter(
      (item) => item.category === "Engagement"
    ).length,

    Invitation: items.filter(
      (item) => item.category === "Invitation"
    ).length,

    Session: items.filter(
      (item) => item.category === "Session"
    ).length,

    System: items.filter(
      (item) => item.category === "System"
    ).length,
  };

  const recentAlerts = [...items]
    .filter(
      (item) =>
        item.severity !== "Information"
    )
    .sort(
      (left, right) =>
        new Date(right.dateIso).getTime() -
        new Date(left.dateIso).getTime()
    )
    .slice(0, 5);

  const clearFilters = () => {
    setCategory("All");
    setStatus("All");
    setSeverity("All");
    setParticipant("All");
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter(
            (selectedId) =>
              selectedId !== id
          )
        : [...current, id]
    );
  };

  const toggleVisibleSelection = () => {
    if (allVisibleSelected) {
      setSelectedIds((current) =>
        current.filter(
          (id) =>
            !visibleItems.some(
              (item) => item.id === id
            )
        )
      );

      return;
    }

    setSelectedIds((current) =>
      Array.from(
        new Set([
          ...current,
          ...visibleItems.map(
            (item) => item.id
          ),
        ])
      )
    );
  };

  const markNotificationsRead = (
    ids: string[]
  ) => {
    setItems((current) =>
      current.map((notification) =>
        ids.includes(notification.id)
          ? {
              ...notification,
              status: "Read",
            }
          : notification
      )
    );

    setSelectedNotification((current) =>
      current &&
      ids.includes(current.id)
        ? {
            ...current,
            status: "Read",
          }
        : current
    );

    setSelectedIds([]);
  };

  const handlePrimaryReadAction = () => {
    if (selectedIds.length > 0) {
      markNotificationsRead(selectedIds);
      return;
    }

    markNotificationsRead(
      items
        .filter(
          (notification) =>
            notification.status ===
            "Unread"
        )
        .map(
          (notification) =>
            notification.id
        )
    );
  };

  const toggleReadStatus = (
    notification: AdminNotification
  ) => {
    const nextStatus =
      notification.status === "Read"
        ? "Unread"
        : "Read";

    setItems((current) =>
      current.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              status: nextStatus,
            }
          : item
      )
    );

    setSelectedNotification((current) =>
      current?.id === notification.id
        ? {
            ...current,
            status: nextStatus,
          }
        : current
    );

    setOpenMenuId(null);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <>
      <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1700px]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-[#201D1B] sm:text-3xl">
                  Notifications
                </h1>

                <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                  Demo alerts
                </span>
              </div>

              <p className="mt-2 text-sm text-[#68615D] sm:text-base">
                Monitor important platform events and
                alerts that may require attention.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={
                  handlePrimaryReadAction
                }
                disabled={
                  unreadCount === 0 &&
                  selectedIds.length === 0
                }
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm font-semibold text-[#3E3936] transition hover:border-[#A98CE6] hover:text-[#592EBD] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <CheckCheck size={17} />

                {selectedIds.length > 0
                  ? `Mark selected as read (${selectedIds.length})`
                  : "Mark all as read"}
              </button>

              <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm font-semibold text-[#3E3936]">
                <Filter size={17} />
                Filters

                {activeFilterCount > 0 ? (
                  <span className="rounded-full bg-[#592EBD] px-2 py-0.5 text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#A98CE6] bg-white px-4 text-sm font-semibold text-[#592EBD] disabled:opacity-60"
              >
                <RefreshCw
                  size={17}
                  className={cn(
                    isRefreshing &&
                      "animate-spin"
                  )}
                />
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0">
              <div className="grid gap-3 rounded-2xl border border-[#E4DFDB] bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
                <FilterSelect
                  label="Category"
                  value={category}
                  onChange={(value) =>
                    setCategory(
                      value as
                        | AdminNotificationCategory
                        | "All"
                    )
                  }
                  options={[
                    ["All", "All Categories"],
                    [
                      "Engagement",
                      "Engagement",
                    ],
                    [
                      "Invitation",
                      "Invitation",
                    ],
                    ["Session", "Session"],
                    ["System", "System"],
                  ]}
                />

                <FilterSelect
                  label="Status"
                  value={status}
                  onChange={(value) =>
                    setStatus(
                      value as
                        | AdminNotificationStatus
                        | "All"
                    )
                  }
                  options={[
                    ["All", "All Statuses"],
                    ["Unread", "Unread"],
                    ["Read", "Read"],
                  ]}
                />

                <FilterSelect
                  label="Severity"
                  value={severity}
                  onChange={(value) =>
                    setSeverity(
                      value as
                        | AdminNotificationSeverity
                        | "All"
                    )
                  }
                  options={[
                    ["All", "All Severities"],
                    [
                      "Information",
                      "Information",
                    ],
                    ["Attention", "Attention"],
                    ["Important", "Important"],
                  ]}
                />

                <FilterSelect
                  label="Participant"
                  value={participant}
                  onChange={setParticipant}
                  options={[
                    ["All", "All Participants"],
                    ...participants.map(
                      (
                        item
                      ): [string, string] => [
                        item,
                        item,
                      ]
                    ),
                  ]}
                />

                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-11 rounded-xl px-4 text-sm font-semibold text-[#592EBD] transition hover:bg-[#F5F1FF]"
                >
                  Clear filters
                </button>
              </div>

              <div className="mt-5 hidden overflow-visible rounded-2xl border border-[#E4DFDB] bg-white shadow-sm md:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px] border-collapse">
                    <thead>
                      <tr className="bg-[#FCFBFA] text-left">
                        <th className="w-12 px-4 py-4">
                          <input
                            type="checkbox"
                            aria-label="Select visible notifications"
                            checked={
                              allVisibleSelected
                            }
                            onChange={
                              toggleVisibleSelection
                            }
                            className="h-4 w-4 rounded accent-[#592EBD]"
                          />
                        </th>

                        <TableHeading>
                          Notification
                        </TableHeading>

                        <TableHeading>
                          Category
                        </TableHeading>

                        <TableHeading>
                          Participant
                        </TableHeading>

                        <TableHeading>
                          Date
                        </TableHeading>

                        <TableHeading>
                          Severity
                        </TableHeading>

                        <TableHeading>
                          Status
                        </TableHeading>

                        <TableHeading>
                          Actions
                        </TableHeading>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleItems.map(
                        (notification) => (
                          <tr
                            key={
                              notification.id
                            }
                            className={cn(
                              "border-t border-[#EEEAE6] transition hover:bg-[#FCFBFA]",
                              notification.status ===
                                "Unread" &&
                                "bg-[#FEFDFF]"
                            )}
                          >
                            <td className="px-4 py-4 align-top">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(
                                  notification.id
                                )}
                                onChange={() =>
                                  toggleSelection(
                                    notification.id
                                  )
                                }
                                aria-label={`Select ${notification.title}`}
                                className="h-4 w-4 rounded accent-[#592EBD]"
                              />
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-start gap-3">
                                <NotificationIcon
                                  category={
                                    notification.category
                                  }
                                />

                                <div>
                                  <p
                                    className={cn(
                                      "text-sm text-[#302B28]",
                                      notification.status ===
                                        "Unread"
                                        ? "font-bold"
                                        : "font-semibold"
                                    )}
                                  >
                                    {
                                      notification.title
                                    }
                                  </p>

                                  <p className="mt-1 max-w-md text-xs leading-5 text-[#77706B]">
                                    {
                                      notification.description
                                    }
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 align-top">
                              <NotificationCategoryBadge
                                category={
                                  notification.category
                                }
                              />
                            </td>

                            <TableCell>
                              {
                                notification.participantId
                              }
                            </TableCell>

                            <TableCell>
                              {
                                notification.dateLabel
                              }
                            </TableCell>

                            <td className="px-5 py-4 align-top">
                              <NotificationSeverityBadge
                                severity={
                                  notification.severity
                                }
                              />
                            </td>

                            <td className="px-5 py-4 align-top">
                              <NotificationReadStatus
                                status={
                                  notification.status
                                }
                              />
                            </td>

                            <td className="relative px-5 py-4 align-top">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedNotification(
                                      notification
                                    )
                                  }
                                  aria-label={`View ${notification.title}`}
                                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#625C58] transition hover:bg-[#EEE8FF] hover:text-[#592EBD]"
                                >
                                  <Eye
                                    size={17}
                                  />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenMenuId(
                                      (
                                        current
                                      ) =>
                                        current ===
                                        notification.id
                                          ? null
                                          : notification.id
                                    )
                                  }
                                  aria-label={`Open actions for ${notification.title}`}
                                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#625C58] transition hover:bg-[#EEE8FF] hover:text-[#592EBD]"
                                >
                                  <MoreVertical
                                    size={17}
                                  />
                                </button>
                              </div>

                              {openMenuId ===
                              notification.id ? (
                                <div className="absolute right-4 top-12 z-30 w-52 rounded-xl border border-[#E4DFDB] bg-white p-2 shadow-xl">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleReadStatus(
                                        notification
                                      )
                                    }
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#393432] hover:bg-[#F7F5F3]"
                                  >
                                    <CheckCheck
                                      size={16}
                                    />

                                    Mark as{" "}
                                    {notification.status ===
                                    "Read"
                                      ? "unread"
                                      : "read"}
                                  </button>

                                  {notification.relatedHref ? (
                                    <Link
                                      href={
                                        notification.relatedHref
                                      }
                                      onClick={() =>
                                        setOpenMenuId(
                                          null
                                        )
                                      }
                                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#393432] hover:bg-[#F7F5F3]"
                                    >
                                      <Eye
                                        size={16}
                                      />
                                      {
                                        notification.relatedLabel
                                      }
                                    </Link>
                                  ) : null}
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  totalItems={
                    filteredItems.length
                  }
                  startIndex={startIndex}
                  visibleCount={
                    visibleItems.length
                  }
                  onChange={setPage}
                />
              </div>

              <div className="mt-5 space-y-4 md:hidden">
                {visibleItems.map(
                  (notification) => (
                    <article
                      key={notification.id}
                      className={cn(
                        "rounded-2xl border bg-white p-5 shadow-sm",
                        notification.status ===
                          "Unread"
                          ? "border-[#BCAAE9]"
                          : "border-[#E4DFDB]"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(
                            notification.id
                          )}
                          onChange={() =>
                            toggleSelection(
                              notification.id
                            )
                          }
                          aria-label={`Select ${notification.title}`}
                          className="mt-3 h-4 w-4 accent-[#592EBD]"
                        />

                        <NotificationIcon
                          category={
                            notification.category
                          }
                        />

                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#302B28]">
                            {
                              notification.title
                            }
                          </p>

                          <p className="mt-1 text-sm leading-6 text-[#77706B]">
                            {
                              notification.description
                            }
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <NotificationCategoryBadge
                          category={
                            notification.category
                          }
                        />

                        <NotificationSeverityBadge
                          severity={
                            notification.severity
                          }
                        />

                        <NotificationReadStatus
                          status={
                            notification.status
                          }
                        />
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                        <MobileDetail
                          label="Participant"
                          value={
                            notification.participantId
                          }
                        />

                        <MobileDetail
                          label="Date"
                          value={
                            notification.dateLabel
                          }
                        />
                      </div>

                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedNotification(
                              notification
                            )
                          }
                          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#DDD8D4] text-sm font-semibold text-[#514B47]"
                        >
                          <Eye size={16} />
                          View details
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleReadStatus(
                              notification
                            )
                          }
                          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#592EBD] text-sm font-semibold text-white"
                        >
                          <CheckCheck
                            size={16}
                          />

                          Mark{" "}
                          {notification.status ===
                          "Read"
                            ? "unread"
                            : "read"}
                        </button>
                      </div>
                    </article>
                  )
                )}

                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  totalItems={
                    filteredItems.length
                  }
                  startIndex={startIndex}
                  visibleCount={
                    visibleItems.length
                  }
                  onChange={setPage}
                />
              </div>

              {visibleItems.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-[#CEC7C2] bg-white px-6 py-14 text-center">
                  <Bell
                    size={30}
                    className="mx-auto text-[#8A837E]"
                  />

                  <h2 className="mt-4 font-semibold text-[#302B28]">
                    No notifications match these
                    filters
                  </h2>

                  <p className="mt-2 text-sm text-[#77706B]">
                    Clear the filters to see more
                    monitoring events.
                  </p>
                </div>
              ) : null}
            </div>

            <aside className="space-y-5 xl:sticky xl:top-[118px]">
              <section className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
                <h2 className="font-bold text-[#282422]">
                  Notification Summary
                </h2>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <SummaryItem
                    icon={Bell}
                    value={items.length}
                    label="Total Notifications"
                    tone="purple"
                  />

                  <SummaryItem
                    icon={Bell}
                    value={unreadCount}
                    label="Unread"
                    tone="purple"
                  />

                  <SummaryItem
                    icon={AlertTriangle}
                    value={attentionCount}
                    label="Attention / Important"
                    tone="amber"
                  />

                  <SummaryItem
                    icon={Info}
                    value={informationCount}
                    label="Information"
                    tone="blue"
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
                <h2 className="font-bold text-[#282422]">
                  Categories
                </h2>

                <div className="mt-5 space-y-4">
                  <CategorySummary
                    category="Engagement"
                    value={
                      categoryCounts.Engagement
                    }
                  />

                  <CategorySummary
                    category="Invitation"
                    value={
                      categoryCounts.Invitation
                    }
                  />

                  <CategorySummary
                    category="Session"
                    value={
                      categoryCounts.Session
                    }
                  />

                  <CategorySummary
                    category="System"
                    value={
                      categoryCounts.System
                    }
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
                <h2 className="font-bold text-[#282422]">
                  Recent Activity Alerts
                </h2>

                <div className="mt-5 divide-y divide-[#EEEAE6]">
                  {recentAlerts.map(
                    (notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          setSelectedNotification(
                            notification
                          )
                        }
                        className="flex w-full gap-3 py-4 text-left first:pt-0"
                      >
                        <NotificationIcon
                          category={
                            notification.category
                          }
                          small
                        />

                        <span className="min-w-0">
                          <span className="block text-sm font-medium leading-5 text-[#514B47]">
                            {
                              notification.title
                            }
                          </span>

                          <span className="mt-1 block text-xs text-[#817A75]">
                            {
                              notification.dateLabel
                            }
                          </span>
                        </span>
                      </button>
                    )
                  )}
                </div>
              </section>

              <section className="flex gap-3 rounded-2xl border border-[#D9D0F0] bg-[#FAF8FF] p-5">
                <ShieldCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-[#592EBD]"
                />

                <div>
                  <h2 className="text-sm font-semibold text-[#39314A]">
                    Monitoring and Privacy
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-[#625A6D]">
                    These notifications support
                    project and engagement
                    monitoring. Administrators
                    cannot read private messages,
                    impersonate carers or change
                    survivor rehabilitation data
                    from this screen.
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>

      <NotificationDetailModal
        notification={selectedNotification}
        onClose={() =>
          setSelectedNotification(null)
        }
        onToggleRead={() => {
          if (selectedNotification) {
            toggleReadStatus(
              selectedNotification
            );
          }
        }}
      />
    </>
  );
}

function NotificationDetailModal({
  notification,
  onClose,
  onToggleRead,
}: {
  notification: AdminNotification | null;
  onClose: () => void;
  onToggleRead: () => void;
}) {
  useEffect(() => {
    if (!notification) return;

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close notification details"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <section className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <NotificationIcon
              category={
                notification.category
              }
            />

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#817A75]">
                Notification Details
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#282422]">
                {notification.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F1EF] text-[#514B47]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <NotificationCategoryBadge
            category={notification.category}
          />

          <NotificationSeverityBadge
            severity={notification.severity}
          />

          <NotificationReadStatus
            status={notification.status}
          />
        </div>

        <div className="mt-7 rounded-2xl border border-[#EEEAE6] bg-[#FCFBFA] p-5">
          <p className="text-sm leading-7 text-[#514B47]">
            {notification.details}
          </p>
        </div>

        <dl className="mt-7 grid gap-5 sm:grid-cols-2">
          <DetailItem
            label="Participant"
            value={
              notification.participantId
            }
          />

          <DetailItem
            label="Date"
            value={
              notification.dateLabel
            }
          />

          <DetailItem
            label="Category"
            value={
              notification.category
            }
          />

          <DetailItem
            label="Severity"
            value={
              notification.severity
            }
          />
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onToggleRead}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#DDD8D4] px-5 text-sm font-semibold text-[#514B47]"
          >
            <CheckCheck size={17} />

            Mark as{" "}
            {notification.status === "Read"
              ? "unread"
              : "read"}
          </button>

          {notification.relatedHref ? (
            <Link
              href={
                notification.relatedHref
              }
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white"
            >
              <Eye size={17} />

              {notification.relatedLabel ??
                "View related record"}
            </Link>
          ) : null}
        </div>

        <div className="mt-7 flex gap-3 rounded-xl border border-[#D9D0F0] bg-[#FAF8FF] p-4">
          <Info
            size={19}
            className="mt-0.5 shrink-0 text-[#592EBD]"
          />

          <p className="text-xs leading-5 text-[#625A6D]">
            This alert is generated from
            frontend demonstration data and
            should not be treated as a clinical
            diagnosis or confirmed system
            incident.
          </p>
        </div>
      </section>
    </div>
  );
}

function NotificationIcon({
  category,
  small = false,
}: {
  category: AdminNotificationCategory;
  small?: boolean;
}) {
  const iconMap: Record<
    AdminNotificationCategory,
    LucideIcon
  > = {
    Engagement: UserRound,
    Invitation: Mail,
    Session: AlertTriangle,
    System: Settings,
  };

  const toneMap: Record<
    AdminNotificationCategory,
    string
  > = {
    Engagement:
      "bg-[#E8F2FF] text-[#2879D8]",
    Invitation:
      "bg-[#FFF4DD] text-[#E99A17]",
    Session:
      "bg-[#FFE7E7] text-[#F23636]",
    System:
      "bg-[#EEE8FF] text-[#592EBD]",
  };

  const Icon = iconMap[category];

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        toneMap[category],
        small
          ? "h-9 w-9"
          : "h-11 w-11"
      )}
    >
      <Icon
        size={small ? 16 : 19}
      />
    </span>
  );
}

function NotificationReadStatus({
  status,
}: {
  status: AdminNotificationStatus;
}) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-[#514B47]">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "Unread"
            ? "bg-[#592EBD]"
            : "bg-[#9BA3B1]"
        )}
      />

      {status}
    </span>
  );
}

function SummaryItem({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
  tone: "purple" | "amber" | "blue";
}) {
  const toneClasses = {
    purple:
      "bg-[#EEE8FF] text-[#592EBD]",
    amber:
      "bg-[#FFF4DD] text-[#E99A17]",
    blue:
      "bg-[#E8F2FF] text-[#2879D8]",
  };

  return (
    <div className="rounded-xl border border-[#EEEAE6] p-4">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            toneClasses[tone]
          )}
        >
          <Icon size={18} />
        </span>

        <p className="text-2xl font-bold text-[#282422]">
          {value}
        </p>
      </div>

      <p className="mt-2 text-xs text-[#77706B]">
        {label}
      </p>
    </div>
  );
}

function CategorySummary({
  category,
  value,
}: {
  category: AdminNotificationCategory;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <NotificationIcon
          category={category}
          small
        />

        <p className="text-sm font-medium text-[#514B47]">
          {category} Alerts
        </p>
      </div>

      <p className="font-bold text-[#282422]">
        {value}
      </p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="sr-only">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm font-semibold text-[#3C3734] outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
      >
        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          )
        )}
      </select>
    </label>
  );
}

function TableHeading({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6F6864]">
      {children}
    </th>
  );
}

function TableCell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <td className="whitespace-nowrap px-5 py-4 align-top text-sm text-[#514B47]">
      {children}
    </td>
  );
}

function MobileDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-[#8A837E]">
        {label}
      </p>

      <p className="mt-1 font-semibold text-[#332E2B]">
        {value}
      </p>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-sm text-[#77706B]">
        {label}
      </dt>

      <dd className="mt-1 font-semibold text-[#393432]">
        {value}
      </dd>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  totalItems,
  startIndex,
  visibleCount,
  onChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  visibleCount: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-[#EEEAE6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[#706965]">
        Showing{" "}
        <strong>
          {totalItems === 0
            ? 0
            : startIndex + 1}
        </strong>{" "}
        to{" "}
        <strong>
          {startIndex + visibleCount}
        </strong>{" "}
        of <strong>{totalItems}</strong>{" "}
        notifications
      </p>

      <div className="flex items-center gap-2">
        <PaginationButton
          label="Previous page"
          disabled={page === 1}
          onClick={() =>
            onChange(page - 1)
          }
        >
          <ChevronLeft size={17} />
        </PaginationButton>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() =>
              onChange(pageNumber)
            }
            className={cn(
              "h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold",
              page === pageNumber
                ? "border-[#592EBD] bg-[#592EBD] text-white"
                : "border-[#DDD8D4] bg-white text-[#514B47]"
            )}
          >
            {pageNumber}
          </button>
        ))}

        <PaginationButton
          label="Next page"
          disabled={page === totalPages}
          onClick={() =>
            onChange(page + 1)
          }
        >
          <ChevronRight size={17} />
        </PaginationButton>
      </div>
    </div>
  );
}

function PaginationButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDD8D4] bg-white text-[#514B47] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}