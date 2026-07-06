"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import {
  calculateNextTrigger,
  isValidTimeOfDay,
  normaliseDaysOfWeek,
  normaliseReminderSchedule,
} from "@/features/reminders/utils/reminder-scheduler";

import type {
  CreateReminderInput,
  DefaultReminderDefinition,
  Reminder,
  ReminderFrequency,
  ReminderPageData,
  ReminderPreferences,
  ReminderType,
  UpdateReminderInput,
  UpdateReminderPreferencesInput,
} from "@/features/reminders/types/reminder";

const DEFAULT_TIMEZONE = "Europe/London";

const DEFAULT_REMINDERS: DefaultReminderDefinition[] = [
  {
    title: "Exercise Reminder",
    message: "It is time for your rehabilitation exercise session.",
    reminderType: "EXERCISE",
    frequency: "DAILY",
    timeOfDay: "10:00",
    scheduledDate: null,
    daysOfWeek: [],
    isEnabled: true,
    isDefault: true,
  },
  {
    title: "Break Reminder",
    message: "Take a short break and rest before continuing.",
    reminderType: "BREAK",
    frequency: "DAILY",
    timeOfDay: "13:00",
    scheduledDate: null,
    daysOfWeek: [],
    isEnabled: false,
    isDefault: true,
  },
  {
    title: "Evening Reminder",
    message: "Review today’s rehabilitation activity.",
    reminderType: "EVENING",
    frequency: "DAILY",
    timeOfDay: "18:00",
    scheduledDate: null,
    daysOfWeek: [],
    isEnabled: false,
    isDefault: true,
  },
];

type ReminderPreferencesRow = {
  id: string;
  survivor_id: string;
  reminders_enabled: boolean;
  encouraging_messages_enabled: boolean;
  weekly_summary_enabled: boolean;
  push_notifications_enabled: boolean;
  timezone: string;
  created_at: string;
  updated_at: string;
};

type ReminderRow = {
  id: string;
  survivor_id: string;
  title: string;
  message: string;
  reminder_type: ReminderType;
  frequency: ReminderFrequency;
  time_of_day: string;
  scheduled_date: string | null;
  days_of_week: number[] | null;
  is_enabled: boolean;
  is_default: boolean;
  next_trigger_at: string | null;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getReminderPageData(): Promise<ReminderPageData> {
  const { supabase, userId } = await getAuthenticatedContext();

  const preferences = await getOrCreateReminderPreferencesWithContext(
    supabase,
    userId
  );

  await createDefaultRemindersWithContext(
    supabase,
    userId,
    preferences.timezone
  );

  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("survivor_id", userId)
    .order("is_default", { ascending: false })
    .order("next_trigger_at", {
      ascending: true,
      nullsFirst: false,
    })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load reminders:", error);
    throw new Error("Your reminders could not be loaded.");
  }

  const reminders = ((data ?? []) as ReminderRow[]).map(mapReminder);

  const weeklyProgress =
    await getReminderWeeklyProgressWithContext(
      supabase,
      userId
    );

  return {
    preferences,
    reminders,
    nextReminder: getNextEnabledReminder(
      reminders,
      preferences.remindersEnabled
    ),
    weeklyProgress,
  };
}

export async function getOrCreateReminderPreferences(): Promise<ReminderPreferences> {
  const { supabase, userId } = await getAuthenticatedContext();

  return getOrCreateReminderPreferencesWithContext(supabase, userId);
}

export async function createDefaultReminders(): Promise<Reminder[]> {
  const { supabase, userId } = await getAuthenticatedContext();
  const preferences = await getOrCreateReminderPreferencesWithContext(
    supabase,
    userId
  );

  const reminders = await createDefaultRemindersWithContext(
    supabase,
    userId,
    preferences.timezone
  );

  revalidateReminderRoutes();
  return reminders;
}

