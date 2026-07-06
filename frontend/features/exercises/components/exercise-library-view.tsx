import type {
  ExerciseSummary,
} from "@/features/exercises/types";

import { ExerciseListItem } from "./exercise-list-item";

type ExerciseLibraryViewProps = {
  exercises: ExerciseSummary[];
};

export function ExerciseLibraryView({
  exercises,
}: ExerciseLibraryViewProps) {
  if (exercises.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
        <h2 className="text-2xl font-semibold text-[#1E1E1E]">
          No exercises available
        </h2>

        <p className="mt-2 text-lg text-neutral-600">
          Active rehabilitation exercises
          will appear here when they are
          available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <ExerciseListItem
          key={exercise.id}
          slug={exercise.slug}
          title={exercise.title}
          description={
            exercise.shortDescription ??
            exercise.description ??
            "Rehabilitation exercise"
          }
          trackerType={
            exercise.trackerType
          }
          primaryMetric={
            exercise.primaryMetric
          }
          targetReps={
            exercise.defaultTargetReps
          }
          illustration={
            exercise.thumbnailUrl
          }
        />
      ))}
    </div>
  );
}