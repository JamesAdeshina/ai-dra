import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HistoryEmptyState() {
  return (
    <div className="flex h-[520px] flex-col items-center justify-center text-center">
      <div className="text-[72px]">📄</div>

      <h2 className="mt-2 text-[18px] font-semibold text-[#1E1E1E]">
        No Sessions Yet
      </h2>

      <p className="mt-1 max-w-[420px] text-[14px] leading-[150%] text-[#9E9E9E]">
        Complete your first exercise session to see your scores, exercise
        trends, and recovery progress here.
      </p>

      <Link href="/exercises" className="mt-5">
        <Button className="h-[44px] rounded-full bg-[#592EBD] px-10 text-[16px] hover:bg-[#4B24A8]">
          Start First Session
        </Button>
      </Link>
    </div>
  );
}