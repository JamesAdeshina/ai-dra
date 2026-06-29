"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ChevronRight,
  LogOut,
  Settings,
  User,
  HelpCircle,
} from "lucide-react";

import { SignOutModal } from "./sign-out-modal";

type ProfileDropdownProps = {
  onClose: () => void;
};

export function ProfileDropdown({
  onClose,
}: ProfileDropdownProps) {
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (showModal) return;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        onClose();
      }
    };

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape" &&
        !showModal
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [onClose, showModal]);

  return (
    <>
      <div
        ref={dropdownRef}
        className="absolute right-0 top-[72px] z-40 w-[330px] rounded-[32px] bg-white p-5 shadow-xl"
      >
        <h3 className="mb-3 text-[20px] font-semibold">
          Profile settings
        </h3>

        <div className="space-y-6 border-t pt-6">
          <Link
            href="/settings?tab=profile"
            onClick={onClose}
            className="flex items-center gap-4"
          >
            <User />
            <span>View Profile</span>
          </Link>

          <Link
            href="/settings?tab=personal"
            onClick={onClose}
            className="flex items-center gap-4"
          >
            <Settings />
            <span>Settings</span>
          </Link>

          <Link
            href="/settings?tab=support"
            onClick={onClose}
            className="flex items-center gap-4"
          >
            <HelpCircle />
            <span>Help & Support</span>
          </Link>

          <button
            type="button"
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
        onClose={() => {
          setShowModal(false);
          onClose();
        }}
      />
    </>
  );
}