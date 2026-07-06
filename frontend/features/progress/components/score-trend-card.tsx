import Link from "next/link";

import { ChartNoAxesColumn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type {
  ProgressTrendPoint,
} from "@/features/progress/types";

type ScoreTrendCardProps = {
  hasData: boolean;
  hasScores: boolean;
  trend: ProgressTrendPoint[];
};

export function ScoreTrendCard({
  hasData,
  hasScores,
  trend,
}: ScoreTrendCardProps) {
  return (
    <Card className="min-h-[348px] rounded-2xl border-0 bg-white p-6 shadow-none">
      <div>
        <h2 className="text-[18px] font-semibold text-[#1E1E1E]">
          {hasScores
            ? "Movement Score Trend"
            : "Session Activity"}
        </h2>

        <p className="mt-1 text-[14px] text-[#8A8A8A]">
          {hasScores
            ? "Average assessed movement score over time."
            : "Recorded rehabilitation sessions over time."}
        </p>
      </div>

      {hasData ? (
        <TrendChart
          trend={trend}
          hasScores={hasScores}
        />
      ) : (
        <div className="flex h-[280px] flex-col items-center justify-center text-center">
          <ChartNoAxesColumn className="h-16 w-16 text-[#C5C5C5]" />

          <h3 className="mt-3 text-[18px] font-semibold text-[#1E1E1E]">
            No Progress Data Yet
          </h3>

          <p className="mt-1 max-w-[420px] text-[14px] leading-[150%] text-[#9E9E9E]">
            Complete your first exercise
            session to see your rehabilitation
            activity here.
          </p>

          <Button
            asChild
            className="mt-5 h-[44px] rounded-full bg-[#592EBD] px-10 text-[16px] hover:bg-[#4B24A8]"
          >
            <Link href="/exercises">
              Start Your First Session
            </Link>
          </Button>
        </div>
      )}
    </Card>
  );
}

function TrendChart({
  trend,
  hasScores,
}: {
  trend: ProgressTrendPoint[];
  hasScores: boolean;
}) {
  if (trend.length === 0) {
    return null;
  }

  const values = trend.map((point) =>
    hasScores
      ? point.score ?? 0
      : point.sessions
  );

  const maximum = Math.max(
    1,
    ...values
  );

  const chartHeight = 150;

  return (
    <div className="mt-8">
      <div className="flex h-[240px] items-end gap-4 rounded-xl bg-[#F7FCFF] px-5 pb-4 pt-6">
        {trend.map((point, index) => {
          const value = values[index];

          const barHeight =
            value > 0
              ? Math.max(
                  14,
                  Math.round(
                    (value / maximum) *
                      chartHeight
                  )
                )
              : 4;

          return (
            <div
              key={`${point.label}-${index}`}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
            >
              <span className="mb-2 text-[13px] font-semibold text-[#2F2F2F]">
                {hasScores
                  ? point.score === null
                    ? "—"
                    : `${point.score}%`
                  : point.sessions}
              </span>

              <div className="flex h-[150px] w-full items-end justify-center">
                <div
                  className="w-full max-w-[56px] rounded-t-lg bg-[#7875FB] transition-all duration-500"
                  style={{
                    height: `${barHeight}px`,
                  }}
                  aria-label={`${point.label}: ${
                    hasScores
                      ? point.score === null
                        ? "Not assessed"
                        : `${point.score}%`
                      : `${point.sessions} sessions`
                  }`}
                />
              </div>

              <span className="mt-3 truncate text-[12px] text-[#777777]">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}