import { AppLayout } from "@/components/layout/app-layout";
import { HistoryView } from "@/features/history/components/history-view";

export default function HistoryPage() {
  return (
    <AppLayout>
      <HistoryView hasData={true} />
    </AppLayout>
  );
}