export async function createReminder(
  input: CreateReminderInput
): Promise<Reminder> {
  const { supabase, userId } = await getAuthenticatedContext();
  const preferences = await getOrCreateReminderPreferencesWithContext(
    supabase,
    userId
  );

  const validated = validateReminderInput(input);
  const schedule = normaliseReminderSchedule({
    frequency: validated.frequency,
    scheduledDate: validated.scheduledDate,
    daysOfWeek: validated.daysOfWeek,
  });

  validateScheduleRequirements({
    frequency: validated.frequency,
    scheduledDate: schedule.scheduledDate,
    daysOfWeek: schedule.daysOfWeek,
  });

  const nextTriggerAt = validated.isEnabled
    ? calculateNextTrigger({
        frequency: validated.frequency,
        timeOfDay: validated.timeOfDay,
        scheduledDate: schedule.scheduledDate,
        daysOfWeek: schedule.daysOfWeek,
        timezone: preferences.timezone,
      })
    : null;

  const { data, error } = await supabase
    .from("reminders")
    .insert({
      survivor_id: userId,
      title: validated.title,
      message: validated.message,
      reminder_type: validated.reminderType,
      frequency: validated.frequency,
      time_of_day: validated.timeOfDay,
      scheduled_date: schedule.scheduledDate,
      days_of_week: schedule.daysOfWeek,
      is_enabled: validated.isEnabled,
      is_default: false,
      next_trigger_at: nextTriggerAt,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Failed to create reminder:", error);
    throw new Error("The reminder could not be created.");
  }

  revalidateReminderRoutes();
  return mapReminder(data as ReminderRow);
}

export async function updateReminder(
  input: UpdateReminderInput
): Promise<Reminder> {
  const { supabase, userId } = await getAuthenticatedContext();
  const preferences = await getOrCreateReminderPreferencesWithContext(
    supabase,
    userId
  );

  const existing = await getOwnedReminderRow(
    supabase,
    userId,
    input.reminderId
  );

  const merged = validateReminderInput({
    title: input.title ?? existing.title,
    message: input.message ?? existing.message,
    reminderType: input.reminderType ?? existing.reminder_type,
    frequency: input.frequency ?? existing.frequency,
    timeOfDay:
      input.timeOfDay ?? normaliseDatabaseTime(existing.time_of_day),
    scheduledDate:
      input.scheduledDate !== undefined
        ? input.scheduledDate
        : existing.scheduled_date,
    daysOfWeek: input.daysOfWeek ?? existing.days_of_week ?? [],
    isEnabled: input.isEnabled ?? existing.is_enabled,
  });

  const schedule = normaliseReminderSchedule({
    frequency: merged.frequency,
    scheduledDate: merged.scheduledDate,
    daysOfWeek: merged.daysOfWeek,
  });

  validateScheduleRequirements({
    frequency: merged.frequency,
    scheduledDate: schedule.scheduledDate,
    daysOfWeek: schedule.daysOfWeek,
  });

  const nextTriggerAt = merged.isEnabled
    ? calculateNextTrigger({
        frequency: merged.frequency,
        timeOfDay: merged.timeOfDay,
        scheduledDate: schedule.scheduledDate,
        daysOfWeek: schedule.daysOfWeek,
        timezone: preferences.timezone,
      })
    : null;

  const { data, error } = await supabase
    .from("reminders")
    .update({
      title: merged.title,
      message: merged.message,
      reminder_type: merged.reminderType,
      frequency: merged.frequency,
      time_of_day: merged.timeOfDay,
      scheduled_date: schedule.scheduledDate,
      days_of_week: schedule.daysOfWeek,
      is_enabled: merged.isEnabled,
      next_trigger_at: nextTriggerAt,
    })
    .eq("id", input.reminderId)
    .eq("survivor_id", userId)
    .select("*")
    .single();

  if (error) {
    console.error("Failed to update reminder:", error);
    throw new Error("The reminder could not be updated.");
  }

  revalidateReminderRoutes();
  return mapReminder(data as ReminderRow);
}

export async function toggleReminder({
  reminderId,
  isEnabled,
}: {
  reminderId: string;
  isEnabled: boolean;
}): Promise<Reminder> {
  return updateReminder({ reminderId, isEnabled });
}

export async function deleteReminder(reminderId: string): Promise<void> {
  const { supabase, userId } = await getAuthenticatedContext();
  const existing = await getOwnedReminderRow(
    supabase,
    userId,
    reminderId
  );

  if (existing.is_default) {
    throw new Error(
      "Default reminders cannot be deleted. Disable the reminder instead."
    );
  }

  const { error } = await supabase
    .from("reminders")
    .delete()
    .eq("id", reminderId)
    .eq("survivor_id", userId);

  if (error) {
    console.error("Failed to delete reminder:", error);
    throw new Error("The reminder could not be deleted.");
  }

  revalidateReminderRoutes();
}

export async function updateReminderPreferences(
  input: UpdateReminderPreferencesInput
): Promise<ReminderPreferences> {
  const { supabase, userId } = await getAuthenticatedContext();
  const current = await getOrCreateReminderPreferencesWithContext(
    supabase,
    userId
  );

  const nextTimezone = input.timezone?.trim() || current.timezone;
  assertValidTimezone(nextTimezone);

  const { data, error } = await supabase
    .from("reminder_preferences")
    .update({
      reminders_enabled:
        input.remindersEnabled ?? current.remindersEnabled,
      encouraging_messages_enabled:
        input.encouragingMessagesEnabled ??
        current.encouragingMessagesEnabled,
      weekly_summary_enabled:
        input.weeklySummaryEnabled ?? current.weeklySummaryEnabled,
      push_notifications_enabled:
        input.pushNotificationsEnabled ?? current.pushNotificationsEnabled,
      timezone: nextTimezone,
    })
    .eq("survivor_id", userId)
    .select("*")
    .single();

  if (error) {
    console.error("Failed to update reminder preferences:", error);
    throw new Error("Reminder preferences could not be updated.");
  }

  if (nextTimezone !== current.timezone) {
    await recalculateUserReminderTriggers({
      supabase,
      userId,
      timezone: nextTimezone,
    });
  }

  revalidateReminderRoutes();
  return mapPreferences(data as ReminderPreferencesRow);
}

async function getOrCreateReminderPreferencesWithContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<ReminderPreferences> {
  const { data, error } = await supabase
    .from("reminder_preferences")
    .select("*")
    .eq("survivor_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load reminder preferences:", error);
    throw new Error("Reminder preferences could not be loaded.");
  }

  if (data) {
    return mapPreferences(data as ReminderPreferencesRow);
  }

  const { data: created, error: createError } = await supabase
    .from("reminder_preferences")
    .insert({
      survivor_id: userId,
      reminders_enabled: true,
      encouraging_messages_enabled: false,
      weekly_summary_enabled: false,
      push_notifications_enabled: false,
      timezone: DEFAULT_TIMEZONE,
    })
    .select("*")
    .single();

  if (createError) {
    console.error("Failed to create reminder preferences:", createError);
    throw new Error("Reminder preferences could not be created.");
  }

  return mapPreferences(created as ReminderPreferencesRow);
}

