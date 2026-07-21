"use server";

import { createClient } from "@/lib/supabase/server";

import type {
  AppRole,
  AuthenticatedRoleContext,
  UserRoleRecord,
} from "@/features/auth/types/auth-role";

type UserRoleRow = {
  id: string;
  user_id: string;
  role: AppRole;
  is_primary: boolean;
  created_at: string;
};

export async function getCurrentUserRoleContext(): Promise<AuthenticatedRoleContext | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("user_roles")
    .select(`
      id,
      user_id,
      role,
      is_primary,
      created_at
    `)
    .eq("user_id", user.id)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load current user roles:", error);
    throw new Error("Your account roles could not be loaded.");
  }

  const roles = ((data ?? []) as UserRoleRow[]).map(mapUserRole);

  return {
    userId: user.id,
    email: user.email ?? null,
    roles,
    availableRoles: roles.map((record) => record.role),
    primaryRole:
      roles.find((record) => record.isPrimary)?.role ?? null,
  };
}

export async function currentUserHasRole(
  role: AppRole
): Promise<boolean> {
  const context = await getCurrentUserRoleContext();

  return context?.availableRoles.includes(role) ?? false;
}

export async function getCurrentPrimaryRole(): Promise<AppRole | null> {
  const context = await getCurrentUserRoleContext();

  return context?.primaryRole ?? null;
}

function mapUserRole(row: UserRoleRow): UserRoleRecord {
  return {
    id: row.id,
    userId: row.user_id,
    role: row.role,
    isPrimary: row.is_primary,
    createdAt: row.created_at,
  };
}
