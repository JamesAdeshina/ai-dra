import { AppLayout } from "@/components/layout/app-layout";
import { HistoryView } from "@/features/history/components/history-view";
import { getHistorySessions } from "@/features/history/services/history-service";

export default async function HistoryPage() {
  const sessions =
    await getHistorySessions();

  return (
    <AppLayout>
      <HistoryView sessions={sessions} />
    </AppLayout>
  );
}