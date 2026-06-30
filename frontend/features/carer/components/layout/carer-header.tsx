"use client";

import Link from "next/link";
import {
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SignOutModal } from "@/components/navigation/sign-out-modal";
import { useCurrentProfile } from "@/features/profile/hooks/use-current-profile";
import { cn } from "@/lib/utils";

type CarerHeaderProps = {
  onOpenNavigation: () => void;
};

export function CarerHeader({ onOpenNavigation }: CarerHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { profile, isLoading } = useCurrentProfile();

  const displayName =
    profile?.display_name?.trim() ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    "Preya Sharma";

  const firstName =
    profile?.first_name?.trim() || displayName.split(" ")[0] || "Preya";

  const email = profile?.email?.trim() || "preyasharma@mail.com";

  const initials =
    [profile?.first_name, profile?.last_name]
      .filter((name): name is string => Boolean(name?.trim()))
      .map((name) => name.trim().charAt(0).toUpperCase())
      .join("")
      .slice(0, 2) ||
    displayName
      .split(" ")
      .filter(Boolean)
      .map((name) => name.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2) ||
    "PS";

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 flex min-h-[94px] items-center justify-between border-b border-[#ECE9E6] bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenNavigation}
            aria-label="Open navigation"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3F1EF] text-[#3D3835] lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-[#201D1B] sm:text-2xl">
              Good Morning, {isLoading ? "" : firstName}!
            </h1>
            <p className="mt-0.5 hidden text-sm text-[#5F5955] sm:block">
              Here’s how your connected survivors are doing today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/carer/settings"
            aria-label="Open carer settings"
            className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#F3F1EF] text-[#67615D] transition hover:bg-[#EAE6E2] sm:flex"
          >
            <Settings size={19} />
          </Link>

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-[#FAF9F8]"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E9E3F8] text-sm font-semibold text-[#592EBD]">
                  {isLoading ? "" : initials}
                </span>
              )}

              <span className="hidden min-w-0 sm:block">
                <span className="block max-w-44 truncate text-sm font-semibold text-[#2A2623]">
                  {isLoading ? "Loading profile..." : displayName}
                </span>
                <span className="block max-w-44 truncate text-xs text-[#817A75]">
                  {isLoading ? "" : email}
                </span>
              </span>

              <ChevronDown
                size={17}
                className={cn(
                  "hidden text-[#6B6561] transition-transform sm:block",
                  profileOpen && "rotate-180"
                )}
              />
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[58px] z-50 w-64 rounded-2xl border border-[#ECE8E4] bg-white p-2 shadow-xl"
              >
                <Link
                  href="/carer/settings?tab=profile"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-[#F7F5F3]"
                >
                  <User size={18} />
                  View profile
                </Link>

                <Link
                  href="/carer/settings"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-[#F7F5F3]"
                >
                  <Settings size={18} />
                  Settings
                </Link>

                <Link
                  href="/carer/settings?tab=support"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-[#F7F5F3]"
                >
                  <HelpCircle size={18} />
                  Help & support
                </Link>

                <div className="my-1 border-t border-[#ECE8E4]" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    setSignOutOpen(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#D93838] hover:bg-[#FFF3F3]"
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <SignOutModal
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
      />
    </>
  );
}
