"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  LogOut,
  Settings,
  User,
  HelpCircle,
} from "lucide-react";

import { SignOutModal } from "./sign-out-modal";

export function ProfileDropdown() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="absolute right-0 top-[72px] z-40 w-[330px] rounded-[32px] bg-white p-5 shadow-xl">
        <h3 className="mb-3 text-[20px] font-semibold">
          Profile settings
        </h3>

        <div className="space-y-6 border-t pt-6">
          <Link
            href="/settings?tab=profile"
            className="flex items-center gap-4"
          >
            <User />
            <span className="">View Profile</span>
          </Link>

          <Link
            href="/settings?tab=personal"
            className="flex items-center gap-4"
          >
            <Settings />
            <span className="">Settings</span>
          </Link>

          <Link
            href="settings?tab=support"
            className="flex items-center gap-4"
          >
            <HelpCircle />
            <span className="">
              Help & Support
            </span>
          </Link>

          <button
            onClick={() => setShowModal(true)}
            className="mt-6 flex w-full items-center justify-between rounded-full bg-[#F5F5F5] p-3"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F23636]">
                <LogOut className="text-white" />
              </div>

              <span className="text-[18px] font-medium">
                Sign Out
              </span>
            </div>

            <ChevronRight />
          </button>
        </div>
      </div>

      <SignOutModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}