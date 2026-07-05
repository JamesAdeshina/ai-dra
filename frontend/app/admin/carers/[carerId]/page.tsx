import { notFound } from "next/navigation";

import { AdminCarerDetailView } from "@/features/admin/components/carers/admin-carer-detail-view";
import { getAdminCarerById } from "@/features/admin/data/admin-carer-data";

type AdminCarerDetailPageProps = {
  params: Promise<{
    carerId: string;
  }>;
};

export default async function AdminCarerDetailPage({
  params,
}: AdminCarerDetailPageProps) {
  const { carerId } = await params;
  const carer = getAdminCarerById(carerId);

  if (!carer) {
    notFound();
  }

  return <AdminCarerDetailView carer={carer} />;
}