import type {
  AudioEffectKey,
  AudioMusicKey,
  AudioPreferences,
  AudioVoiceKey,
  VoicePriority,
} from "./audio-types";

export const AUDIO_PREFERENCES_STORAGE_KEY =
  "ai-dra:audio-preferences";

export const AUDIO_PREFERENCES_VERSION = 1;

export const DEFAULT_AUDIO_PREFERENCES: AudioPreferences = {
  soundEffectsEnabled: true,
  voicePromptsEnabled: true,
  backgroundMusicEnabled: false,
  effectsVolume: 0.5,
  voiceVolume: 0.9,
  musicVolume: 0.15,
};

export const AUDIO_EFFECT_PATHS: Record<
  AudioEffectKey,
  string
> = {
  countdownBeep:
    "/audio/effects/countdown-beep.mp3",
  repComplete:
    "/audio/effects/rep-complete.wav",
  holdComplete:
    "/audio/effects/hold-complete.wav",
  sessionComplete:
    "/audio/effects/session-complete.mp3",
  pause:
    "/audio/effects/pause.mp3",
  trackingLost:
    "/audio/effects/tracking-lost.wav",
};

export const AUDIO_VOICE_PATHS: Record<
  AudioVoiceKey,
  string
> = {
  readyWhenYouAre:
    "/audio/voice/ready-when-you-are.wav",
  halfwayThere:
    "/audio/voice/halfway-there.wav",
  sessionComplete:
    "/audio/voice/session-complete.wav",
  trackingLost:
    "/audio/voice/tracking-lost.wav",
};

export const AUDIO_MUSIC_PATHS: Record<
  AudioMusicKey,
  string
> = {
  dashboardBackground:
    "/audio/music/dashboard-background.mp3",
  sessionBackground:
    "/audio/music/session-background.mp3",
};

export const VOICE_PRIORITIES: Record<
  AudioVoiceKey,
  VoicePriority
> = {
  halfwayThere: 1,
  readyWhenYouAre: 2,
  trackingLost: 3,
  sessionComplete: 4,
};

export const AUDIO_DUCKING_MULTIPLIER = 0.25;

export const MUSIC_FADE_DURATION_MS = 800;

export const READY_PROMPT_SAFE_DELAY_MS = 350;

export const TRACKING_LOST_DELAY_MS = 1500;

export function clampVolume(
  value: number
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}