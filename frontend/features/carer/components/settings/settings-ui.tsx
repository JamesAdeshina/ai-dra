"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

type SettingsToastProps = {
  message: string | null;
  onDismiss: () => void;
  tone?: "success" | "error";
};

export function SettingsToast({
  message,
  onDismiss,
  tone = "success",
}: SettingsToastProps) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [message, onDismiss]);

  if (!message) {
    return null;
  }

  const success = tone === "success";

  return (
    <div
      role="status"
      className={cn(
        "fixed right-4 top-24 z-[80] flex w-[calc(100%-2rem)] max-w-md items-center gap-3 rounded-xl border px-4 py-3 shadow-lg",
        success
          ? "border-[#BCE8CE] bg-[#ECFAF2] text-[#18774A]"
          : "border-[#F4C5C5] bg-[#FFF1F1] text-[#B72F2F]",
      )}
    >
      {success ? (
        <CheckCircle2 size={20} className="shrink-0" />
      ) : (
        <CircleAlert size={20} className="shrink-0" />
      )}

      <p className="flex-1 text-sm font-medium">
        {message}
      </p>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss message"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export function BackToSettings() {
  return (
    <Link
      href="/carer/settings"
      className="inline-flex items-center gap-2 text-sm font-medium text-[#7652EF] transition hover:text-[#592EBD]"
    >
      <ArrowLeft size={18} />
      Back to Settings
    </Link>
  );
}

type SettingsPageHeaderProps = {
  title: string;
  description: string;
  showBackLink?: boolean;
};

export function SettingsPageHeader({
  title,
  description,
  showBackLink = true,
}: SettingsPageHeaderProps) {
  return (
    <header>
      {showBackLink ? <BackToSettings /> : null}

      <h1 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-[#211E1C]">
        {title}
      </h1>

      <p className="mt-1 text-base text-[#5F5955]">
        {description}
      </p>
    </header>
  );
}

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
};

export function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition",
        checked ? "bg-[#12B76A]" : "bg-[#D8D8D8]",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition",
          checked ? "left-6" : "left-1",
        )}
      />
    </button>
  );
}