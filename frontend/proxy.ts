import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const publicRoutes = new Set([
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/check-email",
]);

function isPublicRoute(pathname: string) {
  return publicRoutes.has(pathname);
}

function isAuthRoute(pathname: string) {
  return pathname.startsWith("/auth/");
}

export async function proxy(request: NextRequest) {
  const { response, supabase, userId } =
    await updateSession(request);

  const pathname = request.nextUrl.pathname;

  if (!userId) {
    if (isPublicRoute(pathname)) {
      return response;
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set(
      "redirectTo",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select(
        `
          onboarding_completed,
          onboarding_skipped
        `
      )
      .eq("id", userId)
      .maybeSingle();

  if (profileError) {
    console.error(
      "Failed to load profile in proxy:",
      profileError
    );
  }

  const onboardingFinished =
    profile?.onboarding_completed === true ||
    profile?.onboarding_skipped === true;

  if (isAuthRoute(pathname)) {
    const destination = request.nextUrl.clone();

    destination.pathname = onboardingFinished
      ? "/dashboard"
      : "/onboarding";

    destination.search = "";

    return NextResponse.redirect(destination);
  }

  if (
    !onboardingFinished &&
    pathname !== "/onboarding"
  ) {
    const onboardingUrl = request.nextUrl.clone();

    onboardingUrl.pathname = "/onboarding";
    onboardingUrl.search = "";

    return NextResponse.redirect(onboardingUrl);
  }

  if (
    onboardingFinished &&
    pathname === "/onboarding"
  ) {
    const dashboardUrl = request.nextUrl.clone();

    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";

    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Exclude:
     * - API routes
     * - Next.js static and image files
     * - favicon
     * - common public asset extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf)$).*)",
  ],
};