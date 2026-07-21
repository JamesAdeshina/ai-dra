import { notFound } from "next/navigation";

import { SurvivorOverviewView } from "@/features/carer/components/survivors/survivor-overview-view";
import { getSurvivorDetailById } from "@/features/carer/data/survivor-detail-data";

type SurvivorDetailPageProps = {
  params: Promise<{
    survivorId: string;
  }>;
};

export default async function SurvivorDetailPage({
  params,
}: SurvivorDetailPageProps) {
  const { survivorId } = await params;

  const survivor =
    await getSurvivorDetailById(survivorId);

  if (!survivor) {
    notFound();
  }

  return (
    <SurvivorOverviewView survivor={survivor} />
  );
}