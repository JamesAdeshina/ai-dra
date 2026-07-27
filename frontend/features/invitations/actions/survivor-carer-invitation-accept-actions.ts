"use server";

import { createClient } from "@/lib/supabase/server";

export type SurvivorCarerInvitationState = {
  invitationId: string;
  survivorUserId: string;
  survivorEmail: string;
  survivorName: string;
  inviteeEmail: string;
  carerFirstName: string;
  carerLastName: string;
  phone: string;
  relationship: string;
  message: string;
  status: string;
  expiresAt: string;
  accountExists: boolean;
  accountUserId: string | null;
  currentUserId: string | null;
  currentUserEmail: string | null;
  currentUserMatchesInvite: boolean;
};

type InvitationStateRpcRow = {
  invitation_id: string;
  survivor_user_id: string;
  survivor_email: string | null;
  survivor_name: string | null;
  invitee_email: string;
  carer_first_name: string | null;
  carer_last_name: string | null;
  phone: string | null;
  relationship: string | null;
  message: string | null;
  status: string;
  expires_at: string;
  account_exists: boolean;
  account_user_id: string | null;
  current_user_id: string | null;
  current_user_email: string | null;
  current_user_matches_invite: boolean;
};

export type InvitationActionResult = {
  ok: boolean;
  error?: string;
  next?: string;
};

export async function getSurvivorCarerInvitationState(
  token: string,
): Promise<SurvivorCarerInvitationState | null> {
  if (!token?.trim()) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_survivor_carer_invitation_state",
    {
      p_token: token,
    },
  );

  if (error) {
    console.error(
      "Failed to load survivor carer invitation state:",
      error,
    );

    return null;
  }

  const row = Array.isArray(data)
    ? (data[0] as InvitationStateRpcRow | undefined)
    : (data as InvitationStateRpcRow | undefined);

  if (!row) {
    return null;
  }

  return {
    invitationId: row.invitation_id,
    survivorUserId: row.survivor_user_id,
    survivorEmail: row.survivor_email ?? "",
    survivorName:
      row.survivor_name ?? "AI-DRA survivor",
    inviteeEmail: row.invitee_email,
    carerFirstName: row.carer_first_name ?? "",
    carerLastName: row.carer_last_name ?? "",
    phone: row.phone ?? "",
    relationship: row.relationship ?? "",
    message: row.message ?? "",
    status: row.status,
    expiresAt: row.expires_at,
    accountExists: row.account_exists,
    accountUserId: row.account_user_id,
    currentUserId: row.current_user_id,
    currentUserEmail: row.current_user_email,
    currentUserMatchesInvite:
      row.current_user_matches_invite,
  };
}

export async function acceptSurvivorCarerInvitationAction(
  token: string,
): Promise<InvitationActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.rpc(
    "accept_survivor_carer_invitation_by_token",
    {
      p_token: token,
    },
  );

  if (error) {
    console.error(
      "Failed to accept survivor carer invitation:",
      error,
    );

    return {
      ok: false,
      error:
        error.message ||
        "The invitation could not be accepted.",
    };
  }

  return {
    ok: true,
    next: "/carer/dashboard",
  };
}

export async function declineSurvivorCarerInvitationAction(
  token: string,
): Promise<InvitationActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.rpc(
    "decline_survivor_carer_invitation_by_token",
    {
      p_token: token,
    },
  );

  if (error) {
    console.error(
      "Failed to decline survivor carer invitation:",
      error,
    );

    return {
      ok: false,
      error:
        error.message ||
        "The invitation could not be declined.",
    };
  }

  return {
    ok: true,
    next: "/carer/invitations/manage",
  };
}
