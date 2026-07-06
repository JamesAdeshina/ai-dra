"use client";

import {
  useEffect,
  useState,
  useTransition,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Volume2,
} from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import {
  getOrCreateAccessibilityPreferences,
  updateAccessibilityPreferences,
} from "@/features/settings/accessibility/services/accessibility-service";

import type {
  AccessibilityColorTheme,
  AccessibilityPreferences,
  UpdateAccessibilityPreferencesInput,
} from "@/features/settings/accessibility/types/accessibility";

const FALLBACK_PREFERENCES: AccessibilityPreferences = {
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

const THEME_OPTIONS: {
  value: AccessibilityColorTheme;
  label: string;
}[] = [
  {
    value: "LIGHT",
    label: "Light",
  },
  {
    value: "DARK",
    label: "Dark",
  },
  {
    value: "SYSTEM",
    label: "System",
  },
];

export function AccessibilitySettings() {
  const [preferences, setPreferences] =
    useState<AccessibilityPreferences>(
      FALLBACK_PREFERENCES
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [savedMessage, setSavedMessage] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [isPending, startTransition] =
    useTransition();

  useEffect(() => {
    let active = true;

    void getOrCreateAccessibilityPreferences()
      .then((loadedPreferences) => {
        if (!active) {
          return;
        }

        setPreferences(
          loadedPreferences
        );
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setErrorMessage(
          getErrorMessage(error)
        );
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    applyAccessibilityPreferences(
      preferences
    );
  }, [preferences]);

  useEffect(() => {
    if (
      preferences.colorTheme !==
      "SYSTEM"
    ) {
      return;
    }

    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handleChange = () => {
      applyColorTheme(
        "SYSTEM"
      );
    };

    mediaQuery.addEventListener(
      "change",
      handleChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };
  }, [preferences.colorTheme]);

  const savePreference = (
    input: UpdateAccessibilityPreferencesInput
  ) => {
    setErrorMessage(null);
    setSavedMessage(null);

    const previous = preferences;

    setPreferences((current) => ({
      ...current,
      ...input,
    }));

    startTransition(() => {
      void updateAccessibilityPreferences(
        input
      )
        .then((updated) => {
          setPreferences(updated);
          setSavedMessage(
            "Accessibility settings saved."
          );

          window.setTimeout(() => {
            setSavedMessage(null);
          }, 2500);
        })
        .catch((error: unknown) => {
          setPreferences(previous);
          setErrorMessage(
            getErrorMessage(error)
          );
        });
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl bg-white">
        <div className="flex items-center gap-3 text-[#592EBD]">
          <Loader2 className="h-5 w-5 animate-spin" />

          <span className="text-[15px] font-medium">
            Loading accessibility settings...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[40px] font-bold text-[#1E1E1E]">
          Accessibility
        </h1>

        <p className="mt-1 text-[20px] text-[#424242]">
          Customize the app to match your rehabilitation and accessibility needs.
        </p>
      </div>

      {savedMessage ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
          <CheckCircle2 size={20} />

          <p className="text-[14px] font-medium">
            {savedMessage}
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          <AlertTriangle size={20} />

          <p className="text-[14px] font-medium">
            {errorMessage}
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-2xl bg-white p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border">
              <AlertTriangle size={20} />
            </div>

            <p className="text-[#757575]">
              Accessibility settings are applied automatically across the app where supported.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 sm:p-8">
            <h2 className="text-[28px] font-semibold">
              Text & Display
            </h2>

            <div className="mt-8 space-y-8">
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">
                      Text Size
                    </h3>

                    <p className="mt-1 text-sm text-[#757575]">
                      Increase or reduce text across supported parts of the app.
                    </p>
                  </div>

                  <span className="rounded-full bg-[#F2EEFC] px-3 py-1.5 text-[13px] font-semibold text-[#592EBD]">
                    {preferences.textScale}%
                  </span>
                </div>

                <div className="flex items-center gap-5">
                  <span className="text-[15px]">
                    A
                  </span>

                  <div className="flex-1">
                    <Slider
                      value={[
                        preferences.textScale,
                      ]}
                      min={85}
                      max={140}
                      step={5}
                      disabled={isPending}
                      onValueChange={([
                        value,
                      ]) =>
                        setPreferences(
                          (current) => ({
                            ...current,
                            textScale: value,
                          })
                        )
                      }
                      onValueCommit={([
                        value,
                      ]) =>
                        savePreference({
                          textScale: value,
                        })
                      }
                    />
                  </div>

                  <span className="text-[30px]">
                    A
                  </span>
                </div>
              </div>

              <SettingRow
                title="High Contrast"
                description="Improve visibility using stronger colour contrast."
                checked={
                  preferences.highContrast
                }
                disabled={isPending}
                onChange={(checked) =>
                  savePreference({
                    highContrast: checked,
                  })
                }
              />

              <SettingRow
                title="Reduce Text Animations"
                description="Minimize screen movement and visual distractions."
                checked={
                  preferences.reduceMotion
                }
                disabled={isPending}
                onChange={(checked) =>
                  savePreference({
                    reduceMotion: checked,
                  })
                }
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 sm:p-8">
            <h2 className="text-[28px] font-semibold">
              Audio & Voice
            </h2>

            <div className="mt-8 space-y-8">
              <SettingRow
                title="Voice Guidance"
                description="Receive spoken instructions and exercise feedback."
                checked={
                  preferences.voiceGuidanceEnabled
                }
                disabled={isPending}
                onChange={(checked) =>
                  savePreference({
                    voiceGuidanceEnabled:
                      checked,
                  })
                }
                noBorder
              />

              <SettingRow
                title="Sound Effects"
                description="Play sounds for prompts, reminders, and progress updates."
                checked={
                  preferences.soundEffectsEnabled
                }
                disabled={isPending}
                onChange={(checked) =>
                  savePreference({
                    soundEffectsEnabled:
                      checked,
                  })
                }
              />

              <div className="border-t pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      Audio Volume
                    </h3>

                    <p className="mt-1 text-sm text-[#757575]">
                      Controls voice guidance and sound effects volume.
                    </p>
                  </div>

                  <span className="font-medium">
                    {preferences.audioVolume}%
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Volume2 size={18} />

                  <div className="flex-1">
                    <Slider
                      value={[
                        preferences.audioVolume,
                      ]}
                      min={0}
                      max={100}
                      step={5}
                      disabled={isPending}
                      onValueChange={([
                        value,
                      ]) =>
                        setPreferences(
                          (current) => ({
                            ...current,
                            audioVolume: value,
                          })
                        )
                      }
                      onValueCommit={([
                        value,
                      ]) =>
                        savePreference({
                          audioVolume: value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">
                      Voice Speed
                    </h3>

                    <p className="mt-1 text-sm text-[#757575]">
                      Adjust the speed of spoken guidance.
                    </p>
                  </div>

                  <span className="rounded-full bg-[#F2EEFC] px-3 py-1.5 text-[13px] font-semibold text-[#592EBD]">
                    {formatSpeechRate(
                      preferences.speechRate
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[13px] text-[#777777]">
                    Slow
                  </span>

                  <div className="flex-1">
                    <Slider
                      value={[
                        preferences.speechRate,
                      ]}
                      min={75}
                      max={150}
                      step={5}
                      disabled={isPending}
                      onValueChange={([
                        value,
                      ]) =>
                        setPreferences(
                          (current) => ({
                            ...current,
                            speechRate: value,
                          })
                        )
                      }
                      onValueCommit={([
                        value,
                      ]) =>
                        savePreference({
                          speechRate: value,
                        })
                      }
                    />
                  </div>

                  <span className="text-[13px] text-[#777777]">
                    Fast
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6">
          <h2 className="text-[22px] font-semibold">
            Interaction
          </h2>

          <div className="mt-6 space-y-6">
            <SettingRow
              title="Larger Buttons"
              description="Make buttons easier to tap and select."
              checked={
                preferences.largerButtons
              }
              disabled={isPending}
              onChange={(checked) =>
                savePreference({
                  largerButtons: checked,
                })
              }
              noBorder
            />

            <SettingRow
              title="Step-by-Step Guidance"
              description="Break exercises into smaller guided steps."
              checked={
                preferences.stepByStepGuidance
              }
              disabled={isPending}
              onChange={(checked) =>
                savePreference({
                  stepByStepGuidance:
                    checked,
                })
              }
            />

            <div className="border-t pt-6">
              <h3 className="font-medium">
                Color Theme
              </h3>

              <p className="mt-1 text-sm text-[#757575]">
                Choose a light, dark, or system-matched theme.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {THEME_OPTIONS.map(
                  (option) => {
                    const selected =
                      preferences.colorTheme ===
                      option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          savePreference({
                            colorTheme:
                              option.value,
                          })
                        }
                        className={[
                          "h-11 rounded-xl text-[14px] font-medium transition",
                          selected
                            ? "bg-[#592EBD] text-white"
                            : "bg-[#F5F5F5] text-[#424242] hover:bg-[#ECECEC]",
                        ].join(" ")}
                      >
                        {option.label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  description,
  checked,
  disabled,
  onChange,
  noBorder = false,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
  noBorder?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-5",
        noBorder
          ? ""
          : "border-t pt-6",
      ].join(" ")}
    >
      <div>
        <h3 className="font-medium">
          {title}
        </h3>

        <p className="mt-1 text-sm text-[#757575]">
          {description}
        </p>
      </div>

      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
      />
    </div>
  );
}

function applyAccessibilityPreferences(
  preferences: AccessibilityPreferences
): void {
  document.documentElement.style.setProperty(
    "--ai-dra-text-scale",
    String(preferences.textScale / 100)
  );

  document.documentElement.dataset.highContrast =
    preferences.highContrast
      ? "true"
      : "false";

  document.documentElement.dataset.reduceMotion =
    preferences.reduceMotion
      ? "true"
      : "false";

  document.documentElement.dataset.largeButtons =
    preferences.largerButtons
      ? "true"
      : "false";

  document.documentElement.dataset.stepGuidance =
    preferences.stepByStepGuidance
      ? "true"
      : "false";

  applyColorTheme(
    preferences.colorTheme
  );
}

function applyColorTheme(
  theme: AccessibilityColorTheme
): void {
  const shouldUseDark =
    theme === "DARK" ||
    (theme === "SYSTEM" &&
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches);

  document.documentElement.classList.toggle(
    "dark",
    shouldUseDark
  );

  document.documentElement.dataset.colorTheme =
    theme.toLowerCase();
}

function formatSpeechRate(
  value: number
): string {
  if (value < 90) {
    return "Slow";
  }

  if (value <= 110) {
    return "Normal";
  }

  if (value <= 130) {
    return "Fast";
  }

  return "Very Fast";
}

function getErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Accessibility settings could not be loaded.";
}
