import { Card } from "@/components/ui/card";

type StreakCardProps = {
  days?: number;
};

export function StreakCard({ days = 0 }: StreakCardProps) {
  const isEmpty = days === 0;

  return (
    <Card className="relative h-[581px] w-full overflow-hidden rounded-2xl border-0 bg-white p-6 shadow-none">
      <h2 className="text-[20px] font-semibold leading-[140%] text-[#1E1E1E]">
        Current Streak
      </h2>

      <div className="absolute -bottom-[25px] -left-[75px] h-[337px] w-[337px] rounded-full bg-[#592EBD]/10" />

      <div className="absolute left-1/2 top-[100px] flex h-[212px] w-[212px] -translate-x-1/2 items-center justify-center text-[150px]">
        🔥
      </div>

      <div className="absolute left-1/2 top-[312px] w-[138px] -translate-x-1/2 text-center">
        <p className="text-[48px] font-bold leading-[150%] text-[#010E0E]">
          {days}
        </p>
        <p className="text-[20px] leading-[150%] text-[#1E1E1E]">
          days
        </p>
      </div>

      <p className="absolute left-1/2 top-[483px] w-[436px] -translate-x-1/2 text-center text-[20px] font-medium leading-[150%] text-[#1E1E1E]">
        {isEmpty
          ? "Start your rehabilitation journey today and build a healthy exercise routine."
          : `You've exercised for ${days} consecutive days.`}
      </p>
    </Card>
  );
}