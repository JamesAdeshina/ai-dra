"use server";

import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";

async function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const headerStore = await headers();

  const host =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host");

  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (host?.includes("localhost")
      ? "http"
      : "https");

  if (host) {
    return `${protocol}://${host}`.replace(
      /\/$/,
      "",
    );
  }

  return "https://www.ai-dra.co.uk";
}

export type InvitationSuccessState = {
  invitationId: string;
  inviteeEmail: string;
  firstName: string;
  lastName: string;
  phone: string;
  relationship: string;
  customRelationship: string;
  message: string;
  status: string;
  expiresAt: string;
  accountExists: boolean;
  inviterName: string;
  inviterEmail: string;
  accepted: boolean;
};

type InvitationStateRpcRow = {
  invitation_id: string;
  invitee_email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  relationship: string | null;
  custom_relationship: string | null;
  message: string | null;
  status: string;
  expires_at: string;
  account_exists: boolean;
  account_user_id: string | null;
  inviter_name: string;
  inviter_email: string;
};

export type SetInvitationPasswordResult = {
  ok: boolean;
  error?: string;
  next?: string;
};

export async function getInvitationSuccessState(
  token: string,
): Promise<InvitationSuccessState | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_carer_invitation_success_state",
    {
      p_token: token,
    },
  );

  if (error) {
    console.error(
      "Failed to load invitation success state:",
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

  let accepted =
    row.status === "ACCEPTED";

  if (
    row.account_exists &&
    row.status === "PENDING" &&
    new Date(row.expires_at).getTime() >= Date.now()
  ) {
    const { error: acceptError } =
      await supabase.rpc(
        "accept_existing_carer_invitation_by_token",
        {
          p_token: token,
        },
      );

    if (acceptError) {
      console.error(
        "Failed to auto-accept existing invitation:",
        acceptError,
      );
    } else {
      accepted = true;
    }
  }

  return {
    invitationId: row.invitation_id,
    inviteeEmail: row.invitee_email,
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    phone: row.phone ?? "",
    relationship: row.relationship ?? "",
    customRelationship:
      row.custom_relationship ?? "",
    message: row.message ?? "",
    status: accepted ? "ACCEPTED" : row.status,
    expiresAt: row.expires_at,
    accountExists: row.account_exists,
    inviterName: row.inviter_name,
    inviterEmail: row.inviter_email,
    accepted,
  };
}

export async function setPasswordForInvitedSurvivorAction(
  input: {
    token: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
  },
): Promise<SetInvitationPasswordResult> {
  const supabase = await createClient();

  const siteUrl = await getSiteUrl();

  const redirectTo = `${siteUrl}/auth/callback?next=${encodeURIComponent(
    "/auth/login",
  )}`;

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        display_name: [
          input.firstName,
          input.lastName,
        ]
          .filter(Boolean)
          .join(" ")
          .trim(),
        phone: input.phone,
        role: "SURVIVOR",
        invitation_token: input.token,
      },
    },
  });

  if (error) {
    console.error(
      "Failed to create invited survivor account:",
      error,
    );

    return {
      ok: false,
      error:
        error.message ||
        "Password could not be set.",
    };
  }

  const { error: acceptError } =
    await supabase.rpc(
      "accept_existing_carer_invitation_by_token",
      {
        p_token: input.token,
      },
    );

  if (acceptError) {
    console.error(
      "Account created but invitation could not be accepted:",
      acceptError,
    );

    return {
      ok: false,
      error:
        acceptError.message ||
        "Account was created, but the carer link could not be completed.",
    };
  }

  if (!data.session) {
    return {
      ok: true,
      next: `/auth/login?email=${encodeURIComponent(
        input.email,
      )}`,
    };
  }

  return {
    ok: true,
    next: "/onboarding?linkedCarer=1",
  };
}