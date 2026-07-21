import { notFound } from "next/navigation";

import { AdminSurvivorDetailView } from "@/features/admin/components/survivors/admin-survivor-detail-view";
import { getAdminSurvivorById } from "@/features/admin/data/admin-survivor-data";

type AdminSurvivorDetailPageProps = {
  params: Promise<{
    survivorId: string;
  }>;
};

export default async function AdminSurvivorDetailPage({
  params,
}: AdminSurvivorDetailPageProps) {
  const { survivorId } = await params;
  const survivor = getAdminSurvivorById(survivorId);

  if (!survivor) {
    notFound();
  }

  return <AdminSurvivorDetailView survivor={survivor} />;
}