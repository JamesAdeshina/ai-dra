import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

const metrics = [
  { label: "Movement Score", value: 95, color: "#8566E0" },
  { label: "Accuracy", value: 65, color: "#42B267" },
  { label: "Speed", value: 78, color: "#F5A94C" },
];

export function LiveFeedbackCard() {
  return (
    <Card className="h-[326px] rounded-2xl border-0 bg-white p-5 shadow-none">
      <h2 className="text-[20px] font-semibold leading-[150%] text-[#1E1E1E]">
        Live Feedback
      </h2>

      <div className="mt-6 grid grid-cols-3 divide-x divide-[#E1E1E1]">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col items-center">
            <p className="mb-4 text-center text-[16px] font-medium leading-[140%]">
              {metric.label}
            </p>

            <div className="relative h-[105px] w-[105px]">
              <svg viewBox="0 0 120 120" className="-rotate-90">
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
                  strokeDasharray={`${metric.value * 3.01} 301`}
                />
              </svg>

              <div className="absolute inset-3 flex items-center justify-center rounded-full bg-[#F7FCFF] text-[17px] font-bold">
                {metric.value}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-4 text-[20px] font-semibold leading-[150%]">
        Current Feedback
      </h3>

      <div className="mt-2 flex items-center gap-3">
        <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#40C057]/30 text-[#40C057]">
          <Check size={28} />
        </div>

        <div>
          <p className="text-[16px] font-semibold text-[#40C057]">
            Good posture
          </p>
          <p className="text-[16px] text-black">Raise arm slightly higher</p>
        </div>
      </div>
    </Card>
  );
}