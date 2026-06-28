import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type AttemptResult = "COMPLETED" | "INCOMPLETE" | "FAILED";
type HandSide = "LEFT" | "RIGHT" | "UNKNOWN";

type JsonValue = number | string | boolean | null;
type JsonObject = Record<string, JsonValue>;

type SaveAttemptRequest = {
  sessionId: string;
  attemptNumber: number;
  completedRepNumber?: number | null;

  result: AttemptResult;
  durationMs: number;
  startedAt?: string | null;
  completedAt?: string | null;

  stateReached?: string | null;
  failureReason?: string | null;

  activeHand?: HandSide | null;
  supportHand?: HandSide | null;
  isBilateral?: boolean;

  movementMetrics?: JsonObject;
  speedMetrics?: JsonObject;
  trackingContext?: JsonObject;

  accuracyScore?: number | null;
  movementScore?: number | null;
};

const validResults: AttemptResult[] = [
  "COMPLETED",
  "INCOMPLETE",
  "FAILED",
];

const validHands: HandSide[] = [
  "LEFT",
  "RIGHT",
  "UNKNOWN",
];

function isJsonObject(value: unknown): value is JsonObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isValidOptionalScore(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 100
    )
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SaveAttemptRequest;

    if (!body.sessionId || typeof body.sessionId !== "string") {
      return NextResponse.json(
        { error: "sessionId is required." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(body.attemptNumber) ||
      body.attemptNumber <= 0
    ) {
      return NextResponse.json(
        { error: "attemptNumber must be a positive integer." },
        { status: 400 }
      );
    }

    if (!validResults.includes(body.result)) {
      return NextResponse.json(
        { error: "Invalid attempt result." },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(body.durationMs) ||
      body.durationMs < 0 ||
      body.durationMs > 3_600_000
    ) {
      return NextResponse.json(
        { error: "durationMs must be a valid non-negative number." },
        { status: 400 }
      );
    }

    if (
      body.result === "COMPLETED" &&
      (
        !Number.isInteger(body.completedRepNumber) ||
        Number(body.completedRepNumber) <= 0
      )
    ) {
      return NextResponse.json(
        {
          error:
            "completedRepNumber is required for completed attempts.",
        },
        { status: 400 }
      );
    }

    if (
      body.result !== "COMPLETED" &&
      body.completedRepNumber !== undefined &&
      body.completedRepNumber !== null
    ) {
      return NextResponse.json(
        {
          error:
            "completedRepNumber must be null for incomplete or failed attempts.",
        },
        { status: 400 }
      );
    }

    if (
      body.activeHand &&
      !validHands.includes(body.activeHand)
    ) {
      return NextResponse.json(
        { error: "Invalid activeHand value." },
        { status: 400 }
      );
    }

    if (
      body.supportHand &&
      !validHands.includes(body.supportHand)
    ) {
      return NextResponse.json(
        { error: "Invalid supportHand value." },
        { status: 400 }
      );
    }

    if (
      body.movementMetrics !== undefined &&
      !isJsonObject(body.movementMetrics)
    ) {
      return NextResponse.json(
        { error: "movementMetrics must be an object." },
        { status: 400 }
      );
    }

    if (
      body.speedMetrics !== undefined &&
      !isJsonObject(body.speedMetrics)
    ) {
      return NextResponse.json(
        { error: "speedMetrics must be an object." },
        { status: 400 }
      );
    }

    if (
      body.trackingContext !== undefined &&
      !isJsonObject(body.trackingContext)
    ) {
      return NextResponse.json(
        { error: "trackingContext must be an object." },
        { status: 400 }
      );
    }

    if (!isValidOptionalScore(body.accuracyScore)) {
      return NextResponse.json(
        { error: "accuracyScore must be between 0 and 100." },
        { status: 400 }
      );
    }

    if (!isValidOptionalScore(body.movementScore)) {
      return NextResponse.json(
        { error: "movementScore must be between 0 and 100." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be signed in to save an attempt." },
        { status: 401 }
      );
    }

    const { data: session, error: sessionError } = await supabase
      .from("exercise_sessions")
      .select("id, survivor_id, status")
      .eq("id", body.sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Exercise session not found." },
        { status: 404 }
      );
    }

    if (session.survivor_id !== user.id) {
      return NextResponse.json(
        { error: "You cannot modify this exercise session." },
        { status: 403 }
      );
    }

    if (
      session.status !== "ACTIVE" &&
      session.status !== "PAUSED"
    ) {
      return NextResponse.json(
        { error: "This exercise session is no longer editable." },
        { status: 409 }
      );
    }

    const completedAt =
      body.completedAt ?? new Date().toISOString();

    const { data: attempt, error: attemptError } = await supabase
      .from("exercise_repetitions")
      .upsert(
        {
          session_id: session.id,
          attempt_number: body.attemptNumber,
          completed_rep_number:
            body.result === "COMPLETED"
              ? body.completedRepNumber
              : null,

          result: body.result,
          duration_ms: Math.round(body.durationMs),

          started_at: body.startedAt ?? null,
          completed_at: completedAt,

          state_reached: body.stateReached ?? null,
          failure_reason: body.failureReason ?? null,

          active_hand: body.activeHand ?? null,
          support_hand: body.supportHand ?? null,
          is_bilateral: body.isBilateral ?? false,

          movement_metrics: body.movementMetrics ?? {},
          speed_metrics: body.speedMetrics ?? {},
          tracking_context: body.trackingContext ?? {},

          accuracy_score: body.accuracyScore ?? null,
          movement_score: body.movementScore ?? null,
          quality_breakdown: {},
        },
        {
          onConflict: "session_id,attempt_number",
        }
      )
      .select(
        `
          id,
          session_id,
          attempt_number,
          completed_rep_number,
          result,
          duration_ms,
          state_reached,
          failure_reason,
          active_hand,
          support_hand,
          is_bilateral,
          movement_metrics,
          speed_metrics,
          tracking_context,
          accuracy_score,
          movement_score,
          started_at,
          completed_at
        `
      )
      .single();

    if (attemptError || !attempt) {
      console.error("Failed to save attempt:", attemptError);

      return NextResponse.json(
        { error: "Failed to save exercise attempt." },
        { status: 500 }
      );
    }

    const { data: attempts, error: attemptsError } = await supabase
      .from("exercise_repetitions")
      .select("result")
      .eq("session_id", session.id);

    if (attemptsError || !attempts) {
      console.error(
        "Attempt saved but session totals could not be calculated:",
        attemptsError
      );

      return NextResponse.json(
        {
          error:
            "Attempt was saved, but session totals could not be updated.",
        },
        { status: 500 }
      );
    }

    const attemptCount = attempts.length;

    const completedReps = attempts.filter(
      (item) => item.result === "COMPLETED"
    ).length;

    const failedReps = attempts.filter(
      (item) => item.result === "FAILED"
    ).length;

    const incompleteAttempts = attempts.filter(
      (item) => item.result === "INCOMPLETE"
    ).length;

    const difficultyFlag =
      failedReps >= 3 ||
      incompleteAttempts >= 3;

    const difficultyReason = difficultyFlag
      ? "Repeated failed or incomplete attempts detected."
      : null;

    const { error: updateSessionError } = await supabase
      .from("exercise_sessions")
      .update({
        attempt_count: attemptCount,
        completed_reps: completedReps,
        failed_reps: failedReps,
        incomplete_attempts: incompleteAttempts,
        difficulty_flag: difficultyFlag,
        difficulty_reason: difficultyReason,
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    if (updateSessionError) {
      console.error(
        "Attempt saved but session update failed:",
        updateSessionError
      );

      return NextResponse.json(
        {
          error:
            "Attempt was saved, but the session could not be updated.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        attempt,
        sessionTotals: {
          attemptCount,
          completedReps,
          failedReps,
          incompleteAttempts,
          difficultyFlag,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected attempt API error:", error);

    return NextResponse.json(
      { error: "Invalid attempt request." },
      { status: 400 }
    );
  }
}