"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { AdminHeader } from "./admin-header";
import { AdminMobileNavigation } from "./admin-mobile-navigation";
import { AdminSidebar } from "./admin-sidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F5] lg:grid lg:grid-cols-[302px_minmax(0,1fr)]">
      <div className="sticky top-0 hidden h-screen lg:block">
        <AdminSidebar />
      </div>

      <div className="min-w-0">
        <AdminHeader
          onOpenNavigation={() => setMobileNavigationOpen(true)}
        />

        <main className="min-w-0">{children}</main>
      </div>

      <AdminMobileNavigation
        open={mobileNavigationOpen}
        onClose={() => setMobileNavigationOpen(false)}
      />
    </div>
  );
}