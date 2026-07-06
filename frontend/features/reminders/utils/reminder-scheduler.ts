import type {
  ReminderFrequency,
  ReminderScheduleInput,
} from "@/features/reminders/types/reminder";

const WEEKDAYS = [1, 2, 3, 4, 5];

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export function calculateNextTrigger({
  frequency,
  timeOfDay,
  scheduledDate = null,
  daysOfWeek = [],
  timezone,
  fromDate = new Date(),
}: ReminderScheduleInput): string | null {
  assertValidTimezone(timezone);

  const { hour, minute, second } =
    parseTimeOfDay(timeOfDay);

  if (frequency === "ONCE") {
    if (!scheduledDate) {
      return null;
    }

    const dateParts =
      parseScheduledDate(scheduledDate);

    const occurrence = zonedDateTimeToUtc({
      ...dateParts,
      hour,
      minute,
      second,
      timezone,
    });

    return occurrence.getTime() > fromDate.getTime()
      ? occurrence.toISOString()
      : null;
  }

  const allowedDays = getAllowedDays({
    frequency,
    daysOfWeek,
    scheduledDate,
    timezone,
  });

  const startDateParts =
    getZonedDateParts(fromDate, timezone);

  for (let offset = 0; offset <= 14; offset += 1) {
    const candidateDate =
      addCalendarDays(startDateParts, offset);

    const weekday = getWeekdayForDate(
      candidateDate
    );

    if (
      allowedDays !== null &&
      !allowedDays.includes(weekday)
    ) {
      continue;
    }

    const occurrence = zonedDateTimeToUtc({
      ...candidateDate,
      hour,
      minute,
      second,
      timezone,
    });

    if (occurrence.getTime() > fromDate.getTime()) {
      return occurrence.toISOString();
    }
  }

  return null;
}

export function normaliseReminderSchedule({
  frequency,
  scheduledDate = null,
  daysOfWeek = [],
}: {
  frequency: ReminderFrequency;
  scheduledDate?: string | null;
  daysOfWeek?: number[];
}): {
  scheduledDate: string | null;
  daysOfWeek: number[];
} {
  const validDays = normaliseDaysOfWeek(daysOfWeek);

  switch (frequency) {
    case "ONCE":
      return {
        scheduledDate:
          scheduledDate?.trim() || null,
        daysOfWeek: [],
      };

    case "DAILY":
    case "WEEKDAYS":
      return {
        scheduledDate: null,
        daysOfWeek: [],
      };

    case "WEEKLY":
      return {
        scheduledDate: null,
        daysOfWeek:
          validDays.length > 0
            ? [validDays[0]]
            : [],
      };

    case "CUSTOM_DAYS":
      return {
        scheduledDate: null,
        daysOfWeek: validDays,
      };
  }
}

export function formatReminderSchedule({
  frequency,
  timeOfDay,
  scheduledDate,
  daysOfWeek,
}: {
  frequency: ReminderFrequency;
  timeOfDay: string;
  scheduledDate: string | null;
  daysOfWeek: number[];
}): string {
  const formattedTime = formatTimeForDisplay(
    timeOfDay
  );

  switch (frequency) {
    case "ONCE":
      return scheduledDate
        ? `${formatDateForDisplay(
            scheduledDate
          )} at ${formattedTime}`
        : `Once at ${formattedTime}`;

    case "DAILY":
      return `Every day at ${formattedTime}`;

    case "WEEKDAYS":
      return `Monday to Friday at ${formattedTime}`;

    case "WEEKLY": {
      const day =
        daysOfWeek[0] ?? null;

      return day === null
        ? `Weekly at ${formattedTime}`
        : `Every ${weekdayName(
            day
          )} at ${formattedTime}`;
    }

    case "CUSTOM_DAYS": {
      const labels = normaliseDaysOfWeek(
        daysOfWeek
      ).map(weekdayShortName);

      return labels.length === 0
        ? `Custom schedule at ${formattedTime}`
        : `${labels.join(
            ", "
          )} at ${formattedTime}`;
    }
  }
}

export function normaliseDaysOfWeek(
  values: number[]
): number[] {
  return Array.from(
    new Set(
      values.filter(
        (value) =>
          Number.isInteger(value) &&
          value >= 0 &&
          value <= 6
      )
    )
  ).sort((first, second) => {
    const order = [1, 2, 3, 4, 5, 6, 0];

    return (
      order.indexOf(first) -
      order.indexOf(second)
    );
  });
}

export function isValidTimeOfDay(
  value: string
): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(
    value
  );
}

