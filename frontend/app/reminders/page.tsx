import { AppLayout } from "@/components/layout/app-layout";
import { RemindersView } from "@/features/reminders/components/reminders-view";

export default function RemindersPage() {
  return (
    <AppLayout>
      <RemindersView hasData={true} />
    </AppLayout>
  );
}