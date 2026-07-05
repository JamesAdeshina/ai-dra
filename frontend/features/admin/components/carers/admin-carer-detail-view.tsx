import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Info,
  Link2,
  Send,
  Settings,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

import type {
  AdminCarerActivityRecord,
  AdminCarerActivityType,
  AdminCarerDetail,
} from "@/features/admin/types/admin-carer";
import { cn } from "@/lib/utils";

import { CarerStatusBadge } from "./carer-status-badge";

type AdminCarerDetailViewProps = {
  carer: AdminCarerDetail;
};

export function AdminCarerDetailView({
  carer,
}: AdminCarerDetailViewProps) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1300px]">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/carers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#592EBD] hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Carers
          </Link>

          <Link
            href="/admin/carers"
            aria-label="Close carer details"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#4D4743] transition hover:bg-[#EEE8FF] hover:text-[#592EBD]"
          >
            <X size={23} />
          </Link>
        </div>

        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#592EBD] text-3xl font-bold text-white shadow-lg shadow-[#592EBD]/20">
            {carer.initials}
          </span>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-[#201D1B]">
                {carer.name}
              </h1>

              <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                Demo dataset
              </span>
            </div>

            <p className="mt-1 text-lg text-[#68615D]">
              {carer.email}
            </p>

            <div className="mt-3">
              <CarerStatusBadge value={carer.status} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 border-y border-[#E9E5E1] py-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProfileMetric
            label="Registered On"
            value={carer.registeredOn}
          />

          <ProfileMetric
            label="Last Active"
            value={carer.lastActiveDetailed}
          />

          <ProfileMetric
            label="Linked Survivors"
            value={String(carer.linkedSurvivors)}
          />

          <ProfileMetric
            label="Pending Invitations"
            value={String(carer.pendingInvitations)}
          />
        </div>

        <DetailSection title="Linked Survivors">
          {carer.linkedSurvivorRecords.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] border-collapse">
                  <thead>
                    <tr className="text-left">
                      <TableHeading>Participant ID</TableHeading>
                      <TableHeading>Link Status</TableHeading>
                      <TableHeading>Sessions</TableHeading>
                      <TableHeading>Last Active</TableHeading>
                    </tr>
                  </thead>

                  <tbody>
                    {carer.linkedSurvivorRecords.map((survivor) => (
                      <tr
                        key={survivor.id}
                        className="border-t border-[#EEEAE6]"
                      >
                        <TableCell className="font-semibold">
                          <Link
                            href={`/admin/survivors/${survivor.participantId.toLowerCase()}`}
                            className="text-[#302B28] hover:text-[#592EBD]"
                          >
                            {survivor.participantId}
                          </Link>
                        </TableCell>

                        <TableCell>
                          <CarerStatusBadge value="Accepted Link" />
                        </TableCell>

                        <TableCell>
                          {survivor.sessions ?? "Not Available"}
                        </TableCell>

                        <TableCell>{survivor.lastActive}</TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <SectionLink href="/admin/survivors">
                View all linked survivors
              </SectionLink>
            </>
          ) : (
            <EmptySection>
              Detailed linked-survivor records are not available for this
              demo carer.
            </EmptySection>
          )}
        </DetailSection>

        <DetailSection title="Invitations">
          {carer.invitationRecords.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse">
                  <thead>
                    <tr className="text-left">
                      <TableHeading>Recipient</TableHeading>
                      <TableHeading>Sent Date</TableHeading>
                      <TableHeading>Status</TableHeading>
                      <TableHeading>Last Updated</TableHeading>
                    </tr>
                  </thead>

                  <tbody>
                    {carer.invitationRecords.map((invitation) => (
                      <tr
                        key={invitation.id}
                        className="border-t border-[#EEEAE6]"
                      >
                        <TableCell className="font-semibold">
                          {invitation.recipientParticipantId}
                        </TableCell>

                        <TableCell>{invitation.sentDate}</TableCell>

                        <TableCell>
                          <CarerStatusBadge
                            value={invitation.status}
                          />
                        </TableCell>

                        <TableCell>
                          {invitation.lastUpdated}
                        </TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <SectionLink href="/admin/invitations">
                View all invitations
              </SectionLink>
            </>
          ) : (
            <EmptySection>
              Detailed invitation records are not available for this demo
              carer.
            </EmptySection>
          )}
        </DetailSection>

        <DetailSection title="Recent Activity">
          {carer.recentActivity.length > 0 ? (
            <>
              <div className="divide-y divide-[#EEEAE6]">
                {carer.recentActivity.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                  />
                ))}
              </div>

              <SectionLink href="/admin/notifications">
                View all activity
              </SectionLink>
            </>
          ) : (
            <EmptySection>
              Detailed activity records are not available for this demo
              carer.
            </EmptySection>
          )}
        </DetailSection>

        <div className="mt-5 flex gap-3 rounded-2xl border border-[#D9D0F0] bg-[#FAF8FF] p-5 text-sm leading-6 text-[#625A6D]">
          <Info
            size={21}
            className="mt-0.5 shrink-0 text-[#592EBD]"
          />

          <div>
            <h2 className="font-semibold text-[#39314A]">
              Viewing Information Only
            </h2>

            <p className="mt-1">
              Administrators have view-only access to monitor engagement
              and platform activity. Administrators cannot impersonate
              carers, read private messages or alter survivor
              rehabilitation data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-l border-[#E9E5E1] pl-5 first:border-l-0 first:pl-0">
      <p className="text-sm text-[#77706B]">{label}</p>
      <p className="mt-2 text-lg font-bold text-[#282422]">
        {value}
      </p>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-5 rounded-2xl border border-[#E4DFDB] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#282422]">{title}</h2>

      <div className="mt-5">{children}</div>
    </section>
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
  className,
}: {
  children: ReactNode;
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

function SectionLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-[#592EBD] hover:underline"
    >
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}

function EmptySection({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#CEC7C2] bg-[#FCFBFA] px-5 py-8 text-center">
      <p className="text-sm text-[#77706B]">{children}</p>
    </div>
  );
}

const activityIconMap = {
  "Progress Viewed": Eye,
  "Invitation Sent": Send,
  "Link Accepted": Link2,
  "Settings Updated": Settings,
} satisfies Record<
  AdminCarerActivityType,
  typeof Eye
>;

const activityToneMap = {
  "Progress Viewed": "bg-[#EEE8FF] text-[#592EBD]",
  "Invitation Sent": "bg-[#EEE8FF] text-[#592EBD]",
  "Link Accepted": "bg-[#E6F7EF] text-[#20A663]",
  "Settings Updated": "bg-[#EEE8FF] text-[#592EBD]",
} satisfies Record<AdminCarerActivityType, string>;

function ActivityItem({
  activity,
}: {
  activity: AdminCarerActivityRecord;
}) {
  const Icon = activityIconMap[activity.type];

  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            activityToneMap[activity.type]
          )}
        >
          <Icon size={17} />
        </span>

        <p className="text-sm font-medium text-[#403A36]">
          {activity.description}
        </p>
      </div>

      <p className="text-sm text-[#77706B]">{activity.date}</p>
    </div>
  );
}