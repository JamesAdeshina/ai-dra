"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type SignOutModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SignOutModal({
  open,
  onClose,
}: SignOutModalProps) {
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!open) return null;

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.replace("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign out. Please try again."
      );

      setIsSigningOut(false);
    }
  };

  const handleClose = () => {
    if (isSigningOut) return;

    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-out-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-[420px] rounded-[32px] bg-white p-8">
        <div className="flex flex-col items-center">
          <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#F5F5F5]">
            <LogOut className="h-12 w-12 text-[#424242]" />
          </div>

          <h2
            id="sign-out-title"
            className="mb-3 text-center text-[26px] font-semibold text-[#1E1E1E]"
          >
            Sign Out of AI-DRA
          </h2>

          <p className="mb-8 text-center text-[18px] leading-relaxed text-[#9E9E9E]">
            Are you sure you want to sign out? You can sign back in at
            any time to continue your rehabilitation journey.
          </p>

          {errorMessage && (
            <div className="mb-5 w-full rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <Button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="mb-4 h-16 w-full rounded-full bg-[#F23636] text-xl hover:bg-[#E12D2D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? "Signing Out..." : "Yes, Sign Me Out"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSigningOut}
            className="h-16 w-full rounded-full border disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}