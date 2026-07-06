"use client";

import {
  useMemo,
  useState,
  useTransition,
} from "react";

import Link from "next/link";

import {
  Bell,
  BellRing,
  CalendarClock,
  Edit3,
  Eye,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { ReminderFormModal } from "./reminder-form-modal";
import { WeeklyProgressCard } from "./weekly-progress-card";

import {
  createReminder,
  deleteReminder,
  toggleReminder,
  updateReminder,
  updateReminderPreferences,
} from "@/features/reminders/services/reminder-service";

import {
  formatReminderSchedule,
} from "@/features/reminders/utils/reminder-scheduler";

import type {
  CreateReminderInput,
  Reminder,
  ReminderPageData,
  UpdateReminderPreferencesInput,
} from "@/features/reminders/types/reminder";

type RemindersViewProps = {
  reminderData: ReminderPageData;
};

type FormMode =
  | "CREATE"
  | "EDIT";

export function RemindersView({
  reminderData,
}: RemindersViewProps) {
  const weeklyProgress =
    reminderData.weeklyProgress;

  const [preferences, setPreferences] =
    useState(
      reminderData.preferences
    );

  const [reminders, setReminders] =
    useState(reminderData.reminders);

  const [formMode, setFormMode] =
    useState<FormMode>("CREATE");

  const [
    selectedReminder,
    setSelectedReminder,
  ] = useState<Reminder | null>(
    null
  );

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [
    deletingReminder,
    setDeletingReminder,
  ] = useState<Reminder | null>(
    null
  );

  const [
    previewReminder,
    setPreviewReminder,
  ] = useState<Reminder | null>(
    null
  );

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [isPending, startTransition] =
    useTransition();

  const defaultReminders =
    useMemo(
      () =>
        reminders.filter(
          (reminder) =>
            reminder.isDefault
        ),
      [reminders]
    );

  const customReminders =
    useMemo(
      () =>
        reminders.filter(
          (reminder) =>
            !reminder.isDefault
        ),
      [reminders]
    );

  const nextReminder =
    useMemo(
      () =>
        getNextReminder({
          reminders,
          globalEnabled:
            preferences.remindersEnabled,
        }),
      [
        reminders,
        preferences.remindersEnabled,
      ]
    );

  const handlePreferenceChange = (
    input: UpdateReminderPreferencesInput
  ) => {
    setErrorMessage(null);

    const previous = preferences;

    setPreferences((current) => ({
      ...current,
      remindersEnabled:
        input.remindersEnabled ??
        current.remindersEnabled,
      encouragingMessagesEnabled:
        input.encouragingMessagesEnabled ??
        current.encouragingMessagesEnabled,
      weeklySummaryEnabled:
        input.weeklySummaryEnabled ??
        current.weeklySummaryEnabled,
      pushNotificationsEnabled:
        input.pushNotificationsEnabled ??
        current.pushNotificationsEnabled,
      timezone:
        input.timezone ??
        current.timezone,
    }));

    startTransition(() => {
      void updateReminderPreferences(
        input
      )
        .then((updated) => {
          setPreferences(updated);
        })
        .catch((error: unknown) => {
          setPreferences(previous);
          setErrorMessage(
            getErrorMessage(error)
          );
        });
    });
  };

  const handleReminderToggle = (
    reminder: Reminder,
    checked: boolean
  ) => {
    setErrorMessage(null);

    const previous = reminders;

    setReminders((current) =>
      current.map((item) =>
        item.id === reminder.id
          ? {
              ...item,
              isEnabled: checked,
            }
          : item
      )
    );

    startTransition(() => {
      void toggleReminder({
        reminderId: reminder.id,
        isEnabled: checked,
      })
        .then((updated) => {
          setReminders(
            (current) =>
              current.map(
                (item) =>
                  item.id ===
                  updated.id
                    ? updated
                    : item
              )
          );
        })
        .catch((error: unknown) => {
          setReminders(previous);
          setErrorMessage(
            getErrorMessage(error)
          );
        });
    });
  };

  const handleFormSubmit = async (
    input: CreateReminderInput
  ) => {
    setErrorMessage(null);

    try {
      if (
        formMode === "CREATE"
      ) {
        const created =
          await createReminder(input);

        setReminders((current) => [
          ...current,
          created,
        ]);
      } else if (
        selectedReminder
      ) {
        const updated =
          await updateReminder({
            reminderId:
              selectedReminder.id,
            ...input,
          });

        setReminders((current) =>
          current.map((item) =>
            item.id === updated.id
              ? updated
              : item
          )
        );
      }

      setIsFormOpen(false);
      setSelectedReminder(null);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error)
      );
    }
  };

  const handleDelete = () => {
    if (!deletingReminder) {
      return;
    }

    const reminder =
      deletingReminder;

    setErrorMessage(null);

    startTransition(() => {
      void deleteReminder(
        reminder.id
      )
        .then(() => {
          setReminders(
            (current) =>
              current.filter(
                (item) =>
                  item.id !==
                  reminder.id
              )
          );

          setDeletingReminder(null);
        })
        .catch((error: unknown) => {
          setErrorMessage(
            getErrorMessage(error)
          );
        });
    });
  };

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[40px] font-bold text-[#1E1E1E]">
            Reminders
          </h1>

          <p className="mt-1 text-[20px] text-[#1E1E1E]">
            Manage rehabilitation reminders and notification preferences.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setFormMode("CREATE");
            setSelectedReminder(null);
            setErrorMessage(null);
            setIsFormOpen(true);
          }}
          className="h-12 rounded-full bg-[#592EBD] px-6 hover:bg-[#4B24A8]"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Reminder
        </Button>
      </div>

      {errorMessage ? (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[14px] text-red-700">
          <p>{errorMessage}</p>

          <button
            type="button"
            onClick={() =>
              setErrorMessage(null)
            }
            aria-label="Dismiss error"
          >
            <X size={18} />
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <section className="flex items-center justify-between gap-5 rounded-2xl bg-white p-6">
            <div>
              <p className="font-semibold text-[#1E1E1E]">
                Enable Reminders
              </p>

              <p className="mt-1 text-sm text-[#9E9E9E]">
                Pause or resume all reminder delivery without deleting your schedules.
              </p>
            </div>

            <Switch
              checked={
                preferences.remindersEnabled
              }
              disabled={isPending}
              onCheckedChange={(
                checked
              ) =>
                handlePreferenceChange({
                  remindersEnabled:
                    checked,
                })
              }
            />
          </section>

          <ReminderGroup
            title="Rehabilitation Reminders"
            description="Default schedules can be edited or switched off, but they cannot be deleted."
            reminders={
              defaultReminders
            }
            globalEnabled={
              preferences.remindersEnabled
            }
            isPending={isPending}
            onToggle={
              handleReminderToggle
            }
            onEdit={(reminder) => {
              setFormMode("EDIT");
              setSelectedReminder(
                reminder
              );
              setErrorMessage(null);
              setIsFormOpen(true);
            }}
            onDelete={() => {}}
            onPreview={
              setPreviewReminder
            }
          />

          <ReminderGroup
            title="Custom Reminders"
            description="Create reminders for your own rehabilitation routine."
            reminders={
              customReminders
            }
            globalEnabled={
              preferences.remindersEnabled
            }
            isPending={isPending}
            emptyAction={() => {
              setFormMode("CREATE");
              setSelectedReminder(null);
              setIsFormOpen(true);
            }}
            onToggle={
              handleReminderToggle
            }
            onEdit={(reminder) => {
              setFormMode("EDIT");
              setSelectedReminder(
                reminder
              );
              setErrorMessage(null);
              setIsFormOpen(true);
            }}
            onDelete={
              setDeletingReminder
            }
            onPreview={
              setPreviewReminder
            }
          />

          <section className="rounded-2xl bg-white p-6">
            <h2 className="text-[18px] font-semibold text-[#1E1E1E]">
              Notification Preferences
            </h2>

            <div className="mt-6 space-y-6">
              <PreferenceRow
                title="Encouraging Messages"
                description="Receive occasional supportive rehabilitation messages."
                checked={
                  preferences.encouragingMessagesEnabled
                }
                disabled={isPending}
                onChange={(
                  checked
                ) =>
                  handlePreferenceChange({
                    encouragingMessagesEnabled:
                      checked,
                  })
                }
              />

              <PreferenceRow
                title="Weekly Progress Summary"
                description="Receive a summary of your weekly exercise activity."
                checked={
                  preferences.weeklySummaryEnabled
                }
                disabled={isPending}
                onChange={(
                  checked
                ) =>
                  handlePreferenceChange({
                    weeklySummaryEnabled:
                      checked,
                  })
                }
              />

              <PreferenceRow
                title="Browser Push Notifications"
                description="Save your preference for browser and mobile push delivery."
                checked={
                  preferences.pushNotificationsEnabled
                }
                disabled={isPending}
                onChange={(
                  checked
                ) =>
                  handlePreferenceChange({
                    pushNotificationsEnabled:
                      checked,
                  })
                }
              />
            </div>

            <div className="mt-6 rounded-xl bg-[#F8F6FD] px-4 py-3 text-[13px] leading-[150%] text-[#655A78]">
              Timezone:{" "}
              <strong>
                {preferences.timezone}
              </strong>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <NextReminderCard
            reminder={nextReminder}
            globallyEnabled={
              preferences.remindersEnabled
            }
            onPreview={
              nextReminder
                ? () =>
                    setPreviewReminder(
                      nextReminder
                    )
                : undefined
            }
          />

          <WeeklyProgressCard
            sessionsCompleted={weeklyProgress.sessionsCompleted}
            sessionTarget={weeklyProgress.sessionTarget}
            minutesCompleted={weeklyProgress.minutesCompleted}
            currentStreak={weeklyProgress.currentStreak}
          />
        </aside>
      </div>

      <ReminderFormModal
        isOpen={isFormOpen}
        mode={formMode}
        reminder={selectedReminder}
        isSaving={isPending}
        errorMessage={
          isFormOpen
            ? errorMessage
            : null
        }
        onClose={() => {
          if (!isPending) {
            setIsFormOpen(false);
            setSelectedReminder(null);
            setErrorMessage(null);
          }
        }}
        onSubmit={
          handleFormSubmit
        }
      />

      {deletingReminder ? (
        <DeleteReminderModal
          reminder={
            deletingReminder
          }
          isDeleting={isPending}
          onCancel={() =>
            setDeletingReminder(null)
          }
          onConfirm={
            handleDelete
          }
        />
      ) : null}

      {previewReminder ? (
        <PushPreview
          reminder={
            previewReminder
          }
          onClose={() =>
            setPreviewReminder(null)
          }
        />
      ) : null}
    </main>
  );
}

