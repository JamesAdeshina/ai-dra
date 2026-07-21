import { CarerNotificationsView } from "@/features/carer/components/notifications/carer-notifications-view";
import { getCarerNotifications } from "@/features/carer/services/carer-notification-service";

export default async function CarerNotificationsPage() {
  const notifications =
    await getCarerNotifications();

  return (
    <CarerNotificationsView
      initialNotifications={notifications}
    />
  );
}
