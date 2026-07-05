"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Star,
  Target,
  Users,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AdminExerciseDifficulty,
  AdminExerciseStatus,
  AdminExerciseSummary,
} from "@/features/admin/types/admin-exercise";
import { cn } from "@/lib/utils";

import { ExerciseStatusBadge } from "./exercise-status-badge";

type AdminExercisesViewProps = {
  exercises: AdminExerciseSummary[];
};

const PAGE_SIZE = 8;

export function AdminExercisesView({
  exercises,
}: AdminExercisesViewProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState<
    AdminExerciseDifficulty | "All"
  >("All");
  const [status, setStatus] = useState<
    AdminExerciseStatus | "All"
  >("All");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          exercises.map(
            (exercise) => exercise.catalogueCategory
          )
        )
      ),
    ],
    [exercises]
  );

  const filteredExercises = useMemo(() => {
    const query = search.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const matchesSearch =
        !query ||
        exercise.title.toLowerCase().includes(query) ||
        exercise.description.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" ||
        exercise.catalogueCategory === category;

      const matchesDifficulty =
        difficulty === "All" ||
        exercise.difficulty === difficulty;

      const matchesStatus =
        status === "All" ||
        exercise.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesStatus
      );
    });
  }, [
    exercises,
    search,
    category,
    difficulty,
    status,
  ]);

  useEffect(() => {
    setPage(1);
  }, [search, category, difficulty, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredExercises.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const visibleExercises = filteredExercises.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const activeExercises = exercises.filter(
    (exercise) => exercise.status === "Active"
  ).length;

  const attemptedExercises = exercises.filter(
    (exercise) => exercise.totalSessions > 0
  ).length;

  const neverAttempted =
    exercises.length - attemptedExercises;

  const mostUsedExercise = [...exercises].sort(
    (left, right) =>
      right.totalSessions - left.totalSessions
  )[0];

  const averageCompletionRate =
    exercises.length === 0
      ? 0
      : Math.round(
          exercises.reduce(
            (total, exercise) =>
              total + exercise.completionRate,
            0
          ) / exercises.length
        );

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setDifficulty("All");
    setStatus("All");
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1650px]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#201D1B] sm:text-3xl">
                Exercises
              </h1>

              <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                Demo usage data
              </span>
            </div>

            <p className="mt-2 text-sm text-[#68615D] sm:text-base">
              Review the shared rehabilitation catalogue and
              monitor how each exercise is being used.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm font-semibold text-[#3E3936]">
              <Filter size={17} />
              Filters
            </div>

            <Link
              href="/admin/exercises/new"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white transition hover:bg-[#4B24A8]"
            >
              <Plus size={18} />
              Add Exercise
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          <SummaryCard
            title="Total Exercises"
            value={String(exercises.length)}
            helper="Shared catalogue records"
            icon={Activity}
            tone="purple"
          />

          <SummaryCard
            title="Active Exercises"
            value={String(activeExercises)}
            helper={`${percentage(
              activeExercises,
              exercises.length
            )} of library`}
            icon={CheckCircle2}
            tone="green"
          />

          <SummaryCard
            title="Exercises Attempted"
            value={String(attemptedExercises)}
            helper={`${percentage(
              attemptedExercises,
              exercises.length
            )} of library`}
            icon={Users}
            tone="blue"
          />

          <SummaryCard
            title="Most-Used Exercise"
            value={mostUsedExercise?.title ?? "Not Available"}
            helper={
              mostUsedExercise
                ? `${mostUsedExercise.totalSessions} demo sessions`
                : "Requires session data"
            }
            icon={Star}
            tone="amber"
            compact
          />

          <SummaryCard
            title="Average Completion"
            value={`${averageCompletionRate}%`}
            helper="Across demo usage records"
            icon={Target}
            tone="blue"
          />

          <SummaryCard
            title="Never Attempted"
            value={String(neverAttempted)}
            helper={`${percentage(
              neverAttempted,
              exercises.length
            )} of library`}
            icon={CircleX}
            tone="red"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 xl:flex-row">
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
              placeholder="Search exercises by title, category or description"
              className="h-12 w-full rounded-xl border border-[#DDD8D4] bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-[#A19A95] focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
            />
          </label>

          <select
            value={difficulty}
            onChange={(event) =>
              setDifficulty(
                event.target.value as
                  | AdminExerciseDifficulty
                  | "All"
              )
            }
            aria-label="Filter exercise difficulty"
            className="h-12 rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm font-semibold outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | AdminExerciseStatus
                  | "All"
              )
            }
            aria-label="Filter exercise status"
            className="h-12 rounded-xl border border-[#DDD8D4] bg-white px-4 text-sm font-semibold outline-none focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="h-12 rounded-xl px-4 text-sm font-semibold text-[#592EBD] transition hover:bg-[#F5F1FF]"
          >
            Clear filters
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-[#E4DFDB] bg-white p-2 shadow-sm">
          <span className="px-2 text-sm font-semibold text-[#625C58]">
            Categories:
          </span>

          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                category === item
                  ? "bg-[#592EBD] text-white"
                  : "text-[#514B47] hover:bg-[#F5F1FF] hover:text-[#592EBD]"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visibleExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
            />
          ))}
        </div>

        {visibleExercises.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#CEC7C2] bg-white px-6 py-14 text-center">
            <Activity
              size={30}
              className="mx-auto text-[#8A837E]"
            />

            <h2 className="mt-4 font-semibold text-[#302B28]">
              No exercises match these filters
            </h2>

            <p className="mt-2 text-sm text-[#77706B]">
              Clear the filters or use another search term.
            </p>
          </div>
        ) : null}

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={filteredExercises.length}
          startIndex={startIndex}
          visibleCount={visibleExercises.length}
          onChange={setPage}
        />
      </div>
    </section>
  );
}

