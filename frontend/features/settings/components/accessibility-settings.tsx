"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Volume2,
} from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import {
  updateAccessibilityPreferences,
} from "@/features/settings/accessibility/services/accessibility-service";

import {
  useAccessibility,
} from "@/features/settings/accessibility/components/accessibility-provider";

import type {
  AccessibilityColorTheme,
  UpdateAccessibilityPreferencesInput,
} from "@/features/settings/accessibility/types/accessibility";

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
  const {
    preferences,
    isReady,
    setPreferences,
  } = useAccessibility();

  const [savedMessage, setSavedMessage] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [isPending, startTransition] =
    useTransition();

  const savePreference = (
    input: UpdateAccessibilityPreferencesInput
  ) => {
    setErrorMessage(null);
    setSavedMessage(null);

    const previousPreferences =
      preferences;

    const optimisticPreferences = {
      ...preferences,
      ...input,
    };

    setPreferences(
      optimisticPreferences
    );

    startTransition(() => {
      void updateAccessibilityPreferences(
        input
      )
        .then((updatedPreferences) => {
          setPreferences(
            updatedPreferences
          );

          setSavedMessage(
            "Accessibility settings saved."
          );

          window.setTimeout(() => {
            setSavedMessage(null);
          }, 2200);
        })
        .catch((error: unknown) => {
          setPreferences(
            previousPreferences
          );

          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Accessibility settings could not be saved."
          );
        });
    });
  };

  if (!isReady) {
    return (
      <div className="rounded-2xl bg-white p-8">
        <p className="text-[15px] font-medium text-[#592EBD]">
          Loading accessibility settings...
        </p>
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
              Accessibility settings are applied automatically across the app.
            </p>
          </div>

          <section className="rounded-2xl bg-white p-6 sm:p-8">
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
                      Increase or reduce text across the app.
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
                      setPreferences({
                        ...preferences,
                        textScale: value,
                      })
                    }
                    onValueCommit={([
                      value,
                    ]) =>
                      savePreference({
                        textScale: value,
                      })
                    }
                    className="flex-1"
                  />

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
                title="Reduce Motion"
                description="Minimize animations and visual movement."
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
          </section>

          <section className="rounded-2xl bg-white p-6 sm:p-8">
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
                description="Play sounds for prompts and progress updates."
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
                <div className="mb-3 flex items-center justify-between gap-4">
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
                      setPreferences({
                        ...preferences,
                        audioVolume: value,
                      })
                    }
                    onValueCommit={([
                      value,
                    ]) =>
                      savePreference({
                        audioVolume: value,
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">
                      Voice Speed
                    </h3>

                    <p className="mt-1 text-sm text-[#757575]">
                      Adjust spoken guidance speed.
                    </p>
                  </div>

                  <span className="rounded-full bg-[#F2EEFC] px-3 py-1.5 text-[13px] font-semibold text-[#592EBD]">
                    {preferences.speechRate}%
                  </span>
                </div>

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
                    setPreferences({
                      ...preferences,
                      speechRate: value,
                    })
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
            </div>
          </section>
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

              <div className="mt-4 grid grid-cols-3 gap-2">
                {THEME_OPTIONS.map(
                  (option) => {
                    const isSelected =
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
                          isSelected
                            ? "bg-[#592EBD] text-white"
                            : "bg-[#F5F5F5] text-[#424242]",
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
  onChange: (
    checked: boolean
  ) => void;
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
