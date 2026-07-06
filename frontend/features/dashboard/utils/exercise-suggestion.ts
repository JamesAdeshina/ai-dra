import type {
  DashboardExercise,
  DashboardScore,
  DashboardSession,
  SuggestedExercise,
} from "@/features/dashboard/types/dashboard-types";

type SuggestionInput = {
  exercises: DashboardExercise[];
  sessions: DashboardSession[];
  scores: DashboardScore[];
  userId: string;
  now?: Date;
};

export function suggestExercise({
  exercises,
  sessions,
  scores,
  userId,
  now = new Date(),
}: SuggestionInput): SuggestedExercise | null {
  if (exercises.length === 0) {
    return null;
  }

  const completedSessions = sessions.filter(
    (session) => session.status === "COMPLETED"
  );

  const sessionsByExercise = new Map<string, DashboardSession[]>();

  completedSessions.forEach((session) => {
    const existing =
      sessionsByExercise.get(session.exerciseId) ?? [];

    existing.push(session);
    sessionsByExercise.set(
      session.exerciseId,
      existing
    );
  });

  const scoresByExercise = new Map<string, number[]>();

  scores.forEach((score) => {
    if (
      score.movementScore === null ||
      !Number.isFinite(score.movementScore)
    ) {
      return;
    }

    const existing =
      scoresByExercise.get(score.exerciseId) ?? [];

    existing.push(score.movementScore);
    scoresByExercise.set(
      score.exerciseId,
      existing
    );
  });

  const scoredCandidates = exercises
    .map((exercise) => {
      const exerciseScores =
        scoresByExercise.get(exercise.id) ?? [];

      const averageMovementScore =
        exerciseScores.length > 0
          ? Math.round(
              exerciseScores.reduce(
                (total, score) => total + score,
                0
              ) / exerciseScores.length
            )
          : null;

      const completedForExercise =
        sessionsByExercise.get(exercise.id) ?? [];

      const mostRecentCompletedAt =
        completedForExercise.length > 0
          ? Math.max(
              ...completedForExercise.map((session) =>
                new Date(
                  session.completedAt ??
                    session.startedAt
                ).getTime()
              )
            )
          : null;

      return {
        exercise,
        averageMovementScore,
        sessionsCompleted:
          completedForExercise.length,
        mostRecentCompletedAt,
      };
    });

  const lowestScoreCandidate = scoredCandidates
    .filter(
      (candidate) =>
        candidate.averageMovementScore !== null &&
        candidate.averageMovementScore < 75
    )
    .sort((first, second) => {
      const scoreDifference =
        (first.averageMovementScore ?? 100) -
        (second.averageMovementScore ?? 100);

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      return (
        first.sessionsCompleted -
        second.sessionsCompleted
      );
    })[0];

  if (lowestScoreCandidate) {
    return {
      ...lowestScoreCandidate.exercise,
      reason: "LOWEST_SCORE",
      reasonLabel:
        "Suggested because this exercise had your lowest recent Movement Score.",
      averageMovementScore:
        lowestScoreCandidate.averageMovementScore,
      sessionsCompleted:
        lowestScoreCandidate.sessionsCompleted,
    };
  }

  const neverPractised = scoredCandidates.filter(
    (candidate) =>
      candidate.sessionsCompleted === 0
  );

  if (neverPractised.length > 0) {
    const selected =
      neverPractised[
        stableIndex(
          `${userId}-${toDateKey(now)}-new`,
          neverPractised.length
        )
      ];

    return {
      ...selected.exercise,
      reason: "LEAST_PRACTISED",
      reasonLabel:
        "Suggested because you have not practised this exercise yet.",
      averageMovementScore:
        selected.averageMovementScore,
      sessionsCompleted:
        selected.sessionsCompleted,
    };
  }

  const oldestPractised = [...scoredCandidates].sort(
    (first, second) =>
      (first.mostRecentCompletedAt ??
        Number.NEGATIVE_INFINITY) -
      (second.mostRecentCompletedAt ??
        Number.NEGATIVE_INFINITY)
  )[0];

  if (oldestPractised) {
    return {
      ...oldestPractised.exercise,
      reason: "NOT_PRACTISED_RECENTLY",
      reasonLabel:
        "Suggested because you have not practised it recently.",
      averageMovementScore:
        oldestPractised.averageMovementScore,
      sessionsCompleted:
        oldestPractised.sessionsCompleted,
    };
  }

  const selected =
    exercises[
      stableIndex(
        `${userId}-${toDateKey(now)}`,
        exercises.length
      )
    ];

  return {
    ...selected,
    reason: "DAILY_ROTATION",
    reasonLabel:
      "Suggested from today’s exercise rotation.",
    averageMovementScore: null,
    sessionsCompleted: 0,
  };
}

function stableIndex(
  value: string,
  length: number
): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash =
      (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return length > 0 ? hash % length : 0;
}

function toDateKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}
