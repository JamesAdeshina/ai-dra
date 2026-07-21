import { createClient } from "@/lib/supabase/server";

import type { PendingCarerInvitation } from "@/features/carer/types/carer-invitation";
import type { LinkedSurvivorRecord } from "@/features/carer/types/linked-survivor";

type InvitationRow = {
  id: string;
  survivor_user_id: string | null;
  invitee_email: string;
  survivor_email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  relationship: string | null;
  custom_relationship: string | null;
  message: string | null;
  status: string;
  sent_at: string | null;
  last_resent_at: string | null;
  expires_at: string;
  accepted_at: string | null;
  cancelled_at: string | null;
  created_at: string;
};

type LinkedSurvivorRow = {
  relationship_id: string;
  survivor_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  linked_at: string;
  permissions: Record<string, boolean> | null;
};

type PendingInvitationWithId = PendingCarerInvitation & {
  id: string;
  status: "PENDING";
};

const INVITATION_SELECT = `
  id,
  survivor_user_id,
  invitee_email,
  survivor_email,
  first_name,
  last_name,
  phone,
  relationship,
  custom_relationship,
  message,
  status,
  sent_at,
  last_resent_at,
  expires_at,
  accepted_at,
  cancelled_at,
  created_at
`;

export async function getLatestPendingCarerInvitation(): Promise<PendingInvitationWithId | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("carer_invitations")
    .select(INVITATION_SELECT)
    .eq("status", "PENDING")
    .order("sent_at", {
      ascending: false,
      nullsFirst: false,
    })
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to load pending carer invitation:",
      error,
    );

    return null;
  }

  return data
    ? mapPendingInvitation(data as InvitationRow)
    : null;
}

export async function getPendingCarerInvitationById(
  invitationId?: string,
): Promise<PendingInvitationWithId | null> {
  if (!invitationId) {
    return getLatestPendingCarerInvitation();
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("carer_invitations")
    .select(INVITATION_SELECT)
    .eq("id", invitationId)
    .eq("status", "PENDING")
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to load selected carer invitation:",
      error,
    );

    return null;
  }

  return data
    ? mapPendingInvitation(data as InvitationRow)
    : null;
}

export async function getManageLinkedSurvivorRecords(): Promise<LinkedSurvivorRecord[]> {
  const [linkedSurvivors, invitations] =
    await Promise.all([
      getAcceptedLinkedSurvivorRecords(),
      getInvitationRecords(),
    ]);

  return [...linkedSurvivors, ...invitations];
}

async function getAcceptedLinkedSurvivorRecords(): Promise<LinkedSurvivorRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_my_linked_survivors_for_carer",
  );

  if (error) {
    console.error(
      "Failed to load accepted linked survivors:",
      error,
    );

    return [];
  }

  return ((data ?? []) as LinkedSurvivorRow[]).map(
    (row) => {
      const name = getName({
        firstName: row.first_name,
        lastName: row.last_name,
        fallback:
          row.email ?? "Linked Survivor",
      });

      return {
        id: row.relationship_id,
        survivorId: row.survivor_id,
        name,
        initials: getInitials(name),
        avatarUrl: undefined,
        age: 0,
        conditionLabel: "Stroke Survivor",
        joinedAtLabel: formatDate(row.linked_at),
        linkedAtLabel: formatDate(row.linked_at),
        email:
          row.email ?? "No email available",
        status: "ACCEPTED",
      };
    },
  );
}

async function getInvitationRecords(): Promise<LinkedSurvivorRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("carer_invitations")
    .select(INVITATION_SELECT)
    .in("status", [
      "PENDING",
      "CANCELLED",
      "EXPIRED",
    ])
    .order("sent_at", {
      ascending: false,
      nullsFirst: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load carer invitations:",
      error,
    );

    return [];
  }

  return ((data ?? []) as InvitationRow[]).map(
    (row) => {
      const email =
        row.survivor_email ??
        row.invitee_email;

      const name = getName({
        firstName: row.first_name,
        lastName: row.last_name,
        fallback: email,
      });

      return {
        id: row.id,
        survivorId:
          row.survivor_user_id ?? undefined,
        name,
        initials: getInitials(name),
        avatarUrl: undefined,
        age: 0,
        conditionLabel: "Stroke Survivor",
        joinedAtLabel: formatDate(
          row.sent_at ?? row.created_at,
        ),
        linkedAtLabel: undefined,
        email,
        status:
          row.status === "PENDING"
            ? "PENDING"
            : "EXPIRED",
      };
    },
  );
}

function mapPendingInvitation(
  row: InvitationRow,
): PendingInvitationWithId {
  const email =
    row.survivor_email ??
    row.invitee_email;

  return {
    id: row.id,
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    email,
    phone: row.phone ?? "",
    relationship:
      row.relationship ?? "OTHER",
    customRelationship:
      row.custom_relationship ?? "",
    message: row.message ?? "",
    sentAt:
      row.sent_at ??
      row.created_at ??
      new Date().toISOString(),
    expiresAt:
      row.expires_at ??
      new Date(
        Date.now() + 14 * 86400000,
      ).toISOString(),
    status: "PENDING",
  };
}

function getName({
  firstName,
  lastName,
  fallback,
}: {
  firstName: string | null;
  lastName: string | null;
  fallback: string;
}) {
  const name = [firstName, lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || fallback;
}

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) =>
        part.charAt(0).toUpperCase(),
      )
      .join("")
      .slice(0, 2) || "LS"
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}