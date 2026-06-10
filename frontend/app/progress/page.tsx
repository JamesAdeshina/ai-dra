import { AppLayout } from "@/components/layout/app-layout";
import { ProgressView } from "@/features/progress/components/progress-view";

export default function ProgressPage() {
  return (
    <AppLayout>
      <ProgressView hasData={true} />
    </AppLayout>
  );
}