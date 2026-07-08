"use client";

import type {
  AccessibilityPreferences,
} from "@/features/settings/accessibility/types/accessibility";

export const ACCESSIBILITY_STORAGE_KEY =
  "ai-dra-accessibility-preferences";

export const ACCESSIBILITY_EVENT =
  "ai-dra-accessibility-change";

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  id: "",
  survivorId: "",
  textScale: 100,
  highContrast: false,
  reduceMotion: true,
  voiceGuidanceEnabled: true,
  soundEffectsEnabled: true,
  audioVolume: 65,
  speechRate: 100,
  largerButtons: true,
  stepByStepGuidance: true,
  colorTheme: "SYSTEM",
  createdAt: "",
  updatedAt: "",
};

export function applyAccessibilityPreferences(
  preferences: AccessibilityPreferences
): void {
  if (typeof window === "undefined") {
    return;
  }

  const root = document.documentElement;

  root.style.setProperty(
    "--ai-dra-text-scale",
    String(preferences.textScale / 100)
  );

  root.style.setProperty(
    "--ai-dra-audio-volume",
    String(preferences.audioVolume / 100)
  );

  root.style.setProperty(
    "--ai-dra-speech-rate",
    String(preferences.speechRate / 100)
  );

  root.dataset.highContrast =
    String(preferences.highContrast);

  root.dataset.reduceMotion =
    String(preferences.reduceMotion);

  root.dataset.largeButtons =
    String(preferences.largerButtons);

  root.dataset.stepGuidance =
    String(preferences.stepByStepGuidance);

  root.dataset.voiceGuidance =
    String(preferences.voiceGuidanceEnabled);

  root.dataset.soundEffects =
    String(preferences.soundEffectsEnabled);

  applyColorTheme(preferences.colorTheme);
}

export function persistAccessibilityPreferences(
  preferences: AccessibilityPreferences
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    ACCESSIBILITY_STORAGE_KEY,
    JSON.stringify(preferences)
  );

  applyAccessibilityPreferences(preferences);

  window.dispatchEvent(
    new CustomEvent<AccessibilityPreferences>(
      ACCESSIBILITY_EVENT,
      {
        detail: preferences,
      }
    )
  );
}

export function readStoredAccessibilityPreferences(): AccessibilityPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_ACCESSIBILITY_PREFERENCES;
  }

  const stored = window.localStorage.getItem(
    ACCESSIBILITY_STORAGE_KEY
  );

  if (!stored) {
    return DEFAULT_ACCESSIBILITY_PREFERENCES;
  }

  try {
    return {
      ...DEFAULT_ACCESSIBILITY_PREFERENCES,
      ...(JSON.parse(
        stored
      ) as Partial<AccessibilityPreferences>),
    };
  } catch {
    return DEFAULT_ACCESSIBILITY_PREFERENCES;
  }
}

export function applyColorTheme(
  theme: AccessibilityPreferences["colorTheme"]
): void {
  if (typeof window === "undefined") {
    return;
  }

  const root = document.documentElement;

  const shouldUseDark =
    theme === "DARK" ||
    (theme === "SYSTEM" &&
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches);

  root.classList.toggle(
    "dark",
    shouldUseDark
  );

  root.dataset.colorTheme =
    theme.toLowerCase();
}
