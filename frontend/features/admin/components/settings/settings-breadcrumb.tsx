import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { AdminSettingsBreadcrumbItem } from "@/features/admin/types/admin-settings";

type SettingsBreadcrumbProps = {
  items: AdminSettingsBreadcrumbItem[];
};

export function SettingsBreadcrumb({
  items,
}: SettingsBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="font-medium text-[#625C58] transition hover:text-[#592EBD]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "font-semibold text-[#592EBD]"
                    : "font-medium text-[#625C58]"
                }
              >
                {item.label}
              </span>
            )}

            {!isLast ? (
              <ChevronRight
                size={15}
                className="text-[#A39C97]"
              />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}