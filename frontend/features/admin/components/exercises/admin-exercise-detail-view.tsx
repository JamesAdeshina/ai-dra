import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Ban,
  Clock3,
  Dumbbell,
  ImageIcon,
  Info,
  Pencil,
  Repeat2,
  Users,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

import type {
  AdminExerciseDetail,
} from "@/features/admin/types/admin-exercise";

import { ExerciseStatusBadge } from "./exercise-status-badge";

type AdminExerciseDetailViewProps = {
  exercise: AdminExerciseDetail;
};

export function AdminExerciseDetailView({
  exercise,
}: AdminExerciseDetailViewProps) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1250px]">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/exercises"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#592EBD] hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Exercises
          </Link>

          <Link
            href="/admin/exercises"
            aria-label="Close exercise details"
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#EEE8FF]"
          >
            <X size={23} />
          </Link>
        </div>

        <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-[#E4DFDB] bg-[#F8F6F4] md:w-72">
            <Image
              src={exercise.thumbnail}
              alt=""
              fill
              sizes="288px"
              className="object-contain"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-[#201D1B]">
                {exercise.title}
              </h1>

              <ExerciseStatusBadge
                value={exercise.status}
              />

              <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                Demo usage data
              </span>
            </div>

            <dl className="mt-5 space-y-2 text-sm">
              <DetailLine label="Slug" value={exercise.slug} />
              <DetailLine
                label="Category"
                value={exercise.category}
              />

              <div className="flex items-center gap-3">
                <dt className="text-[#77706B]">
                  Difficulty
                </dt>

                <dd>
                  <ExerciseStatusBadge
                    value={exercise.difficulty}
                  />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="mt-7 text-base leading-7 text-[#5F5955]">
          {exercise.description}
        </p>

        <section className="mt-6">
          <h2 className="text-lg font-bold text-[#282422]">
            Instructions
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#625C58]">
            {exercise.instruction}
          </p>

          <ol className="mt-4 space-y-3">
            {exercise.instructions.map(
              (instruction, index) => (
                <li
                  key={instruction}
                  className="flex gap-3 text-sm leading-6 text-[#625C58]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-xs font-bold text-[#592EBD]">
                    {index + 1}
                  </span>

                  {instruction}
                </li>
              )
            )}
          </ol>
        </section>

        <section className="mt-6 rounded-2xl border border-[#E4DFDB] bg-white p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <InfoRow
              icon={Repeat2}
              label="Target Repetitions"
              value={
                exercise.targetRepetitions
                  ? `${exercise.targetRepetitions} reps`
                  : "Not Available"
              }
            />

            <InfoRow
              icon={Clock3}
              label="Hold Duration"
              value={
                exercise.holdDuration ??
                "Not Applicable"
              }
            />

            <InfoRow
              icon={Activity}
              label="Recommended Sets"
              value={
                exercise.recommendedSets ??
                "Not Available"
              }
            />

            <InfoRow
              icon={Dumbbell}
              label="Equipment"
              value={exercise.equipment}
            />
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#E4DFDB] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#282422]">
            Usage Statistics
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Metric
              label="Total Sessions"
              value={exercise.totalSessions}
            />

            <Metric
              label="Survivors Attempted"
              value={exercise.survivorsAttempted}
            />

            <Metric
              label="Completed Sessions"
              value={exercise.completedSessions}
            />

            <Metric
              label="Ended Early"
              value={exercise.endedEarlySessions}
            />

            <Metric
              label="Paused Sessions"
              value={exercise.pausedSessions}
            />

            <Metric
              label="Completion Rate"
              value={`${exercise.completionRate}%`}
              emphasised
            />

            <Metric
              label="Average Completed Reps"
              value={
                exercise.averageCompletedRepetitions ??
                "Not Available"
              }
            />

            <Metric
              label="Average Session Duration"
              value={
                exercise.averageSessionDuration ??
                "Not Available"
              }
            />
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#E4DFDB] bg-white shadow-sm">
          <div className="border-b border-[#EEEAE6] px-6 py-4">
            <h2 className="text-lg font-bold text-[#282422]">
              Recent Sessions
            </h2>
          </div>

          {exercise.recentSessions.length > 0 ? (
            <div className="overflow-x-auto px-6 py-3">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="text-left">
                    <TableHeading>
                      Participant
                    </TableHeading>
                    <TableHeading>Date</TableHeading>
                    <TableHeading>Status</TableHeading>
                    <TableHeading>Reps</TableHeading>
                    <TableHeading>Duration</TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {exercise.recentSessions.map(
                    (session) => (
                      <tr
                        key={session.id}
                        className="border-t border-[#EEEAE6]"
                      >
                        <TableCell>
                          {session.participantId}
                        </TableCell>

                        <TableCell>
                          {session.date}
                        </TableCell>

                        <TableCell>
                          <span className="rounded-full bg-[#F3F0FA] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                            {session.status}
                          </span>
                        </TableCell>

                        <TableCell>
                          {session.repetitions}
                        </TableCell>

                        <TableCell>
                          {session.duration}
                        </TableCell>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Users
                size={28}
                className="mx-auto text-[#8A837E]"
              />

              <p className="mt-4 text-sm text-[#77706B]">
                Detailed recent session records are not
                available for this demo exercise.
              </p>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-[#E4DFDB] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#282422]">
            Manage Exercise
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <PrototypeButton
              icon={Pencil}
              label="Edit Title"
            />

            <PrototypeButton
              icon={Pencil}
              label="Edit Description"
            />

            <PrototypeButton
              icon={Pencil}
              label="Edit Instructions"
            />

            <PrototypeButton
              icon={ImageIcon}
              label="Update Illustration"
            />
          </div>

          <button
            type="button"
            disabled
            className="mt-4 inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#F57B7B] text-sm font-semibold text-[#D43D3D] opacity-65"
          >
            <Ban size={18} />
            Mark as Inactive
          </button>

          <p className="mt-4 text-sm leading-6 text-[#77706B]">
            Exercise-editing controls are displayed as a
            planned administration feature. Exercises with
            recorded sessions should be deactivated or
            archived rather than deleted.
          </p>
        </section>

        <section className="mt-6 flex gap-3 rounded-2xl border border-[#D9D0F0] bg-[#FAF8FF] p-5">
          <Info
            size={21}
            className="mt-0.5 shrink-0 text-[#592EBD]"
          />

          <p className="text-sm leading-6 text-[#625A6D]">
            The exercise content shown here comes from the
            same shared catalogue used by the survivor
            portal. Usage figures are labelled prototype
            monitoring data until connected to Supabase.
          </p>
        </section>
      </div>
    </section>
  );
}

function DetailLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <dt className="text-[#77706B]">
        {label}:
      </dt>

      <dd className="font-semibold text-[#393432]">
        {value}
      </dd>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <Icon
        size={20}
        className="shrink-0 text-[#592EBD]"
      />

      <div className="grid flex-1 gap-1 sm:grid-cols-2">
        <p className="text-sm text-[#77706B]">
          {label}
        </p>

        <p className="font-semibold text-[#393432]">
          {value}
        </p>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  emphasised = false,
}: {
  label: string;
  value: string | number;
  emphasised?: boolean;
}) {
  return (
    <div className="border-l-2 border-[#EEEAE6] pl-4 first:border-l-0 first:pl-0">
      <p className="text-sm text-[#77706B]">
        {label}
      </p>

      <p
        className={
          emphasised
            ? "mt-2 text-2xl font-bold text-[#20A663]"
            : "mt-2 text-2xl font-bold text-[#282422]"
        }
      >
        {value}
      </p>
    </div>
  );
}

function PrototypeButton({
  icon: Icon,
  label,
}: {
  icon: typeof Pencil;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#DDD8D4] bg-white text-sm font-semibold text-[#514B47] opacity-65"
    >
      <Icon size={17} />
      {label}
      <span className="rounded-full bg-[#EEE8FF] px-2 py-0.5 text-[10px] text-[#592EBD]">
        Planned
      </span>
    </button>
  );
}

function TableHeading({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <th className="px-2 py-3 text-sm font-semibold text-[#625C58]">
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
    <td className="whitespace-nowrap px-2 py-4 text-sm text-[#514B47]">
      {children}
    </td>
  );
}