async function createDefaultRemindersWithContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  timezone: string
): Promise<Reminder[]> {
  const { data: existingData, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("survivor_id", userId)
    .eq("is_default", true);

  if (error) {
    console.error("Failed to check default reminders:", error);
    throw new Error("Default reminders could not be checked.");
  }

  const existingRows = (existingData ?? []) as ReminderRow[];
  const existingTypes = new Set(
    existingRows.map((row) => row.reminder_type)
  );

  const missingDefaults = DEFAULT_REMINDERS.filter(
    (definition) => !existingTypes.has(definition.reminderType)
  );

  if (missingDefaults.length === 0) {
    return existingRows.map(mapReminder);
  }

  const rowsToInsert = missingDefaults.map((definition) => ({
    survivor_id: userId,
    title: definition.title,
    message: definition.message,
    reminder_type: definition.reminderType,
    frequency: definition.frequency,
    time_of_day: definition.timeOfDay,
    scheduled_date: definition.scheduledDate,
    days_of_week: definition.daysOfWeek,
    is_enabled: definition.isEnabled,
    is_default: true,
    next_trigger_at: definition.isEnabled
      ? calculateNextTrigger({
          frequency: definition.frequency,
          timeOfDay: definition.timeOfDay,
          scheduledDate: definition.scheduledDate,
          daysOfWeek: definition.daysOfWeek,
          timezone,
        })
      : null,
  }));

  const { data: insertedData, error: insertError } = await supabase
    .from("reminders")
    .insert(rowsToInsert)
    .select("*");

  if (insertError) {
    console.error("Failed to seed default reminders:", insertError);
    throw new Error("Default reminders could not be created.");
  }

  return [
    ...existingRows,
    ...((insertedData ?? []) as ReminderRow[]),
  ].map(mapReminder);
}

async function recalculateUserReminderTriggers({
  supabase,
  userId,
  timezone,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  timezone: string;
}): Promise<void> {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("survivor_id", userId)
    .eq("is_enabled", true);

  if (error) {
    console.error("Failed to load reminders for timezone update:", error);
    throw new Error("Reminder schedules could not be recalculated.");
  }

  const rows = (data ?? []) as ReminderRow[];

  await Promise.all(
    rows.map(async (row) => {
      const nextTriggerAt = calculateNextTrigger({
        frequency: row.frequency,
        timeOfDay: normaliseDatabaseTime(row.time_of_day),
        scheduledDate: row.scheduled_date,
        daysOfWeek: row.days_of_week ?? [],
        timezone,
      });

      const { error: updateError } = await supabase
        .from("reminders")
        .update({ next_trigger_at: nextTriggerAt })
        .eq("id", row.id)
        .eq("survivor_id", userId);

      if (updateError) {
        throw updateError;
      }
    })
  );
}

async function getOwnedReminderRow(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  reminderId: string
): Promise<ReminderRow> {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("id", reminderId)
    .eq("survivor_id", userId)
    .single();

  if (error || !data) {
    console.error("Failed to load reminder:", error);
    throw new Error("The reminder could not be found.");
  }

  return data as ReminderRow;
}

type WeeklySessionRow = {
  status: string;
  duration_seconds: number | null;
  started_at: string;
  completed_at: string | null;
};

async function getReminderWeeklyProgressWithContext(
  supabase: Awaited<
    ReturnType<typeof createClient>
  >,
  userId: string
): Promise<{
  sessionsCompleted: number;
  sessionTarget: number;
  minutesCompleted: number;
  currentStreak: number;
}> {
  const now = new Date();
  const startOfWeek =
    getStartOfCurrentWeek(now);

  const { data, error } = await supabase
    .from("exercise_sessions")
    .select(
      `
        status,
        duration_seconds,
        started_at,
        completed_at
      `
    )
    .eq("survivor_id", userId)
    .eq("status", "COMPLETED")
    .order("completed_at", {
      ascending: false,
    })
    .limit(365);

  if (error) {
    console.error(
      "Failed to load reminder weekly progress:",
      error
    );

    return {
      sessionsCompleted: 0,
      sessionTarget: 5,
      minutesCompleted: 0,
      currentStreak: 0,
    };
  }

  const sessions =
    (data ?? []) as WeeklySessionRow[];

  const weeklySessions =
    sessions.filter((session) => {
      const sessionDate = new Date(
        session.completed_at ??
          session.started_at
      );

      return sessionDate >= startOfWeek;
    });

  const durationSeconds =
    weeklySessions.reduce(
      (total, session) =>
        total +
        Math.max(
          0,
          session.duration_seconds ?? 0
        ),
      0
    );

  return {
    sessionsCompleted:
      weeklySessions.length,
    sessionTarget: 5,
    minutesCompleted:
      Math.round(durationSeconds / 60),
    currentStreak:
      calculateCompletedSessionStreak(
        sessions,
        now
      ),
  };
}

function getStartOfCurrentWeek(
  value: Date
): Date {
  const start = new Date(value);
  const weekday = start.getDay();

  const daysSinceMonday =
    weekday === 0
      ? 6
      : weekday - 1;

  start.setDate(
    start.getDate() -
      daysSinceMonday
  );

  start.setHours(0, 0, 0, 0);

  return start;
}

function calculateCompletedSessionStreak(
  sessions: WeeklySessionRow[],
  now: Date
): number {
  const completedDays = new Set(
    sessions.map((session) =>
      toLocalDateKey(
        new Date(
          session.completed_at ??
            session.started_at
        )
      )
    )
  );

  if (completedDays.size === 0) {
    return 0;
  }

  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);

  const todayKey =
    toLocalDateKey(cursor);

  if (!completedDays.has(todayKey)) {
    cursor.setDate(
      cursor.getDate() - 1
    );
  }

  let streak = 0;

  while (
    completedDays.has(
      toLocalDateKey(cursor)
    )
  ) {
    streak += 1;

    cursor.setDate(
      cursor.getDate() - 1
    );
  }

  return streak;
}

