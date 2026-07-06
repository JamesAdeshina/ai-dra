import { AppLayout } from "@/components/layout/app-layout";
import { RemindersView } from "@/features/reminders/components/reminders-view";
import { getReminderPageData } from "@/features/reminders/services/reminder-service";

export default async function RemindersPage() {
  const reminderData =
    await getReminderPageData();

  return (
    <AppLayout>
      <RemindersView
        reminderData={reminderData}
      />
    </AppLayout>
  );
}
