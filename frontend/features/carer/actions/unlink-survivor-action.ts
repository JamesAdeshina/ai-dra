"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type UnlinkSurvivorResult =
  | {
      ok: true;
      survivorName: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function unlinkSurvivorFromCarer(
  survivorId: string,
): Promise<UnlinkSurvivorResult> {
  const cleanSurvivorId = survivorId.trim();

  if (!cleanSurvivorId) {
    return {
      ok: false,
      error: "A survivor ID is required.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "unlink_survivor_from_carer_and_queue_notifications",
    {
      target_survivor_id: cleanSurvivorId,
    },
  );

  if (error) {
    console.error("Failed to unlink survivor:", error);

    return {
      ok: false,
      error:
        error.message ||
        "The survivor could not be unlinked.",
    };
  }

  const result = Array.isArray(data) ? data[0] : null;

  revalidatePath("/carer/dashboard");
  revalidatePath("/carer/survivors");
  revalidatePath(`/carer/survivors/${cleanSurvivorId}`);

  return {
    ok: true,
    survivorName:
      result?.survivor_name ??
      "The survivor",
  };
}
