import { notFound } from "next/navigation";

import { SurvivorNotesView } from "@/features/carer/components/survivors/survivor-notes-view";
import { getSurvivorDetailById } from "@/features/carer/data/survivor-detail-data";
import { getSurvivorSharedNotesById } from "@/features/carer/data/survivor-note-data";

type SurvivorNotesPageProps = {
  params: Promise<{
    survivorId: string;
  }>;
};

export default async function SurvivorNotesPage({
  params,
}: SurvivorNotesPageProps) {
  const { survivorId } = await params;

  const survivor =
    getSurvivorDetailById(survivorId);

  if (!survivor) {
    notFound();
  }

  const notes =
    getSurvivorSharedNotesById(survivorId);

  return (
    <SurvivorNotesView
      survivorId={survivorId}
      survivorName={survivor.name}
      initialNotes={notes}
    />
  );
}