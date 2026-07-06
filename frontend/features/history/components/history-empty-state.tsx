import Link from "next/link";

import { ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HistoryEmptyState() {
  return (
    <div className="flex h-[520px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F2EEFC] text-[#592EBD]">
        <ClipboardList
          aria-hidden="true"
          className="h-10 w-10"
        />
      </div>

      <h2 className="mt-5 text-[20px] font-semibold text-[#1E1E1E]">
        No Sessions Yet
      </h2>

      <p className="mt-2 max-w-[420px] text-[15px] leading-[150%] text-[#777777]">
        Complete your first exercise session
        to see your activity, scores and
        rehabilitation progress here.
      </p>

      <Button
        asChild
        className="mt-6 h-[46px] rounded-full bg-[#592EBD] px-10 text-[16px] hover:bg-[#4B24A8]"
      >
        <Link href="/exercises">
          Start First Session
        </Link>
      </Button>
    </div>
  );
}