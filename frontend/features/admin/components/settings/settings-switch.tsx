"use client";

import { cn } from "@/lib/utils";

type SettingsSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
};

export function SettingsSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  label,
}: SettingsSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked
          ? "bg-[#592EBD]"
          : "bg-[#D7DCE6]",
        disabled &&
          "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked
            ? "translate-x-[22px]"
            : "translate-x-0.5"
        )}
      />
    </button>
  );
}