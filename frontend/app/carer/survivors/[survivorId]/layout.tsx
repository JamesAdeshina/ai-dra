import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { SurvivorDetailShell } from "@/features/carer/components/survivors/survivor-detail-shell";
import { getSurvivorDetailById } from "@/features/carer/data/survivor-detail-data";

type SurvivorDetailLayoutProps = {
  children: ReactNode;
  params: Promise<{
    survivorId: string;
  }>;
};

export default async function SurvivorDetailLayout({
  children,
  params,
}: SurvivorDetailLayoutProps) {
  const { survivorId } = await params;
  const survivor = getSurvivorDetailById(survivorId);

  if (!survivor) {
    notFound();
  }

  return (
    <SurvivorDetailShell survivor={survivor}>
      {children}
    </SurvivorDetailShell>
  );
}