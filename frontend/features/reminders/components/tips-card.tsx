import { ChevronRight, Heart } from "lucide-react";

const tips = [
  "Consistency is more important than intensity",
  "Take breaks when you feel tired",
  "Focus on movement quality over speed",
  "Follow exercise demonstrations carefully",
];

export function TipsCard() {
  return (
    <div className="rounded-2xl bg-white p-6">
      <h3 className="text-lg font-semibold">
        Tips for Success
      </h3>

      <div className="mt-5 space-y-4">
        {tips.map((tip) => (
          <div
            key={tip}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5]">
                <Heart className="h-4 w-4 fill-[#592EBD] text-[#592EBD]" />
              </div>

              <span className="text-sm text-[#1E1E1E]">
                {tip}
              </span>
            </div>

            <ChevronRight className="h-4 w-4 text-[#9E9E9E]" />
          </div>
        ))}
      </div>
    </div>
  );
}