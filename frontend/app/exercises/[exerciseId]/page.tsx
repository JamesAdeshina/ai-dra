import { notFound } from "next/navigation";

import { AppLayout } from "@/components/layout/app-layout";
import { ExerciseDetailsView } from "@/features/exercises/components/details/exercise-details-view";
import { getExerciseBySlug } from "@/features/exercises/services/exercise-service";

type ExerciseDetailsPageProps = {
  params: Promise<{
    exerciseId: string;
  }>;
};

export default async function ExerciseDetailsPage({
  params,
}: ExerciseDetailsPageProps) {
  const { exerciseId } = await params;

  const exercise =
    await getExerciseBySlug(exerciseId);

  if (!exercise) {
    notFound();
  }

  return (
    <AppLayout>
      <ExerciseDetailsView
        exercise={exercise}
      />
    </AppLayout>
  );
}