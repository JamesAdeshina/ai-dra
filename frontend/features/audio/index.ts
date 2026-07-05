export {
  DEFAULT_AUDIO_PREFERENCES,
  AUDIO_PREFERENCES_STORAGE_KEY,
  AUDIO_PREFERENCES_VERSION,
  READY_PROMPT_SAFE_DELAY_MS,
  TRACKING_LOST_DELAY_MS,
  VOICE_PRIORITIES,
} from "./audio-config";

export { audioService } from "./audio-service";

export { useAudioPreferences } from "./use-audio-preferences";

export { useBackgroundMusic } from "./use-background-music";

export type {
  AudioCategory,
  AudioEffectKey,
  AudioMusicKey,
  AudioPreferences,
  AudioServiceState,
  AudioVoiceKey,
  PlayVoiceOptions,
  StoredAudioPreferences,
  VoicePriority,
} from "./audio-types";