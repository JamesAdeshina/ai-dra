"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Clock,
  Grid2X2,
  Home,
  LineChart,
  Settings,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { ProfileDropdown } from "@/components/navigation/profile-dropdown";
import { useCurrentProfile } from "@/features/profile/hooks/use-current-profile";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Exercises",
    href: "/exercises",
    icon: Grid2X2,
  },
  {
    label: "Progress",
    href: "/progress",
    icon: LineChart,
  },
  {
    label: "History",
    href: "/history",
    icon: Clock,
  },
  {
    label: "Reminders",
    href: "/reminders",
    icon: Bell,
  },
];

export function TopNavigation() {
  const pathname = usePathname();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const {
    profile,
    isLoading,
  } = useCurrentProfile();

  const displayName =
    profile?.display_name?.trim() ||
    [profile?.first_name, profile?.last_name]
      .filter(Boolean)
      .join(" ") ||
    "AI-DRA Survivor";

  const email =
    profile?.email?.trim() || "";

  const initials =
    [profile?.first_name, profile?.last_name]
      .filter(
        (name): name is string =>
          typeof name === "string" &&
          name.trim().length > 0
      )
      .map((name) =>
        name.trim().charAt(0).toUpperCase()
      )
      .join("")
      .slice(0, 2) ||
    displayName
      .split(" ")
      .filter(Boolean)
      .map((name) =>
        name.charAt(0).toUpperCase()
      )
      .join("")
      .slice(0, 2) ||
    "AD";

  return (
    <header className="sticky top-0 z-50 flex h-24 items-center justify-between border-b bg-white px-8">
      <Logo />

      <nav className="flex items-center gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium transition",
                active
                  ? "bg-purple-700 text-white"
                  : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
              )}
            >
              <Icon size={18} />

              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/settings"
          aria-label="Open settings"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-neutral-200"
        >
          <Settings size={20} />
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setProfileOpen(
                (current) => !current
              )
            }
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="flex items-center gap-3 rounded-xl p-1 text-left transition hover:bg-neutral-50"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E3F8] text-sm font-semibold text-[#592EBD]">
                {isLoading ? "" : initials}
              </div>
            )}

            <div className="min-w-0">
              <p className="max-w-[180px] truncate font-semibold text-[#1E1E1E]">
                {isLoading
                  ? "Loading profile..."
                  : displayName}
              </p>

              <p className="max-w-[180px] truncate text-xs text-muted-foreground">
                {isLoading ? "" : email}
              </p>
            </div>

            <ChevronDown
              size={18}
              className={cn(
                "transition-transform",
                profileOpen && "rotate-180"
              )}
            />
          </button>

          {profileOpen && (
            <ProfileDropdown
              onClose={() =>
                setProfileOpen(false)
              }
            />
          )}
        </div>
      </div>
    </header>
  );
}