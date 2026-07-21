type SendCarerInvitationEmailResult = {
  ok: boolean;
  error?: string;
};

export type CarerInvitationEmailInput = {
  to: string;
  firstName: string;
  lastName: string;
  relationship: string;
  message: string;
  inviteUrl: string;
  expiresInDays: number;
};

export async function sendCarerInvitationEmail({
  to,
  firstName,
  lastName,
  relationship,
  message,
  inviteUrl,
  expiresInDays,
}: CarerInvitationEmailInput): Promise<SendCarerInvitationEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "AI-DRA <no-reply@mail.ai-dra.co.uk>";

  if (!apiKey) {
    return {
      ok: false,
      error:
        "RESEND_API_KEY is missing.",
    };
  }

  if (!to?.trim()) {
    return {
      ok: false,
      error:
        "Recipient email is missing.",
    };
  }

  const fullName = [firstName, lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const greeting = fullName
    ? `Hi ${escapeHtml(firstName || fullName)},`
    : "Hi,";

  const relationshipLine = relationship
    ? `<p style="margin: 0 0 16px; color: #4b5563;">You have been invited as a <strong>${escapeHtml(
        formatRelationship(relationship),
      )}</strong>.</p>`
    : "";

  const messageBlock = message?.trim()
    ? `
      <div style="margin: 24px 0; padding: 16px; border-radius: 12px; background: #f6f1ff; color: #3f2a68;">
        <p style="margin: 0 0 8px; font-weight: 700;">Message from your carer</p>
        <p style="margin: 0; line-height: 1.6;">${escapeHtml(message)}</p>
      </div>
    `
    : "";

  const html = `
    <!doctype html>
    <html>
      <body style="margin:0; padding:0; background:#f7f5f2; font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f7f5f2; padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; background:#ffffff; border-radius:20px; overflow:hidden;">
                <tr>
                  <td style="padding:28px 28px 16px;">
                    <p style="margin:0; color:#592EBD; font-size:14px; font-weight:700;">AI-DRA</p>
                    <h1 style="margin:10px 0 8px; color:#1f2937; font-size:26px; line-height:1.25;">You have been invited to connect on AI-DRA</h1>
                    <p style="margin:0; color:#6b7280; line-height:1.6;">AI-DRA helps survivors and carers stay connected during rehabilitation.</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 28px 28px;">
                    <p style="margin:0 0 16px; color:#374151;">${greeting}</p>
                    <p style="margin:0 0 16px; color:#4b5563; line-height:1.6;">A carer has invited you to link your AI-DRA account so they can support your rehabilitation progress.</p>
                    ${relationshipLine}
                    ${messageBlock}

                    <p style="margin: 0 0 24px; color:#4b5563; line-height:1.6;">This invitation expires in ${expiresInDays} days.</p>

                    <a href="${escapeAttribute(inviteUrl)}" style="display:inline-block; background:#592EBD; color:#ffffff; text-decoration:none; padding:14px 22px; border-radius:999px; font-weight:700;">
                      Accept Invitation
                    </a>

                    <p style="margin:24px 0 0; color:#6b7280; font-size:13px; line-height:1.6;">If the button does not work, copy and paste this link into your browser:</p>
                    <p style="margin:8px 0 0; color:#592EBD; font-size:13px; line-height:1.6; word-break:break-all;">${escapeHtml(inviteUrl)}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0; color:#9ca3af; font-size:12px;">AI-DRA Digital Rehabilitation Assistant</p>
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
            "You have been invited to connect on AI-DRA",
          html,
        }),
      },
    );

    if (!response.ok) {
      const errorBody =
        await response.text();

      return {
        ok: false,
        error: errorBody,
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

function formatRelationship(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
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
