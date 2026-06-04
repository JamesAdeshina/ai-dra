import { Card } from "@/components/ui/card";

export function LiveFeedbackCard() {
  return (
    <Card className="rounded-2xl border-0 bg-white p-6 shadow-none">
      <h2 className="text-[22px] font-bold text-[#1E1E1E]">Live Feedback</h2>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: "Movement Score", value: "95%" },
          { label: "Accuracy", value: "65%" },
          { label: "Speed", value: "78%" },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-[#7875FB] text-[22px] font-bold">
              {item.value}
            </div>
            <p className="mt-3 text-[14px] text-[#666666]">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-[#F7F4F2] p-4">
        <p className="font-semibold text-[#42B267]">Good posture</p>
        <p className="mt-1 text-sm text-[#666666]">Raise arm slightly higher</p>
      </div>
    </Card>
  );
}