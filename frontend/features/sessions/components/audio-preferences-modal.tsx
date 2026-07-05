"use client";

import {
  AudioLines,
  Music2,
  Volume2,
} from "lucide-react";

import {
  audioService,
  type AudioPreferences,
} from "@/features/audio";

type AudioPreferencesModalProps = {
  isOpen: boolean;
  preferences: AudioPreferences;
  onPreferenceChange: <
    Key extends keyof AudioPreferences,
  >(
    key: Key,
    value: AudioPreferences[Key]
  ) => void;
  onContinue: () => void;
  onContinueWithoutAudio: () => void;
};

type AudioOptionProps = {
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  onChange: (enabled: boolean) => void;
};

function AudioOption({
  title,
  description,
  enabled,
  icon,
  onChange,
}: AudioOptionProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E9E3F8] text-[#592EBD]">
          {icon}
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`${title}: ${
          enabled ? "enabled" : "disabled"
        }`}
        onClick={() => onChange(!enabled)}
        className={[
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/25",
          enabled
            ? "bg-[#592EBD]"
            : "bg-slate-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            enabled
              ? "translate-x-6"
              : "translate-x-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export function AudioPreferencesModal({
  isOpen,
  preferences,
  onPreferenceChange,
  onContinue,
  onContinueWithoutAudio,
}: AudioPreferencesModalProps) {
  if (!isOpen) {
    return null;
  }

  const handleContinue = async () => {
    await audioService.unlockAudio();
    audioService.preloadAudio();

    onContinue();
  };

  const handleContinueWithoutAudio =
    async () => {
      await audioService.unlockAudio();

      onContinueWithoutAudio();
    };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="audio-preferences-title"
        aria-describedby="audio-preferences-description"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#F8F7FB] p-6 shadow-2xl sm:p-8"
      >
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9E3F8] text-[#592EBD]">
            <Volume2
              aria-hidden="true"
              className="h-7 w-7"
            />
          </div>

          <h2
            id="audio-preferences-title"
            className="mt-5 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
          >
            Choose Your Audio Preferences
          </h2>

          <p
            id="audio-preferences-description"
            className="mt-3 text-sm leading-6 text-slate-600 sm:text-base"
          >
            AI-DRA can use voice guidance,
            sound effects and optional
            background music to support you
            during your exercise session. You
            can change these settings at any
            time.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          <AudioOption
            title="Voice Instructions"
            description="Hear spoken guidance at important points during your session."
            enabled={
              preferences.voicePromptsEnabled
            }
            icon={
              <AudioLines
                aria-hidden="true"
                className="h-5 w-5"
              />
            }
            onChange={(enabled) =>
              onPreferenceChange(
                "voicePromptsEnabled",
                enabled
              )
            }
          />

          <AudioOption
            title="Sound Effects"
            description="Hear countdown, repetition, hold and session completion sounds."
            enabled={
              preferences.soundEffectsEnabled
            }
            icon={
              <Volume2
                aria-hidden="true"
                className="h-5 w-5"
              />
            }
            onChange={(enabled) =>
              onPreferenceChange(
                "soundEffectsEnabled",
                enabled
              )
            }
          />

          <AudioOption
            title="Background Music"
            description="Play quiet background music during rehabilitation sessions."
            enabled={
              preferences.backgroundMusicEnabled
            }
            icon={
              <Music2
                aria-hidden="true"
                className="h-5 w-5"
              />
            }
            onChange={(enabled) =>
              onPreferenceChange(
                "backgroundMusicEnabled",
                enabled
              )
            }
          />
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              void handleContinueWithoutAudio();
            }}
            className="min-h-12 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/25"
          >
            Continue Without Audio
          </button>

          <button
            type="button"
            onClick={() => {
              void handleContinue();
            }}
            className="min-h-12 rounded-xl bg-[#592EBD] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4B24A8] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/30"
          >
            Continue
          </button>
        </div>
      </section>
    </div>
  );
}