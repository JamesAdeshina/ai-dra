import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Gauge,
  Info,
  UserRound,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

import type {
  AdminAttemptResult,
  AdminSessionDetail,
} from "@/features/admin/types/admin-session";
import { cn } from "@/lib/utils";

import { SessionStatusBadge } from "./session-status-badge";

type AdminSessionDetailViewProps = {
  session: AdminSessionDetail;
};

export function AdminSessionDetailView({
  session,
}: AdminSessionDetailViewProps) {
  const completionPercentage =
    session.targetRepetitions &&
    session.targetRepetitions > 0
      ? Math.round(
          (session.completedRepetitions /
            session.targetRepetitions) *
            100
        )
      : null;

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/sessions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#592EBD] hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Sessions
          </Link>

          <Link
            href="/admin/sessions"
            aria-label="Close session details"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#4D4743] transition hover:bg-[#EEE8FF] hover:text-[#592EBD]"
          >
            <X size={23} />
          </Link>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-[#201D1B]">
                Session Details
              </h1>

              <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                Demo dataset
              </span>
            </div>

            <p className="mt-2 text-sm text-[#68615D]">
              Session ID: {session.id}
            </p>
          </div>

          <SessionStatusBadge value={session.status} />
        </div>

        <section className="mt-7 rounded-2xl border border-[#E4DFDB] bg-white p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2">
            <IdentityItem
              icon={UserRound}
              title={session.participantId}
              label="Participant ID"
            />

            <IdentityItem
              icon={Dumbbell}
              title={session.exerciseName}
              label="Exercise"
            />
          </div>

          <div className="my-6 border-t border-[#EEEAE6]" />

          <div className="grid gap-6 sm:grid-cols-2">
            <Definition
              label="Start Time"
              value={session.startTime}
            />

            <Definition
              label="End Time"
              value={
                session.endTime ??
                "Session Still Active"
              }
            />
          </div>

          <div className="my-6 border-t border-[#EEEAE6]" />

          <div className="grid gap-6 sm:grid-cols-2">
            <Definition
              label="Duration"
              value={
                session.durationSeconds
                  ? formatDuration(
                      session.durationSeconds
                    )
                  : session.durationLabel
              }
            />

            <div>
              <p className="text-sm text-[#77706B]">
                Status
              </p>

              <div className="mt-2">
                <SessionStatusBadge
                  value={session.status}
                />
              </div>
            </div>
          </div>

          <div className="my-6 border-t border-[#EEEAE6]" />

          <div className="grid gap-6 sm:grid-cols-2">
            <Definition
              label="Target Repetitions"
              value={displayValue(
                session.targetRepetitions
              )}
            />

            <Definition
              label="Completed Repetitions"
              value={
                completionPercentage === null
                  ? String(
                      session.completedRepetitions
                    )
                  : `${session.completedRepetitions} (${completionPercentage}%)`
              }
            />
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#E4DFDB] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#282422]">
            Session Summary
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryMetric
              label="Total Attempts"
              value={displayValue(
                session.totalAttempts
              )}
            />

            <SummaryMetric
              label="Successful Reps"
              value={displayValue(
                session.successfulRepetitions
              )}
            />

            <SummaryMetric
              label="Failed Attempts"
              value={displayValue(
                session.failedAttempts
              )}
            />

            <SummaryMetric
              label="Incomplete Attempts"
              value={displayValue(
                session.incompleteAttempts
              )}
            />

            <SummaryMetric
              label="Hold Requirement"
              value={displayValue(
                session.holdRequirement
              )}
            />

            <SummaryMetric
              label="Arm Mode"
              value={displayValue(session.armMode)}
            />

            <SummaryMetric
              label="Performed Side"
              value={displayValue(
                session.performedSide
              )}
            />

            <SummaryMetric
              label="Difficulty"
              value={session.difficulty}
            />
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#E4DFDB] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
              <Gauge size={19} />
            </span>

            <div>
              <h2 className="text-lg font-bold text-[#282422]">
                Movement Metrics
              </h2>

              <p className="mt-0.5 text-sm text-[#77706B]">
                Metrics planned for the movement-scoring
                implementation.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <PlannedMetric
              label="Accuracy"
              value={
                session.accuracy ??
                "Requires Movement Scoring"
              }
            />

            <PlannedMetric
              label="Movement Score"
              value={
                session.movementScore ??
                "Requires Movement Scoring"
              }
            />

            <PlannedMetric
              label="Speed Summary"
              value={
                session.speedSummary ??
                "Not Assessed Yet"
              }
            />
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#E4DFDB] bg-white shadow-sm">
          <div className="border-b border-[#EEEAE6] px-6 py-4">
            <h2 className="text-lg font-bold text-[#282422]">
              Recent Attempts
            </h2>

            <p className="mt-1 text-sm text-[#77706B]">
              Attempt-level information recorded during
              this session.
            </p>
          </div>

          {session.recentAttempts.length > 0 ? (
            <>
              <div className="overflow-x-auto px-6 py-3">
                <table className="w-full min-w-[720px] border-collapse">
                  <thead>
                    <tr className="text-left">
                      <TableHeading>Attempt</TableHeading>
                      <TableHeading>Time</TableHeading>
                      <TableHeading>Result</TableHeading>
                      <TableHeading>Hold Time</TableHeading>
                      <TableHeading>Notes</TableHeading>
                    </tr>
                  </thead>

                  <tbody>
                    {session.recentAttempts.map(
                      (attempt) => (
                        <tr
                          key={attempt.id}
                          className="border-t border-[#EEEAE6]"
                        >
                          <td className="px-2 py-4">
                            <div className="flex items-center gap-3">
                              <AttemptIcon
                                result={attempt.result}
                              />

                              <span className="font-semibold text-[#393432]">
                                {attempt.attemptNumber}
                              </span>
                            </div>
                          </td>

                          <TableCell>
                            {attempt.time}
                          </TableCell>

                          <TableCell>
                            <SessionStatusBadge
                              value={attempt.result}
                            />
                          </TableCell>

                          <TableCell>
                            {displayValue(
                              attempt.holdTime
                            )}
                          </TableCell>

                          <TableCell>
                            {attempt.notes}
                          </TableCell>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {session.totalAttempts &&
              session.totalAttempts >
                session.recentAttempts.length ? (
                <div className="border-t border-[#EEEAE6] px-6 py-4">
                  <p className="text-sm font-semibold text-[#592EBD]">
                    Showing{" "}
                    {session.recentAttempts.length} of{" "}
                    {session.totalAttempts} recorded
                    attempts
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            <div className="px-6 py-12 text-center">
              <Activity
                size={28}
                className="mx-auto text-[#8A837E]"
              />

              <h3 className="mt-4 font-semibold text-[#302B28]">
                Attempt details are not available
              </h3>

              <p className="mt-2 text-sm text-[#77706B]">
                Attempt-level records have not been added
                for this demo session.
              </p>
            </div>
          )}
        </section>

        <section className="mt-5 flex gap-3 rounded-2xl border border-[#D9D0F0] bg-[#FAF8FF] p-5">
          <Info
            size={21}
            className="mt-0.5 shrink-0 text-[#592EBD]"
          />

          <div>
            <h2 className="font-semibold text-[#39314A]">
              About this data
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#625A6D]">
              This information is recorded automatically by
              the AI-DRA platform and is intended for
              engagement and system monitoring. It should
              not be presented as a diagnosis or independent
              clinical assessment.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}

function IdentityItem({
  icon: Icon,
  title,
  label,
}: {
  icon: typeof UserRound;
  title: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
        <Icon size={25} />
      </span>

      <div>
        <p className="text-xl font-bold text-[#282422]">
          {title}
        </p>

        <p className="mt-1 text-sm text-[#77706B]">
          {label}
        </p>
      </div>
    </div>
  );
}

function Definition({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-[#77706B]">
        {label}
      </p>

      <p className="mt-2 font-semibold text-[#393432]">
        {value}
      </p>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-l-2 border-[#EEEAE6] pl-4 first:border-l-0 first:pl-0">
      <p className="text-sm text-[#77706B]">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-[#282422]">
        {value}
      </p>
    </div>
  );
}

function PlannedMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#CDC4E4] bg-[#FAF8FF] p-4">
      <p className="text-sm font-semibold text-[#393432]">
        {label}
      </p>

      <p className="mt-2 text-sm leading-5 text-[#6C6474]">
        {value}
      </p>
    </div>
  );
}

function AttemptIcon({
  result,
}: {
  result: AdminAttemptResult;
}) {
  const classes: Record<
    AdminAttemptResult,
    string
  > = {
    Successful:
      "bg-[#E6F7EF] text-[#20A663]",
    Failed: "bg-[#FFE7E7] text-[#F23636]",
    Incomplete:
      "bg-[#FFF4DD] text-[#E99A17]",
  };

  return (
    <span
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full",
        classes[result]
      )}
    >
      {result === "Successful" ? (
        <CheckCircle2 size={16} />
      ) : (
        <Clock3 size={16} />
      )}
    </span>
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

function displayValue(
  value: string | number | null
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not Available Yet";
  }

  return String(value);
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes} min ${remainingSeconds} sec`;
}