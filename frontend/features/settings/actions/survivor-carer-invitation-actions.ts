"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";

type SurvivorCarerInvitationInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  message: string;
};

type ActionResult = {
  ok: boolean;
  invitationId?: string;
  warning?: string;
  error?: string;
};

type SurvivorProfile = {
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
};

const INVITATION_EXPIRY_DAYS = 14;

export async function createSurvivorCarerInvitationAction(
  input: SurvivorCarerInvitationInput,
): Promise<ActionResult> {
  const carerEmail = input.email.trim().toLowerCase();

  if (!carerEmail) {
    return {
      ok: false,
      error: "Carer email address is required.",
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
      error: "You must be signed in to invite a carer.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, display_name")
    .eq("id", user.id)
    .maybeSingle();

  const survivorName = getSurvivorName(
    profile as SurvivorProfile | null,
    user.email ?? "AI-DRA survivor",
  );

  const token = crypto.randomUUID();
  const expiresAt = new Date(
    Date.now() +
      INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: invitation, error: insertError } =
    await supabase
      .from("carer_invitations")
      .insert({
        inviter_id: user.id,
        invitee_email: carerEmail,
        intended_role: "CARER",
        token_hash: token,
        status: "PENDING",
        message: input.message.trim() || null,
        survivor_user_id: user.id,
        survivor_email: user.email ?? null,
        first_name: input.firstName.trim() || null,
        last_name: input.lastName.trim() || null,
        phone: input.phone.trim() || null,
        relationship:
          input.relationship.trim() || "Carer",
        custom_relationship:
          input.relationship.trim() || null,
        token,
        sent_at: new Date().toISOString(),
        expires_at: expiresAt,
      })
      .select("id")
      .single();

  if (insertError) {
    console.error(
      "Failed to create survivor carer invitation:",
      insertError,
    );

    return {
      ok: false,
      error:
        insertError.message ||
        "The carer invitation could not be created.",
    };
  }

  const invitationId = invitation.id as string;
  const siteUrl = await getSiteUrl();

  const inviteUrl = `${siteUrl}/invitations/survivor/accept?token=${encodeURIComponent(
    token,
  )}`;

  const emailResult =
    await sendSurvivorCarerInvitationEmail({
      to: carerEmail,
      carerFirstName: input.firstName,
      carerLastName: input.lastName,
      survivorName,
      relationship: input.relationship,
      message: input.message,
      inviteUrl,
      expiresInDays: INVITATION_EXPIRY_DAYS,
    });

  revalidateLinkedCarerPaths();

  if (!emailResult.ok) {
    console.error(
      "Survivor carer invitation created but email failed:",
      emailResult.error,
    );

    return {
      ok: true,
      invitationId,
      warning:
        emailResult.error ||
        "The invitation was saved, but the email could not be sent.",
    };
  }

  return {
    ok: true,
    invitationId,
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

function getSurvivorName(
  profile: SurvivorProfile | null,
  fallback: string,
) {
  const displayName =
    profile?.display_name?.trim();

  if (displayName) {
    return displayName;
  }

  const fullName = [
    profile?.first_name,
    profile?.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || fallback;
}

function revalidateLinkedCarerPaths() {
  revalidatePath("/settings");
  revalidatePath("/settings/linked-carer");
  revalidatePath("/dashboard");
}

type EmailResult = {
  ok: boolean;
  error?: string;
};

type SurvivorCarerInvitationEmailInput = {
  to: string;
  carerFirstName: string;
  carerLastName: string;
  survivorName: string;
  relationship: string;
  message: string;
  inviteUrl: string;
  expiresInDays: number;
};

async function sendSurvivorCarerInvitationEmail({
  to,
  carerFirstName,
  carerLastName,
  survivorName,
  relationship,
  message,
  inviteUrl,
  expiresInDays,
}: SurvivorCarerInvitationEmailInput): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "AI-DRA <no-reply@mail.ai-dra.co.uk>";

  if (!apiKey) {
    return {
      ok: false,
      error: "RESEND_API_KEY is missing.",
    };
  }

  const carerName = [
    carerFirstName,
    carerLastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const greeting = carerName
    ? `Hi ${escapeHtml(carerFirstName || carerName)},`
    : "Hi,";

  const relationshipLine = relationship?.trim()
    ? `<p style="margin:0 0 16px;color:#4b5563;">Relationship: <strong>${escapeHtml(
        relationship,
      )}</strong>.</p>`
    : "";

  const messageBlock = message?.trim()
    ? `
      <div style="margin:24px 0;padding:16px;border-radius:12px;background:#f6f1ff;color:#3f2a68;">
        <p style="margin:0 0 8px;font-weight:700;">Message from ${escapeHtml(
          survivorName,
        )}</p>
        <p style="margin:0;line-height:1.6;">${escapeHtml(
          message,
        )}</p>
      </div>
    `
    : "";

  const html = `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#f7f5f2;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f7f5f2;padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;">
                <tr>
                  <td style="padding:28px 28px 16px;">
                    <p style="margin:0;color:#592EBD;font-size:14px;font-weight:700;">AI-DRA</p>
                    <h1 style="margin:10px 0 8px;color:#1f2937;font-size:26px;line-height:1.25;">You have been invited to support a survivor on AI-DRA</h1>
                    <p style="margin:0;color:#6b7280;line-height:1.6;">AI-DRA helps survivors and carers stay connected during rehabilitation.</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 28px 28px;">
                    <p style="margin:0 0 16px;color:#374151;">${greeting}</p>
                    <p style="margin:0 0 16px;color:#4b5563;line-height:1.6;"><strong>${escapeHtml(
                      survivorName,
                    )}</strong> has invited you to connect as their carer so you can support their rehabilitation progress.</p>
                    ${relationshipLine}
                    ${messageBlock}

                    <p style="margin:0 0 24px;color:#4b5563;line-height:1.6;">This invitation expires in ${expiresInDays} days.</p>

                    <a href="${escapeAttribute(
                      inviteUrl,
                    )}" style="display:inline-block;background:#592EBD;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700;">
                      Accept Carer Invitation
                    </a>

                    <p style="margin:24px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">If the button does not work, copy and paste this link into your browser:</p>
                    <p style="margin:8px 0 0;color:#592EBD;font-size:13px;line-height:1.6;word-break:break-all;">${escapeHtml(
                      inviteUrl,
                    )}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0;color:#9ca3af;font-size:12px;">AI-DRA Digital Rehabilitation Assistant</p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject:
            "You have been invited to support a survivor on AI-DRA",
          html,
        }),
      },
    );

    if (!response.ok) {
      return {
        ok: false,
        error: await response.text(),
      };
    }

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown email error.",
    };
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value);
}
