import type { DashboardStat } from "@/features/carer/types";
import { DashboardStatCard } from "./dashboard-stat-card";

type DashboardSummaryProps = {
  stats: DashboardStat[];
};

export function DashboardSummary({ stats }: DashboardSummaryProps) {
  return (
    <section className="grid overflow-hidden rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)] sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <DashboardStatCard
          key={stat.id}
          stat={stat}
          withDivider={index > 0}
        />
      ))}
    </section>
  );
}
