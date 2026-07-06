import Image from "next/image";
import Link from "next/link";
import {
  ImageIcon,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type {
  SuggestedExercise,
} from "@/features/dashboard/types/dashboard-types";

type TodaysSessionCardProps = {
  exercise: SuggestedExercise | null;
};

export function TodaysSessionCard({
  exercise,
}: TodaysSessionCardProps) {
  if (!exercise) {
    return (
      <Card className="w-full rounded-2xl border-0 bg-white p-6 shadow-none">
        <p className="text-[18px] font-semibold text-[#592EBD]">
          Suggested Exercise
        </p>

        <div className="mt-5 rounded-2xl border border-dashed border-[#D8D8D8] px-6 py-10 text-center">
          <p className="text-[16px] font-semibold text-[#1E1E1E]">
            No exercise suggestion is available yet.
          </p>

          <Button
            asChild
            className="mt-5 h-[48px] rounded-full bg-[#592EBD] px-8 hover:bg-[#4B24A8]"
          >
            <Link href="/exercises">
              Browse Exercises
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  const estimatedMinutes =
    estimateDurationMinutes({
      reps:
        exercise.defaultTargetReps,
      holdDurationMs:
        exercise.defaultHoldDurationMs,
    });

  return (
    <Card className="w-full rounded-2xl border-0 bg-white p-4 shadow-none">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[18px] font-semibold text-[#592EBD]">
            Suggested Exercise
          </p>

          <p className="mt-1 text-[13px] leading-[145%] text-[#777777]">
            {exercise.reasonLabel}
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-[#F2EEFC] px-3 py-1.5 text-[12px] font-semibold text-[#592EBD]">
          <Sparkles size={14} />
          Personalised suggestion
        </span>
      </div>

      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex h-[190px] w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F7F4F2] md:w-[190px]">
          {exercise.thumbnailUrl ? (
            <Image
              src={
                exercise.thumbnailUrl
              }
              alt={exercise.title}
              width={320}
              height={320}
              quality={100}
              className="h-full w-full object-contain p-3"
            />
          ) : (
            <ImageIcon className="h-14 w-14 text-[#B8B8B8]" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h2 className="text-[26px] font-semibold text-[#1E1E1E]">
            {exercise.title}
          </h2>

          {exercise.shortDescription ? (
            <p className="mt-2 max-w-[720px] text-[15px] leading-[155%] text-[#666666]">
              {exercise.shortDescription}
            </p>
          ) : null}

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <InfoItem
              label="Target"
              value={`${exercise.defaultTargetReps} reps`}
            />

            <InfoItem
              label="Estimated time"
              value={`${estimatedMinutes} min`}
            />

            <InfoItem
              label="Recent score"
              value={
                exercise.averageMovementScore ===
                null
                  ? "Not assessed"
                  : `${exercise.averageMovementScore}%`
              }
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-[50px] flex-1 rounded-full bg-[#592EBD] text-[15px] font-medium text-white hover:bg-[#4B24A8]"
            >
              <Link
                href={`/exercises/${exercise.slug}/start`}
              >
                Start Suggested Exercise
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-[50px] rounded-full border-[#D8D8D8] px-7 text-[15px]"
            >
              <Link href="/exercises">
                Choose Another
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-[145%] text-[#999999]">
        Suggestions use your recorded activity and prototype scores. They do not replace an exercise plan from your rehabilitation professional.
      </p>
    </Card>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#FAFAFA] px-4 py-3">
      <p className="text-[12px] text-[#888888]">
        {label}
      </p>

      <p className="mt-1 text-[15px] font-semibold text-[#1E1E1E]">
        {value}
      </p>
    </div>
  );
}

function estimateDurationMinutes({
  reps,
  holdDurationMs,
}: {
  reps: number;
  holdDurationMs: number | null;
}): number {
  const holdSeconds =
    holdDurationMs
      ? holdDurationMs / 1000
      : 0;

  return Math.max(
    1,
    Math.ceil(
      (reps * (6 + holdSeconds)) /
        60
    )
  );
}
