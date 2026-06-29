"use client";

import { useCurrentProfile } from "@/features/profile/hooks/use-current-profile";

export function WelcomeSection() {
  const { profile, isLoading } = useCurrentProfile();

  const firstName =
    profile?.first_name?.trim() ||
    profile?.display_name?.trim().split(/\s+/)[0] ||
    "there";

  return (
    <section>
      <h1 className="text-[44px] font-bold leading-[110%] tracking-tight text-neutral-950 xl:text-[48px]">
        {isLoading ? (
          <>
            Welcome
            <br />
            back!
          </>
        ) : (
          <>
            Welcome back,
            <br />
            {firstName}!
          </>
        )}
      </h1>

      <p className="mt-4 text-[22px] text-neutral-700">
        Let&apos;s continue your recovery journey.
      </p>
    </section>
  );
}