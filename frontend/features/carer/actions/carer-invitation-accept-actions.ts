"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type AcceptInvitationResult = {
  ok: boolean;
  error?: string;
  next?: string;
};

export type PublicCarerInvitation = {
  invitationId: string;
  inviterName: string;
  inviterEmail: string;
  inviteeEmail: string;
  firstName: string;
  lastName: string;
  phone: string;
  relationship: string;
  customRelationship: string;
  message: string;
  status: string;
  expiresAt: string;
};

type InvitationRpcRow = {
  invitation_id: string;
  inviter_first_name: string | null;
  inviter_last_name: string | null;
  inviter_email: string | null;
  invitee_email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  relationship: string | null;
  custom_relationship: string | null;
  message: string | null;
  status: string;
  expires_at: string;
};

export async function getPublicCarerInvitationByToken(
  token: string,
): Promise<PublicCarerInvitation | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_carer_invitation_by_token",
    { p_token: token },
  );

  if (error) {
    console.error("Failed to load public carer invitation:", error);
    return null;
  }

  const row = Array.isArray(data)
    ? (data[0] as InvitationRpcRow | undefined)
    : (data as InvitationRpcRow | undefined);

  if (!row) return null;

  const inviterName = [row.inviter_first_name, row.inviter_last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    invitationId: row.invitation_id,
    inviterName: inviterName || row.inviter_email || "Your carer",
    inviterEmail: row.inviter_email ?? "",
    inviteeEmail: row.invitee_email,
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    phone: row.phone ?? "",
    relationship: row.relationship ?? "",
    customRelationship: row.custom_relationship ?? "",
    message: row.message ?? "",
    status: row.status,
    expiresAt: row.expires_at,
  };
}

export async function acceptExistingUserInvitationAction(
  token: string,
): Promise<AcceptInvitationResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      error: "Please sign in before accepting this invitation.",
      next: `/auth/login?redirectTo=${encodeURIComponent(
        `/invitations/carer/accept?token=${token}`,
      )}`,
    };
  }

  const { error } = await supabase.rpc(
    "accept_carer_survivor_invitation",
    { p_token: token },
  );

  if (error) {
    console.error("Failed to accept carer invitation:", error);
    return {
      ok: false,
      error: error.message || "This invitation could not be accepted.",
    };
  }

  redirect("/onboarding?linkedCarer=1");
}

export async function createSurvivorFromInvitationAction(input: {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}): Promise<AcceptInvitationResult> {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const acceptPath = `/invitations/carer/accept?token=${encodeURIComponent(input.token)}`;

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${siteUrl.replace(/\/$/, "")}/auth/callback?redirectTo=${encodeURIComponent(acceptPath)}`,
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        display_name: [input.firstName, input.lastName].filter(Boolean).join(" ").trim(),
        phone: input.phone,
        role: "SURVIVOR",
        invitation_token: input.token,
      },
    },
  });

  if (error) {
    console.error("Failed to create survivor from invitation:", error);
    return { ok: false, error: error.message || "Account could not be created." };
  }

  if (!data.session) {
    return {
      ok: true,
      next: `/auth/check-email?email=${encodeURIComponent(input.email)}`,
    };
  }

  const { error: acceptError } = await supabase.rpc(
    "accept_carer_survivor_invitation",
    { p_token: input.token },
  );

  if (acceptError) {
    console.error("Account created but invitation acceptance failed:", acceptError);
    return {
      ok: false,
      error: acceptError.message || "Account was created, but the invitation could not be accepted.",
    };
  }

  redirect("/onboarding?linkedCarer=1");
}
