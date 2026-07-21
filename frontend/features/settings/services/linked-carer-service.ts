"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type LinkedCarerPermissions = {
  view_progress: boolean;
  view_sessions: boolean;
  view_exercises: boolean;
  add_notes: boolean;
  manage_reminders: boolean;
};

export type LinkedCarer = {
  relationshipId: string;
  carerId: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  email: string | null;
  phone: string | null;
  status: "ACTIVE";
  linkedAt: string;
  permissions: LinkedCarerPermissions;
};

type RelationshipRow = {
  id: string;
  carer_id: string;
  status: "ACTIVE";
  accepted_at: string | null;
  created_at: string;
  permissions: Partial<LinkedCarerPermissions> | null;
};

type ProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  email: string | null;
  phone: string | null;
};

const DEFAULT_PERMISSIONS: LinkedCarerPermissions = {
  view_progress: true,
  view_sessions: true,
  view_exercises: true,
  add_notes: true,
  manage_reminders: false,
};

export async function getLinkedCarers(): Promise<
  LinkedCarer[]
> {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to view linked carers."
    );
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_my_linked_carers"
  );

  if (error) {
    console.error(
      "Failed to load linked carers:",
      error
    );

    throw new Error(
      "Linked carer details could not be loaded."
    );
  }

  const rows = (data ?? []) as {
    relationship_id: string;
    carer_id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    linked_at: string;
    permissions:
      | Partial<LinkedCarerPermissions>
      | null;
  }[];

  return rows.map((row) => {
    const fullName = [
      row.first_name,
      row.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      relationshipId:
        row.relationship_id,
      carerId: row.carer_id,
      firstName: row.first_name,
      lastName: row.last_name,
      displayName:
        fullName ||
        row.email ||
        "AI-DRA Carer",
      email: row.email,
      phone: row.phone,
      status: "ACTIVE",
      linkedAt: row.linked_at,
      permissions: {
        ...DEFAULT_PERMISSIONS,
        ...(row.permissions ?? {}),
      },
    };
  });
}

export async function unlinkCarer(
  relationshipId: string
): Promise<void> {
  const cleanRelationshipId =
    relationshipId.trim();

  if (!cleanRelationshipId) {
    throw new Error("A relationship ID is required.");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to unlink a carer.");
  }

  const { error } = await supabase.rpc(
    "revoke_carer_survivor_relationship",
    {
      relationship_id: cleanRelationshipId,
    }
  );

  if (error) {
    console.error("Failed to unlink carer:", error);

    throw new Error(
      error.message || "The carer could not be unlinked."
    );
  }

  revalidatePath("/settings");
  revalidatePath("/carer/survivors");
}
