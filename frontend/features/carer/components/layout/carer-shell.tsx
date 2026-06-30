"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { CarerHeader } from "./carer-header";
import { CarerMobileNavigation } from "./carer-mobile-navigation";
import { CarerSidebar } from "./carer-sidebar";

type CarerShellProps = {
  children: ReactNode;
};

export function CarerShell({ children }: CarerShellProps) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F6F5] lg:grid lg:grid-cols-[302px_minmax(0,1fr)]">
      <div className="sticky top-0 hidden h-screen lg:block">
        <CarerSidebar />
      </div>

      <div className="min-w-0">
        <CarerHeader
          onOpenNavigation={() => setMobileNavigationOpen(true)}
        />

        <main className="min-w-0">{children}</main>
      </div>

      <CarerMobileNavigation
        open={mobileNavigationOpen}
        onClose={() => setMobileNavigationOpen(false)}
      />
    </div>
  );
}
