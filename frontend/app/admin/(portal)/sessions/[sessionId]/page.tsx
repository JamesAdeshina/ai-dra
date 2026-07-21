import { notFound } from "next/navigation";

import { AdminSessionDetailView } from "@/features/admin/components/sessions/admin-session-detail-view";
import { getAdminSessionById } from "@/features/admin/data/admin-session-data";

type AdminSessionDetailPageProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function AdminSessionDetailPage({
  params,
}: AdminSessionDetailPageProps) {
  const { sessionId } = await params;

  const session =
    getAdminSessionById(sessionId);

  if (!session) {
    notFound();
  }

  return (
    <AdminSessionDetailView
      session={session}
    />
  );
}