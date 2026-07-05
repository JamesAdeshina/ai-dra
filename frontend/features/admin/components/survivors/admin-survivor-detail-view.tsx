import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Info,
  Link2,
  UserRound,
  X,
} from "lucide-react";

import type { AdminSurvivorDetail } from "@/features/admin/types";
import { cn } from "@/lib/utils";

import { SurvivorStatusBadge } from "./survivor-status-badge";

type AdminSurvivorDetailViewProps = {
  survivor: AdminSurvivorDetail;
};

export function AdminSurvivorDetailView({
  survivor,
}: AdminSurvivorDetailViewProps) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/survivors"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#592EBD] hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Survivors
          </Link>

          <Link
            href="/admin/survivors"
            aria-label="Close survivor details"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#4D4743] transition hover:bg-[#EEE8FF] hover:text-[#592EBD]"
          >
            <X size={23} />
          </Link>
        </div>

        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#592EBD] text-3xl font-bold text-white shadow-lg shadow-[#592EBD]/20">
            {survivor.initials}
          </span>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-[#201D1B]">
                {survivor.participantId}
              </h1>

              <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                Demo dataset
              </span>
            </div>

            <p className="mt-1 text-2xl font-semibold text-[#282422]">
              {survivor.name}
            </p>

            <div className="mt-3">
              <SurvivorStatusBadge value={survivor.accountStatus} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <SummaryCard survivor={survivor} />
          <EngagementCard survivor={survivor} />
          <LinkedCarerCard survivor={survivor} />
        </div>

        <section className="mt-5 rounded-2xl border border-[#E4DFDB] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#282422]">
            Rehabilitation Activity
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label="Total Sessions"
              value={survivor.sessions}
            />
            <Metric
              label="Completed"
              value={survivor.completedSessions}
              valueClassName="text-[#20A663]"
            />
            <Metric
              label="Ended Early"
              value={survivor.endedEarlySessions}
              valueClassName="text-[#F07822]"
            />
            <Metric
              label="Paused"
              value={survivor.pausedSessions}
              valueClassName="text-[#E99A17]"
            />
            <Metric
              label="Total Exercises Attempted"
              value={survivor.totalExercisesAttempted}
            />
            <Metric
              label="Total Completed Repetitions"
              value={survivor.totalCompletedRepetitions}
            />
            <Metric
              label="Average Session Duration"
              value={survivor.averageSessionDuration}
            />
            <Metric
              label="Difficulty Flags"
              value={survivor.difficultyFlags}
            />
          </div>
        </section>

        <DataTableSection title="Exercise Breakdown">
          {survivor.exerciseBreakdown.length > 0 ? (
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="text-left">
                  <TableHeading>Exercise</TableHeading>
                  <TableHeading>Sessions</TableHeading>
                  <TableHeading>Completed Reps</TableHeading>
                  <TableHeading>Last Attempted</TableHeading>
                </tr>
              </thead>

              <tbody>
                {survivor.exerciseBreakdown.map((exercise) => (
                  <tr
                    key={exercise.id}
                    className="border-t border-[#EEEAE6]"
                  >
                    <TableCell className="font-semibold">
                      {exercise.exercise}
                    </TableCell>
                    <TableCell>{exercise.sessions}</TableCell>
                    <TableCell>
                      {displayValue(exercise.completedRepetitions)}
                    </TableCell>
                    <TableCell>{exercise.lastAttempted}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyTableMessage>
              Exercise-level activity is not available for this demo participant.
            </EmptyTableMessage>
          )}
        </DataTableSection>

        <DataTableSection title="Recent Sessions">
          {survivor.recentSessions.length > 0 ? (
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="text-left">
                  <TableHeading>Date</TableHeading>
                  <TableHeading>Exercise</TableHeading>
                  <TableHeading>Status</TableHeading>
                  <TableHeading>Duration</TableHeading>
                  <TableHeading>Completed Reps</TableHeading>
                </tr>
              </thead>

              <tbody>
                {survivor.recentSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-t border-[#EEEAE6]"
                  >
                    <TableCell>{session.date}</TableCell>
                    <TableCell className="font-semibold">
                      {session.exercise}
                    </TableCell>
                    <TableCell>
                      <SurvivorStatusBadge value={session.status} />
                    </TableCell>
                    <TableCell>{displayValue(session.duration)}</TableCell>
                    <TableCell>
                      {displayValue(session.completedRepetitions)}
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyTableMessage>
              Detailed session activity is not available for this demo participant.
            </EmptyTableMessage>
          )}
        </DataTableSection>

        <section className="mt-5 rounded-2xl border border-[#E4DFDB] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#282422]">
            Linking Information
          </h2>

          <div className="mt-5 grid gap-5 border-t border-[#EEEAE6] pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <LinkMetric
              label="Linked Carer"
              value={survivor.linkedCarerName ?? "Not linked"}
              icon
            />
            <LinkMetric
              label="Link Accepted"
              value={survivor.linkAcceptedDate ?? "Not Available"}
            />
            <div>
              <p className="text-sm text-[#77706B]">
                Invitation Status
              </p>
              <div className="mt-2">
                <SurvivorStatusBadge
                  value={survivor.invitationStatus}
                />
              </div>
            </div>
            <LinkMetric
              label="Invitation Sent"
              value={survivor.invitationSentDate ?? "Not Available"}
            />
          </div>

          <div className="mt-6 flex gap-3 rounded-xl border border-[#D9D0F0] bg-[#FAF8FF] p-4 text-sm leading-6 text-[#625A6D]">
            <Info
              size={20}
              className="mt-0.5 shrink-0 text-[#592EBD]"
            />
            <p>
              Links are managed by survivors and carers. Administrators can
              review linking information but cannot create or remove links in
              this prototype version.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}

function SummaryCard({
  survivor,
}: {
  survivor: AdminSurvivorDetail;
}) {
  return (
    <Card title="Summary" icon={UserRound}>
      <Definition label="Participant ID" value={survivor.participantId} />
      <Definition label="Account Status">
        <AccountDot status={survivor.accountStatus} />
      </Definition>
      <Definition label="Onboarding Status">
        <SurvivorStatusBadge value={survivor.onboardingStatus} />
      </Definition>
      <Definition label="Registered On" value={survivor.registeredOn} />
      <Definition label="Last Active" value={survivor.lastActive} />
    </Card>
  );
}

function EngagementCard({
  survivor,
}: {
  survivor: AdminSurvivorDetail;
}) {
  return (
    <Card title="Engagement" icon={BarChart3}>
      <SurvivorStatusBadge value={survivor.engagementStatus} />

      <p className="mt-4 text-sm leading-6 text-[#746D68]">
        Based on recorded platform activity during the recent monitoring
        period. This is not a clinical assessment.
      </p>

      <div className="mt-5 flex h-16 items-end gap-2">
        {[22, 36, 52, 68].map((height, index) => (
          <span
            key={height}
            className={cn(
              "w-4 rounded-t-md",
              index === 3
                ? "bg-[#22A765]"
                : "bg-[#8D72DC]"
            )}
            style={{ height }}
          />
        ))}
      </div>
    </Card>
  );
}

function LinkedCarerCard({
  survivor,
}: {
  survivor: AdminSurvivorDetail;
}) {
  return (
    <Card title="Linked Carer" icon={Link2}>
      {survivor.linkedCarerName ? (
        <>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
              <UserRound size={19} />
            </span>

            <p className="font-semibold text-[#302B28]">
              {survivor.linkedCarerName}
            </p>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#746D68]">
            Link accepted
            <br />
            <span className="font-semibold text-[#3A3532]">
              {survivor.linkAcceptedDate ?? "Not Available"}
            </span>
          </p>

          <Link
            href="/admin/invitations"
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#8E6CDF] text-sm font-semibold text-[#592EBD] transition hover:bg-[#F6F2FF]"
          >
            View Link Details
          </Link>
        </>
      ) : (
        <div className="rounded-xl bg-[#F7F5F3] p-4">
          <p className="font-semibold text-[#3A3532]">
            {survivor.linkStatus}
          </p>
          <p className="mt-2 text-sm leading-5 text-[#746D68]">
            No accepted carer connection is available for this survivor.
          </p>
        </div>
      )}
    </Card>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Activity;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E4DFDB] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon size={19} className="text-[#592EBD]" />
        <h2 className="text-lg font-bold text-[#282422]">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Definition({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-[#77706B]">{label}</span>
      <span className="text-right font-semibold text-[#393432]">
        {children ?? value}
      </span>
    </div>
  );
}

function AccountDot({
  status,
}: {
  status: AdminSurvivorDetail["accountStatus"];
}) {
  const colour =
    status === "Active"
      ? "bg-[#20B26B]"
      : status === "Pending"
        ? "bg-[#F59F24]"
        : "bg-[#A6AFBD]";

  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", colour)} />
      {status}
    </span>
  );
}

function Metric({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string | number | null;
  valueClassName?: string;
}) {
  return (
    <div className="border-l-2 border-[#EEEAE6] pl-4 first:border-l-0 first:pl-0">
      <p className="text-sm text-[#77706B]">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl font-bold text-[#282422]",
          valueClassName
        )}
      >
        {displayValue(value)}
      </p>
    </div>
  );
}

function DataTableSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-[#E4DFDB] bg-white shadow-sm">
      <div className="border-b border-[#EEEAE6] px-6 py-4">
        <h2 className="text-lg font-bold text-[#282422]">{title}</h2>
      </div>

      <div className="overflow-x-auto px-6 py-3">
        {children}
      </div>
    </section>
  );
}

function EmptyTableMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-10 text-center">
      <p className="text-sm text-[#77706B]">{children}</p>
    </div>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-2 py-3 text-sm font-semibold text-[#625C58]">
      {children}
    </th>
  );
}

function TableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "whitespace-nowrap px-2 py-3 text-sm text-[#514B47]",
        className
      )}
    >
      {children}
    </td>
  );
}

function LinkMetric({
  label,
  value,
  icon = false,
}: {
  label: string;
  value: string;
  icon?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-[#77706B]">{label}</p>
      <p className="mt-2 flex items-center gap-2 font-semibold text-[#393432]">
        {icon ? <UserRound size={17} className="text-[#592EBD]" /> : null}
        {value}
      </p>
    </div>
  );
}

function displayValue(
  value: string | number | null
): string | number {
  return value === null || value === ""
    ? "Not Available Yet"
    : value;
}