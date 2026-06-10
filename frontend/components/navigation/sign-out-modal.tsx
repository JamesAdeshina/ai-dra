"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type SignOutModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SignOutModal({
  open,
  onClose,
}: SignOutModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[420px] rounded-[32px] bg-white p-8">
        <div className="flex flex-col items-center">
          <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#F5F5F5]">
            <LogOut className="h-12 w-12 text-[#424242]" />
          </div>

          <h2 className="mb-3 text-center text-[36px] font-semibold text-[#1E1E1E]">
            Sign Out of AI-DRA
          </h2>

          <p className="mb-10 text-center text-[18px] leading-relaxed text-[#9E9E9E]">
            Are you sure you want to sign out?
            You can sign back in at any time
            to continue your rehabilitation journey.
          </p>

          <Button
            className="mb-4 h-16 w-full rounded-full bg-[#F23636] text-xl hover:bg-[#e12d2d]"
          >
            Yes, Sign me Out
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="h-16 w-full rounded-full border"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}