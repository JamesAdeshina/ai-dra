import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleX,
  Clock3,
  HeartHandshake,
  Mail,
  Users,
} from "lucide-react";

import type {
  AdminDashboardMetric,
  AdminMetricIcon,
  AdminMetricTone,
} from "@/features/admin/types";
import { cn } from "@/lib/utils";

type DashboardStatCardProps = {
  metric: AdminDashboardMetric;
};

const iconMap = {
  survivors: Users,
  carers: HeartHandshake,
  "active-users": Activity,
  "completed-sessions": CheckCircle2,
  "ended-early": CircleX,
  invitations: Mail,
  difficulty: AlertTriangle,
  inactive: Clock3,
} satisfies Record<AdminMetricIcon, typeof Users>;

const toneClasses = {
  purple: "bg-[#EEE8FF] text-[#592EBD]",
  green: "bg-[#E6F7EF] text-[#22A765]",
  blue: "bg-[#E8F2FF] text-[#4F8DE8]",
  amber: "bg-[#FFF5DF] text-[#E89A16]",
  red: "bg-[#FFE9E9] text-[#F23636]",
  teal: "bg-[#E4F8F5] text-[#24A99A]",
} satisfies Record<AdminMetricTone, string>;

export function DashboardStatCard({ metric }: DashboardStatCardProps) {
  const Icon = iconMap[metric.icon];

  return (
    <article className="rounded-2xl border border-[#E8E4E1] bg-white p-5 shadow-[0_2px_10px_rgba(35,30,28,0.035)] transition-shadow hover:shadow-[0_8px_24px_rgba(35,30,28,0.07)]">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            toneClasses[metric.tone]
          )}
        >
          <Icon size={20} aria-hidden="true" />
        </span>

        <p className="text-sm font-medium text-[#393432]">{metric.label}</p>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-[#201D1B]">
        {metric.value}
      </p>

      <p className="mt-1.5 text-xs leading-5 text-[#817A75]">
        {metric.helper}
      </p>
    </article>
  );
}