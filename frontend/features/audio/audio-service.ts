import {
  AUDIO_DUCKING_MULTIPLIER,
  AUDIO_EFFECT_PATHS,
  AUDIO_MUSIC_PATHS,
  AUDIO_VOICE_PATHS,
  DEFAULT_AUDIO_PREFERENCES,
  MUSIC_FADE_DURATION_MS,
  VOICE_PRIORITIES,
  clampVolume,
} from "./audio-config";

import type {
  AudioCategory,
  AudioEffectKey,
  AudioMusicKey,
  AudioServiceState,
  AudioVoiceKey,
  PlayVoiceOptions,
  VoicePriority,
} from "./audio-types";

type AudioElementMap<T extends string> =
  Partial<Record<T, HTMLAudioElement>>;

class AudioService {
  private effectElements: AudioElementMap<AudioEffectKey> =
    {};

  private voiceElements: AudioElementMap<AudioVoiceKey> =
    {};

  private musicElements: AudioElementMap<AudioMusicKey> =
    {};

  private effectsVolume =
    DEFAULT_AUDIO_PREFERENCES.effectsVolume;

  private voiceVolume =
    DEFAULT_AUDIO_PREFERENCES.voiceVolume;

  private musicVolume =
    DEFAULT_AUDIO_PREFERENCES.musicVolume;

  private currentVoice: AudioVoiceKey | null = null;

  private currentVoicePriority:
    | VoicePriority
    | null = null;

  private currentMusic: AudioMusicKey | null = null;

  private currentVoiceCleanup:
    | (() => void)
    | null = null;

  private musicVolumeBeforeDucking: number | null =
    null;

  private fadeAnimationFrame: number | null = null;

  private isUnlocked = false;

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  private warn(
    message: string,
    error?: unknown
  ): void {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    if (error) {
      console.warn(`[AI-DRA Audio] ${message}`, error);
      return;
    }

    console.warn(`[AI-DRA Audio] ${message}`);
  }

  private createAudioElement(
    source: string,
    loop = false
  ): HTMLAudioElement | null {
    if (!this.isBrowser()) {
      return null;
    }

    const audio = new Audio(source);

    audio.preload = "auto";
    audio.loop = loop;

    return audio;
  }

  private getEffectElement(
    key: AudioEffectKey
  ): HTMLAudioElement | null {
    const existing = this.effectElements[key];

    if (existing) {
      return existing;
    }

    const created = this.createAudioElement(
      AUDIO_EFFECT_PATHS[key]
    );

    if (!created) {
      return null;
    }

    created.volume = this.effectsVolume;
    this.effectElements[key] = created;

    return created;
  }

  private getVoiceElement(
    key: AudioVoiceKey
  ): HTMLAudioElement | null {
    const existing = this.voiceElements[key];

    if (existing) {
      return existing;
    }

    const created = this.createAudioElement(
      AUDIO_VOICE_PATHS[key]
    );

    if (!created) {
      return null;
    }

    created.volume = this.voiceVolume;
    this.voiceElements[key] = created;

    return created;
  }

  private getMusicElement(
    key: AudioMusicKey
  ): HTMLAudioElement | null {
    const existing = this.musicElements[key];

    if (existing) {
      return existing;
    }

    const created = this.createAudioElement(
      AUDIO_MUSIC_PATHS[key],
      true
    );

    if (!created) {
      return null;
    }

    created.volume = this.musicVolume;
    this.musicElements[key] = created;

    return created;
  }

  private async safePlay(
    audio: HTMLAudioElement,
    label: string
  ): Promise<boolean> {
    try {
      await audio.play();
      return true;
    } catch (error) {
      this.warn(
        `${label} could not be played.`,
        error
      );

      return false;
    }
  }

  async unlockAudio(): Promise<void> {
    if (
      !this.isBrowser() ||
      this.isUnlocked
    ) {
      return;
    }

    const audio =
      this.getEffectElement("countdownBeep");

    if (!audio) {
      return;
    }

    const previousVolume = audio.volume;

    try {
      audio.volume = 0;
      audio.currentTime = 0;

      await audio.play();

      audio.pause();
      audio.currentTime = 0;

      this.isUnlocked = true;
    } catch (error) {
      this.warn(
        "Audio could not be unlocked.",
        error
      );
    } finally {
      audio.volume = previousVolume;
    }
  }

  preloadAudio(): void {
    if (!this.isBrowser()) {
      return;
    }

    (
      Object.keys(
        AUDIO_EFFECT_PATHS
      ) as AudioEffectKey[]
    ).forEach((key) => {
      this.getEffectElement(key)?.load();
    });

    (
      Object.keys(
        AUDIO_VOICE_PATHS
      ) as AudioVoiceKey[]
    ).forEach((key) => {
      this.getVoiceElement(key)?.load();
    });

    (
      Object.keys(
        AUDIO_MUSIC_PATHS
      ) as AudioMusicKey[]
    ).forEach((key) => {
      this.getMusicElement(key)?.load();
    });
  }

