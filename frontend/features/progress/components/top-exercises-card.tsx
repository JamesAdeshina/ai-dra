import Link from "next/link";

import { Dumbbell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type {
  TopExerciseItem,
} from "@/features/progress/types";

type TopExercisesCardProps = {
  hasData: boolean;
  exercises: TopExerciseItem[];
};

const ACCENT_CLASSES = [
  "bg-[#7875FB]",
  "bg-[#111111]",
  "bg-[#ED3A3A]",
  "bg-[#F5A94C]",
  "bg-[#2DD4BF]",
];

export function TopExercisesCard({
  hasData,
  exercises,
}: TopExercisesCardProps) {
  return (
    <Card className="min-h-[348px] rounded-2xl border-0 bg-white p-6 shadow-none">
      <h2 className="text-[18px] font-semibold text-[#1E1E1E]">
        Most Practised Exercises
      </h2>

      {hasData &&
      exercises.length > 0 ? (
        <div className="mt-7 space-y-5">
          {exercises.map(
            (exercise, index) => (
              <Link
                key={exercise.exerciseId}
                href={`/exercises/${exercise.exerciseSlug}`}
                className="flex items-center justify-between gap-3 rounded-xl transition hover:bg-[#F8F7FB]"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    className={[
                      "h-10 w-1 shrink-0 rounded-full",
                      ACCENT_CLASSES[
                        index %
                          ACCENT_CLASSES.length
                      ],
                    ].join(" ")}
                  />

                  <div className="min-w-0">
                    <span className="block truncate text-[16px] text-[#1E1E1E]">
                      {
                        exercise.exerciseTitle
                      }
                    </span>

                    <span className="mt-1 block text-[13px] text-[#8A8A8A]">
                      {
                        exercise.completedSessions
                      }{" "}
                      completed
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="block text-[16px] font-bold text-[#1E1E1E]">
                    {exercise.sessions}
                  </span>

                  <span className="text-[12px] text-[#8A8A8A]">
                    sessions
                  </span>
                </div>
              </Link>
            )
          )}
        </div>
      ) : (
        <div className="flex h-[280px] flex-col items-center justify-center text-center">
          <Dumbbell className="h-16 w-16 text-[#C5C5C5]" />

          <p className="mt-3 max-w-[240px] text-[18px] font-semibold leading-[140%] text-[#1E1E1E]">
            Your most practised exercises
            will appear here after your first
            session.
          </p>

          <Button
            asChild
            className="mt-6 h-[44px] rounded-full bg-[#592EBD] px-8 text-[16px] hover:bg-[#4B24A8]"
          >
            <Link href="/exercises">
              Browse Exercises
            </Link>
          </Button>
        </div>
      )}
    </Card>
  );
}