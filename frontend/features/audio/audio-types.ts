export type AudioCategory =
  | "effects"
  | "voice"
  | "music";

export type AudioEffectKey =
  | "countdownBeep"
  | "repComplete"
  | "holdComplete"
  | "sessionComplete"
  | "pause"
  | "trackingLost";

export type AudioVoiceKey =
  | "readyWhenYouAre"
  | "halfwayThere"
  | "sessionComplete"
  | "trackingLost";

export type AudioMusicKey =
  | "dashboardBackground"
  | "sessionBackground";

export type VoicePriority =
  | 1
  | 2
  | 3
  | 4;

export type AudioPreferences = {
  soundEffectsEnabled: boolean;
  voicePromptsEnabled: boolean;
  backgroundMusicEnabled: boolean;
  effectsVolume: number;
  voiceVolume: number;
  musicVolume: number;
};

export type StoredAudioPreferences = {
  version: number;
  configured: boolean;
  preferences: AudioPreferences;
};

export type PlayVoiceOptions = {
  priority?: VoicePriority;
  interruptLowerPriority?: boolean;
};

export type AudioServiceState = {
  currentVoice: AudioVoiceKey | null;
  currentVoicePriority: VoicePriority | null;
  currentMusic: AudioMusicKey | null;
  isMusicPaused: boolean;
};