import Image from "next/image";
import { Dumbbell } from "lucide-react";

import { exercises as sharedExercises } from "@/features/exercises/data/exercises";
import { cn } from "@/lib/utils";

type SharedExercise = (typeof sharedExercises)[number];

type SurvivorExercisesViewProps = {
  survivorName: string;
  exercises: SharedExercise[];
};

function getDifficultyClassName(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-[#258B55]";

    case "hard":
      return "text-[#AD7200]";

    default:
      return "text-[#817A75]";
  }
}

export function SurvivorExercisesView({
  survivorName,
  exercises,
}: SurvivorExercisesViewProps) {
  if (exercises.length === 0) {
    return (
      <section className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-[#DEDAD6] bg-white px-6 py-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1ECFF] text-[#592EBD]">
          <Dumbbell size={28} />
        </span>

        <h2 className="mt-5 text-xl font-semibold text-[#292522]">
          No exercises assigned
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-[#746D68]">
          Exercises assigned to {survivorName} will appear here.
        </p>
      </section>
    );
  }

  return (
    <section aria-label={`Exercises assigned to ${survivorName}`}>
      <div className="divide-y divide-[#ECE8E4]">
        {exercises.map((exercise) => (
          <article
            key={exercise.id}
            className="grid gap-4 px-3 py-3 transition hover:bg-[#FAF9F8] sm:grid-cols-[80px_minmax(0,1fr)_110px] sm:items-center"
          >
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-[#F5F2F0]">
              <Image
                src={exercise.images.thumbnail}
                alt=""
                width={80}
                height={80}
                className="h-full w-full object-contain p-1"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-semibold leading-6 text-[#292522]">
                {exercise.title}
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#817A75]">
                {exercise.description}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-base font-semibold text-[#292522]">
                {exercise.reps}
              </p>

              <p
                className={cn(
                  "mt-1 text-sm font-medium",
                  getDifficultyClassName(exercise.difficulty),
                )}
              >
                {exercise.difficulty}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}