function ExerciseCard({
  exercise,
}: {
  exercise: AdminExerciseSummary;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E4DFDB] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={`/admin/exercises/${exercise.id}`}
        className="block"
      >
        <div className="relative h-48 bg-[#F8F6F4]">
          <Image
            src={exercise.thumbnail}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-contain"
          />
        </div>

        <div className="p-5">
          <h2 className="text-lg font-bold text-[#282422]">
            {exercise.title}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-[#716A66]">
              {exercise.catalogueCategory}
            </span>

            <ExerciseStatusBadge
              value={exercise.difficulty}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#817A75]">
                Sessions
              </p>

              <p className="mt-1 text-lg font-bold text-[#282422]">
                {exercise.totalSessions}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#817A75]">
                Completion Rate
              </p>

              <p className="mt-1 text-lg font-bold text-[#282422]">
                {exercise.completionRate}%
              </p>

              <div className="mt-2 h-1.5 rounded-full bg-[#EEEAE6]">
                <div
                  className="h-full rounded-full bg-[#20A663]"
                  style={{
                    width: `${exercise.completionRate}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <ExerciseStatusBadge
              value={exercise.status}
            />

            <MoreVertical
              size={18}
              className="text-[#716A66]"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}

type SummaryTone =
  | "purple"
  | "green"
  | "blue"
  | "amber"
  | "red";

const summaryToneClasses: Record<
  SummaryTone,
  string
> = {
  purple: "bg-[#EEE8FF] text-[#592EBD]",
  green: "bg-[#E6F7EF] text-[#20A663]",
  blue: "bg-[#E8F2FF] text-[#2879D8]",
  amber: "bg-[#FFF4DD] text-[#E99A17]",
  red: "bg-[#FFE7E7] text-[#F23636]",
};

function SummaryCard({
  title,
  value,
  helper,
  icon: Icon,
  tone,
  compact = false,
}: {
  title: string;
  value: string;
  helper: string;
  icon: typeof Activity;
  tone: SummaryTone;
  compact?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            summaryToneClasses[tone]
          )}
        >
          <Icon size={18} />
        </span>

        <p className="text-sm font-semibold text-[#393432]">
          {title}
        </p>
      </div>

      <p
        className={cn(
          "mt-4 font-bold text-[#201D1B]",
          compact ? "text-lg" : "text-3xl"
        )}
      >
        {value}
      </p>

      <p className="mt-1.5 text-xs text-[#7D7671]">
        {helper}
      </p>
    </article>
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
    <div className="mt-7 flex flex-col gap-4 border-t border-[#EEEAE6] pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[#706965]">
        Showing{" "}
        <strong>
          {totalItems === 0 ? 0 : startIndex + 1}
        </strong>{" "}
        to{" "}
        <strong>{startIndex + visibleCount}</strong>{" "}
        of <strong>{totalItems}</strong> exercises
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDD8D4] bg-white disabled:opacity-40"
        >
          <ChevronLeft size={17} />
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onChange(pageNumber)}
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

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDD8D4] bg-white disabled:opacity-40"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}

function percentage(
  value: number,
  total: number
): string {
  if (total === 0) return "0%";

  return `${Math.round((value / total) * 100)}%`;
}