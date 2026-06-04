import { AppLayout } from "@/components/layout/app-layout";
import { ExerciseLibraryView } from "@/features/exercises/components/exercise-library-view";

export default function ExercisesPage() {
  return (
    <AppLayout>
      <main className="space-y-8">
        <div>
          <h1 className="text-5xl font-bold text-[#1E1E1E]">
            Exercise Library
          </h1>

          <p className="mt-3 text-xl text-[#666666]">
            Browse rehabilitation exercises and start your next session.
          </p>
        </div>

        <ExerciseLibraryView />
      </main>
    </AppLayout>
  );
}