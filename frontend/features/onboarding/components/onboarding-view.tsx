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
    <main className="flex min-h-screen flex-col items-center bg-[#F7F4F2] px-6 pt-14">
      <Logo />

      <div
        className={`mt-16 w-full rounded-2xl bg-white p-10 ${
          step === 3 ? "max-w-[390px]" : "max-w-[620px]"
        }`}
      >
        {step === 0 && <WelcomeStep onNext={goNext} />}
        {step === 1 && <PermissionsStep onNext={goNext} />}
        {step === 2 && <AddCarerStep onNext={goNext} />}
        {step === 3 && <SetupCompleteStep />}
      </div>
    </main>
  );
}