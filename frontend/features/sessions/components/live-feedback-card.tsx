import {
  Check,
  CircleAlert,
  Eye,
  EyeOff,
} from "lucide-react";

import { Card } from "@/components/ui/card";

export type SpeedClassification =
  | "SLOW"
  | "CONTROLLED"
  | "FAST"
  | "NOT_ASSESSED";

type LiveFeedbackCardProps = {
  movementScore: number | null;
  accuracyScore: number | null;
  speedScore: number | null;
  speedClassification: SpeedClassification;
  isTracking: boolean;
  feedback: string;
  isProvisional?: boolean;
};

type MetricItem = {
  label: string;
  value: number | null;
  color: string;
  supportingLabel?: string;
};

export function LiveFeedbackCard({
  movementScore,
  accuracyScore,
  speedScore,
  speedClassification,
  isTracking,
  feedback,
  isProvisional = true,
}: LiveFeedbackCardProps) {
  const metrics: MetricItem[] = [
    {
      label: "Movement Score",
      value: movementScore,
      color: "#8566E0",
    },
    {
      label: "Accuracy",
      value: accuracyScore,
      color: "#42B267",
    },
    {
      label: "Speed",
      value: speedScore,
      color: "#F5A94C",
      supportingLabel:
        formatSpeedClassification(
          speedClassification
        ),
    },
  ];

  return (
    <Card className="min-h-[326px] rounded-2xl border-0 bg-white p-5 shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold leading-[150%] text-[#1E1E1E]">
            Live Feedback
          </h2>

          {isProvisional ? (
            <p className="mt-1 text-[12px] text-[#888888]">
              Prototype scoring with
              provisional thresholds
            </p>
          ) : null}
        </div>

        <TrackingBadge
          isTracking={isTracking}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x divide-[#E1E1E1]">
        {metrics.map((metric) => (
          <MetricCircle
            key={metric.label}
            metric={metric}
          />
        ))}
      </div>

      <h3 className="mt-4 text-[20px] font-semibold leading-[150%] text-[#1E1E1E]">
        Current Feedback
      </h3>

      <div className="mt-2 flex items-center gap-3">
        <div
          className={[
            "flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full",
            isTracking
              ? "bg-[#40C057]/20 text-[#40C057]"
              : "bg-amber-100 text-amber-700",
          ].join(" ")}
        >
          {isTracking ? (
            <Check size={28} />
          ) : (
            <CircleAlert size={26} />
          )}
        </div>

        <div className="min-w-0">
          <p
            className={[
              "text-[16px] font-semibold",
              isTracking
                ? "text-[#40C057]"
                : "text-amber-700",
            ].join(" ")}
          >
            {isTracking
              ? "Movement detected"
              : "Tracking unavailable"}
          </p>

          <p className="text-[16px] leading-[145%] text-black">
            {isTracking
              ? feedback ||
                "Continue following the movement guidance."
              : "Move back into view so AI-DRA can continue tracking."}
          </p>
        </div>
      </div>
    </Card>
  );
}

function MetricCircle({
  metric,
}: {
  metric: MetricItem;
}) {
  const safeValue =
    metric.value === null
      ? 0
      : Math.min(
          100,
          Math.max(0, metric.value)
        );

  const circumference =
    2 * Math.PI * 48;

  const progressLength =
    (safeValue / 100) * circumference;

  return (
    <div className="flex min-w-0 flex-col items-center px-2">
      <p className="mb-4 min-h-[44px] text-center text-[15px] font-medium leading-[140%]">
        {metric.label}
      </p>

      <div className="relative h-[105px] w-[105px]">
        <svg
          viewBox="0 0 120 120"
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="#E8F4FC"
            strokeWidth="10"
          />

          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke={metric.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${progressLength} ${circumference}`}
            className="transition-all duration-500"
          />
        </svg>

        <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-[#F7FCFF] text-center">
          <span className="text-[17px] font-bold">
            {metric.value === null
              ? "—"
              : `${Math.round(
                  safeValue
                )}%`}
          </span>

          {metric.supportingLabel ? (
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#777777]">
              {metric.supportingLabel}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TrackingBadge({
  isTracking,
}: {
  isTracking: boolean;
}) {
  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold",
        isTracking
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700",
      ].join(" ")}
    >
      {isTracking ? (
        <Eye size={14} />
      ) : (
        <EyeOff size={14} />
      )}

      {isTracking
        ? "Tracking"
        : "Not tracking"}
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
      return "Waiting";
  }
}