function getAllowedDays({
  frequency,
  daysOfWeek,
  scheduledDate,
  timezone,
}: {
  frequency: ReminderFrequency;
  daysOfWeek: number[];
  scheduledDate: string | null;
  timezone: string;
}): number[] | null {
  switch (frequency) {
    case "DAILY":
      return null;

    case "WEEKDAYS":
      return WEEKDAYS;

    case "WEEKLY": {
      const normalised =
        normaliseDaysOfWeek(daysOfWeek);

      if (normalised.length > 0) {
        return [normalised[0]];
      }

      if (scheduledDate) {
        return [
          getWeekdayForDate(
            parseScheduledDate(scheduledDate)
          ),
        ];
      }

      return [
        getWeekdayForDate(
          getZonedDateParts(
            new Date(),
            timezone
          )
        ),
      ];
    }

    case "CUSTOM_DAYS": {
      const normalised =
        normaliseDaysOfWeek(daysOfWeek);

      return normalised.length > 0
        ? normalised
        : null;
    }

    case "ONCE":
      return null;
  }
}

function parseTimeOfDay(value: string): {
  hour: number;
  minute: number;
  second: number;
} {
  if (!isValidTimeOfDay(value)) {
    throw new Error(
      "Time must use HH:mm or HH:mm:ss format."
    );
  }

  const [hour, minute, second = "0"] =
    value.split(":");

  return {
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
  };
}

function parseScheduledDate(
  value: string
): {
  year: number;
  month: number;
  day: number;
} {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value
    );

  if (!match) {
    throw new Error(
      "Scheduled date must use YYYY-MM-DD format."
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const validationDate = new Date(
    Date.UTC(year, month - 1, day)
  );

  if (
    validationDate.getUTCFullYear() !== year ||
    validationDate.getUTCMonth() + 1 !==
      month ||
    validationDate.getUTCDate() !== day
  ) {
    throw new Error(
      "Scheduled date is invalid."
    );
  }

  return {
    year,
    month,
    day,
  };
}

function getZonedDateParts(
  value: Date,
  timezone: string
): {
  year: number;
  month: number;
  day: number;
} {
  const parts = getZonedParts(
    value,
    timezone
  );

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
  };
}

function getZonedParts(
  value: Date,
  timezone: string
): ZonedParts {
  const formatter =
    new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });

  const values = Object.fromEntries(
    formatter
      .formatToParts(value)
      .filter(
        (part) => part.type !== "literal"
      )
      .map((part) => [
        part.type,
        Number(part.value),
      ])
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
}

function zonedDateTimeToUtc({
  year,
  month,
  day,
  hour,
  minute,
  second,
  timezone,
}: ZonedParts & {
  timezone: string;
}): Date {
  const targetAsUtc = Date.UTC(
    year,
    month - 1,
    day,
    hour,
    minute,
    second
  );

  let guess = targetAsUtc;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const actual = getZonedParts(
      new Date(guess),
      timezone
    );

    const actualAsUtc = Date.UTC(
      actual.year,
      actual.month - 1,
      actual.day,
      actual.hour,
      actual.minute,
      actual.second
    );

    const difference =
      targetAsUtc - actualAsUtc;

    if (difference === 0) {
      break;
    }

    guess += difference;
  }

  return new Date(guess);
}

function addCalendarDays(
  value: {
    year: number;
    month: number;
    day: number;
  },
  amount: number
): {
  year: number;
  month: number;
  day: number;
} {
  const date = new Date(
    Date.UTC(
      value.year,
      value.month - 1,
      value.day + amount
    )
  );

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function getWeekdayForDate(
  value: {
    year: number;
    month: number;
    day: number;
  }
): number {
  return new Date(
    Date.UTC(
      value.year,
      value.month - 1,
      value.day
    )
  ).getUTCDay();
}

function assertValidTimezone(
  timezone: string
): void {
  try {
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: timezone,
      }
    ).format();
  } catch {
    throw new Error(
      `Invalid timezone: ${timezone}`
    );
  }
}

function formatTimeForDisplay(
  value: string
): string {
  const { hour, minute } =
    parseTimeOfDay(value);

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    }
  ).format(
    new Date(
      Date.UTC(
        2000,
        0,
        1,
        hour,
        minute
      )
    )
  );
}

function formatDateForDisplay(
  value: string
): string {
  const { year, month, day } =
    parseScheduledDate(value);

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(
    new Date(
      Date.UTC(year, month - 1, day)
    )
  );
}

function weekdayName(
  value: number
): string {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][value] ?? "Unknown day";
}

function weekdayShortName(
  value: number
): string {
  return [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ][value] ?? "?";
}