  async playEffect(
    key: AudioEffectKey
  ): Promise<boolean> {
    const audio = this.getEffectElement(key);

    if (!audio) {
      return false;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.volume = this.effectsVolume;

    return this.safePlay(
      audio,
      `Effect "${key}"`
    );
  }

  async playVoice(
    key: AudioVoiceKey,
    options: PlayVoiceOptions = {}
  ): Promise<boolean> {
    const priority =
      options.priority ??
      VOICE_PRIORITIES[key];

    const interruptLowerPriority =
      options.interruptLowerPriority ?? true;

    if (
      this.currentVoice &&
      this.currentVoicePriority
    ) {
      const canInterrupt =
        interruptLowerPriority &&
        priority >
          this.currentVoicePriority;

      if (!canInterrupt) {
        return false;
      }

      this.stopCurrentVoice();
    }

    const audio = this.getVoiceElement(key);

    if (!audio) {
      return false;
    }

    this.currentVoice = key;
    this.currentVoicePriority = priority;

    audio.pause();
    audio.currentTime = 0;
    audio.volume = this.voiceVolume;

    this.duckMusic();

    return new Promise<boolean>((resolve) => {
      const cleanup = () => {
        audio.removeEventListener(
          "ended",
          handleEnded
        );

        audio.removeEventListener(
          "error",
          handleError
        );

        if (this.currentVoice === key) {
          this.currentVoice = null;
          this.currentVoicePriority = null;
          this.restoreMusicAfterDucking();
        }

        if (
          this.currentVoiceCleanup === cleanup
        ) {
          this.currentVoiceCleanup = null;
        }
      };

      const handleEnded = () => {
        cleanup();
        resolve(true);
      };

      const handleError = () => {
        cleanup();
        this.warn(
          `Voice prompt "${key}" failed.`
        );
        resolve(false);
      };

      audio.addEventListener(
        "ended",
        handleEnded,
        { once: true }
      );

      audio.addEventListener(
        "error",
        handleError,
        { once: true }
      );

      this.currentVoiceCleanup = cleanup;

      void this.safePlay(
        audio,
        `Voice prompt "${key}"`
      ).then((played) => {
        if (!played) {
          cleanup();
          resolve(false);
        }
      });
    });
  }

  async playMusic(
    key: AudioMusicKey
  ): Promise<boolean> {
    if (
      this.currentMusic &&
      this.currentMusic !== key
    ) {
      this.stopMusic();
    }

    const audio = this.getMusicElement(key);

    if (!audio) {
      return false;
    }

    this.currentMusic = key;
    audio.loop = true;
    audio.volume = this.musicVolume;

    return this.safePlay(
      audio,
      `Music "${key}"`
    );
  }

  pauseMusic(): void {
    if (!this.currentMusic) {
      return;
    }

    this.getMusicElement(
      this.currentMusic
    )?.pause();
  }

  async resumeMusic(): Promise<boolean> {
    if (!this.currentMusic) {
      return false;
    }

    const audio = this.getMusicElement(
      this.currentMusic
    );

    if (!audio) {
      return false;
    }

    return this.safePlay(
      audio,
      `Music "${this.currentMusic}"`
    );
  }

  stopMusic(): void {
    this.cancelFade();

    (
      Object.keys(
        this.musicElements
      ) as AudioMusicKey[]
    ).forEach((key) => {
      const audio = this.musicElements[key];

      if (!audio) {
        return;
      }

      audio.pause();
      audio.currentTime = 0;
      audio.volume = this.musicVolume;
    });

    this.currentMusic = null;
    this.musicVolumeBeforeDucking = null;
  }

  async fadeInMusic(
    key: AudioMusicKey,
    durationMs = MUSIC_FADE_DURATION_MS
  ): Promise<boolean> {
    this.cancelFade();

    if (
      this.currentMusic &&
      this.currentMusic !== key
    ) {
      this.stopMusic();
    }

    const audio = this.getMusicElement(key);

    if (!audio) {
      return false;
    }

    this.currentMusic = key;
    audio.currentTime = 0;
    audio.volume = 0;

    const played = await this.safePlay(
      audio,
      `Music "${key}"`
    );

    if (!played) {
      return false;
    }

    this.animateVolume(
      audio,
      0,
      this.musicVolume,
      durationMs
    );

    return true;
  }

  fadeOutMusic(
    durationMs = MUSIC_FADE_DURATION_MS
  ): Promise<void> {
    if (!this.currentMusic) {
      return Promise.resolve();
    }

    const key = this.currentMusic;
    const audio = this.getMusicElement(key);

    if (!audio) {
      this.currentMusic = null;
      return Promise.resolve();
    }

    this.cancelFade();

    return new Promise((resolve) => {
      this.animateVolume(
        audio,
        audio.volume,
        0,
        durationMs,
        () => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = this.musicVolume;

          if (this.currentMusic === key) {
            this.currentMusic = null;
          }

          resolve();
        }
      );
    });
  }

