import { AppLayout } from "@/components/layout/app-layout";
import { exerciseDetails } from "@/features/exercises/data/exercise-details";
import { SessionView } from "@/features/sessions/components/session-view";

type StartExercisePageProps = {
  params: Promise<{
    exerciseId: string;
  }>;
};

export default async function StartExercisePage({
  params,
}: StartExercisePageProps) {
  const { exerciseId } = await params;

  const exercise =
    exerciseDetails[exerciseId as keyof typeof exerciseDetails] ??
    exerciseDetails["target-touch"];

  return (
    <AppLayout>
      <SessionView exercise={exercise} />
    </AppLayout>
  );
}