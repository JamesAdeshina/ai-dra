import { AppLayout } from "@/components/layout/app-layout";
import { ExerciseDetailsView } from "@/features/exercises/components/details/exercise-details-view";
import { exerciseDetails } from "@/features/exercises/data/exercise-details";

type ExerciseDetailsPageProps = {
  params: Promise<{
    exerciseId: string;
  }>;
};

export default async function ExerciseDetailsPage({
  params,
}: ExerciseDetailsPageProps) {
  const { exerciseId } = await params;

  const exercise = exerciseDetails[exerciseId as keyof typeof exerciseDetails];

  if (!exercise) {
    return (
      <AppLayout>
        <div>
          <h1 className="text-4xl font-bold">Exercise not found</h1>
          <p className="mt-2 text-neutral-600">
            Please return to the exercise library and choose another exercise.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ExerciseDetailsView exercise={exercise} />
    </AppLayout>
  );
}