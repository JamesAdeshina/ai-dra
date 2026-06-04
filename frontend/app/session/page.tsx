import { AppLayout } from "@/components/layout/app-layout";
import { SessionView } from "@/features/sessions/components/session-view";

export default function SessionPage() {
  return (
    <AppLayout>
      <SessionView />
    </AppLayout>
  );
}