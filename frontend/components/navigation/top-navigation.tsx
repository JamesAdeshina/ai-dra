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
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Exercises", href: "/exercises", icon: Grid2X2 },
  { label: "Progress", href: "/progress", icon: LineChart },
  { label: "History", href: "/history", icon: Clock },
  { label: "Reminders", href: "/reminders", icon: Bell },
];

export function TopNavigation() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-24 items-center justify-between border-b bg-white px-8">
      <Logo />

      <nav className="flex items-center gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

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
          className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100"
        >
          <Settings size={20} />
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((current) => !current)}
            className="flex items-center gap-3 text-left"
          >
            <div className="h-12 w-12 rounded-full bg-neutral-300" />

            <div>
              <p className="font-semibold">William Carter</p>
              <p className="text-xs text-muted-foreground">
                williamcarter@mail.com
              </p>
            </div>

            <ChevronDown size={18} />
          </button>

          {profileOpen && <ProfileDropdown />}
        </div>
      </div>
    </header>
  );
}