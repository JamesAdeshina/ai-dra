"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SetupCompleteStep() {
  const router = useRouter();

  const handleContinue = () => {
    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <div className="text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#00A651] text-white">
        <Check size={38} />
      </div>

      <h1 className="mt-10 text-[20px] font-medium text-[#1E1E1E]">
        Setup Complete
      </h1>

      <p className="mx-auto mt-2 max-w-[320px] text-[15px] leading-[150%] text-[#9E9E9E]">
        Your rehabilitation assistant is ready. Let&apos;s begin setting up
        your rehabilitation experience.
      </p>

      <Button
        type="button"
        onClick={handleContinue}
        className="mt-10 h-14 w-full rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8]"
      >
        Continue to Dashboard
      </Button>
    </div>
  );
}