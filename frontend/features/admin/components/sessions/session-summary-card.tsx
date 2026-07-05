import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SessionSummaryTone =
  | "purple"
  | "green"
  | "blue"
  | "amber"
  | "red";

type SessionSummaryCardProps = {
  title: string;
  value: number;
  helper: string;
  icon: LucideIcon;
  tone: SessionSummaryTone;
};

const toneClasses: Record<SessionSummaryTone, string> = {
  purple: "bg-[#EEE8FF] text-[#592EBD]",
  green: "bg-[#E6F7EF] text-[#20A663]",
  blue: "bg-[#E8F2FF] text-[#2879D8]",
  amber: "bg-[#FFF4DD] text-[#E99A17]",
  red: "bg-[#FFE7E7] text-[#F23636]",
};

export function SessionSummaryCard({
  title,
  value,
  helper,
  icon: Icon,
  tone,
}: SessionSummaryCardProps) {
  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            toneClasses[tone]
          )}
        >
          <Icon size={20} aria-hidden="true" />
        </span>

        <p className="text-sm font-semibold text-[#393432]">
          {title}
        </p>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-[#201D1B]">
        {value}
      </p>

      <p className="mt-1.5 text-xs text-[#7D7671]">
        {helper}
      </p>
    </article>
  );
}