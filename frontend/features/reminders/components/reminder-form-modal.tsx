"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  CalendarDays,
  Check,
  Clock3,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  WEEKDAY_OPTIONS,
  type CreateReminderInput,
  type Reminder,
  type ReminderFrequency,
  type ReminderType,
} from "@/features/reminders/types/reminder";

type ReminderFormModalProps = {
  isOpen: boolean;
  mode: "CREATE" | "EDIT";
  reminder?: Reminder | null;
  isSaving?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (
    input: CreateReminderInput
  ) => Promise<void> | void;
};

const REMINDER_TYPES: {
  value: ReminderType;
  label: string;
}[] = [
  {
    value: "EXERCISE",
    label: "Exercise",
  },
  {
    value: "BREAK",
    label: "Break",
  },
  {
    value: "EVENING",
    label: "Evening",
  },
  {
    value: "MOTIVATIONAL",
    label: "Motivational",
  },
  {
    value: "WEEKLY_SUMMARY",
    label: "Weekly summary",
  },
  {
    value: "CUSTOM",
    label: "Custom",
  },
];

const FREQUENCIES: {
  value: ReminderFrequency;
  label: string;
}[] = [
  {
    value: "ONCE",
    label: "One time",
  },
  {
    value: "DAILY",
    label: "Every day",
  },
  {
    value: "WEEKDAYS",
    label: "Weekdays",
  },
  {
    value: "WEEKLY",
    label: "Weekly",
  },
  {
    value: "CUSTOM_DAYS",
    label: "Selected days",
  },
];

type FormState = {
  title: string;
  message: string;
  reminderType: ReminderType;
  frequency: ReminderFrequency;
  timeOfDay: string;
  scheduledDate: string;
  daysOfWeek: number[];
  isEnabled: boolean;
};

const EMPTY_FORM: FormState = {
  title: "",
  message: "",
  reminderType: "CUSTOM",
  frequency: "DAILY",
  timeOfDay: "10:00",
  scheduledDate: "",
  daysOfWeek: [],
  isEnabled: true,
};

