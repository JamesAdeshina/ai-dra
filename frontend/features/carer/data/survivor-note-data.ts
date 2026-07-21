import type { SurvivorSharedNote } from "@/features/carer/types/shared-note";

export async function getSurvivorSharedNotesById(
  survivorId: string,
): Promise<SurvivorSharedNote[]> {
  /*
   * Notes are still client-local in the current UI.
   * This keeps the page live and permission-safe while
   * we connect persistent notes later.
   */
  return [];
}