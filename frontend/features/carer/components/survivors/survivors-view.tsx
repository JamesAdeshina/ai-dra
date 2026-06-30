"use client";

import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Link2,
  MailQuestion,
  Search,
  UsersRound,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import {
  carerSurvivors,
  pendingSurvivorInviteCount,
  survivorStatusGuide,
} from "@/features/carer/data/carer-survivors-data";
import type {
  DirectorySurvivorStatus,
  SurvivorDirectorySort,
} from "@/features/carer/types";
import { cn } from "@/lib/utils";

import { SurvivorCard } from "./survivor-card";

type StatusFilter = "ALL" | DirectorySurvivorStatus;

const statusPresentation: Record<
  DirectorySurvivorStatus,
  {
    indicatorClassName: string;
  }
> = {
  ON_TRACK: {
    indicatorClassName: "border-[#38B978] bg-[#EAF8EF]",
  },
  NEEDS_SUPPORT: {
    indicatorClassName: "border-[#F2B322] bg-[#FFF7E5]",
  },
  AT_RISK: {
    indicatorClassName: "border-[#F23636] bg-[#FFF0F0]",
  },
};

const attentionPriority: Record<
  DirectorySurvivorStatus,
  number
> = {
  AT_RISK: 0,
  NEEDS_SUPPORT: 1,
  ON_TRACK: 2,
};

