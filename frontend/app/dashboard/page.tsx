import { AppLayout } from "@/components/layout/app-layout";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { getDashboardData } from "@/features/dashboard/services/dashboard-service";

export default async function DashboardPage() {
  const dashboardData =
    await getDashboardData();

  return (
    <AppLayout>
      <DashboardView
        dashboardData={dashboardData}
      />
    </AppLayout>
  );
}
