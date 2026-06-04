import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function TodaysSessionCard() {
  return (
    <Card className="w-full rounded-2xl border-0 bg-white p-4 shadow-none">
      <p className="mb-5 text-[18px] font-semibold text-[#592EBD]">
        Today&apos;s Session
      </p>

      <div className="flex gap-5">
        {/* Exercise Illustration */}
        <div className="flex h-[254px] w-[148px] items-center justify-center rounded-2xl bg-[#F7F4F2]">
          <span className="text-6xl">🧍</span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-6">
          <h2 className="text-[24px] font-semibold text-[#1E1E1E]">
            Shoulder Flexion
          </h2>

          {/* Exercise Details */}
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-semibold text-[#7875FB]">
              Level 2
            </span>

            <span className="text-[20px] font-bold text-[#010E0E]">
              10 reps
            </span>

            <span className="text-[14px] font-normal text-[#616161]">
              5 Minutes
            </span>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4">
            <div className="flex flex-1 rounded-full bg-[#FAFAFA] p-[3px]">
              <div className="flex w-full gap-[2px]">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-[22px] flex-1 bg-[#D9D9D9]
                    ${index === 0 ? "rounded-l-full" : ""}
                    ${index === 9 ? "rounded-r-full" : ""}
                    ${index > 0 && index < 9 ? "rounded-md" : ""}
                  `}
                  />
                ))}
              </div>
            </div>

            <span className="text-[20px] font-semibold text-[#592EBD]">
              0%
            </span>
          </div>

          {/* CTA */}
          <Button
            className="
              h-[50px]
              w-full
              rounded-full
              bg-[#592EBD]
              text-[15px]
              font-medium
              text-white
              hover:bg-[#4B24A8]
            "
          >
            Start Session
          </Button>
        </div>
      </div>
    </Card>
  );
}