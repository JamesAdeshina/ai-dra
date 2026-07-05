"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AUDIO_PREFERENCES_STORAGE_KEY,
  AUDIO_PREFERENCES_VERSION,
  DEFAULT_AUDIO_PREFERENCES,
  clampVolume,
} from "./audio-config";

import { audioService } from "./audio-service";

import type {
  AudioPreferences,
  StoredAudioPreferences,
} from "./audio-types";

type UseAudioPreferencesResult = {
  preferences: AudioPreferences;
  isLoaded: boolean;
  hasConfiguredAudio: boolean;
  updatePreference: <
    Key extends keyof AudioPreferences,
  >(
    key: Key,
    value: AudioPreferences[Key]
  ) => void;
  updatePreferences: (
    updates: Partial<AudioPreferences>
  ) => void;
  savePreferences: (
    preferences?: AudioPreferences
  ) => void;
  markConfigured: () => void;
  continueWithoutAudio: () => void;
  resetPreferences: () => void;
};

function normalisePreferences(
  value: Partial<AudioPreferences>
): AudioPreferences {
  return {
    soundEffectsEnabled:
      value.soundEffectsEnabled ??
      DEFAULT_AUDIO_PREFERENCES.soundEffectsEnabled,

    voicePromptsEnabled:
      value.voicePromptsEnabled ??
      DEFAULT_AUDIO_PREFERENCES.voicePromptsEnabled,

    backgroundMusicEnabled:
      value.backgroundMusicEnabled ??
      DEFAULT_AUDIO_PREFERENCES.backgroundMusicEnabled,

    effectsVolume: clampVolume(
      value.effectsVolume ??
        DEFAULT_AUDIO_PREFERENCES.effectsVolume
    ),

    voiceVolume: clampVolume(
      value.voiceVolume ??
        DEFAULT_AUDIO_PREFERENCES.voiceVolume
    ),

    musicVolume: clampVolume(
      value.musicVolume ??
        DEFAULT_AUDIO_PREFERENCES.musicVolume
    ),
  };
}

function applyVolumes(
  preferences: AudioPreferences
): void {
  audioService.setCategoryVolume(
    "effects",
    preferences.effectsVolume
  );

  audioService.setCategoryVolume(
    "voice",
    preferences.voiceVolume
  );

  audioService.setCategoryVolume(
    "music",
    preferences.musicVolume
  );
}

export function useAudioPreferences(): UseAudioPreferencesResult {
  const [preferences, setPreferences] =
    useState<AudioPreferences>(
      DEFAULT_AUDIO_PREFERENCES
    );

  const [
    hasConfiguredAudio,
    setHasConfiguredAudio,
  ] = useState(false);

  const [isLoaded, setIsLoaded] =
    useState(false);

  useEffect(() => {
    try {
      const storedValue =
        window.localStorage.getItem(
          AUDIO_PREFERENCES_STORAGE_KEY
        );

      if (!storedValue) {
        applyVolumes(
          DEFAULT_AUDIO_PREFERENCES
        );

        setIsLoaded(true);
        return;
      }

      const parsed =
        JSON.parse(
          storedValue
        ) as StoredAudioPreferences;

      const loadedPreferences =
        normalisePreferences(
          parsed.preferences ?? {}
        );

      setPreferences(loadedPreferences);
      setHasConfiguredAudio(
        Boolean(parsed.configured)
      );

      applyVolumes(loadedPreferences);
    } catch (error) {
      if (
        process.env.NODE_ENV ===
        "development"
      ) {
        console.warn(
          "[AI-DRA Audio] Stored preferences could not be loaded.",
          error
        );
      }

      applyVolumes(
        DEFAULT_AUDIO_PREFERENCES
      );
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    applyVolumes(preferences);
  }, [isLoaded, preferences]);

  const persist = useCallback(
    (
      nextPreferences: AudioPreferences,
      configured: boolean
    ) => {
      const payload: StoredAudioPreferences =
        {
          version:
            AUDIO_PREFERENCES_VERSION,
          configured,
          preferences: nextPreferences,
        };

      try {
        window.localStorage.setItem(
          AUDIO_PREFERENCES_STORAGE_KEY,
          JSON.stringify(payload)
        );
      } catch (error) {
        if (
          process.env.NODE_ENV ===
          "development"
        ) {
          console.warn(
            "[AI-DRA Audio] Preferences could not be saved.",
            error
          );
        }
      }
    },
    []
  );

  const updatePreference = useCallback(
    <
      Key extends keyof AudioPreferences,
    >(
      key: Key,
      value: AudioPreferences[Key]
    ) => {
      setPreferences((current) => ({
        ...current,
        [key]:
          key === "effectsVolume" ||
          key === "voiceVolume" ||
          key === "musicVolume"
            ? clampVolume(value as number)
            : value,
      }));
    },
    []
  );

  const updatePreferences = useCallback(
    (
      updates: Partial<AudioPreferences>
    ) => {
      setPreferences((current) =>
        normalisePreferences({
          ...current,
          ...updates,
        })
      );
    },
    []
  );

  const savePreferences = useCallback(
    (
      nextPreferences = preferences
    ) => {
      const normalised =
        normalisePreferences(
          nextPreferences
        );

      setPreferences(normalised);
      setHasConfiguredAudio(true);

      applyVolumes(normalised);

      persist(normalised, true);
    },
    [persist, preferences]
  );

  const markConfigured = useCallback(() => {
    setHasConfiguredAudio(true);
    persist(preferences, true);
  }, [persist, preferences]);

  const continueWithoutAudio =
    useCallback(() => {
      const silentPreferences: AudioPreferences =
        {
          ...preferences,
          soundEffectsEnabled: false,
          voicePromptsEnabled: false,
          backgroundMusicEnabled: false,
        };

      setPreferences(silentPreferences);
      setHasConfiguredAudio(true);

      applyVolumes(silentPreferences);

      persist(silentPreferences, true);
    }, [persist, preferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(
      DEFAULT_AUDIO_PREFERENCES
    );

    setHasConfiguredAudio(false);

    applyVolumes(
      DEFAULT_AUDIO_PREFERENCES
    );

    persist(
      DEFAULT_AUDIO_PREFERENCES,
      false
    );
  }, [persist]);

  return {
    preferences,
    isLoaded,
    hasConfiguredAudio,
    updatePreference,
    updatePreferences,
    savePreferences,
    markConfigured,
    continueWithoutAudio,
    resetPreferences,
  };
}