import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SettingsCardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
};

export function SettingsCard({
  children,
  className,
  title,
  description,
  actions,
}: SettingsCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#E4DFDB] bg-white p-5 shadow-sm sm:p-6",
        className
      )}
    >
      {title || description || actions ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-lg font-bold text-[#282422]">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p className="mt-1 text-sm leading-6 text-[#77706B]">
                {description}
              </p>
            ) : null}
          </div>

          {actions ? (
            <div className="shrink-0">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          title || description || actions
            ? "mt-5"
            : undefined
        )}
      >
        {children}
      </div>
    </section>
  );
}