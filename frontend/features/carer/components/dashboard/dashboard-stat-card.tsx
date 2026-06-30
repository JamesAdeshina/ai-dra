import {
  CalendarDays,
  Check,
  Flame,
  UserRound,
} from "lucide-react";

import type { DashboardStat } from "@/features/carer/types";
import { cn } from "@/lib/utils";

type DashboardStatCardProps = {
  stat: DashboardStat;
  withDivider?: boolean;
};

const statPresentation = {
  goal: {
    icon: CalendarDays,
    iconClassName: "bg-[#EEE9FB] text-[#6B45D7]",
  },
  completed: {
    icon: Check,
    iconClassName: "bg-[#EAF8EF] text-[#28A861]",
  },
  streak: {
    icon: Flame,
    iconClassName: "bg-[#FFF7E5] text-[#F2B322]",
  },
  completion: {
    icon: UserRound,
    iconClassName: "bg-[#EAF3FF] text-[#3987E8]",
  },
} as const;

export function DashboardStatCard({
  stat,
  withDivider = false,
}: DashboardStatCardProps) {
  const presentation = statPresentation[stat.icon];
  const Icon = presentation.icon;

  return (
    <article
      className={cn(
        "min-w-0 px-4 py-4 sm:px-5",
        withDivider && "lg:border-l lg:border-[#E7E3DF]"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            presentation.iconClassName
          )}
        >
          <Icon size={20} strokeWidth={2} />
        </span>

        <p className="truncate text-sm font-medium text-[#37322F]">
          {stat.label}
        </p>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <strong className="text-[30px] leading-none text-[#201D1B]">
          {stat.value}
        </strong>
        {stat.suffix && (
          <span className="pb-0.5 text-xs text-[#817A75]">{stat.suffix}</span>
        )}
      </div>
    </article>
  );
}
