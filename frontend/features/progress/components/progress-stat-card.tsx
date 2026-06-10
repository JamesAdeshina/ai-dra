import { ArrowUpRight, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

type ProgressStatCardProps = {
  title: string;
  value: string;
  hasData?: boolean;
};

export function ProgressStatCard({
  title,
  value,
  hasData = false,
}: ProgressStatCardProps) {
  return (
    <Card className="h-[134px] rounded-2xl border-0 bg-white p-6 shadow-none">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-[#1E1E1E]">{title}</h3>
          <p className="mt-5 text-[48px] font-normal leading-none text-[#1E1E1E]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5] text-[#424242]">
          <ArrowUpRight size={18} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-[14px]">
        {hasData ? (
          <>
            <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-500">
              ↑ +34%
            </span>
            <span className="text-[#1E1E1E]">vs last 30 days</span>
          </>
        ) : (
          <>
            <Info size={14} className="text-[#9E9E9E]" />
            <span className="text-[#1E1E1E]">No data yet</span>
          </>
        )}
      </div>
    </Card>
  );
}