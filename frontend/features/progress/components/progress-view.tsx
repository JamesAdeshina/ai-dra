import { ProgressStatCard } from "./progress-stat-card";
import { ScoreTrendCard } from "./score-trend-card";
import { TopExercisesCard } from "./top-exercises-card";

type ProgressViewProps = {
  hasData?: boolean;
};

export function ProgressView({ hasData = false }: ProgressViewProps) {
  return (
    <main className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[40px] font-bold text-[#1E1E1E]">
            Your Progress
          </h1>
          <p className="mt-1 text-[20px] text-[#1E1E1E]">
            Track your improvement over time.
          </p>
        </div>

        <div className="flex gap-2">
          {["7 Days", "30 Days", "3 Months", "All Time"].map((label) => (
            <button
              key={label}
              className={`h-[56px] rounded-xl border px-8 text-[14px] font-medium ${
                label === "30 Days"
                  ? "border-[#7875FB] bg-[#7875FB] text-white"
                  : "border-[#06C7A8] bg-transparent text-[#1E1E1E]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <ProgressStatCard
          title="Average Score"
          value={hasData ? "78%" : "0%"}
          hasData={hasData}
        />
        <ProgressStatCard
          title="Total Sessions"
          value={hasData ? "23" : "0"}
          hasData={hasData}
        />
        <ProgressStatCard
          title="Total Time"
          value={hasData ? "6h 38m" : "0"}
          hasData={hasData}
        />
        <ProgressStatCard
          title="Exercise Done"
          value={hasData ? "5" : "0"}
          hasData={hasData}
        />
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-6">
        <ScoreTrendCard hasData={hasData} />
        <TopExercisesCard hasData={hasData} />
      </div>
    </main>
  );
}