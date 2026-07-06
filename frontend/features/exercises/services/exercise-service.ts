import { createClient } from "@/lib/supabase/server";

import type {
  Exercise,
  ExerciseStep,
  ExerciseSummary,
} from "@/features/exercises/types";

type ExerciseRow = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  benefits: string[] | null;
  daily_activities: string[] | null;
  daily_activity_images: string[] | null;
  safety_information: string | null;
  tracker_type: string;
  primary_metric: string;
  default_target_reps: number;
  default_start_threshold: number | null;
  default_complete_threshold: number | null;
  default_return_threshold: number | null;
  default_grip_threshold: number | null;
  default_release_threshold: number | null;
  default_hold_duration_ms: number | null;
  thresholds_are_provisional: boolean;
  thumbnail_url: string | null;
  start_image_url: string | null;
  active_image_url: string | null;
  demo_video_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ExerciseStepRow = {
  id: string;
  exercise_id: string;
  step_number: number;
  title: string | null;
  instruction: string;
  image_url: string | null;
  created_at: string;
};

function mapExerciseStep(
  row: ExerciseStepRow
): ExerciseStep {
  return {
    id: row.id,
    exerciseId: row.exercise_id,
    stepNumber: row.step_number,
    title: row.title,
    instruction: row.instruction,
    imageUrl: row.image_url,
    createdAt: row.created_at,
  };
}

function mapExercise(
  row: ExerciseRow,
  steps: ExerciseStep[] = []
): Exercise {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    benefits: row.benefits ?? [],
    dailyActivities: row.daily_activities ?? [],
    safetyInformation: row.safety_information,
    trackerType: row.tracker_type,
    primaryMetric: row.primary_metric,
    defaultTargetReps: row.default_target_reps,
    defaultStartThreshold:
      row.default_start_threshold,
    defaultCompleteThreshold:
      row.default_complete_threshold,
    defaultReturnThreshold:
      row.default_return_threshold,
    defaultGripThreshold:
      row.default_grip_threshold,
    defaultReleaseThreshold:
      row.default_release_threshold,
    defaultHoldDurationMs:
      row.default_hold_duration_ms,
    thresholdsAreProvisional:
      row.thresholds_are_provisional,
    dailyActivityImages:
    row.daily_activity_images ?? [],
    thumbnailUrl: row.thumbnail_url,
    startImageUrl: row.start_image_url,
    activeImageUrl: row.active_image_url,
    demoVideoUrl: row.demo_video_url,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    steps,
  };
}

export async function getActiveExercises(): Promise<
  ExerciseSummary[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exercises")
    .select(
      `
        id,
        slug,
        title,
        short_description,
        description,
        tracker_type,
        primary_metric,
        default_target_reps,
        thumbnail_url
      `
    )
    .eq("is_active", true)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Failed to load active exercises:",
      error
    );

    throw new Error(
      "The exercise library could not be loaded."
    );
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription:
      row.short_description,
    description: row.description,
    trackerType: row.tracker_type,
    primaryMetric: row.primary_metric,
    defaultTargetReps:
      row.default_target_reps,
    thumbnailUrl: row.thumbnail_url,
  }));
}

export async function getExerciseBySlug(
  slug: string
): Promise<Exercise | null> {
  const supabase = await createClient();

  const {
    data: exerciseData,
    error: exerciseError,
  } = await supabase
    .from("exercises")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (exerciseError) {
    console.error(
      `Failed to load exercise "${slug}":`,
      exerciseError
    );

    throw new Error(
      "The exercise could not be loaded."
    );
  }

  if (!exerciseData) {
    return null;
  }

  const {
    data: stepData,
    error: stepError,
  } = await supabase
    .from("exercise_steps")
    .select(
      `
        id,
        exercise_id,
        step_number,
        title,
        instruction,
        image_url,
        created_at
      `
    )
    .eq("exercise_id", exerciseData.id)
    .order("step_number", {
      ascending: true,
    });

  if (stepError) {
    console.error(
      `Failed to load steps for exercise "${slug}":`,
      stepError
    );

    throw new Error(
      "The exercise instructions could not be loaded."
    );
  }

  const steps = (
    (stepData ?? []) as ExerciseStepRow[]
  ).map(mapExerciseStep);

  return mapExercise(
    exerciseData as ExerciseRow,
    steps
  );
}

export async function getExerciseById(
  id: string
): Promise<Exercise | null> {
  const supabase = await createClient();

  const {
    data: exerciseData,
    error: exerciseError,
  } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (exerciseError) {
    console.error(
      `Failed to load exercise "${id}":`,
      exerciseError
    );

    throw new Error(
      "The exercise could not be loaded."
    );
  }

  if (!exerciseData) {
    return null;
  }

  const {
    data: stepData,
    error: stepError,
  } = await supabase
    .from("exercise_steps")
    .select(
      `
        id,
        exercise_id,
        step_number,
        title,
        instruction,
        image_url,
        created_at
      `
    )
    .eq("exercise_id", exerciseData.id)
    .order("step_number", {
      ascending: true,
    });

  if (stepError) {
    console.error(
      `Failed to load steps for exercise "${id}":`,
      stepError
    );

    throw new Error(
      "The exercise instructions could not be loaded."
    );
  }

  return mapExercise(
    exerciseData as ExerciseRow,
    (
      (stepData ?? []) as ExerciseStepRow[]
    ).map(mapExerciseStep)
  );
}