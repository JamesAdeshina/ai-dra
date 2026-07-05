"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Download,
  RefreshCw,
} from "lucide-react";

import {
  adminAttentionItems,
  adminDashboardMetrics,
  adminRecentActivity,
  adminSessionStatuses,
  adminSessionTrend,
} from "@/features/admin/data/admin-dashboard-data";
import { cn } from "@/lib/utils";

import { AttentionRequiredCard } from "./attention-required-card";
import { DashboardStatCard } from "./dashboard-stat-card";
import { RecentActivityTable } from "./recent-activity-table";
import { SessionStatusChart } from "./session-status-chart";
import { SessionTrendChart } from "./session-trend-chart";

export function AdminDashboardView() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 650);
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[#201D1B] sm:text-3xl">
                Admin Dashboard
              </h1>

              <span className="rounded-full bg-[#EEE8FF] px-3 py-1 text-xs font-semibold text-[#592EBD]">
                Demo dataset
              </span>
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#68615D] sm:text-base">
              Monitor survivor engagement, rehabilitation activity and
              platform usage across AI-DRA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#E4DFDB] bg-white px-4 text-sm font-medium text-[#3E3936] transition hover:bg-[#FAF9F8] disabled:cursor-wait disabled:opacity-70"
            >
              <RefreshCw
                size={17}
                className={cn(isRefreshing && "animate-spin")}
              />
              Refresh
            </button>

            <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#E4DFDB] bg-white px-4 text-sm font-medium text-[#3E3936]">
              <CalendarDays size={17} />
              Last 7 days
            </div>

            <button
              type="button"
              disabled
              title="Data export will be enabled after the database integration is complete."
              className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-xl bg-[#592EBD] px-5 text-sm font-semibold text-white opacity-70"
            >
              <Download size={17} />
              Export Data
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                Planned
              </span>
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminDashboardMetrics.map((metric) => (
            <DashboardStatCard key={metric.id} metric={metric} />
          ))}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <SessionTrendChart data={adminSessionTrend} />
          <SessionStatusChart data={adminSessionStatuses} />
        </div>

        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
          <RecentActivityTable activities={adminRecentActivity} />
          <AttentionRequiredCard items={adminAttentionItems} />
        </div>
      </div>
    </section>
  );
}