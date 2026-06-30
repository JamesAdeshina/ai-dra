import { notFound } from "next/navigation";

import { SurvivorExercisesView } from "@/features/carer/components/survivors/survivor-exercises-view";
import { getSurvivorDetailById } from "@/features/carer/data/survivor-detail-data";
import { exercises } from "@/features/exercises/data/exercises";

type SurvivorExercisesPageProps = {
  params: Promise<{
    survivorId: string;
  }>;
};

const assignedExerciseIdsBySurvivor: Record<
  string,
  string[]
> = {
  "william-carter": [
    "target-touch",
    "reach-grasp",
    "lift-place",
    "hand-function",
    "button-fastening",
  ],

  "margaret-wilson": [
    "reach-grasp",
    "lift-place",
    "hand-function",
    "button-fastening",
  ],

  "robert-singh": [
    "target-touch",
    "reach-grasp",
    "hand-function",
  ],
};

export default async function SurvivorExercisesPage({
  params,
}: SurvivorExercisesPageProps) {
  const { survivorId } = await params;

  const survivor = getSurvivorDetailById(survivorId);

  if (!survivor) {
    notFound();
  }

  const assignedIds =
    assignedExerciseIdsBySurvivor[survivorId] ?? [];

  const assignedExercises = exercises.filter((exercise) =>
    assignedIds.includes(exercise.id),
  );

  return (
    <SurvivorExercisesView
      survivorName={survivor.name}
      exercises={assignedExercises}
    />
  );
}