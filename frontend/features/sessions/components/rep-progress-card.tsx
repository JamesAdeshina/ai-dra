import { Card } from "@/components/ui/card";

type RepProgressCardProps = {
  currentRep: number;
  totalReps: number;
};

export function RepProgressCard({
  currentRep,
  totalReps,
}: RepProgressCardProps) {
  const safeCurrentRep = Math.min(currentRep, totalReps);

  return (
    <Card className="h-[158px] rounded-2xl border-0 bg-white p-5 shadow-none">
      <h2 className="text-[20px] font-semibold leading-[150%] text-[#1E1E1E]">
        Rep Progress
      </h2>

      <div className="mt-8 flex rounded-full bg-[#FAFAFA] p-[3px]">
        <div className="flex w-full gap-[2px]">
          {Array.from({ length: totalReps }).map((_, index) => (
            <div
              key={index}
              className={`h-[22px] flex-1 ${
                index < safeCurrentRep ? "bg-[#592EBD]" : "bg-[#D9D9D9]"
              } ${index === 0 ? "rounded-l-full" : "rounded-md"} ${
                index === totalReps - 1 ? "rounded-r-full" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <p className="mt-5 text-[32px] font-semibold leading-[120%] text-[#111111]">
        {safeCurrentRep}
        <span className="text-[20px] text-[#B3B3B3]">
          /{totalReps} Reps
        </span>
      </p>
    </Card>
  );
}