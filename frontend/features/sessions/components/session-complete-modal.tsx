import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SessionCompleteModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
      <div className="flex h-[515px] w-[388px] flex-col items-center rounded-[24px] bg-white px-6 py-[30px]">
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#F5F5F5] text-[64px]">
            🎉
          </div>

          <div className="text-center">
            <h2 className="text-[18px] font-medium leading-[150%] text-[#1E1E1E]">
              Session Complete
            </h2>
            <p className="text-[14px] font-medium leading-[150%] text-[#9E9E9E]">
              Great work today!
            </p>
          </div>

          <div className="flex h-[120px] w-full items-center justify-center rounded-xl bg-[#F5F5F5] text-center text-[14px] font-medium leading-[150%] text-black">
            <p>
              Exercise: Shoulder Flexion
              <br />
              Repetitions Completed: 10/10
              <br />
              Average Score: 87%
              <br />
              Duration: 4 min 52 sec
            </p>
          </div>

          <div className="mt-2 flex w-full flex-col gap-2">
            <Button className="h-[53px] rounded-[53px] bg-[#4F2BB1] text-[14px] font-medium text-[#FAFAFA] hover:bg-[#3F2292]">
              Continue Next Exercise
            </Button>

            <Link href="/dashboard">
              <Button
                variant="outline"
                className="h-[56px] w-full rounded-[53px] border-[#E0E0E0] text-[16px] font-normal text-[#1E1E1E]"
              >
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}