import type { SurvivorSharedNote } from "@/features/carer/types/shared-note";

const sharedNotesBySurvivor: Record<
  string,
  SurvivorSharedNote[]
> = {
  "william-carter": [
    {
      id: "william-note-5",
      survivorId: "william-carter",
      authorName: "Haruna Nayaya",
      content:
        "William struggled with Buttoning and Fastening today. He needed verbal encouragement but completed all repetitions.",
      createdAt: "2026-06-27T20:12:00.000Z",
      createdAtLabel: "27 Jun 2026 • 8:12 PM",
    },
    {
      id: "william-note-4",
      survivorId: "william-carter",
      authorName: "Haruna Nayaya",
      content:
        "Improved shoulder range today. William appeared more confident during the Target Touch exercise.",
      createdAt: "2026-06-25T18:45:00.000Z",
      createdAtLabel: "25 Jun 2026 • 6:45 PM",
    },
    {
      id: "william-note-3",
      survivorId: "william-carter",
      authorName: "Haruna Nayaya",
      content:
        "William reported slight wrist discomfort before the session. A shorter session and increased rest between sets were suggested.",
      createdAt: "2026-06-22T10:30:00.000Z",
      createdAtLabel: "22 Jun 2026 • 10:30 AM",
    },
    {
      id: "william-note-2",
      survivorId: "william-carter",
      authorName: "Haruna Nayaya",
      content:
        "Completed the Grasp and Hold activity independently. Movement appeared controlled throughout the session.",
      createdAt: "2026-06-18T17:20:00.000Z",
      createdAtLabel: "18 Jun 2026 • 5:20 PM",
    },
    {
      id: "william-note-1",
      survivorId: "william-carter",
      authorName: "Haruna Nayaya",
      content:
        "William needed help positioning the target before starting but completed the exercise without further assistance.",
      createdAt: "2026-06-15T16:10:00.000Z",
      createdAtLabel: "15 Jun 2026 • 4:10 PM",
    },
  ],

  "margaret-wilson": [
    {
      id: "margaret-note-3",
      survivorId: "margaret-wilson",
      authorName: "Haruna Nayaya",
      content:
        "Margaret needed a short break during the Lift and Place exercise but completed the remaining repetitions.",
      createdAt: "2026-06-29T16:45:00.000Z",
      createdAtLabel: "29 Jun 2026 • 4:45 PM",
    },
    {
      id: "margaret-note-2",
      survivorId: "margaret-wilson",
      authorName: "Haruna Nayaya",
      content:
        "Margaret appeared more comfortable using her affected arm during the Hand Function Task.",
      createdAt: "2026-06-25T15:35:00.000Z",
      createdAtLabel: "25 Jun 2026 • 3:35 PM",
    },
    {
      id: "margaret-note-1",
      survivorId: "margaret-wilson",
      authorName: "Haruna Nayaya",
      content:
        "The session was completed with encouragement. No difficulty was reported after the activity.",
      createdAt: "2026-06-20T16:15:00.000Z",
      createdAtLabel: "20 Jun 2026 • 4:15 PM",
    },
  ],

  "robert-singh": [],
};

export function getSurvivorSharedNotesById(
  survivorId: string,
): SurvivorSharedNote[] {
  return [...(sharedNotesBySurvivor[survivorId] ?? [])];
}