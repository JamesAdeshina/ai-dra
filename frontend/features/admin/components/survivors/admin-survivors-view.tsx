"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Link2,
  Search,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AdminSurvivorSummary,
  SurvivorEngagementStatus,
  SurvivorLinkStatus,
  SurvivorOnboardingStatus,
} from "@/features/admin/types";
import { cn } from "@/lib/utils";

import { SurvivorStatusBadge } from "./survivor-status-badge";

type AdminSurvivorsViewProps = {
  survivors: AdminSurvivorSummary[];
};

const PAGE_SIZE = 6;

export function AdminSurvivorsView({
  survivors,
}: AdminSurvivorsViewProps) {
  const [search, setSearch] = useState("");
  const [engagement, setEngagement] = useState<
    SurvivorEngagementStatus | "All"
  >("All");
  const [linkStatus, setLinkStatus] = useState<
    SurvivorLinkStatus | "All"
  >("All");
  const [onboarding, setOnboarding] = useState<
    SurvivorOnboardingStatus | "All"
  >("All");
  const [accountStatus, setAccountStatus] = useState<
    "All" | "Active" | "Inactive" | "Pending"
  >("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    engagement,
    linkStatus,
    onboarding,
    accountStatus,
  ]);

  const filteredSurvivors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return survivors.filter((survivor) => {
      const matchesSearch =
        !query ||
        survivor.participantId.toLowerCase().includes(query) ||
        survivor.name.toLowerCase().includes(query) ||
        survivor.email.toLowerCase().includes(query) ||
        survivor.linkedCarerName
          ?.toLowerCase()
          .includes(query);

      const matchesEngagement =
        engagement === "All" ||
        survivor.engagementStatus === engagement;

      const matchesLink =
        linkStatus === "All" ||
        survivor.linkStatus === linkStatus;

      const matchesOnboarding =
        onboarding === "All" ||
        survivor.onboardingStatus === onboarding;

      const matchesAccount =
        accountStatus === "All" ||
        survivor.accountStatus === accountStatus;

      return (
        matchesSearch &&
        matchesEngagement &&
        matchesLink &&
        matchesOnboarding &&
        matchesAccount
      );
    });
  }, [
    survivors,
    search,
    engagement,
    linkStatus,
    onboarding,
    accountStatus,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSurvivors.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleSurvivors = filteredSurvivors.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const activeFilterCount = [
    engagement !== "All",
    linkStatus !== "All",
    onboarding !== "All",
    accountStatus !== "All",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setEngagement("All");
    setLinkStatus("All");
    setOnboarding("All");
    setAccountStatus("All");
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#201D1B] sm:text-3xl">
                Survivors
              </h1>

              <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                Demo dataset
              </span>
            </div>

            <p className="mt-2 text-sm text-[#68615D] sm:text-base">
              View survivor onboarding, engagement and rehabilitation activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#CFC3EE] bg-white px-4 text-sm font-semibold text-[#592EBD]">
              <Users size={17} />
              {survivors.length} Survivors
            </div>

            <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#CFC3EE] bg-white px-4 text-sm font-semibold text-[#592EBD]">
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
              disabled
              title="Export will be connected after the database integration."
              className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white opacity-70"
            >
              <Download size={17} />
              Export
            </button>
          </div>
        </div>

        <div className="mt-7">
          <label className="relative block">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8480]"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by ID, name, carer or email"
              className="h-12 w-full rounded-xl border border-[#DDD8D4] bg-white pl-12 pr-4 text-sm text-[#2B2724] outline-none transition placeholder:text-[#A19A95] focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
          <FilterSelect
            label="Account status"
            value={accountStatus}
            onChange={(value) =>
              setAccountStatus(
                value as typeof accountStatus
              )
            }
            options={[
              ["All", "All Survivors"],
              ["Active", "Active"],
              ["Inactive", "Inactive"],
              ["Pending", "Pending"],
            ]}
          />

          <FilterSelect
            label="Engagement"
            value={engagement}
            onChange={(value) =>
              setEngagement(value as typeof engagement)
            }
            options={[
              ["All", "All Engagement"],
              ["High", "High"],
              ["Moderate", "Moderate"],
              ["Low", "Low"],
              ["Inactive", "Inactive"],
              ["Not Started", "Not Started"],
            ]}
          />

          <FilterSelect
            label="Linking status"
            value={linkStatus}
            onChange={(value) =>
              setLinkStatus(value as typeof linkStatus)
            }
            options={[
              ["All", "All Linking Status"],
              ["Linked", "Linked"],
              ["Invitation Pending", "Invitation Pending"],
              ["Not Linked", "Not Linked"],
            ]}
          />

          <FilterSelect
            label="Onboarding"
            value={onboarding}
            onChange={(value) =>
              setOnboarding(value as typeof onboarding)
            }
            options={[
              ["All", "All Onboarding"],
              ["Complete", "Complete"],
              ["In Progress", "In Progress"],
              ["Not Started", "Not Started"],
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

        <div className="mt-6 hidden overflow-hidden rounded-2xl border border-[#E4DFDB] bg-white shadow-[0_2px_10px_rgba(35,30,28,0.035)] md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse">
              <thead>
                <tr className="bg-[#FCFBFA] text-left">
                  {[
                    "Participant",
                    "Linked Carer",
                    "Onboarding",
                    "Sessions",
                    "Last Active",
                    "Engagement",
                    "Status",
                    "",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6F6864]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleSurvivors.map((survivor) => (
                  <tr
                    key={survivor.id}
                    className="border-t border-[#EEEAE6] transition hover:bg-[#FCFBFA]"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-[#282422]">
                        {survivor.participantId}
                      </p>
                      <p className="mt-1 text-xs text-[#716A66]">
                        {survivor.name}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <LinkDisplay survivor={survivor} />
                    </td>

                    <td className="px-5 py-4">
                      <SurvivorStatusBadge
                        value={survivor.onboardingStatus}
                      />
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#3B3633]">
                      {survivor.sessions}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#5E5753]">
                      {survivor.lastActive}
                    </td>

                    <td className="px-5 py-4">
                      <SurvivorStatusBadge
                        value={survivor.engagementStatus}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <AccountStatus status={survivor.accountStatus} />
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/survivors/${survivor.id}`}
                        aria-label={`View ${survivor.name}`}
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
            totalItems={filteredSurvivors.length}
            startIndex={startIndex}
            visibleCount={visibleSurvivors.length}
            onChange={setPage}
          />
        </div>

        <div className="mt-6 space-y-4 md:hidden">
          {visibleSurvivors.map((survivor) => (
            <Link
              key={survivor.id}
              href={`/admin/survivors/${survivor.id}`}
              className="block rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-sm font-bold text-[#592EBD]">
                  {survivor.initials}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#282422]">
                    {survivor.participantId}
                  </p>
                  <p className="truncate text-sm text-[#68615D]">
                    {survivor.name}
                  </p>
                </div>

                <ChevronRight size={19} className="text-[#8B837E]" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <MobileDetail
                  label="Sessions"
                  value={String(survivor.sessions)}
                />
                <MobileDetail
                  label="Last active"
                  value={survivor.lastActive}
                />
                <div>
                  <p className="text-xs text-[#8A837E]">Engagement</p>
                  <div className="mt-1.5">
                    <SurvivorStatusBadge
                      value={survivor.engagementStatus}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#8A837E]">Status</p>
                  <div className="mt-2">
                    <AccountStatus status={survivor.accountStatus} />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredSurvivors.length}
            startIndex={startIndex}
            visibleCount={visibleSurvivors.length}
            onChange={setPage}
          />
        </div>

        {visibleSurvivors.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#CFC7C2] bg-white px-6 py-14 text-center">
            <SlidersHorizontal
              size={28}
              className="mx-auto text-[#8B837E]"
            />
            <h2 className="mt-4 font-semibold text-[#2F2A27]">
              No survivors match these filters
            </h2>
            <p className="mt-2 text-sm text-[#756E69]">
              Clear the filters or use a different search term.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
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

function LinkDisplay({
  survivor,
}: {
  survivor: AdminSurvivorSummary;
}) {
  if (survivor.linkStatus === "Linked") {
    return (
      <div className="flex items-center gap-2 text-sm text-[#3D3835]">
        <UserRound size={17} className="text-[#592EBD]" />
        {survivor.linkedCarerName}
      </div>
    );
  }

  if (survivor.linkStatus === "Invitation Pending") {
    return (
      <div className="flex items-center gap-2 text-sm text-[#3D3835]">
        <span className="h-4 w-4 rounded-full border-2 border-[#F59F24]" />
        Invitation pending
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-[#3D3835]">
      <Link2 size={17} className="text-[#58708F]" />
      Not linked
    </div>
  );
}

function AccountStatus({
  status,
}: {
  status: AdminSurvivorSummary["accountStatus"];
}) {
  const dotClass =
    status === "Active"
      ? "bg-[#20B26B]"
      : status === "Pending"
        ? "bg-[#F59F24]"
        : "bg-[#A6AFBD]";

  return (
    <div className="flex items-center gap-2 text-sm text-[#514B47]">
      <span className={cn("h-2 w-2 rounded-full", dotClass)} />
      {status}
    </div>
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
      <p className="text-xs text-[#8A837E]">{label}</p>
      <p className="mt-1 font-semibold text-[#332E2B]">{value}</p>
    </div>
  );
}

type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  visibleCount: number;
  onChange: (page: number) => void;
};

function Pagination({
  page,
  totalPages,
  totalItems,
  startIndex,
  visibleCount,
  onChange,
}: PaginationProps) {
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
        survivors
      </p>

      <div className="flex items-center gap-2">
        <PaginationButton
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          label="Previous page"
        >
          <ChevronLeft size={17} />
        </PaginationButton>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
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
          )
        )}

        <PaginationButton
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          label="Next page"
        >
          <ChevronRight size={17} />
        </PaginationButton>
      </div>
    </div>
  );
}

function PaginationButton({
  children,
  disabled,
  onClick,
  label,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
  label: string;
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