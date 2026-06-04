import { Card } from "@/components/ui/card";

export function RangeOfMotionCard() {
  return (
    <Card className="rounded-2xl border-0 bg-white p-6 text-center shadow-none">
      <h2 className="text-left text-[22px] font-bold text-[#1E1E1E]">
        Range of Motion
      </h2>

      <div className="mt-8 text-[64px] font-bold text-[#1E1E1E]">175°</div>

      <p className="mt-2 text-[20px] font-semibold text-[#42B267]">
        Good Range
      </p>

      <div className="mt-6 flex justify-between text-[18px] font-bold">
        <span>0</span>
        <span>180</span>
      </div>
    </Card>
  );
}