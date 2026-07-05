import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  Info,
} from "lucide-react";

import type {
  AdminAttentionItem,
  AdminAttentionLevel,
} from "@/features/admin/types";
import { cn } from "@/lib/utils";

type AttentionRequiredCardProps = {
  items: AdminAttentionItem[];
};

const levelClasses = {
  Information: "bg-[#E8F2FF] text-[#4F8DE8]",
  Attention: "bg-[#FFF5DF] text-[#D88B12]",
  Important: "bg-[#FFE9E9] text-[#F23636]",
} satisfies Record<AdminAttentionLevel, string>;

const levelIcons = {
  Information: Info,
  Attention: BellRing,
  Important: AlertTriangle,
} satisfies Record<AdminAttentionLevel, typeof Info>;

export function AttentionRequiredCard({
  items,
}: AttentionRequiredCardProps) {
  return (
    <article className="rounded-2xl border border-[#E8E4E1] bg-white p-5 shadow-[0_2px_10px_rgba(35,30,28,0.035)]">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEE8FF] text-[#592EBD]">
          <AlertTriangle size={20} aria-hidden="true" />
        </span>

        <div>
          <h2 className="text-base font-semibold text-[#282422]">
            Needs Attention
          </h2>

          <p className="mt-0.5 text-sm text-[#7D7671]">
            Monitoring items requiring review.
          </p>
        </div>
      </div>

      <div className="mt-5 divide-y divide-[#EEEAE6]">
        {items.map((item) => {
          const Icon = levelIcons[item.level];

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex gap-3 py-4 first:pt-1"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  levelClasses[item.level]
                )}
              >
                <Icon size={15} aria-hidden="true" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#302B28]">
                  {item.title}
                </span>

                <span className="mt-1 block text-xs leading-5 text-[#7A736E]">
                  {item.description}
                </span>
              </span>

              <ArrowRight
                size={17}
                className="mt-1 shrink-0 text-[#A19A95] transition-transform group-hover:translate-x-1 group-hover:text-[#592EBD]"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </article>
  );
}