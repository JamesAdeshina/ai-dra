import { Card } from "@/components/ui/card";

export function RepProgressCard() {
  return (
    <Card className="rounded-2xl border-0 bg-white p-6 shadow-none">
      <h2 className="text-[22px] font-bold text-[#1E1E1E]">Rep Progress</h2>

      <div className="mt-6 flex gap-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className={`h-5 flex-1 rounded-md ${
              index < 7 ? "bg-[#592EBD]" : "bg-[#D9D9D9]"
            }`}
          />
        ))}
      </div>

      <p className="mt-6 text-[32px] font-bold text-[#1E1E1E]">
        7<span className="text-[20px] font-normal text-[#8A8A8A]">/10 Reps</span>
      </p>
    </Card>
  );
}