import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function RangeOfMotionCard() {
  return (
    <Card className="h-[300px] rounded-2xl border-0 bg-white p-6 shadow-none">
      <h2 className="text-[20px] font-semibold leading-[150%] text-[#1E1E1E]">
        Range of Motion
      </h2>

      <div className="relative mx-auto mt-6 h-[210px] w-[285px]">
        <svg viewBox="0 0 285 180" className="h-full w-full">
          <path
            d="M40 150 A105 105 0 0 1 245 150"
            fill="none"
            stroke="#F5F5F5"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M40 150 A105 105 0 0 1 190 55"
            fill="none"
            stroke="#42B267"
            strokeWidth="24"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-x-0 top-[75px] text-center">
          <p className="text-[40px] font-bold leading-[150%] text-[#1E1E1E]">
            175°
          </p>

          <div className="mt-1 flex items-center justify-center gap-1 text-[#42B267]">
            <span className="text-[16px] font-medium">Good Range</span>
            <CheckCircle size={15} fill="#42B267" className="text-white" />
          </div>
        </div>

        <div className="absolute bottom-5 left-5 text-[16px] font-bold">0</div>
        <div className="absolute bottom-5 right-5 text-[16px] font-bold">
          180
        </div>
      </div>
    </Card>
  );
}