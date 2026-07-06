import { AppLayout } from "@/components/layout/app-layout";
import { ExerciseLibraryView } from "@/features/exercises/components/exercise-library-view";
import { getActiveExercises } from "@/features/exercises/services/exercise-service";

export default async function ExercisesPage() {
  const exercises =
    await getActiveExercises();

  return (
    <AppLayout>
      <main className="space-y-8">
        <div>
          <h1 className="text-[40px] font-bold text-[#1E1E1E]">
            Exercise Library
          </h1>

          <p className="mt-1 text-[20px] text-[#1E1E1E]">
            Browse rehabilitation exercises
            and start your next session.
          </p>
        </div>

        <ExerciseLibraryView
          exercises={exercises}
        />
      </main>
    </AppLayout>
  );
}