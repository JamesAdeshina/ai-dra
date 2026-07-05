import {
  Ban,
  CheckCircle2,
  CircleX,
  Clock3,
  Hourglass,
  Info,
  Mail,
  MailCheck,
  MailX,
  Send,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  AdminInvitation,
  AdminInvitationTimelineType,
} from "@/features/admin/types/admin-invitation";
import { cn } from "@/lib/utils";

import {
  InvitationDeliveryBadge,
  InvitationStatusBadge,
} from "./invitation-status-badge";

type InvitationDetailPanelProps = {
  invitation: AdminInvitation | null;
  invitations: AdminInvitation[];
};

export function InvitationDetailPanel({
  invitation,
  invitations,
}: InvitationDetailPanelProps) {
  if (!invitation) {
    return (
      <aside className="rounded-2xl border border-dashed border-[#CEC7C2] bg-white p-8 text-center">
        <Mail size={28} className="mx-auto text-[#8A837E]" />

        <h2 className="mt-4 font-semibold text-[#302B28]">
          No invitation selected
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#77706B]">
          Select an invitation to review its monitoring details.
        </p>
      </aside>
    );
  }

  const total = invitations.length;

  const accepted = invitations.filter(
    (item) => item.status === "Accepted"
  ).length;

  const declined = invitations.filter(
    (item) => item.status === "Declined"
  ).length;

  const expired = invitations.filter(
    (item) => item.status === "Expired"
  ).length;

  const delivered = invitations.filter(
    (item) => item.deliveryStatus === "Delivered"
  ).length;

  const failed = invitations.filter(
    (item) => item.deliveryStatus === "Failed"
  ).length;

  const deliveryAttempts = delivered + failed;

  return (
    <aside className="space-y-5 xl:sticky xl:top-[118px]">
      <section className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-[#282422]">
          Invitation Details
        </h2>

        <div className="mt-5 flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
            <Mail size={21} />
          </span>

          <div>
            <p className="text-xs text-[#77706B]">Invitation ID</p>

            <p className="mt-1 font-bold text-[#282422]">
              {invitation.invitationId}
            </p>

            <div className="mt-2">
              <InvitationStatusBadge status={invitation.status} />
            </div>
          </div>
        </div>

        <dl className="mt-6 space-y-4">
          <DetailRow label="Sent By">
            <p className="font-semibold text-[#393432]">
              {invitation.senderName}
            </p>

            <p className="mt-0.5 break-all text-xs text-[#77706B]">
              {invitation.senderEmail}
            </p>
          </DetailRow>

          <DetailRow label="Recipient Email">
            <span className="break-all font-semibold text-[#393432]">
              {invitation.recipientEmail}
            </span>
          </DetailRow>

          <DetailRow label="Survivor ID">
            <span className="font-semibold text-[#393432]">
              {invitation.survivorId}
            </span>
          </DetailRow>

          <DetailRow label="Date Sent">
            <span className="font-semibold text-[#393432]">
              {invitation.dateSent}, {invitation.timeSent}
            </span>
          </DetailRow>

          <DetailRow label="Status">
            <InvitationStatusBadge status={invitation.status} />
          </DetailRow>

          <DetailRow label="Last Updated">
            <span className="font-semibold text-[#393432]">
              {invitation.lastUpdated}
            </span>
          </DetailRow>

          <DetailRow label="Email Delivery">
            <InvitationDeliveryBadge
              status={invitation.deliveryStatus}
            />
          </DetailRow>

          <DetailRow label="Expires On">
            <span className="font-semibold text-[#393432]">
              {invitation.expiresOn}
            </span>
          </DetailRow>
        </dl>
      </section>

      <section className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-[#282422]">
          Timeline
        </h2>

        <div className="mt-5">
          {invitation.timeline.map((event, index) => {
            const Icon = timelineIcons[event.type];
            const isLast =
              index === invitation.timeline.length - 1;

            return (
              <div
                key={event.id}
                className="relative flex gap-3 pb-6 last:pb-0"
              >
                {!isLast ? (
                  <span className="absolute left-[15px] top-8 h-[calc(100%-18px)] w-px bg-[#E4DFDB]" />
                ) : null}

                <span
                  className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    timelineToneClasses[event.type]
                  )}
                >
                  <Icon size={15} />
                </span>

                <div className="pt-0.5">
                  <p className="text-sm font-semibold text-[#332E2B]">
                    {event.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#77706B]">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-[#282422]">
          Quick Stats
        </h2>

        <div className="mt-5 space-y-4">
          <StatRow
            label="Average response time"
            value="Requires Data"
          />

          <StatRow
            label="Acceptance rate"
            value={formatPercentage(accepted, total)}
          />

          <StatRow
            label="Decline rate"
            value={formatPercentage(declined, total)}
          />

          <StatRow
            label="Expired rate"
            value={formatPercentage(expired, total)}
          />

          <StatRow
            label="Delivery success rate"
            value={formatPercentage(delivered, deliveryAttempts)}
          />
        </div>

        <p className="mt-4 text-xs leading-5 text-[#817A75]">
          Calculated from the current demo dataset only.
        </p>
      </section>

      <section className="flex gap-3 rounded-2xl border border-[#D9D0F0] bg-[#FAF8FF] p-5">
        <Info
          size={20}
          className="mt-0.5 shrink-0 text-[#592EBD]"
        />

        <div>
          <h2 className="text-sm font-semibold text-[#39314A]">
            Read-only view
          </h2>

          <p className="mt-1 text-xs leading-5 text-[#625A6D]">
            Invitation actions such as resend and cancel are not
            available in this admin prototype. This page is for
            monitoring purposes only.
          </p>
        </div>
      </section>
    </aside>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 text-sm sm:grid-cols-[105px_minmax(0,1fr)]">
      <dt className="text-[#77706B]">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-[#77706B]">{label}</span>

      <span className="text-right font-semibold text-[#393432]">
        {value}
      </span>
    </div>
  );
}

const timelineIcons: Record<
  AdminInvitationTimelineType,
  LucideIcon
> = {
  Sent: Send,
  Delivered: MailCheck,
  "Delivery Failed": MailX,
  "Awaiting Response": Clock3,
  Accepted: CheckCircle2,
  Declined: CircleX,
  Cancelled: Ban,
  Expired: Hourglass,
};

const timelineToneClasses: Record<
  AdminInvitationTimelineType,
  string
> = {
  Sent: "bg-[#EEE8FF] text-[#592EBD]",
  Delivered: "bg-[#E6F7EF] text-[#20A663]",
  "Delivery Failed": "bg-[#FFE7E7] text-[#F23636]",
  "Awaiting Response": "bg-[#EEF1F5] text-[#7A8494]",
  Accepted: "bg-[#E6F7EF] text-[#20A663]",
  Declined: "bg-[#FFE7E7] text-[#F23636]",
  Cancelled: "bg-[#EEF1F5] text-[#7A8494]",
  Expired: "bg-[#FFF4DD] text-[#E99A17]",
};

function formatPercentage(
  value: number,
  total: number
): string {
  if (total === 0) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}