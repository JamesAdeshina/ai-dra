import type { ReactNode } from "react";

import { CarerShell } from "@/features/carer/components/layout/carer-shell";

type CarerLayoutProps = {
  children: ReactNode;
};

export default function CarerLayout({ children }: CarerLayoutProps) {
  return <CarerShell>{children}</CarerShell>;
}
