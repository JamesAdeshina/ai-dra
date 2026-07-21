import { notFound } from "next/navigation";

import { SurvivorExercisesView } from "@/features/carer/components/survivors/survivor-exercises-view";
import { getSurvivorDetailById } from "@/features/carer/data/survivor-detail-data";
import { exercises } from "@/features/exercises/data/exercises";

type SurvivorExercisesPageProps = {
  params: Promise<{
    survivorId: string;
  }>;
};

export default async function SurvivorExercisesPage({
  params,
}: SurvivorExercisesPageProps) {
  const { survivorId } = await params;

  const survivor =
    await getSurvivorDetailById(survivorId);

  if (!survivor) {
    notFound();
  }

  return (
    <SurvivorExercisesView
      survivorName={survivor.name}
      exercises={exercises}
    />
  );
}