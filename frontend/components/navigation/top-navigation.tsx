"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";
import {
  Bell,
  ChevronDown,
  Clock,
  Grid2X2,
  Home,
  LineChart,
  Menu,
  Settings,
  X,
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

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const { profile, isLoading } =
    useCurrentProfile();

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

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  const Avatar = ({
    size = "large",
  }: {
    size?: "small" | "large";
  }) => {
    const sizeClass =
      size === "small"
        ? "h-10 w-10"
        : "h-12 w-12";

    if (profile?.avatar_url) {
      return (
        <img
          src={profile.avatar_url}
          alt={displayName}
          className={cn(
            sizeClass,
            "shrink-0 rounded-full object-cover"
          )}
        />
      );
    }

    return (
      <div
        className={cn(
          sizeClass,
          "flex shrink-0 items-center justify-center rounded-full bg-[#E9E3F8] text-sm font-semibold text-[#592EBD]"
        )}
      >
        {isLoading ? "" : initials}
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:h-20 sm:px-6 xl:h-24 xl:px-8">
        <div className="min-w-0 shrink-0">
          <Logo />
        </div>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-2 xl:flex"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  active ? "page" : undefined
                }
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition 2xl:px-6",
                  active
                    ? "bg-[#592EBD] text-white"
                    : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                )}
              >
                <Icon
                  size={18}
                  aria-hidden="true"
                />

                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/settings"
            aria-label="Open settings"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-neutral-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/20"
          >
            <Settings
              size={20}
              aria-hidden="true"
            />
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
              className="flex items-center gap-3 rounded-xl p-1 text-left transition hover:bg-neutral-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/20"
            >
              <Avatar />

              <div className="min-w-0">
                <p className="max-w-[150px] truncate font-semibold text-[#1E1E1E] 2xl:max-w-[180px]">
                  {isLoading
                    ? "Loading profile..."
                    : displayName}
                </p>

                <p className="max-w-[150px] truncate text-xs text-muted-foreground 2xl:max-w-[180px]">
                  {isLoading ? "" : email}
                </p>
              </div>

              <ChevronDown
                size={18}
                aria-hidden="true"
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

        <div className="flex items-center gap-2 xl:hidden">
          <Link
            href="/settings"
            aria-label="Open settings"
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-neutral-200 sm:flex"
          >
            <Settings
              size={19}
              aria-hidden="true"
            />
          </Link>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (current) => !current
              )
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 transition hover:bg-neutral-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/20"
          >
            {mobileMenuOpen ? (
              <X
                size={23}
                aria-hidden="true"
              />
            ) : (
              <Menu
                size={23}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="fixed inset-0 top-16 z-40 bg-black/30 backdrop-blur-[1px] sm:top-20 xl:hidden"
          />

          <div
            id="mobile-navigation"
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-neutral-200 bg-white px-4 py-5 shadow-xl sm:top-20 sm:px-6 xl:hidden"
          >
            <div className="mx-auto max-w-2xl">
              <div className="mb-5 flex items-center gap-3 rounded-2xl bg-[#F7F4FD] p-4">
                <Avatar size="small" />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#1E1E1E]">
                    {isLoading
                      ? "Loading profile..."
                      : displayName}
                  </p>

                  {email && (
                    <p className="truncate text-sm text-neutral-500">
                      {email}
                    </p>
                  )}
                </div>
              </div>

              <nav
                aria-label="Mobile navigation"
                className="grid gap-2 sm:grid-cols-2"
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    isActiveRoute(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
                      className={cn(
                        "flex min-h-14 items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition",
                        active
                          ? "bg-[#592EBD] text-white"
                          : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                      )}
                    >
                      <Icon
                        size={21}
                        aria-hidden="true"
                      />

                      {item.label}
                    </Link>
                  );
                })}

                <Link
                  href="/settings"
                  className={cn(
                    "flex min-h-14 items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition sm:hidden",
                    pathname.startsWith(
                      "/settings"
                    )
                      ? "bg-[#592EBD] text-white"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  )}
                >
                  <Settings
                    size={21}
                    aria-hidden="true"
                  />

                  Settings
                </Link>
              </nav>

              <div className="mt-4 border-t border-neutral-200 pt-4">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen(
                        (current) =>
                          !current
                      )
                    }
                    aria-expanded={
                      profileOpen
                    }
                    aria-haspopup="menu"
                    className="flex min-h-14 w-full items-center justify-between rounded-2xl border border-neutral-200 px-4 py-3 text-left transition hover:bg-neutral-50"
                  >
                    <span className="font-medium text-neutral-800">
                      Account options
                    </span>

                    <ChevronDown
                      size={19}
                      aria-hidden="true"
                      className={cn(
                        "transition-transform",
                        profileOpen &&
                          "rotate-180"
                      )}
                    />
                  </button>

                  {profileOpen && (
                    <div className="relative mt-2">
                      <ProfileDropdown
                        onClose={() =>
                          setProfileOpen(
                            false
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}