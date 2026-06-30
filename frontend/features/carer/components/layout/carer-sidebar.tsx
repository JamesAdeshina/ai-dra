"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

import { SignOutModal } from "@/components/navigation/sign-out-modal";
import { useCurrentProfile } from "@/features/profile/hooks/use-current-profile";
import { carerNavigationItems } from "@/features/carer/data/carer-navigation";
import { cn } from "@/lib/utils";

type CarerSidebarProps = {
  onNavigate?: () => void;
};

export function CarerSidebar({ onNavigate }: CarerSidebarProps) {
  const pathname = usePathname();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const { profile, isLoading } = useCurrentProfile();

  const displayName =
    profile?.display_name?.trim() ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    "Preya Sharma";

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

  return (
    <>
      <aside className="flex h-full min-h-screen flex-col border-r border-[#ECE9E6] bg-[#F8F6F4] px-6 py-7">
        <Link
          href="/carer/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 px-2"
        >
          <Image
            src="/images/logo.svg"
            alt="AI-DRA"
            width={48}
            height={48}
            priority
          />

          <div>
            <p className="text-[20px] font-bold leading-tight text-[#592EBD]">
              AI-DRA
            </p>
            <p className="text-xs text-[#7C7672]">Carer Portal</p>
          </div>
        </Link>

        <nav className="mt-10 flex-1" aria-label="Carer portal navigation">
          <ul className="space-y-2">
            {carerNavigationItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/carer/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <li
                  key={item.href}
                  className={cn(
                    item.separatorBefore &&
                      "mt-4 border-t border-[#E6E1DD] pt-4"
                  )}
                >
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-lg px-5 py-3 text-[15px] font-medium transition-colors",
                      active
                        ? "bg-[#592EBD] text-white shadow-sm"
                        : "text-[#363230] hover:bg-white hover:text-[#592EBD]"
                    )}
                  >
                    <Icon size={19} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-8">
          <Link
            href="/carer/settings?tab=profile"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-[0_1px_5px_rgba(24,20,18,0.04)] transition hover:shadow-sm"
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

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-[#282422]">
                {isLoading ? "Loading profile..." : displayName}
              </span>
              <span className="block truncate text-xs text-[#817A75]">
                {isLoading ? "" : email}
              </span>
            </span>
          </Link>

          <div className="my-4 border-t border-[#E6E1DD]" />

          <button
            type="button"
            onClick={() => setSignOutOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left font-medium text-[#3D3835] transition hover:bg-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE4E4] text-[#F23636]">
              <LogOut size={18} aria-hidden="true" />
            </span>
            Log out
          </button>
        </div>
      </aside>

      <SignOutModal
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
      />
    </>
  );
}
