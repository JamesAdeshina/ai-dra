"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  HeartHandshake,
  Link2,
  Mail,
  RefreshCw,
  Search,
  UserRoundCheck,
  UserRoundX,
  UsersRound,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AdminCarerActivityGroup,
  AdminCarerStatus,
  AdminCarerSummary,
} from "@/features/admin/types/admin-carer";
import { cn } from "@/lib/utils";

import { CarerStatusBadge } from "./carer-status-badge";

type AdminCarersViewProps = {
  carers: AdminCarerSummary[];
};

type LinkFilter =
  | "All"
  | "Has Linked Survivors"
  | "No Linked Survivors";

type InvitationFilter =
  | "All"
  | "Has Pending Invitations"
  | "No Pending Invitations";

const PAGE_SIZE = 10;

export function AdminCarersView({
  carers,
}: AdminCarersViewProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AdminCarerStatus | "All">(
    "All"
  );
  const [linkFilter, setLinkFilter] =
    useState<LinkFilter>("All");
  const [invitationFilter, setInvitationFilter] =
    useState<InvitationFilter>("All");
  const [activityFilter, setActivityFilter] = useState<
    AdminCarerActivityGroup | "All"
  >("All");
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    status,
    linkFilter,
    invitationFilter,
    activityFilter,
  ]);

  const filteredCarers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return carers.filter((carer) => {
      const matchesSearch =
        !query ||
        carer.name.toLowerCase().includes(query) ||
        carer.email.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || carer.status === status;

      const matchesLink =
        linkFilter === "All" ||
        (linkFilter === "Has Linked Survivors" &&
          carer.linkedSurvivors > 0) ||
        (linkFilter === "No Linked Survivors" &&
          carer.linkedSurvivors === 0);

      const matchesInvitations =
        invitationFilter === "All" ||
        (invitationFilter === "Has Pending Invitations" &&
          carer.pendingInvitations > 0) ||
        (invitationFilter === "No Pending Invitations" &&
          carer.pendingInvitations === 0);

      const matchesActivity =
        activityFilter === "All" ||
        carer.activityGroup === activityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLink &&
        matchesInvitations &&
        matchesActivity
      );
    });
  }, [
    carers,
    search,
    status,
    linkFilter,
    invitationFilter,
    activityFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCarers.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const visibleCarers = filteredCarers.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const activeCarers = carers.filter(
    (carer) => carer.status === "Active"
  ).length;

  const carersWithLinks = carers.filter(
    (carer) => carer.linkedSurvivors > 0
  ).length;

  const carersWithoutLinks = carers.length - carersWithLinks;

  const pendingInvitations = carers.reduce(
    (total, carer) => total + carer.pendingInvitations,
    0
  );

  const acceptedLinks = carers.reduce(
    (total, carer) => total + carer.acceptedLinks,
    0
  );

  const activeFilterCount = [
    status !== "All",
    linkFilter !== "All",
    invitationFilter !== "All",
    activityFilter !== "All",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setLinkFilter("All");
    setInvitationFilter("All");
    setActivityFilter("All");
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
                Carers
              </h1>

              <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                Demo dataset
              </span>
            </div>

            <p className="mt-2 text-sm text-[#68615D] sm:text-base">
              Monitor carer registration, survivor links and recent
              platform activity.
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
                className={cn(isRefreshing && "animate-spin")}
              />
              Refresh
            </button>

            <button
              type="button"
              disabled
              title="Export will be enabled after database integration."
              className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white opacity-70"
            >
              <Download size={17} />
              Export
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          <SummaryCard
            title="Total Carers"
            value={carers.length}
            helper="Registered demo accounts"
            icon={UsersRound}
            tone="purple"
          />

          <SummaryCard
            title="Active Carers"
            value={activeCarers}
            helper={`${percentage(activeCarers, carers.length)} of total`}
            icon={UserRoundCheck}
            tone="green"
          />

          <SummaryCard
            title="Carers with Linked Survivors"
            value={carersWithLinks}
            helper={`${percentage(carersWithLinks, carers.length)} of total`}
            icon={Link2}
            tone="blue"
          />

          <SummaryCard
            title="Carers without Linked Survivors"
            value={carersWithoutLinks}
            helper={`${percentage(carersWithoutLinks, carers.length)} of total`}
            icon={UserRoundX}
            tone="amber"
          />

          <SummaryCard
            title="Pending Invitations"
            value={pendingInvitations}
            helper="Awaiting responses"
            icon={Mail}
            tone="purple"
          />

          <SummaryCard
            title="Accepted Links"
            value={acceptedLinks}
            helper="Total accepted links"
            icon={CheckCircle2}
            tone="green"
          />
        </div>

        <div className="mt-7 flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8480]"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by carer name, email or survivor ID"
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
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
          <FilterSelect
            label="Account status"
            value={status}
            onChange={(value) =>
              setStatus(value as AdminCarerStatus | "All")
            }
            options={[
              ["All", "All Carers"],
              ["Active", "Active"],
              ["Inactive", "Inactive"],
              ["Pending Setup", "Pending Setup"],
              ["No Linked Survivors", "No Linked Survivors"],
              ["Access Revoked", "Access Revoked"],
            ]}
          />

          <FilterSelect
            label="Link status"
            value={linkFilter}
            onChange={(value) =>
              setLinkFilter(value as LinkFilter)
            }
            options={[
              ["All", "All Link Status"],
              ["Has Linked Survivors", "Has Linked Survivors"],
              ["No Linked Survivors", "No Linked Survivors"],
            ]}
          />

          <FilterSelect
            label="Invitation status"
            value={invitationFilter}
            onChange={(value) =>
              setInvitationFilter(value as InvitationFilter)
            }
            options={[
              ["All", "All Invitations"],
              [
                "Has Pending Invitations",
                "Has Pending Invitations",
              ],
              [
                "No Pending Invitations",
                "No Pending Invitations",
              ],
            ]}
          />

          <FilterSelect
            label="Activity"
            value={activityFilter}
            onChange={(value) =>
              setActivityFilter(
                value as AdminCarerActivityGroup | "All"
              )
            }
            options={[
              ["All", "All Activity"],
              ["Recent", "Recent Activity"],
              ["Older", "No Recent Activity"],
              ["Never", "Never Active"],
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
                  <TableHeading>Carer</TableHeading>
                  <TableHeading>Linked Survivors</TableHeading>
                  <TableHeading>Pending Invitations</TableHeading>
                  <TableHeading>Last Active</TableHeading>
                  <TableHeading>Status</TableHeading>
                  <TableHeading />
                </tr>
              </thead>

              <tbody>
                {visibleCarers.map((carer) => (
                  <tr
                    key={carer.id}
                    className="border-t border-[#EEEAE6] transition hover:bg-[#FCFBFA]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <CarerAvatar carer={carer} />

                        <div className="min-w-0">
                          <p className="font-semibold text-[#282422]">
                            {carer.name}
                          </p>
                          <p className="mt-0.5 text-xs text-[#716A66]">
                            {carer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <TableCell>{carer.linkedSurvivors}</TableCell>
                    <TableCell>{carer.pendingInvitations}</TableCell>
                    <TableCell>{carer.lastActive}</TableCell>

                    <td className="px-5 py-4">
                      <CarerStatusBadge value={carer.status} />
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/carers/${carer.id}`}
                        aria-label={`View ${carer.name}`}
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
            totalItems={filteredCarers.length}
            startIndex={startIndex}
            visibleCount={visibleCarers.length}
            onChange={setPage}
          />
        </div>

        <div className="mt-6 space-y-4 md:hidden">
          {visibleCarers.map((carer) => (
            <Link
              key={carer.id}
              href={`/admin/carers/${carer.id}`}
              className="block rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <CarerAvatar carer={carer} />

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#282422]">
                    {carer.name}
                  </p>
                  <p className="truncate text-sm text-[#716A66]">
                    {carer.email}
                  </p>
                </div>

                <ChevronRight
                  size={19}
                  className="text-[#8B837E]"
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <MobileMetric
                  label="Linked survivors"
                  value={String(carer.linkedSurvivors)}
                />
                <MobileMetric
                  label="Pending invitations"
                  value={String(carer.pendingInvitations)}
                />
                <MobileMetric
                  label="Last active"
                  value={carer.lastActive}
                />

                <div>
                  <p className="text-xs text-[#8A837E]">Status</p>
                  <div className="mt-1.5">
                    <CarerStatusBadge value={carer.status} />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredCarers.length}
            startIndex={startIndex}
            visibleCount={visibleCarers.length}
            onChange={setPage}
          />
        </div>

        {visibleCarers.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#CFC7C2] bg-white px-6 py-14 text-center">
            <HeartHandshake
              size={30}
              className="mx-auto text-[#8B837E]"
            />

            <h2 className="mt-4 font-semibold text-[#2F2A27]">
              No carers match these filters
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

type SummaryTone =
  | "purple"
  | "green"
  | "blue"
  | "amber";

const summaryToneClasses: Record<SummaryTone, string> = {
  purple: "bg-[#EEE8FF] text-[#592EBD]",
  green: "bg-[#E6F7EF] text-[#20A663]",
  blue: "bg-[#E8F2FF] text-[#4F8DE8]",
  amber: "bg-[#FFF4DD] text-[#E99A17]",
};

function SummaryCard({
  title,
  value,
  helper,
  icon: Icon,
  tone,
}: {
  title: string;
  value: number;
  helper: string;
  icon: typeof UsersRound;
  tone: SummaryTone;
}) {
  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            summaryToneClasses[tone]
          )}
        >
          <Icon size={20} />
        </span>

        <p className="text-sm font-semibold leading-5 text-[#393432]">
          {title}
        </p>
      </div>

      <p className="mt-5 text-3xl font-bold text-[#201D1B]">
        {value}
      </p>

      <p className="mt-1.5 text-xs text-[#7D7671]">{helper}</p>
    </article>
  );
}

function CarerAvatar({
  carer,
}: {
  carer: AdminCarerSummary;
}) {
  if (carer.avatarUrl) {
    return (
      <img
        src={carer.avatarUrl}
        alt=""
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-sm font-bold text-[#592EBD]">
      {carer.initials}
    </span>
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
    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-[#514B47]">
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
      <p className="mt-1 font-semibold text-[#332E2B]">{value}</p>
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
        carers
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

function percentage(value: number, total: number): string {
  if (total === 0) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}