function ReminderGroup({
  title,
  description,
  reminders,
  globalEnabled,
  isPending,
  emptyAction,
  onToggle,
  onEdit,
  onDelete,
  onPreview,
}: {
  title: string;
  description: string;
  reminders: Reminder[];
  globalEnabled: boolean;
  isPending: boolean;
  emptyAction?: () => void;
  onToggle: (
    reminder: Reminder,
    checked: boolean
  ) => void;
  onEdit: (
    reminder: Reminder
  ) => void;
  onDelete: (
    reminder: Reminder
  ) => void;
  onPreview: (
    reminder: Reminder
  ) => void;
}) {
  return (
    <section className="rounded-2xl bg-white p-6">
      <div>
        <h2 className="text-[18px] font-semibold text-[#1E1E1E]">
          {title}
        </h2>

        <p className="mt-1 text-[13px] leading-[145%] text-[#888888]">
          {description}
        </p>
      </div>

      {reminders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#D8D8D8] px-5 py-8 text-center">
          <CalendarClock className="mx-auto h-10 w-10 text-[#A99BD4]" />

          <p className="mt-3 text-[15px] font-semibold text-[#1E1E1E]">
            No custom reminders yet
          </p>

          <p className="mt-1 text-[13px] text-[#888888]">
            Create a reminder that fits your own routine.
          </p>

          {emptyAction ? (
            <Button
              type="button"
              onClick={emptyAction}
              className="mt-4 h-11 rounded-full bg-[#592EBD] px-6 hover:bg-[#4B24A8]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Reminder
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 divide-y divide-[#EEEEEE]">
          {reminders.map(
            (reminder) => (
              <ReminderRow
                key={reminder.id}
                reminder={reminder}
                globalEnabled={
                  globalEnabled
                }
                isPending={
                  isPending
                }
                onToggle={
                  onToggle
                }
                onEdit={
                  onEdit
                }
                onDelete={
                  onDelete
                }
                onPreview={
                  onPreview
                }
              />
            )
          )}
        </div>
      )}
    </section>
  );
}

function ReminderRow({
  reminder,
  globalEnabled,
  isPending,
  onToggle,
  onEdit,
  onDelete,
  onPreview,
}: {
  reminder: Reminder;
  globalEnabled: boolean;
  isPending: boolean;
  onToggle: (
    reminder: Reminder,
    checked: boolean
  ) => void;
  onEdit: (
    reminder: Reminder
  ) => void;
  onDelete: (
    reminder: Reminder
  ) => void;
  onPreview: (
    reminder: Reminder
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-[#1E1E1E]">
            {reminder.title}
          </p>

          {reminder.isDefault ? (
            <span className="rounded-full bg-[#F2EEFC] px-2.5 py-1 text-[11px] font-semibold text-[#592EBD]">
              Default
            </span>
          ) : (
            <span className="rounded-full bg-[#EAF8F1] px-2.5 py-1 text-[11px] font-semibold text-[#23875B]">
              Custom
            </span>
          )}
        </div>

        <p className="mt-1 text-[13px] leading-[145%] text-[#777777]">
          {formatReminderSchedule({
            frequency:
              reminder.frequency,
            timeOfDay:
              reminder.timeOfDay,
            scheduledDate:
              reminder.scheduledDate,
            daysOfWeek:
              reminder.daysOfWeek,
          })}
        </p>

        <p className="mt-1 line-clamp-2 text-[13px] text-[#9A9A9A]">
          {reminder.message}
        </p>

        {!globalEnabled ? (
          <p className="mt-2 text-[12px] font-medium text-amber-700">
            Global reminders are currently paused.
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ActionButton
          label="Preview reminder"
          onClick={() =>
            onPreview(reminder)
          }
        >
          <Eye size={17} />
        </ActionButton>

        <ActionButton
          label="Edit reminder"
          onClick={() =>
            onEdit(reminder)
          }
        >
          <Edit3 size={17} />
        </ActionButton>

        {!reminder.isDefault ? (
          <ActionButton
            label="Delete reminder"
            danger
            onClick={() =>
              onDelete(reminder)
            }
          >
            <Trash2 size={17} />
          </ActionButton>
        ) : null}

        <Switch
          checked={
            reminder.isEnabled
          }
          disabled={isPending}
          onCheckedChange={(
            checked
          ) =>
            onToggle(
              reminder,
              checked
            )
          }
        />
      </div>
    </div>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (
    checked: boolean
  ) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <div>
        <p className="font-medium text-[#1E1E1E]">
          {title}
        </p>

        <p className="mt-1 text-[13px] text-[#8E8E8E]">
          {description}
        </p>
      </div>

      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={
          onChange
        }
      />
    </div>
  );
}

function NextReminderCard({
  reminder,
  globallyEnabled,
  onPreview,
}: {
  reminder: Reminder | null;
  globallyEnabled: boolean;
  onPreview?: () => void;
}) {
  if (
    !globallyEnabled ||
    !reminder
  ) {
    return (
      <section className="rounded-2xl bg-white p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5] text-[#592EBD]">
          <Bell size={18} />
        </div>

        <h2 className="mt-4 text-[18px] font-semibold text-[#1E1E1E]">
          No upcoming reminder
        </h2>

        <p className="mt-2 text-[14px] leading-[150%] text-[#888888]">
          Enable reminders or create a future reminder to see it here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5] text-[#592EBD]">
          <BellRing size={18} />
        </div>

        <div className="min-w-0">
          <h2 className="text-[18px] font-semibold leading-[140%] text-[#1E1E1E]">
            {reminder.title}
          </h2>

          <p className="mt-1 text-[14px] leading-[145%] text-[#888888]">
            {reminder.message}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t pt-4">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#7875FB]">
          Next reminder
        </p>

        <p className="mt-2 text-[20px] font-semibold text-[#1E1E1E]">
          {formatNextDateTime(
            reminder.nextTriggerAt
          )}
        </p>

        <p className="mt-1 text-[13px] text-[#888888]">
          {formatReminderSchedule({
            frequency:
              reminder.frequency,
            timeOfDay:
              reminder.timeOfDay,
            scheduledDate:
              reminder.scheduledDate,
            daysOfWeek:
              reminder.daysOfWeek,
          })}
        </p>
      </div>

      {onPreview ? (
        <Button
          type="button"
          variant="outline"
          onClick={onPreview}
          className="mt-5 h-11 w-full rounded-full"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview Notification
        </Button>
      ) : null}
    </section>
  );
}

function DeleteReminderModal({
  reminder,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  reminder: Reminder;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <section className="w-full max-w-[430px] rounded-[24px] bg-white p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
          <Trash2 size={22} />
        </div>

        <h2 className="mt-4 text-[21px] font-semibold">
          Delete reminder?
        </h2>

        <p className="mt-2 text-[14px] leading-[150%] text-[#777777]">
          “{reminder.title}” will be permanently removed.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
            className="h-11 rounded-full px-6"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-11 rounded-full bg-red-600 px-6 hover:bg-red-700"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete Reminder"}
          </Button>
        </div>
      </section>
    </div>
  );
}

function PushPreview({
  reminder,
  onClose,
}: {
  reminder: Reminder;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] sm:bottom-auto sm:left-auto sm:right-5 sm:top-5 sm:w-[390px]">
      <div className="overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2EEFC] text-[#592EBD]">
              <BellRing size={17} />
            </div>

            <div>
              <p className="text-[13px] font-semibold">
                AI-DRA
              </p>

              <p className="text-[11px] text-[#8A8A8A]">
                Notification preview
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F3F3F3]"
            aria-label="Close preview"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-4 py-4">
          <h2 className="text-[16px] font-semibold">
            {reminder.title}
          </h2>

          <p className="mt-1 text-[14px] leading-[150%] text-[#666666]">
            {reminder.message}
          </p>

          <p className="mt-3 text-[12px] text-[#8A8A8A]">
            {formatReminderSchedule({
              frequency:
                reminder.frequency,
              timeOfDay:
                reminder.timeOfDay,
              scheduledDate:
                reminder.scheduledDate,
              daysOfWeek:
                reminder.daysOfWeek,
            })}
          </p>

          <div className="mt-4 flex gap-3">
            <Link
              href="/exercises"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#592EBD] px-5 text-[14px] font-semibold text-white"
            >
              Open AI-DRA
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-full border px-5 text-[14px]"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  danger = false,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={[
        "flex h-9 w-9 items-center justify-center rounded-full transition",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-[#666666] hover:bg-[#F4F1FC] hover:text-[#592EBD]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function getNextReminder({
  reminders,
  globalEnabled,
}: {
  reminders: Reminder[];
  globalEnabled: boolean;
}): Reminder | null {
  if (!globalEnabled) {
    return null;
  }

  return (
    reminders
      .filter(
        (reminder) =>
          reminder.isEnabled &&
          reminder.nextTriggerAt
      )
      .sort(
        (first, second) =>
          new Date(
            first.nextTriggerAt as string
          ).getTime() -
          new Date(
            second.nextTriggerAt as string
          ).getTime()
      )[0] ?? null
  );
}

function formatNextDateTime(
  value: string | null
): string {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

function getErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
