"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { AdminSidebar } from "./admin-sidebar";

type AdminMobileNavigationProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminMobileNavigation({
  open,
  onClose,
}: AdminMobileNavigationProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label="Close admin navigation"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 left-0 w-[min(88vw,320px)] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close admin navigation"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#3D3835] shadow-sm"
        >
          <X size={20} />
        </button>

        <AdminSidebar onNavigate={onClose} />
      </div>
    </div>
  );
}