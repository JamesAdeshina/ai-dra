import { Card } from "@/components/ui/card";

type WeeklyProgressCardProps = {
  completed: number;
  total: number;
};

export function WeeklyProgressCard({
  completed,
  total,
}: WeeklyProgressCardProps) {
  const safeCompleted = Math.max(
    0,
    completed
  );

  const safeTotal = Math.max(1, total);

  const progress = Math.min(
    1,
    safeCompleted / safeTotal
  );

  const circumference =
    2 * Math.PI * 50;

  return (
    <Card className="flex h-[300px] w-full flex-col rounded-2xl border-0 bg-white p-6 shadow-none">
      <h2 className="text-[18px] font-semibold leading-[140%] text-[#1E1E1E]">
        Weekly Progress
      </h2>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative h-[150px] w-[150px]">
          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#F5F5F5"
              strokeWidth="12"
              strokeLinecap="round"
            />

            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#42B267"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${progress * circumference} ${circumference}`}
              className="transition-all duration-500"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[30px] font-bold leading-[120%] text-[#010E0E]">
              {safeCompleted}/{safeTotal}
            </p>

            <p className="text-[12px] font-medium leading-[130%] text-[#1E1E1E]">
              Sessions
              <br />
              Completed
            </p>
          </div>
        </div>

        <p className="mt-4 max-w-[300px] text-center text-[15px] font-medium leading-[140%] text-[#1E1E1E]">
          {safeCompleted === 0
            ? "Complete your first session this week to begin."
            : safeCompleted >= safeTotal
              ? "Weekly target reached. Well done."
              : `${safeTotal - safeCompleted} more ${
                  safeTotal - safeCompleted === 1
                    ? "session"
                    : "sessions"
                } to reach the current target.`}
        </p>
      </div>
    </Card>
  );
}
