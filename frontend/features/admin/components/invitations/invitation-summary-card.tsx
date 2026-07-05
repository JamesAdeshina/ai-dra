import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SummaryTone =
  | "purple"
  | "amber"
  | "green"
  | "red"
  | "grey";

type InvitationSummaryCardProps = {
  title: string;
  value: number;
  helper: string;
  icon: LucideIcon;
  tone: SummaryTone;
};

const toneClasses: Record<SummaryTone, string> = {
  purple: "bg-[#EEE8FF] text-[#592EBD]",
  amber: "bg-[#FFF4DD] text-[#E99A17]",
  green: "bg-[#E6F7EF] text-[#20A663]",
  red: "bg-[#FFE7E7] text-[#F23636]",
  grey: "bg-[#EEF1F5] text-[#7A8494]",
};

export function InvitationSummaryCard({
  title,
  value,
  helper,
  icon: Icon,
  tone,
}: InvitationSummaryCardProps) {
  return (
    <article className="rounded-2xl border border-[#E4DFDB] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            toneClasses[tone]
          )}
        >
          <Icon size={18} aria-hidden="true" />
        </span>

        <p className="text-sm font-semibold leading-5 text-[#393432]">
          {title}
        </p>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-[#201D1B]">
        {value}
      </p>

      <p className="mt-1.5 text-xs text-[#7D7671]">{helper}</p>
    </article>
  );
}