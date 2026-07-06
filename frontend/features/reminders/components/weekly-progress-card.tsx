import Link from "next/link";

type WeeklyProgressCardProps = {
  sessionsCompleted: number;
  sessionTarget: number;
  minutesCompleted: number;
  currentStreak: number;
};

export function WeeklyProgressCard({
  sessionsCompleted,
  sessionTarget,
  minutesCompleted,
  currentStreak,
}: WeeklyProgressCardProps) {
  const safeSessionsCompleted = Math.max(
    0,
    sessionsCompleted
  );

  const safeSessionTarget = Math.max(
    1,
    sessionTarget
  );

  const safeMinutesCompleted = Math.max(
    0,
    Math.round(minutesCompleted)
  );

  const safeCurrentStreak = Math.max(
    0,
    currentStreak
  );

  const remainingSessions = Math.max(
    0,
    safeSessionTarget -
      safeSessionsCompleted
  );

  const progressPercentage = Math.min(
    100,
    Math.round(
      (safeSessionsCompleted /
        safeSessionTarget) *
        100
    )
  );

  return (
    <section className="rounded-2xl bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[18px] font-semibold text-[#1E1E1E]">
          Weekly Progress
        </h3>

        <Link
          href="/progress"
          className="text-[14px] font-medium text-[#7875FB] transition hover:text-[#592EBD] hover:underline"
        >
          View Progress
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <ProgressMetric
          label="Sessions Completed"
          value={`${safeSessionsCompleted}/${safeSessionTarget}`}
          unit="Sessions"
        />

        <ProgressMetric
          label="Exercise Time"
          value={String(
            safeMinutesCompleted
          )}
          unit={
            safeMinutesCompleted === 1
              ? "Minute"
              : "Minutes"
          }
        />

        <ProgressMetric
          label="Current Streak"
          value={String(
            safeCurrentStreak
          )}
          unit={
            safeCurrentStreak === 1
              ? "Day"
              : "Days"
          }
        />
      </div>

      <div
        className="mt-6 h-3 overflow-hidden rounded-full bg-[#F5F5F5]"
        role="progressbar"
        aria-label="Weekly session progress"
        aria-valuemin={0}
        aria-valuemax={
          safeSessionTarget
        }
        aria-valuenow={Math.min(
          safeSessionsCompleted,
          safeSessionTarget
        )}
      >
        <div
          className="h-full rounded-full bg-[#592EBD] transition-all duration-500"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>

      <div className="mt-2 flex flex-col gap-1 text-[12px] text-[#9E9E9E] sm:flex-row sm:justify-between">
        <span>
          {progressPercentage}% of weekly
          session target
        </span>

        <span>
          {remainingSessions === 0
            ? "Weekly target reached"
            : `${remainingSessions} ${
                remainingSessions === 1
                  ? "session"
                  : "sessions"
              } remaining`}
        </span>
      </div>
    </section>
  );
}

function ProgressMetric({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div>
      <p className="text-[12px] leading-[140%] text-[#9E9E9E]">
        {label}
      </p>

      <p className="mt-2 text-[30px] font-bold leading-none text-[#1E1E1E]">
        {value}
      </p>

      <p className="mt-1 text-[14px] text-[#9E9E9E]">
        {unit}
      </p>
    </div>
  );
}
