import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Info,
} from "lucide-react";

import type {
  AdminSettingsNoticeTone,
} from "@/features/admin/types/admin-settings";
import { cn } from "@/lib/utils";

type SettingsSaveNoticeProps = {
  title?: string;
  message: string;
  tone?: AdminSettingsNoticeTone;
};

const toneClasses: Record<
  AdminSettingsNoticeTone,
  string
> = {
  info: "border-[#D9D0F0] bg-[#FAF8FF] text-[#625A6D]",
  success: "border-[#BDE8D0] bg-[#F0FBF5] text-[#337153]",
  warning: "border-[#F1D89C] bg-[#FFF9EB] text-[#73551A]",
  danger: "border-[#F2C4C4] bg-[#FFF5F5] text-[#8C3838]",
};

const iconClasses: Record<
  AdminSettingsNoticeTone,
  string
> = {
  info: "text-[#592EBD]",
  success: "text-[#20A663]",
  warning: "text-[#D88A00]",
  danger: "text-[#D43D3D]",
};

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: CircleAlert,
};

export function SettingsSaveNotice({
  title,
  message,
  tone = "info",
}: SettingsSaveNoticeProps) {
  const Icon = icons[tone];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-4",
        toneClasses[tone]
      )}
    >
      <Icon
        size={20}
        className={cn(
          "mt-0.5 shrink-0",
          iconClasses[tone]
        )}
      />

      <div>
        {title ? (
          <p className="text-sm font-semibold">
            {title}
          </p>
        ) : null}

        <p
          className={cn(
            "text-sm leading-6",
            title && "mt-1"
          )}
        >
          {message}
        </p>
      </div>
    </div>
  );
}