function SummaryStat({
  icon,
  label,
  value,
  description,
  withDivider = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
  withDivider?: boolean;
}) {
  return (
    <article
      className={cn(
        "min-w-0 px-5 py-5",
        withDivider &&
          "border-t border-[#E7E3DF] sm:border-l sm:border-t-0",
      )}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEE9FB] text-[#592EBD]">
          {icon}
        </span>

        <div>
          <p className="text-sm font-medium text-[#403B37]">
            {label}
          </p>

          <strong className="mt-1 block text-[30px] leading-none text-[#221F1D]">
            {value}
          </strong>

          <p className="mt-3 text-xs leading-5 text-[#817A75]">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

export function SurvivorsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");
  const [sortBy, setSortBy] =
    useState<SurvivorDirectorySort>("RECENTLY_ADDED");

  const activeTodayCount = carerSurvivors.filter(
    (survivor) => survivor.activeToday,
  ).length;

  const filteredSurvivors = useMemo(() => {
    const normalisedSearch = searchTerm.trim().toLowerCase();

    const matchingSurvivors = carerSurvivors.filter(
      (survivor) => {
        const matchesStatus =
          statusFilter === "ALL" ||
          survivor.status === statusFilter;

        const matchesSearch =
          normalisedSearch.length === 0 ||
          survivor.name.toLowerCase().includes(normalisedSearch) ||
          survivor.relationship
            .toLowerCase()
            .includes(normalisedSearch) ||
          survivor.latestSessionExercise
            .toLowerCase()
            .includes(normalisedSearch) ||
          survivor.conditionLabel
            .toLowerCase()
            .includes(normalisedSearch);

        return matchesStatus && matchesSearch;
      },
    );

    return [...matchingSurvivors].sort((first, second) => {
      switch (sortBy) {
        case "NAME_ASCENDING":
          return first.name.localeCompare(second.name);

        case "HIGHEST_COMPLETION": {
          const firstCompletion =
            first.dailyGoalMinutes > 0
              ? first.todayProgressMinutes /
                first.dailyGoalMinutes
              : 0;

          const secondCompletion =
            second.dailyGoalMinutes > 0
              ? second.todayProgressMinutes /
                second.dailyGoalMinutes
              : 0;

          return secondCompletion - firstCompletion;
        }

        case "NEEDS_ATTENTION":
          return (
            attentionPriority[first.status] -
            attentionPriority[second.status]
          );

        case "RECENTLY_ADDED":
        default:
          return (
            new Date(second.linkedAt).getTime() -
            new Date(first.linkedAt).getTime()
          );
      }
    });
  }, [searchTerm, sortBy, statusFilter]);

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#211E1C]">
              Survivors
            </h1>

            <p className="mt-1 text-sm text-[#5F5955]">
              View and manage the survivors linked to your account
            </p>
          </div>

          <Link
            href="/carer/invitations"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#592EBD] px-7 text-sm font-semibold text-white transition hover:bg-[#4B24A8]"
          >
            <Link2 size={18} />
            Invite / Link Another Survivor
          </Link>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <section className="grid overflow-hidden rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)] sm:grid-cols-3">
              <SummaryStat
                icon={<UsersRound size={21} />}
                label="Total Survivors"
                value={carerSurvivors.length}
                description="Linked to your account"
              />

              <SummaryStat
                icon={<CheckCircle2 size={21} />}
                label="Active Today"
                value={activeTodayCount}
                description="Completed at least one session"
                withDivider
              />

              <SummaryStat
                icon={<MailQuestion size={21} />}
                label="Pending Invite"
                value={pendingSurvivorInviteCount}
                description="Awaiting acceptance"
                withDivider
              />
            </section>

            <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_220px]">
              <label className="relative block">
                <span className="sr-only">
                  Search connected survivors
                </span>

                <Search
                  size={21}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#302C29]"
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search"
                  className="h-14 w-full rounded-xl border border-[#DEDAD6] bg-white pl-12 pr-4 text-sm text-[#302C29] outline-none transition placeholder:text-[#7F7873] focus:border-[#592EBD] focus:ring-2 focus:ring-[#E9E3F8]"
                />
              </label>

              <label className="relative block">
                <span className="sr-only">
                  Filter survivors by status
                </span>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as StatusFilter,
                    )
                  }
                  className="h-14 w-full appearance-none rounded-xl border border-[#DEDAD6] bg-white px-4 pr-11 text-sm text-[#403B37] outline-none transition focus:border-[#592EBD] focus:ring-2 focus:ring-[#E9E3F8]"
                >
                  <option value="ALL">All Status</option>
                  <option value="ON_TRACK">On Track</option>
                  <option value="NEEDS_SUPPORT">
                    Needs Support
                  </option>
                  <option value="AT_RISK">At Risk</option>
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4D4844]"
                />
              </label>

              <label className="relative block">
                <span className="sr-only">
                  Sort connected survivors
                </span>

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target
                        .value as SurvivorDirectorySort,
                    )
                  }
                  className="h-14 w-full appearance-none rounded-xl border border-[#DEDAD6] bg-white px-4 pr-11 text-sm text-[#403B37] outline-none transition focus:border-[#592EBD] focus:ring-2 focus:ring-[#E9E3F8]"
                >
                  <option value="RECENTLY_ADDED">
                    Sort by: Recently Added
                  </option>
                  <option value="NAME_ASCENDING">
                    Sort by: Name A–Z
                  </option>
                  <option value="HIGHEST_COMPLETION">
                    Sort by: Highest Completion
                  </option>
                  <option value="NEEDS_ATTENTION">
                    Sort by: Needs Attention
                  </option>
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4D4844]"
                />
              </label>
            </div>

            <div className="mt-4 space-y-4">
              {filteredSurvivors.length > 0 ? (
                filteredSurvivors.map((survivor) => (
                  <SurvivorCard
                    key={survivor.id}
                    survivor={survivor}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-[#DEDAD6] bg-white px-6 py-16 text-center">
                  <Search
                    size={28}
                    className="mx-auto text-[#592EBD]"
                  />

                  <h2 className="mt-4 text-lg font-semibold text-[#292522]">
                    No survivors found
                  </h2>

                  <p className="mt-2 text-sm text-[#746D68]">
                    Try changing your search or status filter.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)] xl:sticky xl:top-[118px]">
            <div className="flex items-center justify-between border-b border-[#EEEAE6] px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F0F8] text-[#592EBD]">
                  <Bell size={18} />
                </span>

                <h2 className="font-semibold text-[#332E2B]">
                  Survivor Status Guide
                </h2>
              </div>

              <button
                type="button"
                className="text-xs font-semibold text-[#4C7BFF] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-[#F0ECE8] px-4">
              {survivorStatusGuide.map((statusItem) => {
                const presentation =
                  statusPresentation[statusItem.status];

                return (
                  <article
                    key={statusItem.status}
                    className="flex gap-3 py-5"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[7px]",
                        presentation.indicatorClassName,
                      )}
                    >
                      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                    </span>

                    <div>
                      <h3 className="text-sm font-medium text-[#3A3532]">
                        {statusItem.label}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#817A75]">
                        {statusItem.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}