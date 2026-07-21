"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function markCarerNotificationReadAction(
  notificationId: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      error:
        "You must be signed in to update notifications.",
    };
  }

  const { error } = await supabase
    .from("notification_outbox")
    .update({
      status: "READ",
      updated_at: new Date().toISOString(),
    })
    .eq("id", notificationId)
    .eq("recipient_user_id", user.id);

  if (error) {
    console.error(
      "Failed to mark notification as read:",
      error,
    );

    return {
      ok: false,
      error:
        "Notification could not be updated.",
    };
  }

  revalidatePath("/carer/notifications");

  return {
    ok: true,
  };
}

export async function markAllCarerNotificationsReadAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      error:
        "You must be signed in to update notifications.",
    };
  }

  const { error } = await supabase
    .from("notification_outbox")
    .update({
      status: "READ",
      updated_at: new Date().toISOString(),
    })
    .eq("recipient_user_id", user.id)
    .in("channel", ["IN_APP", "PUSH"]);

  if (error) {
    console.error(
      "Failed to mark all notifications as read:",
      error,
    );

    return {
      ok: false,
      error:
        "Notifications could not be updated.",
    };
  }

  revalidatePath("/carer/notifications");

  return {
    ok: true,
  };
}
