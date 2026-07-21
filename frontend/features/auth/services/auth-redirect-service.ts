"use server";

import { redirect } from "next/navigation";

import {
  getCurrentUserRoleContext,
} from "@/features/auth/services/role-service";

import {
  getPortalHomeRoute,
  getPortalLoginRoute,
  MISSING_ROLE_ROUTE,
  ROLE_SELECTION_ROUTE,
} from "@/features/auth/utils/portal-routes";

import type {
  AppRole,
  PortalResolution,
} from "@/features/auth/types/auth-role";

export async function resolveAuthenticatedPortal(
  intendedRole: AppRole | null
): Promise<PortalResolution> {
  const context = await getCurrentUserRoleContext();

  if (!context) {
    const fallbackRole = intendedRole ?? "SURVIVOR";

    return {
      destination: getPortalLoginRoute(fallbackRole),
      resolvedRole: null,
      availableRoles: [],
      requestedRole: intendedRole,
      requestedRoleAllowed: false,
      reason: "NO_ROLE_ASSIGNED",
    };
  }

  const { availableRoles, primaryRole } = context;

  if (availableRoles.length === 0) {
    return {
      destination: MISSING_ROLE_ROUTE,
      resolvedRole: null,
      availableRoles,
      requestedRole: intendedRole,
      requestedRoleAllowed: false,
      reason: "NO_ROLE_ASSIGNED",
    };
  }

  if (
    intendedRole &&
    availableRoles.includes(intendedRole)
  ) {
    return {
      destination: getPortalHomeRoute(intendedRole),
      resolvedRole: intendedRole,
      availableRoles,
      requestedRole: intendedRole,
      requestedRoleAllowed: true,
      reason: "REQUESTED_ROLE_ALLOWED",
    };
  }

  if (
    primaryRole &&
    availableRoles.includes(primaryRole)
  ) {
    return {
      destination: getPortalHomeRoute(primaryRole),
      resolvedRole: primaryRole,
      availableRoles,
      requestedRole: intendedRole,
      requestedRoleAllowed: false,
      reason: "PRIMARY_ROLE_FALLBACK",
    };
  }

  if (availableRoles.length === 1) {
    const onlyRole = availableRoles[0];

    return {
      destination: getPortalHomeRoute(onlyRole),
      resolvedRole: onlyRole,
      availableRoles,
      requestedRole: intendedRole,
      requestedRoleAllowed: intendedRole === onlyRole,
      reason: "ONLY_ROLE_AVAILABLE",
    };
  }

  return {
    destination: ROLE_SELECTION_ROUTE,
    resolvedRole: null,
    availableRoles,
    requestedRole: intendedRole,
    requestedRoleAllowed: false,
    reason: "ROLE_SELECTION_REQUIRED",
  };
}

export async function redirectAuthenticatedUser(
  intendedRole: AppRole | null
): Promise<never> {
  const resolution =
    await resolveAuthenticatedPortal(intendedRole);

  redirect(resolution.destination);
}

export async function requirePortalRole(
  requiredRole: AppRole
): Promise<void> {
  const context = await getCurrentUserRoleContext();

  if (!context) {
    redirect(getPortalLoginRoute(requiredRole));
  }

  if (
    context.availableRoles.includes(requiredRole)
  ) {
    return;
  }

  const resolution =
    await resolveAuthenticatedPortal(requiredRole);

  redirect(resolution.destination);
}
