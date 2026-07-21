import type {
  AppRole,
} from "@/features/auth/types/auth-role";

export const ROLE_HOME_ROUTES: Record<AppRole, string> = {
  SURVIVOR: "/dashboard",
  CARER: "/carer/dashboard",
  ADMIN: "/admin/dashboard",
  CLINICIAN: "/clinician/dashboard",
};

export const ROLE_LOGIN_ROUTES: Record<AppRole, string> = {
  SURVIVOR: "/auth/login",
  CARER: "/carer/auth/login",
  ADMIN: "/admin/auth/login",
  CLINICIAN: "/clinician/auth/login",
};

export const ROLE_REGISTER_ROUTES: Partial<Record<AppRole, string>> = {
  SURVIVOR: "/auth/register",
  CARER: "/carer/auth/register",
  CLINICIAN: "/clinician/auth/register",
};

export const ROLE_FORGOT_PASSWORD_ROUTES: Record<AppRole, string> = {
  SURVIVOR: "/auth/forgot-password",
  CARER: "/carer/auth/forgot-password",
  ADMIN: "/admin/auth/forgot-password",
  CLINICIAN: "/clinician/auth/forgot-password",
};

export const ROLE_LABELS: Record<AppRole, string> = {
  SURVIVOR: "Survivor",
  CARER: "Carer",
  ADMIN: "Administrator",
  CLINICIAN: "Clinician",
};

export const ROLE_SELECTION_ROUTE = "/auth/select-role";
export const MISSING_ROLE_ROUTE = "/auth/login?error=missing-role";

export function getPortalHomeRoute(role: AppRole): string {
  return ROLE_HOME_ROUTES[role];
}

export function getPortalLoginRoute(role: AppRole): string {
  return ROLE_LOGIN_ROUTES[role];
}

export function getPortalRegisterRoute(role: AppRole): string | null {
  return ROLE_REGISTER_ROUTES[role] ?? null;
}

export function getPortalForgotPasswordRoute(role: AppRole): string {
  return ROLE_FORGOT_PASSWORD_ROUTES[role];
}

export function getRoleLabel(role: AppRole): string {
  return ROLE_LABELS[role];
}
