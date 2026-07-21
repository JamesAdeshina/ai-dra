"use client";

import {
  CalendarDays,
  ChevronDown,
  Users,
} from "lucide-react";

import type {
  CarerSurvivorSummary,
} from "@/features/carer/types";

type DashboardFiltersProps = {
  survivors: CarerSurvivorSummary[];
};

export function DashboardFilters({
  survivors,
}: DashboardFiltersProps) {
  const formattedDate =
    new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date());

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative block sm:w-[265px]">
        <span className="sr-only">
          Choose survivor
        </span>

        <Users
          size={19}
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#4D4844]"
        />

        <select
          defaultValue="all"
          className="h-[54px] w-full appearance-none rounded-xl border border-[#DEDAD6] bg-white pl-12 pr-11 text-sm font-medium text-[#3B3633] outline-none transition focus:border-[#592EBD] focus:ring-2 focus:ring-[#E9E3F8]"
        >
          <option value="all">
            Viewing: All Survivors (
            {survivors.length})
          </option>

          {survivors.map((survivor) => (
            <option
              key={survivor.id}
              value={survivor.id}
            >
              Viewing: {survivor.name}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4D4844]"
        />
      </label>

      <div className="flex h-[54px] items-center gap-3 rounded-xl border border-[#DEDAD6] bg-white px-4 text-sm font-medium text-[#3B3633] sm:min-w-[240px]">
        <CalendarDays size={19} />

        <span
          className="flex-1"
          suppressHydrationWarning
        >
          Today, {formattedDate}
        </span>

        <ChevronDown size={18} />
      </div>
    </div>
  );
}
