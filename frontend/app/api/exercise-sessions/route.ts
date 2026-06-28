import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type CreateSessionRequest = {
  exerciseSlug: string;
  targetReps: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateSessionRequest;

    if (!body.exerciseSlug || typeof body.exerciseSlug !== "string") {
      return NextResponse.json(
        { error: "exerciseSlug is required." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(body.targetReps) ||
      body.targetReps <= 0 ||
      body.targetReps > 100
    ) {
      return NextResponse.json(
        { error: "targetReps must be a positive integer." },
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
        { error: "You must be signed in to create a session." },
        { status: 401 }
      );
    }

    const { data: exercise, error: exerciseError } = await supabase
      .from("exercises")
      .select("id, slug, is_active")
      .eq("slug", body.exerciseSlug)
      .eq("is_active", true)
      .single();

    if (exerciseError || !exercise) {
      return NextResponse.json(
        { error: "Exercise not found or inactive." },
        { status: 404 }
      );
    }

    const { data: session, error: sessionError } = await supabase
      .from("exercise_sessions")
      .insert({
        survivor_id: user.id,
        exercise_id: exercise.id,
        target_reps: body.targetReps,
        completed_reps: 0,
        failed_reps: 0,
        duration_seconds: 0,
        status: "ACTIVE",
        session_summary: {},
      })
      .select(
        `
          id,
          survivor_id,
          exercise_id,
          status,
          target_reps,
          completed_reps,
          failed_reps,
          duration_seconds,
          started_at
        `
      )
      .single();

    if (sessionError) {
      console.error("Failed to create exercise session:", sessionError);

      return NextResponse.json(
        { error: "Failed to create exercise session." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected session creation error:", error);

    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}