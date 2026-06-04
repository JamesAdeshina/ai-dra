import { exercises } from "../data/exercises";
import { ExerciseListItem } from "./exercise-list-item";

export function ExerciseLibraryView() {
  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <ExerciseListItem
          key={exercise.id}
          id={exercise.id}
          title={exercise.title}
          description={exercise.description}
          level={exercise.level}
          reps={exercise.reps}
          difficulty={exercise.difficulty}
          illustration={exercise.illustration}
        />
      ))}
    </div>
  );
}