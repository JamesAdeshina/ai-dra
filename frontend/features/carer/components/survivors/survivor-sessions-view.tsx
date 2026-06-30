"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarX2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type {
  CarerSessionHistoryItem,
  RehabilitationSessionStatus,
} from "@/features/carer/types/session-history";
import { cn } from "@/lib/utils";

type SurvivorSessionsViewProps = {
  survivorName: string;
  sessions: CarerSessionHistoryItem[];
};

const PAGE_SIZE = 6;

const statusPresentation: Record<
  RehabilitationSessionStatus,
  {
    label: string;
    className: string;
  }
> = {
  COMPLETED: {
    label: "Completed",
    className: "bg-[#E8F8EE] text-[#168A50]",
  },
  PARTIAL: {
    label: "Partial",
    className: "bg-[#F1EBFF] text-[#7040D4]",
  },
  ENDED_EARLY: {
    label: "Ended Early",
    className: "bg-[#FFF7E5] text-[#AD7200]",
  },
  MISSED: {
    label: "Missed",
    className: "bg-[#FFF0F0] text-[#D33B3B]",
  },
};

export function SurvivorSessionsView({
  survivorName,
  sessions,
}: SurvivorSessionsViewProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(sessions.length / PAGE_SIZE),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const visibleSessions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return sessions.slice(
      startIndex,
      startIndex + PAGE_SIZE,
    );
  }, [currentPage, sessions]);

  const firstVisibleItem =
    sessions.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const lastVisibleItem = Math.min(
    currentPage * PAGE_SIZE,
    sessions.length,
  );

  function goToPage(page: number) {
    setCurrentPage(
      Math.max(1, Math.min(page, totalPages)),
    );
  }

  if (sessions.length === 0) {
    return (
      <section className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-[#DEDAD6] bg-white px-6 py-12 text-center shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1ECFF] text-[#592EBD]">
          <CalendarX2 size={28} />
        </span>

        <h2 className="mt-5 text-xl font-semibold text-[#292522]">
          No rehabilitation sessions yet
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-[#746D68]">
          Completed, partial, ended-early and missed sessions
          for {survivorName} will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <caption className="sr-only">
            Rehabilitation session history for {survivorName}
          </caption>

          <thead>
            <tr className="border-b border-[#E6E2DE] bg-white text-left">
              <th
                scope="col"
                className="w-[150px] px-5 py-5 text-sm font-semibold text-[#322E2B]"
              >
                Date
              </th>

              <th
                scope="col"
                className="px-5 py-5 text-sm font-semibold text-[#322E2B]"
              >
                Exercises
              </th>

              <th
                scope="col"
                className="w-[115px] px-5 py-5 text-sm font-semibold text-[#322E2B]"
              >
                Score
              </th>

              <th
                scope="col"
                className="w-[145px] px-5 py-5 text-sm font-semibold text-[#322E2B]"
              >
                Status
              </th>

              <th
                scope="col"
                className="w-[125px] px-5 py-5 text-sm font-semibold text-[#322E2B]"
              >
                Duration
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleSessions.map((session) => {
              const status =
                statusPresentation[session.status];

              return (
                <tr
                  key={session.id}
                  className="border-b border-[#ECE8E4] transition last:border-b-0 hover:bg-[#FAF9F8]"
                >
                  <td className="whitespace-nowrap px-5 py-5 text-sm font-medium text-[#37322F]">
                    <time dateTime={session.dateISO}>
                      {session.dateLabel}
                    </time>
                  </td>

                  <td className="px-5 py-5 text-sm font-medium leading-6 text-[#292522]">
                    {session.exerciseNames.join(", ")}
                  </td>

                  <td className="whitespace-nowrap px-5 py-5 text-sm font-medium text-[#37322F]">
                    {session.score !== null
                      ? `${session.score}%`
                      : "Not assessed"}
                  </td>

                  <td className="px-5 py-5">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1.5 text-xs font-semibold",
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-5 text-sm font-medium text-[#37322F]">
                    {session.durationMinutes !== null
                      ? `${session.durationMinutes} min`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-4 border-t border-[#E6E2DE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#746D68]">
          Showing{" "}
          <span className="font-semibold text-[#3D3733]">
            {firstVisibleItem}
          </span>
          –
          <span className="font-semibold text-[#3D3733]">
            {lastVisibleItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#3D3733]">
            {sessions.length}
          </span>{" "}
          sessions
        </p>

        <nav
          className="flex items-center gap-2"
          aria-label="Session history pagination"
        >
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDD8D4] text-[#403B37] transition hover:border-[#592EBD] hover:text-[#592EBD] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1,
          ).map((page) => {
            const active = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                aria-label={`Go to page ${page}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition",
                  active
                    ? "border-[#592EBD] bg-[#592EBD] text-white"
                    : "border-[#DDD8D4] bg-white text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]",
                )}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDD8D4] text-[#403B37] transition hover:border-[#592EBD] hover:text-[#592EBD] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </nav>
      </footer>
    </section>
  );
}