import { Flame } from "lucide-react";

import { Card } from "@/components/ui/card";

type StreakCardProps = {
  days: number;
};

export function StreakCard({
  days,
}: StreakCardProps) {
  const safeDays = Math.max(
    0,
    days
  );

  return (
    <Card className="relative h-[300px] w-full overflow-hidden rounded-2xl border-0 bg-white p-6 shadow-none">
      <h2 className="text-[18px] font-semibold leading-[140%] text-[#1E1E1E]">
        Current Streak
      </h2>

      <div className="absolute -bottom-[90px] -left-[90px] h-[220px] w-[220px] rounded-full bg-[#592EBD]/10" />

      <div className="flex h-[235px] flex-col items-center justify-center">
        <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full bg-[#FFF3E8] text-[#F08A24]">
          <Flame
            className="h-12 w-12"
            fill="currentColor"
          />
        </div>

        <p className="mt-2 text-[34px] font-bold leading-[120%] text-[#010E0E]">
          {safeDays}
        </p>

        <p className="text-[15px] leading-[130%] text-[#1E1E1E]">
          {safeDays === 1
            ? "day"
            : "days"}
        </p>

        <p className="mt-4 max-w-[300px] text-center text-[15px] font-medium leading-[140%] text-[#1E1E1E]">
          {safeDays === 0
            ? "Complete a session today to begin a new activity streak."
            : `You have completed sessions for ${safeDays} consecutive ${
                safeDays === 1
                  ? "day"
                  : "days"
              }.`}
        </p>
      </div>
    </Card>
  );
}