  setCategoryVolume(
    category: AudioCategory,
    volume: number
  ): void {
    const safeVolume = clampVolume(volume);

    if (category === "effects") {
      this.effectsVolume = safeVolume;

      Object.values(
        this.effectElements
      ).forEach((audio) => {
        if (audio) {
          audio.volume = safeVolume;
        }
      });

      return;
    }

    if (category === "voice") {
      this.voiceVolume = safeVolume;

      Object.values(
        this.voiceElements
      ).forEach((audio) => {
        if (audio) {
          audio.volume = safeVolume;
        }
      });

      return;
    }

    this.musicVolume = safeVolume;

    Object.values(
      this.musicElements
    ).forEach((audio) => {
      if (!audio) {
        return;
      }

      const isCurrentlyDucked =
        this.musicVolumeBeforeDucking !== null;

      audio.volume = isCurrentlyDucked
        ? safeVolume *
          AUDIO_DUCKING_MULTIPLIER
        : safeVolume;
    });
  }

  stopAllAudio(): void {
    this.cancelFade();
    this.stopCurrentVoice();

    Object.values(
      this.effectElements
    ).forEach((audio) => {
      if (!audio) {
        return;
      }

      audio.pause();
      audio.currentTime = 0;
    });

    this.stopMusic();
  }

  getState(): AudioServiceState {
    const currentMusicElement =
      this.currentMusic
        ? this.getMusicElement(
            this.currentMusic
          )
        : null;

    return {
      currentVoice: this.currentVoice,
      currentVoicePriority:
        this.currentVoicePriority,
      currentMusic: this.currentMusic,
      isMusicPaused:
        Boolean(
          currentMusicElement?.paused
        ),
    };
  }

  private stopCurrentVoice(): void {
    if (!this.currentVoice) {
      this.restoreMusicAfterDucking();
      return;
    }

    const audio = this.getVoiceElement(
      this.currentVoice
    );

    audio?.pause();

    if (audio) {
      audio.currentTime = 0;
    }

    this.currentVoiceCleanup?.();
    this.currentVoiceCleanup = null;
    this.currentVoice = null;
    this.currentVoicePriority = null;

    this.restoreMusicAfterDucking();
  }

  private duckMusic(): void {
    if (!this.currentMusic) {
      return;
    }

    const music = this.getMusicElement(
      this.currentMusic
    );

    if (!music) {
      return;
    }

    if (
      this.musicVolumeBeforeDucking === null
    ) {
      this.musicVolumeBeforeDucking =
        music.volume;
    }

    music.volume =
      this.musicVolume *
      AUDIO_DUCKING_MULTIPLIER;
  }

  private restoreMusicAfterDucking(): void {
    if (
      !this.currentMusic ||
      this.musicVolumeBeforeDucking === null
    ) {
      this.musicVolumeBeforeDucking = null;
      return;
    }

    const music = this.getMusicElement(
      this.currentMusic
    );

    if (music) {
      music.volume = this.musicVolume;
    }

    this.musicVolumeBeforeDucking = null;
  }

  private animateVolume(
    audio: HTMLAudioElement,
    from: number,
    to: number,
    durationMs: number,
    onComplete?: () => void
  ): void {
    if (!this.isBrowser()) {
      onComplete?.();
      return;
    }

    const safeDuration = Math.max(
      1,
      durationMs
    );

    const startedAt = performance.now();

    const tick = (timestamp: number) => {
      const elapsed = timestamp - startedAt;

      const progress = Math.min(
        1,
        elapsed / safeDuration
      );

      const nextVolume =
        from + (to - from) * progress;

      audio.volume = clampVolume(nextVolume);

      if (progress >= 1) {
        this.fadeAnimationFrame = null;
        onComplete?.();
        return;
      }

      this.fadeAnimationFrame =
        window.requestAnimationFrame(tick);
    };

    this.fadeAnimationFrame =
      window.requestAnimationFrame(tick);
  }

  private cancelFade(): void {
    if (
      !this.isBrowser() ||
      this.fadeAnimationFrame === null
    ) {
      return;
    }

    window.cancelAnimationFrame(
      this.fadeAnimationFrame
    );

    this.fadeAnimationFrame = null;
  }
}

export const audioService =
  new AudioService();