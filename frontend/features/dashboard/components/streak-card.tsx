import { Card } from "@/components/ui/card";

type StreakCardProps = {
  days?: number;
};

export function StreakCard({ days = 0 }: StreakCardProps) {
  const isEmpty = days === 0;

  return (
    <Card className="relative h-[300px] w-full overflow-hidden rounded-2xl border-0 bg-white p-6 shadow-none">
      <h2 className="text-[18px] font-semibold leading-[140%] text-[#1E1E1E]">
        Current Streak
      </h2>

      <div className="absolute -bottom-[90px] -left-[90px] h-[220px] w-[220px] rounded-full bg-[#592EBD]/10" />

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex h-[90px] w-[90px] items-center justify-center text-[80px]">
          🔥
        </div>

        <p className="mt-2 text-[34px] font-bold leading-[120%] text-[#010E0E]">
          {days}
        </p>

        <p className="text-[15px] leading-[130%] text-[#1E1E1E]">
          days
        </p>

        <p className="mt-4 max-w-[300px] text-center text-[15px] font-medium leading-[140%] text-[#1E1E1E]">
          {isEmpty
            ? "Start your rehabilitation journey today and build a healthy exercise routine."
            : `You've exercised for ${days} consecutive days.`}
        </p>
      </div>
    </Card>
  );
}