function toLocalDateKey(
  value: Date
): string {
  const year = value.getFullYear();
  const month = String(
    value.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    value.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function getAuthenticatedContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be signed in to manage reminders.");
  }

  return { supabase, userId: user.id };
}

function validateReminderInput(
  input: Omit<
    CreateReminderInput,
    "scheduledDate" | "daysOfWeek" | "isEnabled"
  > & {
    scheduledDate?: string | null;
    daysOfWeek?: number[];
    isEnabled?: boolean;
  }
): Required<
  Pick<
    CreateReminderInput,
    "title" | "message" | "reminderType" | "frequency" | "timeOfDay"
  >
> & {
  scheduledDate: string | null;
  daysOfWeek: number[];
  isEnabled: boolean;
} {
  const title = input.title.trim();
  const message = input.message.trim();
  const timeOfDay = normaliseDatabaseTime(input.timeOfDay.trim());

  if (title.length < 2) {
    throw new Error("Reminder title must contain at least 2 characters.");
  }

  if (title.length > 100) {
    throw new Error("Reminder title must not exceed 100 characters.");
  }

  if (message.length < 2) {
    throw new Error("Reminder message must contain at least 2 characters.");
  }

  if (message.length > 300) {
    throw new Error("Reminder message must not exceed 300 characters.");
  }

  if (!isValidTimeOfDay(timeOfDay)) {
    throw new Error("Reminder time must use HH:mm format.");
  }

  return {
    title,
    message,
    reminderType: input.reminderType,
    frequency: input.frequency,
    timeOfDay,
    scheduledDate: input.scheduledDate?.trim() || null,
    daysOfWeek: normaliseDaysOfWeek(input.daysOfWeek ?? []),
    isEnabled: input.isEnabled ?? true,
  };
}

