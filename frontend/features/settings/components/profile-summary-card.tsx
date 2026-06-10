import { Pencil } from "lucide-react";

type ProfileSummaryCardProps = {
  hasData?: boolean;
};

export function ProfileSummaryCard({ hasData = false }: ProfileSummaryCardProps) {
  return (
    <div className="rounded-2xl bg-white p-8">
      <h2 className="text-[24px] font-semibold text-[#1E1E1E]">
        Profile Summary
      </h2>

      <div className="mt-12 flex justify-center">
        <div className="relative">
          <div className="h-[130px] w-[130px] rounded-full border-4 border-[#E7C83F] bg-[#D9D9D9]" />

          <button className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5]">
            <Pencil size={18} />
          </button>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <div>
          <p className="text-[16px] text-[#1E1E1E]">Member Since</p>
          <p className="mt-1 text-[28px] text-[#1E1E1E]">May 2026</p>
        </div>

        <div>
          <p className="text-[16px] text-[#1E1E1E]">Rehabilitation Level</p>
          <p className="mt-1 text-[28px] text-[#1E1E1E]">
            {hasData ? "Intermediate" : "Not Assessed Yet"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[16px] text-[#1E1E1E]">Weekly Goal</p>
            <p className="mt-1 text-[28px] text-[#1E1E1E]">
              {hasData ? "30 Minutes" : "Not Set"}
            </p>
          </div>

          <button className="h-14 rounded-full border px-8 text-[16px]">
            {hasData ? "Edit" : "Set Goal"}
          </button>
        </div>

        <div>
          <p className="text-[16px] text-[#1E1E1E]">Sessions Completed</p>
          <p className="mt-1 text-[28px] text-[#1E1E1E]">
            {hasData ? "18" : "0"}
          </p>
        </div>
      </div>
    </div>
  );
}