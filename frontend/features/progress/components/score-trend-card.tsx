import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ScoreTrendCardProps = {
  hasData?: boolean;
};

export function ScoreTrendCard({ hasData = false }: ScoreTrendCardProps) {
  return (
    <Card className="h-[348px] rounded-2xl border-0 bg-white p-6 shadow-none">
      <h2 className="text-[18px] font-semibold text-[#1E1E1E]">Score Trend</h2>

      {hasData ? (
        <div className="mt-8 h-[250px] rounded-xl bg-[#F7FCFF] p-6">
          <svg viewBox="0 0 800 240" className="h-full w-full">
            <path
              d="M0 90 C80 150, 120 80, 180 120 S310 70, 360 130 S470 200, 540 120 S650 150, 800 220"
              fill="none"
              stroke="#006DFF"
              strokeWidth="4"
            />
            <path
              d="M0 230 C80 120, 140 160, 210 130 S330 170, 360 70 S470 20, 520 120 S640 80, 800 10"
              fill="none"
              stroke="#8AB9FF"
              strokeWidth="4"
            />
          </svg>
        </div>
      ) : (
        <div className="flex h-[280px] flex-col items-center justify-center text-center">
          <div className="text-[72px]">📄</div>
          <h3 className="mt-2 text-[18px] font-semibold text-[#1E1E1E]">
            No Progress Data Yet
          </h3>
          <p className="mt-1 max-w-[420px] text-[14px] leading-[150%] text-[#9E9E9E]">
            Complete your first exercise session to see your scores, exercise
            trends, and recovery progress here.
          </p>

          <Link href="/exercises" className="mt-5">
            <Button className="h-[44px] rounded-full bg-[#592EBD] px-10 text-[16px] hover:bg-[#4B24A8]">
              Start Your First Session
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}