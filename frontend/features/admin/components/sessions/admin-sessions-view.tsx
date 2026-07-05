"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CirclePause,
  CircleStop,
  Download,
  Filter,
  PlayCircle,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AdminSessionDateRange,
  AdminSessionStatus,
  AdminSessionSummary,
} from "@/features/admin/types/admin-session";
import { cn } from "@/lib/utils";

import { SessionStatusBadge } from "./session-status-badge";
import { SessionSummaryCard } from "./session-summary-card";

type AdminSessionsViewProps = {
  sessions: AdminSessionSummary[];
};

const PAGE_SIZE = 10;

const DEMO_REFERENCE_DATE = new Date(
  "2026-07-03T23:59:59"
);

const statusTabs: Array<AdminSessionStatus | "All"> = [
  "All",
  "Completed",
  "Active",
  "Paused",
  "Ended Early",
];

export function AdminSessionsView({
  sessions,
}: AdminSessionsViewProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    AdminSessionStatus | "All"
  >("All");
  const [participant, setParticipant] = useState("All");
  const [exercise, setExercise] = useState("All");
  const [dateRange, setDateRange] =
    useState<AdminSessionDateRange>("All");
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statusCounts = useMemo(
    () => ({
      All: sessions.length,
      Completed: sessions.filter(
        (session) => session.status === "Completed"
      ).length,
      Active: sessions.filter(
        (session) => session.status === "Active"
      ).length,
      Paused: sessions.filter(
        (session) => session.status === "Paused"
      ).length,
      "Ended Early": sessions.filter(
        (session) => session.status === "Ended Early"
      ).length,
    }),
    [sessions]
  );

  const participants = useMemo(
    () =>
      Array.from(
        new Set(
          sessions.map((session) => session.participantId)
        )
      ).sort(),
    [sessions]
  );

  const exercises = useMemo(
    () =>
      Array.from(
        new Set(
          sessions.map((session) => session.exerciseName)
        )
      ).sort(),
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesSearch =
        !query ||
        session.participantId
          .toLowerCase()
          .includes(query) ||
        session.exerciseName
          .toLowerCase()
          .includes(query) ||
        session.id.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || session.status === status;

      const matchesParticipant =
        participant === "All" ||
        session.participantId === participant;

      const matchesExercise =
        exercise === "All" ||
        session.exerciseName === exercise;

      const matchesDate = sessionMatchesDateRange(
        session,
        dateRange
      );

      return (
        matchesSearch &&
        matchesStatus &&
        matchesParticipant &&
        matchesExercise &&
        matchesDate
      );
    });
  }, [
    sessions,
    search,
    status,
    participant,
    exercise,
    dateRange,
  ]);

  useEffect(() => {
    setPage(1);
  }, [search, status, participant, exercise, dateRange]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSessions.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const visibleSessions = filteredSessions.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const activeFilterCount = [
    status !== "All",
    participant !== "All",
    exercise !== "All",
    dateRange !== "All",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setParticipant("All");
    setExercise("All");
    setDateRange("All");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#201D1B] sm:text-3xl">
                Sessions
              </h1>

              <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                Demo dataset
              </span>
            </div>

            <p className="mt-2 text-sm text-[#68615D] sm:text-base">
              View and monitor rehabilitation sessions across
              the AI-DRA platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm font-semibold text-[#3E3936] transition hover:bg-[#FAF9F8] disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={cn(
                  isRefreshing && "animate-spin"
                )}
              />
              Refresh
            </button>

            <button
              type="button"
              disabled
              title="CSV export will be enabled after database integration."
              className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white opacity-70"
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <SessionSummaryCard
            title="Total Sessions"
            value={statusCounts.All}
            helper="Current demo records"
            icon={CalendarDays}
            tone="purple"
          />

          <SessionSummaryCard
            title="Completed"
            value={statusCounts.Completed}
            helper={percentageHelper(
              statusCounts.Completed,
              statusCounts.All
            )}
            icon={CheckCircle2}
            tone="green"
          />

          <SessionSummaryCard
            title="Active"
            value={statusCounts.Active}
            helper={percentageHelper(
              statusCounts.Active,
              statusCounts.All
            )}
            icon={PlayCircle}
            tone="amber"
          />

          <SessionSummaryCard
            title="Paused"
            value={statusCounts.Paused}
            helper={percentageHelper(
              statusCounts.Paused,
              statusCounts.All
            )}
            icon={CirclePause}
            tone="blue"
          />

          <SessionSummaryCard
            title="Ended Early"
            value={statusCounts["Ended Early"]}
            helper={percentageHelper(
              statusCounts["Ended Early"],
              statusCounts.All
            )}
            icon={CircleStop}
            tone="red"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {statusTabs.map((tab) => {
            const active = status === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatus(tab)}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition",
                  active
                    ? "border-[#592EBD] bg-[#592EBD] text-white"
                    : "border-[#E1DCD8] bg-white text-[#514B47] hover:border-[#A98CE6] hover:text-[#592EBD]"
                )}
              >
                {tab === "All" ? "All Sessions" : tab}

                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-[#F1EEEB] text-[#77706B]"
                  )}
                >
                  {statusCounts[tab]}
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
              placeholder="Search by participant ID, exercise or session ID"
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
                    .value as AdminSessionDateRange
                )
              }
              aria-label="Session date range"
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

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
          <FilterSelect
            label="Participant"
            value={participant}
            onChange={setParticipant}
            options={[
              ["All", "All Participants"],
              ...participants.map(
                (item): [string, string] => [item, item]
              ),
            ]}
          />

          <FilterSelect
            label="Exercise"
            value={exercise}
            onChange={setExercise}
            options={[
              ["All", "All Exercises"],
              ...exercises.map(
                (item): [string, string] => [item, item]
              ),
            ]}
          />

          <FilterSelect
            label="Status"
            value={status}
            onChange={(value) =>
              setStatus(
                value as AdminSessionStatus | "All"
              )
            }
            options={[
              ["All", "All Statuses"],
              ["Completed", "Completed"],
              ["Active", "Active"],
              ["Paused", "Paused"],
              ["Ended Early", "Ended Early"],
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
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-[#FCFBFA] text-left">
                  <TableHeading>Participant</TableHeading>
                  <TableHeading>Exercise</TableHeading>
                  <TableHeading>Date</TableHeading>
                  <TableHeading>Status</TableHeading>
                  <TableHeading>Duration</TableHeading>
                  <TableHeading>Repetitions</TableHeading>
                  <TableHeading />
                </tr>
              </thead>

              <tbody>
                {visibleSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-t border-[#EEEAE6] transition hover:bg-[#FCFBFA]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
                          <UserRound size={17} />
                        </span>

                        <span className="font-semibold text-[#393432]">
                          {session.participantId}
                        </span>
                      </div>
                    </td>

                    <TableCell>
                      {session.exerciseName}
                    </TableCell>

                    <TableCell>
                      <p>{session.date}</p>
                      <p className="mt-0.5 text-xs text-[#817A75]">
                        {session.time}
                      </p>
                    </TableCell>

                    <td className="px-5 py-4">
                      <SessionStatusBadge
                        value={session.status}
                      />
                    </td>

                    <TableCell>
                      {session.durationLabel}
                    </TableCell>

                    <TableCell>
                      {session.completedRepetitions}
                    </TableCell>

                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/sessions/${session.id}`}
                        aria-label={`View ${session.exerciseName} session for ${session.participantId}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#6E6763] transition hover:bg-[#EEE8FF] hover:text-[#592EBD]"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredSessions.length}
            startIndex={startIndex}
            visibleCount={visibleSessions.length}
            onChange={setPage}
          />
        </div>

        <div className="mt-6 space-y-4 md:hidden">
          {visibleSessions.map((session) => (
            <Link
              key={session.id}
              href={`/admin/sessions/${session.id}`}
              className="block rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
                  <UserRound size={19} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#282422]">
                    {session.participantId}
                  </p>

                  <p className="truncate text-sm text-[#716A66]">
                    {session.exerciseName}
                  </p>
                </div>

                <ChevronRight
                  size={18}
                  className="text-[#7C756F]"
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <MobileMetric
                  label="Date"
                  value={session.date}
                />

                <MobileMetric
                  label="Duration"
                  value={session.durationLabel}
                />

                <MobileMetric
                  label="Repetitions"
                  value={String(
                    session.completedRepetitions
                  )}
                />

                <div>
                  <p className="text-xs text-[#8A837E]">
                    Status
                  </p>

                  <div className="mt-1.5">
                    <SessionStatusBadge
                      value={session.status}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredSessions.length}
            startIndex={startIndex}
            visibleCount={visibleSessions.length}
            onChange={setPage}
          />
        </div>

        {visibleSessions.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#CEC7C2] bg-white px-6 py-14 text-center">
            <CalendarDays
              size={30}
              className="mx-auto text-[#8A837E]"
            />

            <h2 className="mt-4 font-semibold text-[#302B28]">
              No sessions match these filters
            </h2>

            <p className="mt-2 text-sm text-[#77706B]">
              Clear the filters or use a different search
              term.
            </p>
          </div>
        ) : null}
      </div>
    </section>
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
      <p className="text-xs text-[#8A837E]">
        {label}
      </p>

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
        sessions
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

function sessionMatchesDateRange(
  session: AdminSessionSummary,
  dateRange: AdminSessionDateRange
): boolean {
  if (dateRange === "All") {
    return true;
  }

  const sessionDate = new Date(session.dateIso);

  const differenceMilliseconds =
    DEMO_REFERENCE_DATE.getTime() -
    sessionDate.getTime();

  const differenceDays =
    differenceMilliseconds / (1000 * 60 * 60 * 24);

  const limits: Record<
    Exclude<AdminSessionDateRange, "All">,
    number
  > = {
    "Last 7 Days": 7,
    "Last 30 Days": 30,
    "Last 90 Days": 90,
  };

  return (
    differenceDays >= 0 &&
    differenceDays <= limits[dateRange]
  );
}

function percentageHelper(
  value: number,
  total: number
): string {
  if (total === 0) {
    return "0% of total";
  }

  return `${Math.round(
    (value / total) * 100
  )}% of total`;
}