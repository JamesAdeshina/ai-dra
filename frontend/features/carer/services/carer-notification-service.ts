import { createClient } from "@/lib/supabase/server";

export type CarerNotificationCategory =
  | "ACTIVITY"
  | "ALERT"
  | "REMINDER"
  | "SYSTEM";

export type CarerNotificationIcon =
  | "goal"
  | "missed"
  | "reminder"
  | "progress"
  | "streak"
  | "difficulty"
  | "connection";

export type CarerNotification = {
  id: string;
  title: string;
  message: string;
  category: CarerNotificationCategory;
  icon: CarerNotificationIcon;
  unread: boolean;
  timeLabel: string;
  dateLabel: string;
  createdAt: string;
};

type NotificationOutboxRow = {
  id: string;
  recipient_user_id?: string | null;
  channel?: string | null;
  status?: string | null;
  subject?: string | null;
  title?: string | null;
  body?: string | null;
  message?: string | null;
  type?: string | null;
  payload?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
  sent_at?: string | null;
  read_at?: string | null;
};

export async function getCarerNotifications(): Promise<CarerNotification[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("notification_outbox")
    .select("*")
    .eq("recipient_user_id", user.id)
    .in("channel", ["IN_APP", "PUSH"])
    .order("created_at", {
      ascending: false,
    })
    .limit(80);

  if (error) {
    console.error(
      "Failed to load carer notifications:",
      error,
    );

    return [];
  }

  return ((data ?? []) as NotificationOutboxRow[]).map(
    mapNotificationRow,
  );
}

function mapNotificationRow(
  row: NotificationOutboxRow,
): CarerNotification {
  const payload = row.payload ?? {};

  const rawType =
    getString(payload, "type") ||
    row.type ||
    "";

  const title =
    row.title ||
    row.subject ||
    getString(payload, "title") ||
    getTitleFromType(rawType);

  const message =
    row.body ||
    row.message ||
    getString(payload, "body") ||
    getString(payload, "message") ||
    getMessageFromType(rawType);

  const category =
    getCategoryFromType(rawType, title, message);

  const icon =
    getIconFromType(rawType, category);

  const createdAt =
    row.created_at ||
    row.sent_at ||
    row.updated_at ||
    new Date().toISOString();

  return {
    id: row.id,
    title,
    message,
    category,
    icon,
    unread:
      !row.read_at &&
      row.status !== "READ" &&
      row.status !== "SEEN",
    timeLabel: formatTime(createdAt),
    dateLabel: formatDate(createdAt),
    createdAt,
  };
}

function getString(
  payload: Record<string, unknown>,
  key: string,
) {
  const value = payload[key];

  return typeof value === "string"
    ? value
    : "";
}

function getTitleFromType(type: string) {
  switch (type) {
    case "CARER_INVITATION_ACCEPTED":
      return "Invitation accepted";
    case "CARER_LINKED":
      return "Carer linked";
    case "SURVIVOR_MISSED_SESSION":
      return "Missed exercise session";
    case "SURVIVOR_COMPLETED_SESSION":
      return "Exercise completed";
    case "SURVIVOR_DIFFICULTY_ALERT":
      return "Difficulty detected";
    case "REMINDER":
      return "Reminder";
    default:
      return "AI-DRA notification";
  }
}

function getMessageFromType(type: string) {
  switch (type) {
    case "CARER_INVITATION_ACCEPTED":
      return "A survivor has accepted your invitation and is now linked to your carer account.";
    case "CARER_LINKED":
      return "Your carer link has been created successfully.";
    case "SURVIVOR_MISSED_SESSION":
      return "A linked survivor missed a scheduled exercise session.";
    case "SURVIVOR_COMPLETED_SESSION":
      return "A linked survivor completed an exercise session.";
    case "SURVIVOR_DIFFICULTY_ALERT":
      return "A linked survivor may need support with an exercise.";
    default:
      return "You have a new AI-DRA update.";
  }
}

function getCategoryFromType(
  type: string,
  title: string,
  message: string,
): CarerNotificationCategory {
  const value = `${type} ${title} ${message}`.toLowerCase();

  if (
    value.includes("alert") ||
    value.includes("difficulty") ||
    value.includes("missed") ||
    value.includes("failed") ||
    value.includes("pain")
  ) {
    return "ALERT";
  }

  if (
    value.includes("reminder") ||
    value.includes("upcoming") ||
    value.includes("schedule")
  ) {
    return "REMINDER";
  }

  if (
    value.includes("accepted") ||
    value.includes("linked") ||
    value.includes("system")
  ) {
    return "SYSTEM";
  }

  return "ACTIVITY";
}

function getIconFromType(
  type: string,
  category: CarerNotificationCategory,
): CarerNotificationIcon {
  const value = type.toLowerCase();

  if (
    value.includes("accepted") ||
    value.includes("linked") ||
    value.includes("connection")
  ) {
    return "connection";
  }

  if (
    value.includes("difficulty") ||
    value.includes("alert") ||
    value.includes("pain")
  ) {
    return "difficulty";
  }

  if (
    value.includes("missed") ||
    value.includes("failed")
  ) {
    return "missed";
  }

  if (value.includes("reminder")) {
    return "reminder";
  }

  if (value.includes("streak")) {
    return "streak";
  }

  if (category === "REMINDER") {
    return "reminder";
  }

  if (category === "ALERT") {
    return "difficulty";
  }

  if (category === "SYSTEM") {
    return "connection";
  }

  return "progress";
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (
    date.toDateString() ===
    yesterday.toDateString()
  ) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Now";
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
