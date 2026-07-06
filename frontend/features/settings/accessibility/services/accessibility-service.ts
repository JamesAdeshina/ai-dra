"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type {
  AccessibilityColorTheme,
  AccessibilityPreferences,
  UpdateAccessibilityPreferencesInput,
} from "@/features/settings/accessibility/types/accessibility";

type AccessibilityPreferencesRow = {
  id: string;
  survivor_id: string;
  text_scale: number;
  high_contrast: boolean;
  reduce_motion: boolean;
  voice_guidance_enabled: boolean;
  sound_effects_enabled: boolean;
  audio_volume: number;
  speech_rate: number;
  larger_buttons: boolean;
  step_by_step_guidance: boolean;
  color_theme: AccessibilityColorTheme;
  created_at: string;
  updated_at: string;
};

const DEFAULT_PREFERENCES = {
  text_scale: 100,
  high_contrast: false,
  reduce_motion: true,
  voice_guidance_enabled: true,
  sound_effects_enabled: true,
  audio_volume: 65,
  speech_rate: 100,
  larger_buttons: true,
  step_by_step_guidance: true,
  color_theme: "SYSTEM" as AccessibilityColorTheme,
};

export async function getOrCreateAccessibilityPreferences(): Promise<AccessibilityPreferences> {
  const { supabase, userId } =
    await getAuthenticatedContext();

  const { data, error } = await supabase
    .from("accessibility_preferences")
    .select("*")
    .eq("survivor_id", userId)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to load accessibility preferences:",
      error
    );

    throw new Error(
      "Accessibility settings could not be loaded."
    );
  }

  if (data) {
    return mapPreferences(
      data as AccessibilityPreferencesRow
    );
  }

  const { data: created, error: createError } =
    await supabase
      .from("accessibility_preferences")
      .insert({
        survivor_id: userId,
        ...DEFAULT_PREFERENCES,
      })
      .select("*")
      .single();

  if (createError) {
    console.error(
      "Failed to create accessibility preferences:",
      createError
    );

    throw new Error(
      "Accessibility settings could not be created."
    );
  }

  return mapPreferences(
    created as AccessibilityPreferencesRow
  );
}

export async function updateAccessibilityPreferences(
  input: UpdateAccessibilityPreferencesInput
): Promise<AccessibilityPreferences> {
  const { supabase, userId } =
    await getAuthenticatedContext();

  const current =
    await getOrCreateAccessibilityPreferences();

  const payload = {
    text_scale: clamp(
      input.textScale ?? current.textScale,
      85,
      140
    ),
    high_contrast:
      input.highContrast ??
      current.highContrast,
    reduce_motion:
      input.reduceMotion ??
      current.reduceMotion,
    voice_guidance_enabled:
      input.voiceGuidanceEnabled ??
      current.voiceGuidanceEnabled,
    sound_effects_enabled:
      input.soundEffectsEnabled ??
      current.soundEffectsEnabled,
    audio_volume: clamp(
      input.audioVolume ??
        current.audioVolume,
      0,
      100
    ),
    speech_rate: clamp(
      input.speechRate ??
        current.speechRate,
      75,
      150
    ),
    larger_buttons:
      input.largerButtons ??
      current.largerButtons,
    step_by_step_guidance:
      input.stepByStepGuidance ??
      current.stepByStepGuidance,
    color_theme:
      input.colorTheme ??
      current.colorTheme,
  };

  const { data, error } = await supabase
    .from("accessibility_preferences")
    .update(payload)
    .eq("survivor_id", userId)
    .select("*")
    .single();

  if (error) {
    console.error(
      "Failed to update accessibility preferences:",
      error
    );

    throw new Error(
      "Accessibility settings could not be saved."
    );
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");

  return mapPreferences(
    data as AccessibilityPreferencesRow
  );
}

async function getAuthenticatedContext() {
  const supabase =
    await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error(
      "You must be signed in to manage accessibility settings."
    );
  }

  return {
    supabase,
    userId: user.id,
  };
}

function mapPreferences(
  row: AccessibilityPreferencesRow
): AccessibilityPreferences {
  return {
    id: row.id,
    survivorId: row.survivor_id,
    textScale: row.text_scale,
    highContrast: row.high_contrast,
    reduceMotion: row.reduce_motion,
    voiceGuidanceEnabled:
      row.voice_guidance_enabled,
    soundEffectsEnabled:
      row.sound_effects_enabled,
    audioVolume: row.audio_volume,
    speechRate: row.speech_rate,
    largerButtons: row.larger_buttons,
    stepByStepGuidance:
      row.step_by_step_guidance,
    colorTheme: row.color_theme,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function clamp(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(minimum, Math.round(value))
  );
}
