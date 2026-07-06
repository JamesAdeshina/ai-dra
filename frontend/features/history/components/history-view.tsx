"use client";

import {
  useMemo,
  useState,
} from "react";

import { HistoryEmptyState } from "./history-empty-state";
import { HistoryTable } from "./history-table";

import type {
  HistoryRange,
  HistorySession,
} from "@/features/history/types";

type HistoryViewProps = {
  sessions: HistorySession[];
};

const RANGE_OPTIONS: {
  label: string;
  value: HistoryRange;
}[] = [
  {
    label: "7 Days",
    value: "7_DAYS",
  },
  {
    label: "30 Days",
    value: "30_DAYS",
  },
  {
    label: "3 Months",
    value: "3_MONTHS",
  },
  {
    label: "All Time",
    value: "ALL_TIME",
  },
];

export function HistoryView({
  sessions,
}: HistoryViewProps) {
  const [selectedRange, setSelectedRange] =
    useState<HistoryRange>("30_DAYS");

  const filteredSessions = useMemo(
    () =>
      filterSessionsByRange(
        sessions,
        selectedRange
      ),
    [selectedRange, sessions]
  );

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[40px] font-bold text-[#1E1E1E]">
            Session History
          </h1>

          <p className="mt-1 text-[20px] text-[#1E1E1E]">
            Review previous rehabilitation
            sessions and performance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((option) => {
            const isSelected =
              selectedRange === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setSelectedRange(
                    option.value
                  )
                }
                aria-pressed={isSelected}
                className={[
                  "min-h-[50px] rounded-xl border px-5 text-[14px] font-medium transition",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7875FB]/25",
                  isSelected
                    ? "border-[#7875FB] bg-[#7875FB] text-white"
                    : "border-[#06C7A8] bg-transparent text-[#1E1E1E] hover:bg-[#06C7A8]/5",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white">
        {filteredSessions.length > 0 ? (
          <HistoryTable
            sessions={filteredSessions}
          />
        ) : (
          <HistoryEmptyState />
        )}
      </div>
    </main>
  );
}

function filterSessionsByRange(
  sessions: HistorySession[],
  range: HistoryRange
): HistorySession[] {
  if (range === "ALL_TIME") {
    return sessions;
  }

  const now = new Date();
  const cutoff = new Date(now);

  if (range === "7_DAYS") {
    cutoff.setDate(now.getDate() - 7);
  }

  if (range === "30_DAYS") {
    cutoff.setDate(now.getDate() - 30);
  }

  if (range === "3_MONTHS") {
    cutoff.setMonth(now.getMonth() - 3);
  }

  return sessions.filter(
    (session) =>
      new Date(session.startedAt) >= cutoff
  );
}