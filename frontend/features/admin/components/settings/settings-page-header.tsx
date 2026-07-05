import type { ReactNode } from "react";

import { SettingsBreadcrumb } from "./settings-breadcrumb";

import type { AdminSettingsBreadcrumbItem } from "@/features/admin/types/admin-settings";

type SettingsPageHeaderProps = {
  title: string;
  description: string;
  breadcrumbs?: AdminSettingsBreadcrumbItem[];
  actions?: ReactNode;
};

export function SettingsPageHeader({
  title,
  description,
  breadcrumbs = [
    {
      label: "Admin",
      href: "/admin",
    },
    {
      label: "Settings",
    },
  ],
  actions,
}: SettingsPageHeaderProps) {
  return (
    <header>
      <SettingsBreadcrumb items={breadcrumbs} />

      <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#201D1B] sm:text-3xl">
            {title}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#68615D] sm:text-base">
            {description}
          </p>
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap gap-3">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}