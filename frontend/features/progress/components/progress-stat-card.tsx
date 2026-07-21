import {
  ArrowUpRight,
  Info,
} from "lucide-react";

import { Card } from "@/components/ui/card";

type ProgressStatCardProps = {
  title: string;
  value: string;
  helperText: string;
  hasData?: boolean;
};

export function ProgressStatCard({
  title,
  value,
  helperText,
  hasData = false,
}: ProgressStatCardProps) {
  const isLongValue =
    value.length > 10;

  return (
    <Card className="min-h-[164px] rounded-2xl border-0 bg-white p-6 shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[18px] font-semibold text-[#1E1E1E]">
            {title}
          </h3>

          <p
            className={[
              "mt-5 break-words font-normal leading-none text-[#1E1E1E]",
              isLongValue
                ? "text-[28px]"
                : "text-[48px]",
            ].join(" ")}
          >
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5] text-[#424242]">
          <ArrowUpRight size={18} />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 text-[14px]">
        <Info
          size={14}
          className={
            hasData
              ? "mt-0.5 text-[#592EBD]"
              : "mt-0.5 text-[#9E9E9E]"
          }
        />

        <span className="leading-[145%] text-[#666666]">
          {helperText}
        </span>
      </div>
    </Card>
  );
}