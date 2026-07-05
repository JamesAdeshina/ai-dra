"use client";

import {
  Ban,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Download,
  Filter,
  Hourglass,
  Mail,
  Search,
  Timer,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AdminInvitation,
  AdminInvitationDateRange,
  AdminInvitationDeliveryStatus,
  AdminInvitationStatus,
} from "@/features/admin/types/admin-invitation";
import { cn } from "@/lib/utils";

import { InvitationDetailPanel } from "./invitation-detail-panel";
import {
  InvitationDeliveryBadge,
  InvitationStatusBadge,
} from "./invitation-status-badge";
import { InvitationSummaryCard } from "./invitation-summary-card";

type AdminInvitationsViewProps = {
  invitations: AdminInvitation[];
};

const PAGE_SIZE = 8;

const DEMO_REFERENCE_DATE = new Date(
  "2026-07-03T23:59:59"
);

export function AdminInvitationsView({
  invitations,
}: AdminInvitationsViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<
    AdminInvitationStatus | "All"
  >("All");

  const [search, setSearch] = useState("");
  const [sender, setSender] = useState("All");
  const [survivor, setSurvivor] = useState("All");

  const [deliveryStatus, setDeliveryStatus] = useState<
    AdminInvitationDeliveryStatus | "All"
  >("All");

  const [dateRange, setDateRange] =
    useState<AdminInvitationDateRange>("All");

  const [page, setPage] = useState(1);

  const [selectedInvitationId, setSelectedInvitationId] =
    useState<string | null>(invitations[0]?.id ?? null);

  const statusCounts = useMemo(() => {
    return {
      All: invitations.length,
      Pending: invitations.filter(
        (item) => item.status === "Pending"
      ).length,
      Accepted: invitations.filter(
        (item) => item.status === "Accepted"
      ).length,
      Declined: invitations.filter(
        (item) => item.status === "Declined"
      ).length,
      Cancelled: invitations.filter(
        (item) => item.status === "Cancelled"
      ).length,
      Expired: invitations.filter(
        (item) => item.status === "Expired"
      ).length,
    };
  }, [invitations]);

  const senders = useMemo(
    () =>
      Array.from(
        new Set(invitations.map((item) => item.senderName))
      ).sort(),
    [invitations]
  );

  const survivors = useMemo(
    () =>
      Array.from(
        new Set(invitations.map((item) => item.survivorId))
      ).sort(),
    [invitations]
  );

  const filteredInvitations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invitations.filter((invitation) => {
      const matchesStatus =
        selectedStatus === "All" ||
        invitation.status === selectedStatus;

      const matchesSearch =
        !query ||
        invitation.invitationId
          .toLowerCase()
          .includes(query) ||
        invitation.senderName.toLowerCase().includes(query) ||
        invitation.senderEmail.toLowerCase().includes(query) ||
        invitation.recipientEmail
          .toLowerCase()
          .includes(query) ||
        invitation.survivorId.toLowerCase().includes(query);

      const matchesSender =
        sender === "All" ||
        invitation.senderName === sender;

      const matchesSurvivor =
        survivor === "All" ||
        invitation.survivorId === survivor;

      const matchesDelivery =
        deliveryStatus === "All" ||
        invitation.deliveryStatus === deliveryStatus;

      const matchesDate = invitationMatchesDateRange(
        invitation,
        dateRange
      );

      return (
        matchesStatus &&
        matchesSearch &&
        matchesSender &&
        matchesSurvivor &&
        matchesDelivery &&
        matchesDate
      );
    });
  }, [
    invitations,
    selectedStatus,
    search,
    sender,
    survivor,
    deliveryStatus,
    dateRange,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    selectedStatus,
    search,
    sender,
    survivor,
    deliveryStatus,
    dateRange,
  ]);

  useEffect(() => {
    if (filteredInvitations.length === 0) {
      setSelectedInvitationId(null);
      return;
    }

    const selectedStillVisible = filteredInvitations.some(
      (item) => item.id === selectedInvitationId
    );

    if (!selectedStillVisible) {
      setSelectedInvitationId(filteredInvitations[0].id);
    }
  }, [filteredInvitations, selectedInvitationId]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvitations.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const visibleInvitations = filteredInvitations.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const selectedInvitation =
    invitations.find(
      (item) => item.id === selectedInvitationId
    ) ?? null;

  const activeFilterCount = [
    selectedStatus !== "All",
    sender !== "All",
    survivor !== "All",
    deliveryStatus !== "All",
    dateRange !== "All",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedStatus("All");
    setSearch("");
    setSender("All");
    setSurvivor("All");
    setDeliveryStatus("All");
    setDateRange("All");
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1700px]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#201D1B] sm:text-3xl">
                Invitations
              </h1>

              <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                Demo dataset
              </span>
            </div>

            <p className="mt-2 text-sm text-[#68615D] sm:text-base">
              Monitor carer-survivor invitations and their status
              across the platform.
            </p>
          </div>

          <button
            type="button"
            disabled
            title="CSV export will be connected after database integration."
            className="inline-flex h-11 cursor-not-allowed items-center gap-2 self-start rounded-xl border border-[#A98CE6] bg-white px-5 text-sm font-semibold text-[#592EBD] opacity-70"
          >
            <Download size={17} />
            Export CSV
            <span className="rounded-full bg-[#EEE8FF] px-2 py-0.5 text-[10px]">
              Planned
            </span>
          </button>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          <InvitationSummaryCard
            title="Total Invitations"
            value={statusCounts.All}
            helper="Current demo records"
            icon={Mail}
            tone="purple"
          />

          <InvitationSummaryCard
            title="Pending"
            value={statusCounts.Pending}
            helper={percentageHelper(
              statusCounts.Pending,
              statusCounts.All
            )}
            icon={Timer}
            tone="amber"
          />

          <InvitationSummaryCard
            title="Accepted"
            value={statusCounts.Accepted}
            helper={percentageHelper(
              statusCounts.Accepted,
              statusCounts.All
            )}
            icon={CheckCircle2}
            tone="green"
          />

          <InvitationSummaryCard
            title="Declined"
            value={statusCounts.Declined}
            helper={percentageHelper(
              statusCounts.Declined,
              statusCounts.All
            )}
            icon={CircleX}
            tone="red"
          />

          <InvitationSummaryCard
            title="Cancelled"
            value={statusCounts.Cancelled}
            helper={percentageHelper(
              statusCounts.Cancelled,
              statusCounts.All
            )}
            icon={Ban}
            tone="grey"
          />

          <InvitationSummaryCard
            title="Expired"
            value={statusCounts.Expired}
            helper={percentageHelper(
              statusCounts.Expired,
              statusCounts.All
            )}
            icon={Hourglass}
            tone="amber"
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 rounded-2xl border border-[#E4DFDB] bg-white p-2 shadow-sm">
              {invitationStatusTabs.map((status) => {
                const active = selectedStatus === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition",
                      active
                        ? "bg-[#592EBD] text-white"
                        : "text-[#514B47] hover:bg-[#F5F1FF] hover:text-[#592EBD]"
                    )}
                  >
                    {status}

                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-[#F1EEEB] text-[#77706B]"
                      )}
                    >
                      {statusCounts[status]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-3 lg:flex-row">
              <label className="relative flex-1">
                <Search
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8480]"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search by sender, recipient email, survivor ID or invitation ID"
                  className="h-12 w-full rounded-xl border border-[#DDD8D4] bg-white pl-12 pr-4 text-sm text-[#2B2724] outline-none transition placeholder:text-[#A19A95] focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
                />
              </label>

              <div className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#A98CE6] bg-white px-5 text-sm font-semibold text-[#592EBD]">
                <Filter size={18} />
                Filters

                {activeFilterCount > 0 ? (
                  <span className="rounded-full bg-[#592EBD] px-2 py-0.5 text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </div>

              <label className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#77706B]"
                />

                <select
                  value={dateRange}
                  onChange={(event) =>
                    setDateRange(
                      event.target
                        .value as AdminInvitationDateRange
                    )
                  }
                  aria-label="Invitation date range"
                  className="h-12 min-w-44 rounded-xl border border-[#DDD8D4] bg-white pl-11 pr-4 text-sm font-semibold text-[#3C3734] outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
                >
                  <option value="All">All Dates</option>
                  <option value="Last 7 Days">
                    Last 7 Days
                  </option>
                  <option value="Last 30 Days">
                    Last 30 Days
                  </option>
                  <option value="Last 90 Days">
                    Last 90 Days
                  </option>
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
              <FilterSelect
                label="Sender"
                value={sender}
                onChange={setSender}
                options={[
                  ["All", "All Senders"],
                  ...senders.map(
                    (item): [string, string] => [item, item]
                  ),
                ]}
              />

              <FilterSelect
                label="Survivor"
                value={survivor}
                onChange={setSurvivor}
                options={[
                  ["All", "All Survivors"],
                  ...survivors.map(
                    (item): [string, string] => [item, item]
                  ),
                ]}
              />

              <FilterSelect
                label="Status"
                value={selectedStatus}
                onChange={(value) =>
                  setSelectedStatus(
                    value as AdminInvitationStatus | "All"
                  )
                }
                options={[
                  ["All", "All Statuses"],
                  ["Pending", "Pending"],
                  ["Accepted", "Accepted"],
                  ["Declined", "Declined"],
                  ["Cancelled", "Cancelled"],
                  ["Expired", "Expired"],
                ]}
              />

              <FilterSelect
                label="Email delivery"
                value={deliveryStatus}
                onChange={(value) =>
                  setDeliveryStatus(
                    value as
                      | AdminInvitationDeliveryStatus
                      | "All"
                  )
                }
                options={[
                  ["All", "All Delivery Status"],
                  ["Delivered", "Delivered"],
                  ["Failed", "Failed"],
                  ["Not Applicable", "Not Applicable"],
                ]}
              />

              <button
                type="button"
                onClick={clearFilters}
                className="h-12 rounded-xl px-4 text-sm font-semibold text-[#592EBD] transition hover:bg-[#F5F1FF]"
              >
                Clear filters
              </button>
            </div>

            <div className="mt-6 hidden overflow-hidden rounded-2xl border border-[#E4DFDB] bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1020px] border-collapse">
                  <thead>
                    <tr className="bg-[#FCFBFA] text-left">
                      <TableHeading>Sent By</TableHeading>
                      <TableHeading>Recipient</TableHeading>
                      <TableHeading>Survivor</TableHeading>
                      <TableHeading>Date Sent</TableHeading>
                      <TableHeading>Status</TableHeading>
                      <TableHeading>Email Delivery</TableHeading>
                      <TableHeading />
                    </tr>
                  </thead>

                  <tbody>
                    {visibleInvitations.map((invitation) => {
                      const selected =
                        invitation.id ===
                        selectedInvitationId;

                      return (
                        <tr
                          key={invitation.id}
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            setSelectedInvitationId(
                              invitation.id
                            )
                          }
                          onKeyDown={(event) => {
                            if (
                              event.key === "Enter" ||
                              event.key === " "
                            ) {
                              event.preventDefault();
                              setSelectedInvitationId(
                                invitation.id
                              );
                            }
                          }}
                          className={cn(
                            "cursor-pointer border-t border-[#EEEAE6] transition",
                            selected
                              ? "bg-[#FAF8FF]"
                              : "hover:bg-[#FCFBFA]"
                          )}
                        >
                          <td
                            className={cn(
                              "px-5 py-4",
                              selected &&
                                "border-l-2 border-[#592EBD]"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-xs font-bold text-[#592EBD]">
                                {invitation.senderInitials}
                              </span>

                              <div>
                                <p className="text-sm font-semibold text-[#282422]">
                                  {invitation.senderName}
                                </p>

                                <p className="mt-0.5 text-xs text-[#716A66]">
                                  {invitation.senderEmail}
                                </p>
                              </div>
                            </div>
                          </td>

                          <TableCell>
                            {invitation.recipientEmail}
                          </TableCell>

                          <TableCell>
                            <span className="font-semibold">
                              {invitation.survivorId}
                            </span>
                          </TableCell>

                          <TableCell>
                            <p>{invitation.dateSent}</p>

                            <p className="mt-0.5 text-xs text-[#817A75]">
                              {invitation.timeSent}
                            </p>
                          </TableCell>

                          <td className="px-5 py-4">
                            <InvitationStatusBadge
                              status={invitation.status}
                            />
                          </td>

                          <td className="px-5 py-4">
                            <InvitationDeliveryBadge
                              status={
                                invitation.deliveryStatus
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <ChevronRight
                              size={18}
                              className={cn(
                                "text-[#7C756F]",
                                selected &&
                                  "text-[#592EBD]"
                              )}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={currentPage}
                totalPages={totalPages}
                totalItems={filteredInvitations.length}
                startIndex={startIndex}
                visibleCount={visibleInvitations.length}
                onChange={setPage}
              />
            </div>

            <div className="mt-6 space-y-4 md:hidden">
              {visibleInvitations.map((invitation) => {
                const selected =
                  invitation.id === selectedInvitationId;

                return (
                  <button
                    key={invitation.id}
                    type="button"
                    onClick={() =>
                      setSelectedInvitationId(invitation.id)
                    }
                    className={cn(
                      "block w-full rounded-2xl border bg-white p-5 text-left shadow-sm",
                      selected
                        ? "border-[#8E6CDF] ring-2 ring-[#592EBD]/10"
                        : "border-[#E4DFDB]"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-sm font-bold text-[#592EBD]">
                        {invitation.senderInitials}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#282422]">
                          {invitation.senderName}
                        </p>

                        <p className="truncate text-sm text-[#716A66]">
                          {invitation.recipientEmail}
                        </p>
                      </div>

                      <ChevronRight
                        size={18}
                        className="text-[#7C756F]"
                      />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <MobileMetric
                        label="Survivor"
                        value={invitation.survivorId}
                      />

                      <MobileMetric
                        label="Date sent"
                        value={invitation.dateSent}
                      />

                      <div>
                        <p className="text-xs text-[#8A837E]">
                          Status
                        </p>

                        <div className="mt-1.5">
                          <InvitationStatusBadge
                            status={invitation.status}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-[#8A837E]">
                          Delivery
                        </p>

                        <div className="mt-2">
                          <InvitationDeliveryBadge
                            status={
                              invitation.deliveryStatus
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              <Pagination
                page={currentPage}
                totalPages={totalPages}
                totalItems={filteredInvitations.length}
                startIndex={startIndex}
                visibleCount={visibleInvitations.length}
                onChange={setPage}
              />
            </div>

            {visibleInvitations.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-[#CEC7C2] bg-white px-6 py-14 text-center">
                <Mail
                  size={30}
                  className="mx-auto text-[#8A837E]"
                />

                <h2 className="mt-4 font-semibold text-[#302B28]">
                  No invitations match these filters
                </h2>

                <p className="mt-2 text-sm text-[#77706B]">
                  Clear the filters or use a different search
                  term.
                </p>
              </div>
            ) : null}
          </div>

          <InvitationDetailPanel
            invitation={selectedInvitation}
            invitations={invitations}
          />
        </div>
      </div>
    </section>
  );
}

const invitationStatusTabs: Array<
  AdminInvitationStatus | "All"
> = [
  "All",
  "Pending",
  "Accepted",
  "Declined",
  "Cancelled",
  "Expired",
];

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
      <span className="sr-only">{label}</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm font-semibold text-[#3C3734] outline-none transition focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function TableHeading({
  children,
}: {
  children?: ReactNode;
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
    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#514B47]">
      {children}
    </td>
  );
}

function MobileMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-[#8A837E]">{label}</p>

      <p className="mt-1 font-semibold text-[#332E2B]">
        {value}
      </p>
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
        <span className="font-semibold text-[#332E2B]">
          {totalItems === 0 ? 0 : startIndex + 1}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-[#332E2B]">
          {startIndex + visibleCount}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-[#332E2B]">
          {totalItems}
        </span>{" "}
        invitations
      </p>

      <div className="flex items-center gap-2">
        <PaginationButton
          label="Previous page"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
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
            onClick={() => onChange(pageNumber)}
            className={cn(
              "h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition",
              page === pageNumber
                ? "border-[#592EBD] bg-[#592EBD] text-white"
                : "border-[#DDD8D4] bg-white text-[#514B47] hover:border-[#592EBD] hover:text-[#592EBD]"
            )}
          >
            {pageNumber}
          </button>
        ))}

        <PaginationButton
          label="Next page"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
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
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDD8D4] bg-white text-[#514B47] transition hover:border-[#592EBD] hover:text-[#592EBD] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function invitationMatchesDateRange(
  invitation: AdminInvitation,
  dateRange: AdminInvitationDateRange
): boolean {
  if (dateRange === "All") {
    return true;
  }

  const invitationDate = new Date(invitation.dateSentIso);

  const differenceMilliseconds =
    DEMO_REFERENCE_DATE.getTime() -
    invitationDate.getTime();

  const differenceDays =
    differenceMilliseconds / (1000 * 60 * 60 * 24);

  const limits: Record<
    Exclude<AdminInvitationDateRange, "All">,
    number
  > = {
    "Last 7 Days": 7,
    "Last 30 Days": 30,
    "Last 90 Days": 90,
  };

  return differenceDays >= 0 && differenceDays <= limits[dateRange];
}

function percentageHelper(
  value: number,
  total: number
): string {
  if (total === 0) {
    return "0% of total";
  }

  return `${Math.round((value / total) * 100)}% of total`;
}