import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type SessionAction =
  | "PAUSE"
  | "RESUME"
  | "CHECKPOINT"
  | "COMPLETE"
  | "END_EARLY"
  | "ABANDON";

type UpdateSessionRequest = {
  action: SessionAction;
  completedReps?: number;
  durationSeconds?: number;
  performedSide?: "LEFT" | "RIGHT" | "BILATERAL" | "UNKNOWN" | null;
  endedReason?: string | null;
  sessionSummary?: Record<string, number | string | boolean | null>;
};

const validActions: SessionAction[] = [
  "PAUSE",
  "RESUME",
  "CHECKPOINT",
  "COMPLETE",
  "END_EARLY",
  "ABANDON",
];

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      sessionId: string;
    }>;
  }
) {
  try {
    const { sessionId } = await context.params;
    const body = (await request.json()) as UpdateSessionRequest;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required." },
        { status: 400 }
      );
    }

    if (!validActions.includes(body.action)) {
      return NextResponse.json(
        { error: "Invalid session action." },
        { status: 400 }
      );
    }

    if (
      body.completedReps !== undefined &&
      (
        !Number.isInteger(body.completedReps) ||
        body.completedReps < 0
      )
    ) {
      return NextResponse.json(
        { error: "completedReps must be a non-negative integer." },
        { status: 400 }
      );
    }

    if (
      body.durationSeconds !== undefined &&
      (
        !Number.isInteger(body.durationSeconds) ||
        body.durationSeconds < 0
      )
    ) {
      return NextResponse.json(
        { error: "durationSeconds must be a non-negative integer." },
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
        { error: "You must be signed in to update a session." },
        { status: 401 }
      );
    }

    const { data: session, error: sessionError } = await supabase
      .from("exercise_sessions")
      .select(
        `
          id,
          survivor_id,
          status,
          pause_count,
          completed_reps,
          duration_seconds,
          session_summary
        `
      )
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Exercise session not found." },
        { status: 404 }
      );
    }

    if (session.survivor_id !== user.id) {
      return NextResponse.json(
        { error: "You cannot update this exercise session." },
        { status: 403 }
      );
    }

    const now = new Date().toISOString();

    const updateData: Record<string, unknown> = {
      last_activity_at: now,
    };

    if (body.completedReps !== undefined) {
      updateData.completed_reps = body.completedReps;
    }

    if (body.durationSeconds !== undefined) {
      updateData.duration_seconds = body.durationSeconds;
    }

    if (body.performedSide !== undefined) {
      updateData.performed_side = body.performedSide;
    }

    if (body.sessionSummary !== undefined) {
      updateData.session_summary = {
        ...(session.session_summary ?? {}),
        ...body.sessionSummary,
      };
    }

    switch (body.action) {
      case "PAUSE": {
        if (session.status !== "ACTIVE") {
          return NextResponse.json(
            { error: "Only active sessions can be paused." },
            { status: 409 }
          );
        }

        updateData.status = "PAUSED";
        updateData.paused_at = now;
        updateData.pause_count = session.pause_count + 1;
        break;
      }

      case "RESUME": {
        if (session.status !== "PAUSED") {
          return NextResponse.json(
            { error: "Only paused sessions can be resumed." },
            { status: 409 }
          );
        }

        updateData.status = "ACTIVE";
        updateData.paused_at = null;
        break;
      }

      case "CHECKPOINT": {
        if (
          session.status !== "ACTIVE" &&
          session.status !== "PAUSED"
        ) {
          return NextResponse.json(
            { error: "This session can no longer be checkpointed." },
            { status: 409 }
          );
        }

        break;
      }

      case "COMPLETE": {
        if (
          session.status !== "ACTIVE" &&
          session.status !== "PAUSED"
        ) {
          return NextResponse.json(
            { error: "This session can no longer be completed." },
            { status: 409 }
          );
        }

        updateData.status = "COMPLETED";
        updateData.completed_at = now;
        updateData.paused_at = null;
        updateData.resume_allowed = false;
        updateData.ended_reason = null;
        break;
      }

      case "END_EARLY": {
        if (
          session.status !== "ACTIVE" &&
          session.status !== "PAUSED"
        ) {
          return NextResponse.json(
            { error: "This session can no longer be ended." },
            { status: 409 }
          );
        }

        updateData.status = "ENDED_EARLY";
        updateData.completed_at = now;
        updateData.paused_at = null;
        updateData.resume_allowed = false;
        updateData.ended_reason =
          body.endedReason?.trim() || "Ended by survivor.";
        break;
      }

      case "ABANDON": {
        if (
          session.status !== "ACTIVE" &&
          session.status !== "PAUSED"
        ) {
          return NextResponse.json(
            { error: "This session can no longer be abandoned." },
            { status: 409 }
          );
        }

        updateData.status = "ABANDONED";
        updateData.completed_at = now;
        updateData.paused_at = null;
        updateData.resume_allowed = true;
        updateData.ended_reason =
          body.endedReason?.trim() ||
          "Session closed without formal completion.";
        break;
      }
    }

    const { data: updatedSession, error: updateError } = await supabase
      .from("exercise_sessions")
      .update(updateData)
      .eq("id", sessionId)
      .select(
        `
          id,
          status,
          target_reps,
          completed_reps,
          failed_reps,
          incomplete_attempts,
          attempt_count,
          duration_seconds,
          pause_count,
          paused_at,
          completed_at,
          resume_allowed,
          ended_reason,
          performed_side,
          difficulty_flag,
          difficulty_reason,
          session_summary,
          last_activity_at
        `
      )
      .single();

    if (updateError || !updatedSession) {
      console.error("Failed to update session:", updateError);

      return NextResponse.json(
        { error: "Failed to update exercise session." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      session: updatedSession,
    });
  } catch (error) {
    console.error("Unexpected session update error:", error);

    return NextResponse.json(
      { error: "Invalid session update request." },
      { status: 400 }
    );
  }
}