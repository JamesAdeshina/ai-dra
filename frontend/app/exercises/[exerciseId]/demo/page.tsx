import { notFound } from "next/navigation";

import { AppLayout } from "@/components/layout/app-layout";
import { ExerciseDemoView } from "@/features/exercises/components/demo/exercise-demo-view";
import { getExerciseBySlug } from "@/features/exercises/services/exercise-service";

type ExerciseDemoPageProps = {
  params: Promise<{
    exerciseId: string;
  }>;
};

export default async function ExerciseDemoPage({
  params,
}: ExerciseDemoPageProps) {
  const { exerciseId } = await params;

  const exercise =
    await getExerciseBySlug(exerciseId);

  if (!exercise) {
    notFound();
  }

  return (
    <AppLayout>
      <ExerciseDemoView
        exercise={exercise}
      />
    </AppLayout>
  );
}