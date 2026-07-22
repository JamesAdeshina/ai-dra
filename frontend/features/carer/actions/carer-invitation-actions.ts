"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import {
  sendCarerInvitationEmail,
  type CarerInvitationEmailInput,
} from "@/features/carer/services/carer-invitation-email";

type CreateCarerInvitationInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  customRelationship: string;
  message: string;
};

type ActionResult = {
  ok: boolean;
  invitationId?: string;
  warning?: string;
  error?: string;
};

type RpcInvitationResult = {
  invitation_id: string;
  invitation_token: string;
  invitation_email: string;
};

type InvitationEmailRow = {
  id: string;
  invitee_email: string;
  survivor_email: string | null;
  first_name: string | null;
  last_name: string | null;
  relationship: string | null;
  custom_relationship: string | null;
  message: string | null;
  token: string | null;
  expires_at: string;
  status: string;
};

export async function createCarerInvitationAction(
  input: CreateCarerInvitationInput,
): Promise<ActionResult> {
  const supabase = await createClient();

  const relationship =
    input.customRelationship?.trim() ||
    input.relationship?.trim();

  const { data, error } = await supabase.rpc(
    "create_carer_survivor_invitation",
    {
      p_first_name: input.firstName,
      p_last_name: input.lastName,
      p_email: input.email,
      p_phone: input.phone,
      p_relationship: relationship,
      p_message: input.message,
    },
  );

  if (error) {
    console.error(
      "Failed to create carer invitation:",
      error,
    );

    return {
      ok: false,
      error:
        error.message ||
        "Invitation could not be created.",
    };
  }

  const invitation =
    Array.isArray(data)
      ? (data[0] as RpcInvitationResult | undefined)
      : (data as RpcInvitationResult | undefined);

  if (!invitation) {
    return {
      ok: false,
      error:
        "Invitation was created but no invitation details were returned.",
    };
  }

  const inviteUrl = await buildInvitationUrl(
    invitation.invitation_token,
  );

  const emailResult =
    await sendCarerInvitationEmail({
      to: invitation.invitation_email,
      firstName: input.firstName,
      lastName: input.lastName,
      relationship,
      message: input.message,
      inviteUrl,
      expiresInDays: 14,
    });

  if (!emailResult.ok) {
    console.error(
      "Invitation created but email failed:",
      emailResult.error,
    );

    revalidateInvitationPaths();

    return {
      ok: true,
      invitationId:
        invitation.invitation_id,
      warning:
        "Invitation was saved, but the email could not be sent. Check the Resend API key and domain settings.",
    };
  }

  revalidateInvitationPaths();

  return {
    ok: true,
    invitationId:
      invitation.invitation_id,
  };
}

export async function resendCarerInvitationAction(
  invitationId: string,
): Promise<ActionResult> {
  const cleanInvitationId =
    invitationId.trim();

  if (!cleanInvitationId) {
    return {
      ok: false,
      error:
        "Invitation ID is required.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      error:
        "You must be signed in to resend an invitation.",
    };
  }

  const { data, error } = await supabase
    .from("carer_invitations")
    .select(
      `
        id,
        invitee_email,
        survivor_email,
        first_name,
        last_name,
        relationship,
        custom_relationship,
        message,
        token,
        expires_at,
        status
      `,
    )
    .eq("id", cleanInvitationId)
    .eq("inviter_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to load invitation for resend:",
      error,
    );

    return {
      ok: false,
      error:
        "Invitation could not be loaded.",
    };
  }

  if (!data) {
    return {
      ok: false,
      error:
        "Invitation was not found.",
    };
  }

  const invitation =
    data as InvitationEmailRow;

  if (invitation.status !== "PENDING") {
    return {
      ok: false,
      error:
        "Only pending invitations can be resent.",
    };
  }

  if (!invitation.token) {
    return {
      ok: false,
      error:
        "This invitation does not have a token and cannot be resent.",
    };
  }

  const inviteUrl = await buildInvitationUrl(
    invitation.token,
  );

  const emailResult =
    await sendCarerInvitationEmail({
      to:
        invitation.invitee_email ||
        invitation.survivor_email ||
        "",
      firstName:
        invitation.first_name ?? "",
      lastName:
        invitation.last_name ?? "",
      relationship:
        invitation.custom_relationship ||
        invitation.relationship ||
        "",
      message:
        invitation.message ?? "",
      inviteUrl,
      expiresInDays: 14,
    });

  if (!emailResult.ok) {
    console.error(
      "Failed to resend invitation email:",
      emailResult.error,
    );

    return {
      ok: false,
      error:
        "Invitation could not be resent by email.",
    };
  }

  const { error: updateError } =
    await supabase
      .from("carer_invitations")
      .update({
        last_resent_at:
          new Date().toISOString(),
        sent_at:
          new Date().toISOString(),
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", cleanInvitationId)
      .eq("inviter_id", user.id);

  if (updateError) {
    console.error(
      "Invitation email resent but timestamp update failed:",
      updateError,
    );
  }

  revalidateInvitationPaths();

  return {
    ok: true,
    invitationId:
      cleanInvitationId,
  };
}

export async function cancelCarerInvitationAction(
  invitationId: string,
): Promise<ActionResult> {
  const cleanInvitationId =
    invitationId.trim();

  if (!cleanInvitationId) {
    return {
      ok: false,
      error:
        "Invitation ID is required.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      error:
        "You must be signed in to cancel an invitation.",
    };
  }

  const { error } = await supabase
    .from("carer_invitations")
    .update({
      status: "CANCELLED",
      cancelled_at:
        new Date().toISOString(),
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", cleanInvitationId)
    .eq("inviter_id", user.id)
    .eq("status", "PENDING");

  if (error) {
    console.error(
      "Failed to cancel invitation:",
      error,
    );

    return {
      ok: false,
      error:
        error.message ||
        "Invitation could not be cancelled.",
    };
  }

  revalidateInvitationPaths();

  return {
    ok: true,
    invitationId:
      cleanInvitationId,
  };
}

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

async function buildInvitationUrl(token: string) {
  const siteUrl = await getSiteUrl();

  return `${siteUrl}/invitations/carer/accept?token=${encodeURIComponent(
    token,
  )}`;
}

function revalidateInvitationPaths() {
  revalidatePath("/carer/invitations");
  revalidatePath(
    "/carer/invitations/send",
  );
  revalidatePath(
    "/carer/invitations/pending",
  );
  revalidatePath(
    "/carer/invitations/manage",
  );
}