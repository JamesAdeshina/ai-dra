import { AppLayout } from "@/components/layout/app-layout";
import { ProgressView } from "@/features/progress/components/progress-view";
import { getProgressData } from "@/features/progress/services/progress-service";

export default async function ProgressPage() {
  const progressData =
    await getProgressData();

  return (
    <AppLayout>
      <ProgressView
        progressData={progressData}
      />
    </AppLayout>
  );
}