function validateScheduleRequirements({
  frequency,
  scheduledDate,
  daysOfWeek,
}: {
  frequency: ReminderFrequency;
  scheduledDate: string | null;
  daysOfWeek: number[];
}): void {
  if (frequency === "ONCE" && !scheduledDate) {
    throw new Error("A date is required for a one-time reminder.");
  }

  if (frequency === "WEEKLY" && daysOfWeek.length !== 1) {
    throw new Error("Choose one day for a weekly reminder.");
  }

  if (frequency === "CUSTOM_DAYS" && daysOfWeek.length === 0) {
    throw new Error("Choose at least one day for a custom schedule.");
  }
}

function getNextEnabledReminder(
  reminders: Reminder[],
  remindersEnabled: boolean
): Reminder | null {
  if (!remindersEnabled) {
    return null;
  }

  return (
    reminders
      .filter(
        (reminder) =>
          reminder.isEnabled && reminder.nextTriggerAt !== null
      )
      .sort(
        (first, second) =>
          new Date(first.nextTriggerAt as string).getTime() -
          new Date(second.nextTriggerAt as string).getTime()
      )[0] ?? null
  );
}

function mapPreferences(
  row: ReminderPreferencesRow
): ReminderPreferences {
  return {
    id: row.id,
    survivorId: row.survivor_id,
    remindersEnabled: row.reminders_enabled,
    encouragingMessagesEnabled: row.encouraging_messages_enabled,
    weeklySummaryEnabled: row.weekly_summary_enabled,
    pushNotificationsEnabled: row.push_notifications_enabled,
    timezone: row.timezone,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapReminder(row: ReminderRow): Reminder {
  return {
    id: row.id,
    survivorId: row.survivor_id,
    title: row.title,
    message: row.message,
    reminderType: row.reminder_type,
    frequency: row.frequency,
    timeOfDay: normaliseDatabaseTime(row.time_of_day),
    scheduledDate: row.scheduled_date,
    daysOfWeek: row.days_of_week ?? [],
    isEnabled: row.is_enabled,
    isDefault: row.is_default,
    nextTriggerAt: row.next_trigger_at,
    lastTriggeredAt: row.last_triggered_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normaliseDatabaseTime(value: string): string {
  return value.slice(0, 5);
}

function assertValidTimezone(timezone: string): void {
  try {
    new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
    }).format();
  } catch {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
}

function revalidateReminderRoutes(): void {
  revalidatePath("/reminders");
  revalidatePath("/dashboard");
}