export function ReminderFormModal({
  isOpen,
  mode,
  reminder = null,
  isSaving = false,
  errorMessage = null,
  onClose,
  onSubmit,
}: ReminderFormModalProps) {
  const [form, setForm] =
    useState<FormState>(EMPTY_FORM);

  const [localError, setLocalError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (
      mode === "EDIT" &&
      reminder
    ) {
      setForm({
        title: reminder.title,
        message: reminder.message,
        reminderType:
          reminder.reminderType,
        frequency:
          reminder.frequency,
        timeOfDay:
          reminder.timeOfDay,
        scheduledDate:
          reminder.scheduledDate ?? "",
        daysOfWeek:
          reminder.daysOfWeek,
        isEnabled:
          reminder.isEnabled,
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setLocalError(null);
  }, [
    isOpen,
    mode,
    reminder,
  ]);

  const requiresDate =
    form.frequency === "ONCE";

  const requiresWeekday =
    form.frequency === "WEEKLY";

  const requiresMultipleDays =
    form.frequency ===
    "CUSTOM_DAYS";

  const selectedDaysLabel =
    useMemo(() => {
      if (form.daysOfWeek.length === 0) {
        return "No days selected";
      }

      return WEEKDAY_OPTIONS.filter(
        (option) =>
          form.daysOfWeek.includes(
            option.value
          )
      )
        .map(
          (option) =>
            option.shortLabel
        )
        .join(", ");
    }, [form.daysOfWeek]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async () => {
    setLocalError(null);

    if (form.title.trim().length < 2) {
      setLocalError(
        "Add a clear reminder title."
      );
      return;
    }

    if (form.message.trim().length < 2) {
      setLocalError(
        "Add a reminder message."
      );
      return;
    }

    if (
      requiresDate &&
      !form.scheduledDate
    ) {
      setLocalError(
        "Choose a date for this one-time reminder."
      );
      return;
    }

    if (
      requiresWeekday &&
      form.daysOfWeek.length !== 1
    ) {
      setLocalError(
        "Choose one day for a weekly reminder."
      );
      return;
    }

    if (
      requiresMultipleDays &&
      form.daysOfWeek.length === 0
    ) {
      setLocalError(
        "Choose at least one day."
      );
      return;
    }

    await onSubmit({
      title: form.title.trim(),
      message: form.message.trim(),
      reminderType:
        form.reminderType,
      frequency: form.frequency,
      timeOfDay: form.timeOfDay,
      scheduledDate:
        form.scheduledDate || null,
      daysOfWeek:
        form.daysOfWeek,
      isEnabled: form.isEnabled,
    });
  };

  const toggleDay = (
    day: number
  ) => {
    setForm((current) => {
      if (
        current.frequency === "WEEKLY"
      ) {
        return {
          ...current,
          daysOfWeek: [day],
        };
      }

      const alreadySelected =
        current.daysOfWeek.includes(day);

      return {
        ...current,
        daysOfWeek:
          alreadySelected
            ? current.daysOfWeek.filter(
                (value) =>
                  value !== day
              )
            : [
                ...current.daysOfWeek,
                day,
              ],
      };
    });
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm sm:flex sm:items-center sm:justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-form-title"
      onMouseDown={(event) => {
        if (
          event.currentTarget ===
          event.target &&
          !isSaving
        ) {
          onClose();
        }
      }}
    >
      <section className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:static sm:w-full sm:max-w-[650px] sm:rounded-[24px]">
        <header className="sticky top-0 z-10 flex items-start justify-between border-b bg-white px-5 py-5 sm:px-7">
          <div>
            <h2
              id="reminder-form-title"
              className="text-[22px] font-semibold text-[#1E1E1E]"
            >
              {mode === "CREATE"
                ? "Create Reminder"
                : "Edit Reminder"}
            </h2>

            <p className="mt-1 text-[14px] text-[#777777]">
              Choose when and how AI-DRA should remind you.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5] transition hover:bg-[#EDEDED] disabled:opacity-50"
            aria-label="Close reminder form"
          >
            <X size={20} />
          </button>
        </header>

        <div className="space-y-6 px-5 py-6 sm:px-7">
          <Field
            label="Reminder title"
            required
          >
            <input
              value={form.title}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    title:
                      event.target.value,
                  })
                )
              }
              maxLength={100}
              placeholder="Example: Morning hand exercise"
              className="h-12 w-full rounded-xl border border-[#DADADA] px-4 text-[15px] outline-none transition focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
            />
          </Field>

          <Field
            label="Notification message"
            required
          >
            <textarea
              value={form.message}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    message:
                      event.target.value,
                  })
                )
              }
              maxLength={300}
              rows={3}
              placeholder="Example: It is time for your hand exercise."
              className="w-full resize-none rounded-xl border border-[#DADADA] px-4 py-3 text-[15px] outline-none transition focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
            />

            <p className="mt-1 text-right text-[12px] text-[#999999]">
              {form.message.length}/300
            </p>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Reminder type">
              <select
                value={
                  form.reminderType
                }
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      reminderType:
                        event.target
                          .value as ReminderType,
                    })
                  )
                }
                className="h-12 w-full rounded-xl border border-[#DADADA] bg-white px-4 text-[15px] outline-none transition focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
              >
                {REMINDER_TYPES.map(
                  (type) => (
                    <option
                      key={type.value}
                      value={type.value}
                    >
                      {type.label}
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field label="Repeat">
              <select
                value={form.frequency}
                onChange={(event) => {
                  const frequency =
                    event.target
                      .value as ReminderFrequency;

                  setForm(
                    (current) => ({
                      ...current,
                      frequency,
                      scheduledDate:
                        frequency === "ONCE"
                          ? current.scheduledDate
                          : "",
                      daysOfWeek:
                        frequency === "WEEKLY" ||
                        frequency ===
                          "CUSTOM_DAYS"
                          ? current.daysOfWeek
                          : [],
                    })
                  );
                }}
                className="h-12 w-full rounded-xl border border-[#DADADA] bg-white px-4 text-[15px] outline-none transition focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
              >
                {FREQUENCIES.map(
                  (frequency) => (
                    <option
                      key={
                        frequency.value
                      }
                      value={
                        frequency.value
                      }
                    >
                      {frequency.label}
                    </option>
                  )
                )}
              </select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Time"
              icon={<Clock3 size={17} />}
              required
            >
              <input
                type="time"
                value={form.timeOfDay}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      timeOfDay:
                        event.target.value,
                    })
                  )
                }
                className="h-12 w-full rounded-xl border border-[#DADADA] px-4 text-[15px] outline-none transition focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
              />
            </Field>

            {requiresDate ? (
              <Field
                label="Date"
                icon={
                  <CalendarDays
                    size={17}
                  />
                }
                required
              >
                <input
                  type="date"
                  value={
                    form.scheduledDate
                  }
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        scheduledDate:
                          event.target
                            .value,
                      })
                    )
                  }
                  min={new Date()
                    .toISOString()
                    .slice(0, 10)}
                  className="h-12 w-full rounded-xl border border-[#DADADA] px-4 text-[15px] outline-none transition focus:border-[#592EBD] focus:ring-4 focus:ring-[#592EBD]/10"
                />
              </Field>
            ) : null}
          </div>

          {requiresWeekday ||
          requiresMultipleDays ? (
            <Field
              label={
                requiresWeekday
                  ? "Day of the week"
                  : "Days of the week"
              }
              helper={selectedDaysLabel}
              required
            >
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {WEEKDAY_OPTIONS.map(
                  (day) => {
                    const selected =
                      form.daysOfWeek.includes(
                        day.value
                      );

                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() =>
                          toggleDay(
                            day.value
                          )
                        }
                        className={[
                          "flex h-11 items-center justify-center rounded-xl border text-[13px] font-semibold transition",
                          selected
                            ? "border-[#592EBD] bg-[#592EBD] text-white"
                            : "border-[#DADADA] bg-white text-[#555555] hover:border-[#9F8DD6]",
                        ].join(" ")}
                      >
                        {day.shortLabel}
                      </button>
                    );
                  }
                )}
              </div>
            </Field>
          ) : null}

          <div className="flex items-center justify-between rounded-2xl bg-[#F8F6FD] px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#592EBD]">
                <Bell size={19} />
              </div>

              <div>
                <p className="text-[15px] font-semibold text-[#1E1E1E]">
                  Enable this reminder
                </p>

                <p className="mt-1 text-[13px] text-[#777777]">
                  You can also turn it on or off from the reminders page.
                </p>
              </div>
            </div>

            <Switch
              checked={form.isEnabled}
              onCheckedChange={(
                checked
              ) =>
                setForm(
                  (current) => ({
                    ...current,
                    isEnabled: checked,
                  })
                )
              }
            />
          </div>

          {localError ||
          errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
              {localError ??
                errorMessage}
            </div>
          ) : null}
        </div>

        <footer className="sticky bottom-0 flex flex-col-reverse gap-3 border-t bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="h-12 rounded-full px-7"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={() => {
              void handleSubmit();
            }}
            disabled={isSaving}
            className="h-12 rounded-full bg-[#592EBD] px-8 hover:bg-[#4B24A8]"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {mode === "CREATE"
                  ? "Create Reminder"
                  : "Save Changes"}
              </>
            )}
          </Button>
        </footer>
      </section>
    </div>
  );
}

function Field({
  label,
  helper,
  icon,
  required = false,
  children,
}: {
  label: string;
  helper?: string;
  icon?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-[#1E1E1E]">
        {icon}
        {label}
        {required ? (
          <span className="text-red-500">
            *
          </span>
        ) : null}
      </span>

      {children}

      {helper ? (
        <span className="mt-2 block text-[12px] text-[#888888]">
          {helper}
        </span>
      ) : null}
    </label>
  );
}
