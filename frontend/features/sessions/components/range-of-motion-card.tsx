import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

type RangeOfMotionCardProps = {
  angle: number;
};

export function RangeOfMotionCard({ angle }: RangeOfMotionCardProps) {
  const safeAngle = Math.max(0, Math.min(180, Math.round(angle || 0)));
  const progress = safeAngle / 180;

  const status =
    safeAngle >= 120 ? "Good Range" : safeAngle >= 60 ? "Keep Moving" : "Low Range";

  const statusColor = safeAngle >= 120 ? "#42B267" : "#F59E0B";

  const circumference = 314;
  const strokeDashoffset = circumference - circumference * progress;

  return (
    <Card className="h-[300px] rounded-2xl border-0 bg-white p-6 shadow-none">
      <h2 className="text-[20px] font-semibold leading-[150%] text-[#1E1E1E]">
        Range of Motion
      </h2>

      <div className="relative mx-auto mt-0 h-[220px] w-[300px]">
        <svg viewBox="0 0 240 140" className="h-full w-full">
          <path
            d="M40 120 A80 80 0 0 1 200 120"
            fill="none"
            stroke="#F5F5F5"
            strokeWidth="18"
            strokeLinecap="round"
            pathLength="100"
          />

          <path
            d="M40 120 A80 80 0 0 1 200 120"
            fill="none"
            stroke={statusColor}
            strokeWidth="18"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - progress * 100}
          />
        </svg>

        <div className="absolute inset-x-0 top-[78px] text-center">
          <p className="text-[42px] font-bold leading-none text-[#1E1E1E]">
            {safeAngle}°
          </p>

          <div
            className="mt-3 flex items-center justify-center gap-1"
            style={{ color: statusColor }}
          >
            <span className="text-[16px] font-medium">{status}</span>
            {safeAngle >= 120 && (
              <CheckCircle size={15} fill="#42B267" className="text-white" />
            )}
          </div>
        </div>

        <div className="absolute bottom-[28px] left-[18px] text-[15px] font-bold text-[#1E1E1E]">
          0°
        </div>

        <div className="absolute bottom-[28px] right-[16px] translate-x-1/2 text-[15px] font-bold text-[#1E1E1E]">
          180°
        </div>
      </div>
    </Card>
  );
}