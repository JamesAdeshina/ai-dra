import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  updateSession,
} from "@/lib/supabase/proxy";

type AppRole =
  | "SURVIVOR"
  | "CARER"
  | "ADMIN"
  | "CLINICIAN";

type UserRoleRow = {
  role: AppRole;
  is_primary: boolean;
};

const PUBLIC_ROUTES = new Set([
  "/",

  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/check-email",
  "/auth/callback",
  "/auth/reset-password",

  "/invitations/carer/accept",

  "/carer/auth/login",
  "/carer/auth/register",
  "/carer/auth/forgot-password",
  "/carer/auth/check-email",
  "/carer/auth/reset-password",

  "/admin/auth/login",
  "/admin/auth/forgot-password",
  "/admin/auth/check-email",
  "/admin/auth/reset-password",
]);

const PASSWORD_RECOVERY_ROUTES =
  new Set([
    "/auth/reset-password",
    "/carer/auth/reset-password",
    "/admin/auth/reset-password",
  ]);

const ROLE_HOME_ROUTES: Record<
  AppRole,
  string
> = {
  SURVIVOR: "/dashboard",
  CARER: "/carer/dashboard",
  ADMIN: "/admin/dashboard",
  CLINICIAN: "/",
};

const ROLE_LOGIN_ROUTES: Partial<
  Record<AppRole, string>
> = {
  SURVIVOR: "/auth/login",
  CARER: "/carer/auth/login",
  ADMIN: "/admin/auth/login",
};

const SURVIVOR_ROUTE_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/exercises",
  "/history",
  "/progress",
  "/reminders",
  "/session",
  "/settings",
];

function matchesRoutePrefix(
  pathname: string,
  prefix: string
) {
  return (
    pathname === prefix ||
    pathname.startsWith(
      `${prefix}/`
    )
  );
}

function isPublicRoute(
  pathname: string
) {
  return PUBLIC_ROUTES.has(
    pathname
  );
}

function isSurvivorAuthRoute(
  pathname: string
) {
  return (
    pathname === "/auth" ||
    pathname.startsWith(
      "/auth/"
    )
  );
}

function isCarerAuthRoute(
  pathname: string
) {
  return (
    pathname === "/carer/auth" ||
    pathname.startsWith(
      "/carer/auth/"
    )
  );
}

function isAdminAuthRoute(
  pathname: string
) {
  return (
    pathname === "/admin/auth" ||
    pathname.startsWith(
      "/admin/auth/"
    )
  );
}

function isAnyAuthRoute(
  pathname: string
) {
  return (
    isSurvivorAuthRoute(
      pathname
    ) ||
    isCarerAuthRoute(
      pathname
    ) ||
    isAdminAuthRoute(
      pathname
    )
  );
}

function isCarerPortalRoute(
  pathname: string
) {
  return (
    matchesRoutePrefix(
      pathname,
      "/carer"
    ) &&
    !isCarerAuthRoute(
      pathname
    )
  );
}

function isAdminPortalRoute(
  pathname: string
) {
  return (
    matchesRoutePrefix(
      pathname,
      "/admin"
    ) &&
    !isAdminAuthRoute(
      pathname
    )
  );
}

function isSurvivorPortalRoute(
  pathname: string
) {
  return SURVIVOR_ROUTE_PREFIXES.some(
    (prefix) =>
      matchesRoutePrefix(
        pathname,
        prefix
      )
  );
}

function getRequiredRole(
  pathname: string
): AppRole | null {
  if (
    isAdminPortalRoute(
      pathname
    )
  ) {
    return "ADMIN";
  }

  if (
    isCarerPortalRoute(
      pathname
    )
  ) {
    return "CARER";
  }

  if (
    isSurvivorPortalRoute(
      pathname
    )
  ) {
    return "SURVIVOR";
  }

  return null;
}

function getIntendedAuthRole(
  pathname: string
): AppRole | null {
  if (
    isAdminAuthRoute(
      pathname
    )
  ) {
    return "ADMIN";
  }

  if (
    isCarerAuthRoute(
      pathname
    )
  ) {
    return "CARER";
  }

  if (
    isSurvivorAuthRoute(
      pathname
    )
  ) {
    return "SURVIVOR";
  }

  return null;
}

function getLoginRouteForPath(
  pathname: string
) {
  if (
    matchesRoutePrefix(
      pathname,
      "/admin"
    )
  ) {
    return "/admin/auth/login";
  }

  if (
    matchesRoutePrefix(
      pathname,
      "/carer"
    )
  ) {
    return "/carer/auth/login";
  }

  return "/auth/login";
}

