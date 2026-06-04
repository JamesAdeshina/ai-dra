import { AppLayout } from "@/components/layout/app-layout";
import { ExerciseDemoView } from "@/features/exercises/components/demo/exercise-demo-view";

type ExerciseDemoPageProps = {
  params: Promise<{
    exerciseId: string;
  }>;
};

export default async function ExerciseDemoPage({ params }: ExerciseDemoPageProps) {
  const { exerciseId } = await params;

  return (
    <AppLayout>
      <ExerciseDemoView exerciseId={exerciseId} />
    </AppLayout>
  );
}