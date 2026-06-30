import {
  NextResponse,
  type NextRequest,
} from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest
) {
  const url = request.nextUrl;

  const code =
    url.searchParams.get("code");

  const tokenHash =
    url.searchParams.get("token_hash");

  const type =
    url.searchParams.get("type") as
      | EmailOtpType
      | null;

  const supabase = await createClient();

  let authenticationError:
    | Error
    | null = null;

  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(
        code
      );

    authenticationError = error;
  } else if (tokenHash && type) {
    const { error } =
      await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });

    authenticationError = error;
  } else {
    authenticationError = new Error(
      "No authentication code was provided."
    );
  }

  if (authenticationError) {
    console.error(
      "Password recovery callback failed:",
      authenticationError
    );

    const errorUrl = new URL(
      "/auth/forgot-password",
      url.origin
    );

    errorUrl.searchParams.set(
      "error",
      "invalid_or_expired_link"
    );

    return NextResponse.redirect(errorUrl);
  }

  const response = NextResponse.redirect(
    new URL(
      "/auth/reset-password",
      url.origin
    )
  );

  response.cookies.set(
    "ai_dra_password_recovery",
    "true",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    }
  );

  return response;
}