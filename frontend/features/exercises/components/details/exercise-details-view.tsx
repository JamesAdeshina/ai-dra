import Image from "next/image";
import Link from "next/link";

import {
  Activity,
  ArrowLeft,
  Heart,
  ImageIcon,
  Play,
  RotateCw,
  Target,
  ThumbsUp,
  Timer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type {
  Exercise,
} from "@/features/exercises/types";

type ExerciseDetailsViewProps = {
  exercise: Exercise;
};

type ActivityItem = {
  title: string;
  imageUrl: string | null;
};

export function ExerciseDetailsView({
  exercise,
}: ExerciseDetailsViewProps) {
  const startImage =
    exercise.startImageUrl ??
    exercise.thumbnailUrl;

  const activeImage =
    exercise.activeImageUrl ??
    exercise.thumbnailUrl;

  const thumbnailImage =
    exercise.thumbnailUrl ??
    exercise.startImageUrl ??
    exercise.activeImageUrl;

  const instruction =
    exercise.steps[0]?.instruction ??
    exercise.shortDescription ??
    exercise.description ??
    "Follow the on-screen guidance to complete this exercise.";

  const activities: ActivityItem[] =
    exercise.dailyActivities.map(
      (title, index) => ({
        title,
        imageUrl:
          exercise.dailyActivityImages[
            index
          ] ??
          exercise.thumbnailUrl ??
          null,
      })
    );

  const holdDuration =
    exercise.defaultHoldDurationMs
      ? `${Math.round(
          exercise.defaultHoldDurationMs /
            1000
        )} seconds`
      : "Not required";

  const durationLabel =
    getEstimatedDuration(
      exercise.defaultTargetReps,
      exercise.defaultHoldDurationMs
    );

  return (
    <div className="space-y-6">
      <Link
        href="/exercises"
        className="inline-flex items-center gap-2 text-[16px] font-medium text-[#7875FB] transition hover:text-[#592EBD]"
      >
        <ArrowLeft size={18} />
        Back to Exercises
      </Link>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-[112px] w-[112px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2">
              <ExerciseImage
                src={thumbnailImage}
                alt={exercise.title}
              />
            </div>

            <div>
              <h1 className="text-[28px] font-bold text-[#1E1E1E] sm:text-[34px]">
                {exercise.title}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-[#7875FB]/15 px-5 py-2 text-[15px] font-semibold text-[#7875FB]">
                  {formatLabel(
                    exercise.trackerType
                  )}
                </span>

                <span className="inline-flex rounded-full bg-[#F2EEFC] px-5 py-2 text-[15px] font-semibold text-[#592EBD]">
                  {formatLabel(
                    exercise.primaryMetric
                  )}
                </span>
              </div>
            </div>
          </div>

          <Card className="grid grid-cols-1 overflow-hidden rounded-2xl border-0 bg-white p-5 shadow-none lg:grid-cols-[1fr_260px]">
            <div className="rounded-2xl bg-[#F7F4F2] p-4 sm:p-8">
              <ExerciseAnimation
                startImage={startImage}
                endImage={activeImage}
                fallbackImage={
                  thumbnailImage
                }
                title={exercise.title}
              />

              <div className="mt-5 rounded-2xl bg-[#ECE8FF] px-6 py-5 text-[17px] font-semibold leading-[150%] text-[#1E1E1E]">
                {instruction}
              </div>
            </div>

            <div className="mt-6 space-y-5 border-t pt-6 lg:mt-0 lg:border-l lg:border-t-0 lg:px-6 lg:pt-0">
              <SummaryItem
                icon={<Target />}
                label="Target Repetitions"
                value={`${exercise.defaultTargetReps} reps`}
              />

              <SummaryItem
                icon={<Timer />}
                label="Estimated Duration"
                value={durationLabel}
              />

              <SummaryItem
                icon={<Activity />}
                label="Primary Metric"
                value={formatLabel(
                  exercise.primaryMetric
                )}
              />

              <SummaryItem
                icon={<ThumbsUp />}
                label="Tracking Type"
                value={formatLabel(
                  exercise.trackerType
                )}
              />

              <SummaryItem
                icon={<RotateCw />}
                label="Hold Requirement"
                value={holdDuration}
              />
            </div>
          </Card>

          <Card className="rounded-2xl border-0 bg-white p-5 shadow-none">
            <h2 className="text-[22px] font-semibold text-[#1E1E1E]">
              How To Perform
            </h2>

            {exercise.steps.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-neutral-300 bg-[#F7F4F2] px-6 py-10 text-center">
                <p className="text-[16px] text-neutral-600">
                  Step-by-step instructions
                  are not available yet.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {exercise.steps.map(
                  (step, index) => {
                    const stepImage =
                      step.imageUrl ??
                      getFallbackStepImage({
                        index,
                        startImage,
                        activeImage,
                        thumbnailImage,
                      });

                    return (
                      <div
                        key={step.id}
                        className="rounded-2xl bg-[#F7F4F2] p-4"
                      >
                        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#ECE8FF] text-[16px] font-semibold text-[#7875FB]">
                          {step.stepNumber}
                        </div>

                        <div className="flex h-[180px] items-center justify-center overflow-hidden rounded-xl bg-white">
                          <ExerciseImage
                            src={stepImage}
                            alt={`${exercise.title} step ${step.stepNumber}`}
                          />
                        </div>

                        {step.title ? (
                          <h3 className="mt-4 text-[17px] font-semibold text-[#1E1E1E]">
                            {step.title}
                          </h3>
                        ) : null}

                        <p className="mt-2 text-[16px] font-medium leading-[150%] text-[#444444]">
                          {step.instruction}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-2xl border-0 bg-white p-6 shadow-none">
            <h2 className="text-[22px] font-bold text-[#1E1E1E]">
              About This Exercise
            </h2>

            <p className="mt-3 text-[16px] leading-[160%] text-[#666666]">
              {exercise.description ??
                exercise.shortDescription ??
                "Exercise information is not available yet."}
            </p>

            <h3 className="mt-6 text-[22px] font-bold text-[#1E1E1E]">
              Benefits
            </h3>

            {exercise.benefits.length ===
            0 ? (
              <p className="mt-2 text-[16px] text-[#666666]">
                Benefits have not been
                added yet.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {exercise.benefits.map(
                  (benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7F4F2] text-[#592EBD]">
                        <Heart
                          size={20}
                          fill="#592EBD"
                        />
                      </div>

                      <span className="text-[16px] leading-[145%]">
                        {benefit}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}

            {exercise.safetyInformation ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
                <h3 className="text-[16px] font-semibold text-amber-900">
                  Safety Information
                </h3>

                <p className="mt-1 text-[15px] leading-[150%] text-amber-800">
                  {
                    exercise.safetyInformation
                  }
                </p>
              </div>
            ) : null}
          </Card>

          <Card className="rounded-2xl border-0 bg-white p-6 shadow-none">
            <h2 className="text-[22px] font-bold leading-[130%] text-[#1E1E1E]">
              What Daily Activities Does
              This Help With?
            </h2>

            {activities.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-[#F7F4F2] px-5 py-8 text-center">
                <p className="text-[15px] text-neutral-600">
                  Daily-life activities
                  have not been added yet.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {activities.map(
                  (activity, index) => (
                    <div
                      key={`${activity.title}-${index}`}
                      className="rounded-2xl bg-[#F7F4F2] p-3 text-center"
                    >
                      <div className="mx-auto flex h-[120px] w-full items-center justify-center overflow-hidden rounded-xl bg-white">
                        <ExerciseImage
                          src={
                            activity.imageUrl
                          }
                          alt={activity.title}
                        />
                      </div>

                      <p className="mt-3 text-[15px] font-medium leading-[145%] text-[#1E1E1E]">
                        {activity.title}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </Card>

          {exercise.thresholdsAreProvisional ? (
            <div className="rounded-2xl border border-[#DCD5F5] bg-[#F4F1FC] px-5 py-4">
              <p className="text-[14px] leading-[150%] text-[#4B3E72]">
                The movement thresholds used
                by this research prototype
                are provisional and may be
                refined during future
                co-design and evaluation.
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              asChild
              variant="outline"
              className="h-16 rounded-full text-[18px]"
            >
              <Link
                href={`/exercises/${exercise.slug}/demo`}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>

            <Button
              asChild
              className="h-16 rounded-full bg-[#592EBD] text-[18px] hover:bg-[#4B24A8]"
            >
              <Link
                href={`/exercises/${exercise.slug}/start`}
              >
                Start Exercise
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExerciseAnimation({
  startImage,
  endImage,
  fallbackImage,
  title,
}: {
  startImage: string | null;
  endImage: string | null;
  fallbackImage: string | null;
  title: string;
}) {
  const firstImage =
    startImage ?? fallbackImage;

  const secondImage =
    endImage ?? fallbackImage;

  if (!firstImage && !secondImage) {
    return (
      <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-[#F7F4F2]">
        <ImageIcon
          aria-hidden="true"
          className="h-16 w-16 text-neutral-400"
        />
      </div>
    );
  }

  if (
    !firstImage ||
    !secondImage ||
    firstImage === secondImage
  ) {
    return (
      <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-[#F7F4F2]">
        <ExerciseImage
          src={firstImage ?? secondImage}
          alt={`${title} exercise position`}
          priority
        />
      </div>
    );
  }

  return (
    <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-[#F7F4F2]">
      <Image
        src={firstImage}
        alt={`${title} starting position`}
        width={520}
        height={520}
        quality={100}
        priority
        className="absolute h-[420px] w-[420px] object-contain animate-[fadeOne_2.4s_ease-in-out_infinite]"
      />

      <Image
        src={secondImage}
        alt={`${title} exercise position`}
        width={520}
        height={520}
        quality={100}
        priority
        className="absolute h-[420px] w-[420px] object-contain animate-[fadeTwo_2.4s_ease-in-out_infinite]"
      />
    </div>
  );
}

function ExerciseImage({
  src,
  alt,
  priority = false,
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <ImageIcon
        aria-hidden="true"
        className="h-12 w-12 text-neutral-400"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={520}
      height={520}
      quality={100}
      priority={priority}
      className="h-full w-full object-contain"
    />
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b pb-4 last:border-b-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ECE8FF] text-[#592EBD]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[14px] text-[#888888]">
          {label}
        </p>

        <p className="break-words text-[16px] font-semibold text-[#1E1E1E]">
          {value}
        </p>
      </div>
    </div>
  );
}

function formatLabel(
  value: string
): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function getEstimatedDuration(
  targetReps: number,
  holdDurationMs: number | null
): string {
  const holdSeconds =
    holdDurationMs
      ? holdDurationMs / 1000
      : 0;

  const estimatedSecondsPerRep =
    6 + holdSeconds;

  const estimatedMinutes = Math.max(
    1,
    Math.ceil(
      (targetReps *
        estimatedSecondsPerRep) /
        60
    )
  );

  if (estimatedMinutes === 1) {
    return "About 1 minute";
  }

  return `About ${estimatedMinutes} minutes`;
}

function getFallbackStepImage({
  index,
  startImage,
  activeImage,
  thumbnailImage,
}: {
  index: number;
  startImage: string | null;
  activeImage: string | null;
  thumbnailImage: string | null;
}): string | null {
  if (index % 2 === 0) {
    return (
      startImage ??
      activeImage ??
      thumbnailImage
    );
  }

  return (
    activeImage ??
    startImage ??
    thumbnailImage
  );
}