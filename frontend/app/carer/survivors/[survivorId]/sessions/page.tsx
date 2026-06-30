import { notFound } from "next/navigation";

import { SurvivorSessionsView } from "@/features/carer/components/survivors/survivor-sessions-view";
import { getSurvivorDetailById } from "@/features/carer/data/survivor-detail-data";
import { getSurvivorSessionsById } from "@/features/carer/data/survivor-session-data";

type SurvivorSessionsPageProps = {
  params: Promise<{
    survivorId: string;
  }>;
};

export default async function SurvivorSessionsPage({
  params,
}: SurvivorSessionsPageProps) {
  const { survivorId } = await params;

  const survivor = getSurvivorDetailById(survivorId);

  if (!survivor) {
    notFound();
  }

  const sessions = getSurvivorSessionsById(survivorId);

  return (
    <SurvivorSessionsView
      survivorName={survivor.name}
      sessions={sessions}
    />
  );
}