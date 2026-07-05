"use client";

import {
  useCallback,
  useEffect,
} from "react";

import { audioService } from "./audio-service";

import type {
  AudioMusicKey,
} from "./audio-types";

type UseBackgroundMusicOptions = {
  enabled: boolean;
  musicKey: AudioMusicKey;
  stopOnUnmount?: boolean;
};

type UseBackgroundMusicResult = {
  play: () => Promise<boolean>;
  fadeIn: () => Promise<boolean>;
  pause: () => void;
  resume: () => Promise<boolean>;
  stop: () => void;
  fadeOut: () => Promise<void>;
};

export function useBackgroundMusic({
  enabled,
  musicKey,
  stopOnUnmount = true,
}: UseBackgroundMusicOptions): UseBackgroundMusicResult {
  const play = useCallback(async () => {
    if (!enabled) {
      return false;
    }

    return audioService.playMusic(
      musicKey
    );
  }, [enabled, musicKey]);

  const fadeIn = useCallback(async () => {
    if (!enabled) {
      return false;
    }

    return audioService.fadeInMusic(
      musicKey
    );
  }, [enabled, musicKey]);

  const pause = useCallback(() => {
    audioService.pauseMusic();
  }, []);

  const resume = useCallback(async () => {
    if (!enabled) {
      return false;
    }

    return audioService.resumeMusic();
  }, [enabled]);

  const stop = useCallback(() => {
    audioService.stopMusic();
  }, []);

  const fadeOut = useCallback(async () => {
    await audioService.fadeOutMusic();
  }, []);

  useEffect(() => {
    if (enabled) {
      return;
    }

    audioService.stopMusic();
  }, [enabled]);

  useEffect(() => {
    return () => {
      if (stopOnUnmount) {
        audioService.stopMusic();
      }
    };
  }, [stopOnUnmount]);

  return {
    play,
    fadeIn,
    pause,
    resume,
    stop,
    fadeOut,
  };
}