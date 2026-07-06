export type AccessibilityColorTheme =
  | "LIGHT"
  | "DARK"
  | "SYSTEM";

export type AccessibilityPreferences = {
  id: string;
  survivorId: string;
  textScale: number;
  highContrast: boolean;
  reduceMotion: boolean;
  voiceGuidanceEnabled: boolean;
  soundEffectsEnabled: boolean;
  audioVolume: number;
  speechRate: number;
  largerButtons: boolean;
  stepByStepGuidance: boolean;
  colorTheme: AccessibilityColorTheme;
  createdAt: string;
  updatedAt: string;
};

export type UpdateAccessibilityPreferencesInput = {
  textScale?: number;
  highContrast?: boolean;
  reduceMotion?: boolean;
  voiceGuidanceEnabled?: boolean;
  soundEffectsEnabled?: boolean;
  audioVolume?: number;
  speechRate?: number;
  largerButtons?: boolean;
  stepByStepGuidance?: boolean;
  colorTheme?: AccessibilityColorTheme;
};
