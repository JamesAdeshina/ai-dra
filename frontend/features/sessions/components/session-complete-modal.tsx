import Link from "next/link";

import {
  CheckCircle2,
  Gauge,
  RotateCcw,
  ShieldAlert,
  Target,
  Timer,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type SpeedClassification =
  | "SLOW"
  | "CONTROLLED"
  | "FAST"
  | "NOT_ASSESSED";

type SessionCompleteModalProps = {
  exerciseSlug: string;
  exerciseTitle: string;

  repsCompleted?: number;
  totalReps?: number;

  averageAccuracy?: number | null;
  averageMovementScore?: number | null;

  speedClassification?: SpeedClassification;

  duration?: string;

  difficultyFlag?: boolean;
  recommendation?: string | null;

  onRepeatExercise?: () => void;
};

export function SessionCompleteModal({
  exerciseSlug,
  exerciseTitle,

  repsCompleted = 0,
  totalReps = 10,

  averageAccuracy = null,
  averageMovementScore = null,

  speedClassification = "NOT_ASSESSED",

  duration = "00:00",

  difficultyFlag = false,
  recommendation = null,

  onRepeatExercise,
}: SessionCompleteModalProps) {
  const completionRate =
    totalReps > 0
      ? Math.round(
          (repsCompleted / totalReps) * 100
        )
      : 0;

  const defaultRecommendation =
    difficultyFlag
      ? "AI-DRA noticed that this exercise may have been difficult. Consider taking a short break or repeating the movement more slowly."
      : "Good work. Continue practising with slow, controlled movement.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-[24px] bg-white px-6 py-7 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#E9F8EE] text-[#42B267]">
            <CheckCircle2
              className="h-12 w-12"
              strokeWidth={2.2}
            />
          </div>

          <h2 className="mt-4 text-[24px] font-semibold leading-[140%] text-[#1E1E1E]">
            Session Complete
          </h2>

          <p className="mt-1 text-[15px] font-medium leading-[150%] text-[#777777]">
            You completed {exerciseTitle}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <SummaryMetric
            icon={<Target size={20} />}
            label="Repetitions"
            value={`${repsCompleted}/${totalReps}`}
            helper={`${completionRate}% complete`}
          />

          <SummaryMetric
            icon={<Timer size={20} />}
            label="Duration"
            value={duration}
          />

          <SummaryMetric
            icon={<Target size={20} />}
            label="Average Accuracy"
            value={
              averageAccuracy === null
                ? "Not assessed"
                : `${Math.round(
                    averageAccuracy
                  )}%`
            }
          />

          <SummaryMetric
            icon={<Gauge size={20} />}
            label="Movement Score"
            value={
              averageMovementScore === null
                ? "Not assessed"
                : `${Math.round(
                    averageMovementScore
                  )}%`
            }
          />
        </div>

        <div className="mt-4 rounded-2xl bg-[#F7F4F2] px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[14px] font-medium text-[#666666]">
              Movement Speed
            </span>

            <span
              className={[
                "rounded-full px-3 py-1 text-[13px] font-semibold",
                getSpeedStyles(
                  speedClassification
                ),
              ].join(" ")}
            >
              {formatSpeedClassification(
                speedClassification
              )}
            </span>
          </div>
        </div>

        <div
          className={[
            "mt-4 rounded-2xl border px-5 py-4",
            difficultyFlag
              ? "border-amber-200 bg-amber-50"
              : "border-emerald-200 bg-emerald-50",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <div
              className={[
                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                difficultyFlag
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700",
              ].join(" ")}
            >
              {difficultyFlag ? (
                <ShieldAlert size={19} />
              ) : (
                <CheckCircle2 size={19} />
              )}
            </div>

            <div>
              <p
                className={[
                  "text-[15px] font-semibold",
                  difficultyFlag
                    ? "text-amber-900"
                    : "text-emerald-900",
                ].join(" ")}
              >
                {difficultyFlag
                  ? "Some difficulty detected"
                  : "Session completed successfully"}
              </p>

              <p
                className={[
                  "mt-1 text-[14px] leading-[150%]",
                  difficultyFlag
                    ? "text-amber-800"
                    : "text-emerald-800",
                ].join(" ")}
              >
                {recommendation ??
                  defaultRecommendation}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[12px] leading-[150%] text-[#888888]">
          Scores use prototype rules and
          provisional thresholds. They are
          not a clinical assessment.
        </p>

        <div className="mt-6 flex w-full flex-col gap-3">
          <Button
            type="button"
            onClick={onRepeatExercise}
            className="h-[54px] rounded-full bg-[#4F2BB1] text-[16px] font-medium text-white hover:bg-[#3F2292]"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Repeat Exercise
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-[54px] rounded-full border-[#D8D8D8] text-[16px] font-medium text-[#1E1E1E]"
          >
            <Link href="/exercises">
              Choose Another Exercise
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="h-[50px] rounded-full text-[15px] font-medium text-[#666666]"
          >
            <Link href="/dashboard">
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryMetric({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F7F4F2] p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#592EBD]">
        {icon}
      </div>

      <p className="mt-3 text-[13px] font-medium text-[#777777]">
        {label}
      </p>

      <p className="mt-1 break-words text-[20px] font-semibold text-[#1E1E1E]">
        {value}
      </p>

      {helper ? (
        <p className="mt-1 text-[12px] text-[#888888]">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

function formatSpeedClassification(
  value: SpeedClassification
): string {
  switch (value) {
    case "CONTROLLED":
      return "Controlled";

    case "FAST":
      return "Fast";

    case "SLOW":
      return "Slow";

    default:
      return "Not assessed";
  }
}

function getSpeedStyles(
  value: SpeedClassification
): string {
  switch (value) {
    case "CONTROLLED":
      return "bg-emerald-100 text-emerald-800";

    case "FAST":
      return "bg-amber-100 text-amber-800";

    case "SLOW":
      return "bg-blue-100 text-blue-800";

    default:
      return "bg-neutral-200 text-neutral-700";
  }
}