function resolveUserHome(
  roles: UserRoleRow[]
) {
  const primaryRole =
    roles.find(
      (record) =>
        record.is_primary
    )?.role;

  if (
    primaryRole &&
    ROLE_HOME_ROUTES[
      primaryRole
    ]
  ) {
    return ROLE_HOME_ROUTES[
      primaryRole
    ];
  }

  const firstSupportedRole =
    roles.find(
      (record) =>
        record.role ===
          "SURVIVOR" ||
        record.role ===
          "CARER" ||
        record.role ===
          "ADMIN"
    )?.role;

  if (firstSupportedRole) {
    return ROLE_HOME_ROUTES[
      firstSupportedRole
    ];
  }

  return "/";
}

function redirectWithCookies(
  request: NextRequest,
  sourceResponse: NextResponse,
  pathname: string,
  searchParams?: Record<
    string,
    string
  >
) {
  const url =
    request.nextUrl.clone();

  url.pathname = pathname;
  url.search = "";

  Object.entries(
    searchParams ?? {}
  ).forEach(([key, value]) => {
    url.searchParams.set(
      key,
      value
    );
  });

  const redirectResponse =
    NextResponse.redirect(url);

  sourceResponse.cookies
    .getAll()
    .forEach((cookie) => {
      redirectResponse.cookies.set(
        cookie
      );
    });

  return redirectResponse;
}

export async function proxy(
  request: NextRequest
) {
  const {
    response,
    supabase,
    userId,
  } = await updateSession(
    request
  );

  const pathname =
    request.nextUrl.pathname;

  /*
   * Signed-out visitors.
   */
  if (!userId) {
    if (
      isPublicRoute(pathname)
    ) {
      return response;
    }

    const redirectTo = `${pathname}${request.nextUrl.search}`;

    return redirectWithCookies(
      request,
      response,
      getLoginRouteForPath(
        pathname
      ),
      {
        redirectTo,
      }
    );
  }

  /*
   * Recovery pages must remain accessible
   * while Supabase has created a temporary
   * password-recovery session.
   */
  if (
    PASSWORD_RECOVERY_ROUTES.has(
      pathname
    )
  ) {
    return response;
  }

  const {
    data: roleData,
    error: roleError,
  } = await supabase
    .from("user_roles")
    .select(
      `
        role,
        is_primary
      `
    )
    .eq("user_id", userId);

  if (roleError) {
    console.error(
      "Failed to load user roles in proxy:",
      roleError
    );

    return redirectWithCookies(
      request,
      response,
      "/auth/login",
      {
        error:
          "role-check-failed",
      }
    );
  }

  const roles =
    (roleData ??
      []) as UserRoleRow[];

  const availableRoles =
    roles.map(
      (record) =>
        record.role
    );

  /*
   * Authenticated accounts must have at
   * least one role.
   */
  if (roles.length === 0) {
    if (
      pathname ===
      "/auth/login"
    ) {
      return response;
    }

    return redirectWithCookies(
      request,
      response,
      "/auth/login",
      {
        error:
          "missing-role",
      }
    );
  }

  /*
   * Authenticated user visiting an auth page.
   *
   * Where they have the role represented by
   * that login page, send them to that portal.
   * Otherwise send them to their own primary
   * portal.
   */
  if (
    isAnyAuthRoute(
      pathname
    )
  ) {
    const intendedRole =
      getIntendedAuthRole(
        pathname
      );

    if (
      intendedRole &&
      availableRoles.includes(
        intendedRole
      )
    ) {
      return redirectWithCookies(
        request,
        response,
        ROLE_HOME_ROUTES[
          intendedRole
        ]
      );
    }

    return redirectWithCookies(
      request,
      response,
      resolveUserHome(
        roles
      )
    );
  }

  /*
   * Protect each portal by role.
   */
  const requiredRole =
    getRequiredRole(
      pathname
    );

  if (
    requiredRole &&
    !availableRoles.includes(
      requiredRole
    )
  ) {
    return redirectWithCookies(
      request,
      response,
      resolveUserHome(
        roles
      ),
      {
        redirected:
          "wrong-role",
      }
    );
  }

  /*
   * Survivor onboarding applies only to
   * survivor portal routes.
   *
   * Carers and admins must never be forced
   * through survivor onboarding.
   */
  if (
    requiredRole === "SURVIVOR"
  ) {
    const {
      data: profile,
      error: profileError,
    } = await supabase
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
        "Failed to load survivor profile in proxy:",
        profileError
      );
    }

    const onboardingFinished =
      profile?.onboarding_completed ===
        true ||
      profile?.onboarding_skipped ===
        true;

    if (
      !onboardingFinished &&
      pathname !==
        "/onboarding"
    ) {
      return redirectWithCookies(
        request,
        response,
        "/onboarding"
      );
    }

    if (
      onboardingFinished &&
      pathname ===
        "/onboarding"
    ) {
      return redirectWithCookies(
        request,
        response,
        "/dashboard"
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf)$).*)",
  ],
};