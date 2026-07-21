export type AppRole =
  | "SURVIVOR"
  | "CARER"
  | "ADMIN"
  | "CLINICIAN";

export type UserRoleRecord = {
  id: string;
  userId: string;
  role: AppRole;
  isPrimary: boolean;
  createdAt: string;
};

export type AuthenticatedRoleContext = {
  userId: string;
  email: string | null;
  roles: UserRoleRecord[];
  availableRoles: AppRole[];
  primaryRole: AppRole | null;
};

export type PortalResolutionReason =
  | "REQUESTED_ROLE_ALLOWED"
  | "PRIMARY_ROLE_FALLBACK"
  | "ONLY_ROLE_AVAILABLE"
  | "ROLE_SELECTION_REQUIRED"
  | "NO_ROLE_ASSIGNED";

export type PortalResolution = {
  destination: string;
  resolvedRole: AppRole | null;
  availableRoles: AppRole[];
  requestedRole: AppRole | null;
  requestedRoleAllowed: boolean;
  reason: PortalResolutionReason;
};

export type RoleAwareLoginFormProps = {
  intendedRole: AppRole;
  registerHref?: string | null;
  forgotPasswordHref?: string;
  heading?: string;
  description?: string;
  submitLabel?: string;
};
