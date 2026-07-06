"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import type {
  HistorySession,
  HistorySessionStatus,
} from "@/features/history/types";

type HistoryTableProps = {
  sessions: HistorySession[];
};

const PAGE_SIZE = 8;

export function HistoryTable({
  sessions,
}: HistoryTableProps) {
  const [currentPage, setCurrentPage] =
    useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(
      sessions.length / PAGE_SIZE
    )
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [sessions]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const visibleSessions = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PAGE_SIZE;

    return sessions.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [currentPage, sessions]);

  const firstVisible =
    sessions.length === 0
      ? 0
      : (currentPage - 1) *
          PAGE_SIZE +
        1;

  const lastVisible = Math.min(
    currentPage * PAGE_SIZE,
    sessions.length
  );

  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-white text-[14px] font-semibold text-[#1E1E1E]">
              <th className="px-6 py-5">
                Date
              </th>

              <th className="px-6 py-5">
                Exercise
              </th>

              <th className="px-6 py-5">
                Movement Score
              </th>

              <th className="px-6 py-5">
                Status
              </th>

              <th className="px-6 py-5">
                Repetitions
              </th>

              <th className="px-6 py-5">
                Duration
              </th>

              <th className="px-6 py-5">
                Attempts
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleSessions.map(
              (session) => (
                <tr
                  key={session.id}
                  className="border-b bg-[#FAFAFA] text-[14px] text-[#1E1E1E] transition hover:bg-[#F4F1FC]"
                >
                  <td className="whitespace-nowrap px-6 py-5">
                    {formatSessionDate(
                      session.startedAt
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <Link
                      href={`/exercises/${session.exerciseSlug}`}
                      className="font-medium text-[#592EBD] hover:underline"
                    >
                      {
                        session.exerciseTitle
                      }
                    </Link>
                  </td>

                  <td className="px-6 py-5">
                    {session.averageMovementScore ===
                    null
                      ? "Not assessed"
                      : `${session.averageMovementScore}%`}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge
                      status={
                        session.status
                      }
                    />
                  </td>

                  <td className="px-6 py-5">
                    {session.completedReps}/
                    {session.targetReps}
                  </td>

                  <td className="px-6 py-5">
                    {formatDuration(
                      session.durationSeconds
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <div className="space-y-1 text-[13px]">
                      <p>
                        Failed:{" "}
                        {
                          session.failedReps
                        }
                      </p>

                      <p>
                        Incomplete:{" "}
                        {
                          session.incompleteAttempts
                        }
                      </p>

                      {session.difficultyFlag ? (
                        <p className="font-medium text-amber-700">
                          Difficulty recorded
                        </p>
                      ) : null}
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 px-6 py-4 text-[14px] sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {firstVisible}–
          {lastVisible} of{" "}
          {sessions.length} sessions
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((page) =>
                Math.max(1, page - 1)
              )
            }
            className="rounded-md border px-4 py-2 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="flex items-center px-3">
            Page {currentPage} of{" "}
            {totalPages}
          </span>

          <button
            type="button"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(
                  totalPages,
                  page + 1
                )
              )
            }
            className="rounded-md border px-4 py-2 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: HistorySessionStatus;
}) {
  const styles: Record<
    HistorySessionStatus,
    string
  > = {
    ACTIVE:
      "bg-blue-100 text-blue-800",
    PAUSED:
      "bg-amber-100 text-amber-800",
    COMPLETED:
      "bg-emerald-100 text-emerald-800",
    ENDED_EARLY:
      "bg-red-100 text-red-800",
    ABANDONED:
      "bg-neutral-200 text-neutral-700",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-[13px] font-semibold",
        styles[status],
      ].join(" ")}
    >
      {formatStatus(status)}
    </span>
  );
}

function formatStatus(
  status: HistorySessionStatus
): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatSessionDate(
  value: string
): string {
  return new Date(value).toLocaleDateString(
    undefined,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatDuration(
  totalSeconds: number
): string {
  const safeSeconds = Math.max(
    0,
    totalSeconds
  );

  const minutes = Math.floor(
    safeSeconds / 60
  );

  const seconds = safeSeconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}