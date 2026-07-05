import { AdminAnalyticsView } from "@/features/admin/components/analytics/admin-analytics-view";
import { getAdminAnalyticsData } from "@/features/admin/data/admin-analytics-data";

export default function AdminAnalyticsPage() {
  return (
    <AdminAnalyticsView
      data={getAdminAnalyticsData()}
    />
  );
}