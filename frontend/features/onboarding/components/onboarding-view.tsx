"use client";

import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import { AddCarerStep } from "./add-carer-step";
import { PermissionsStep } from "./permissions-step";
import { SetupCompleteStep } from "./setup-complete-step";
import { WelcomeStep } from "./welcome-step";

export function OnboardingView() {
  const [step, setStep] = useState(0);

  const goNext = () => setStep((current) => Math.min(current + 1, 3));

  return (
    <main className="flex flex-col min-h-screen items-center bg-[#F7F4F2] px-6 py-6">
      <Logo />

      <div className="flex flex-1 items-center justify-center">
          <div
            className={`mt-6 w-full rounded-2xl bg-white shadow-none ${
              step === 3
                ? "max-w-[390px] p-8"
                : "max-w-[620px] px-10 py-8"
            }`}
          >
            {step === 0 && <WelcomeStep onNext={goNext} />}
            {step === 1 && <PermissionsStep onNext={goNext} />}
            {step === 2 && <AddCarerStep onNext={goNext} />}
            {step === 3 && <SetupCompleteStep />}
          </div>
      </div>
    </main>
  );
}