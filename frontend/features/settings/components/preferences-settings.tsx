"use client";

import { useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Download,
  X,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const unavailableMessage =
  "This feature is not available in the current AI-DRA prototype.";

export function PreferencesSettings() {
  const [notice, setNotice] = useState<string | null>(
    null
  );

  const showUnavailableNotice = () => {
    setNotice(unavailableMessage);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[#1E1E1E] sm:text-[40px]">
          Preferences
        </h1>

        <p className="mt-1 text-[17px] text-[#424242] sm:text-[20px]">
          Customize your rehabilitation experience and session settings.
        </p>
      </div>

      {notice ? (
        <div
          role="alert"
          className="flex items-start justify-between gap-4 rounded-2xl border border-[#592EBD]/20 bg-[#F4F0FF] p-4 text-[#1E1E1E]"
        >
          <div className="flex gap-3">
            <AlertCircle
              size={22}
              className="mt-0.5 shrink-0 text-[#592EBD]"
            />

            <div>
              <p className="font-semibold">
                Not available yet
              </p>

              <p className="mt-1 text-sm leading-[150%] text-[#424242]">
                {notice}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Close notice"
            className="rounded-full p-1 text-[#424242] transition hover:bg-white"
          >
            <X size={18} />
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-8">
            <h2 className="mb-6 text-[28px] font-semibold">Sessions</h2>

            <div className="space-y-5">
              {[
                "Default Session Duration",
                "Rest Time Between Sets",
                "Default Reps",
                "Session Timeout",
              ].map((item) => (
                <div key={item}>
                  <label className="mb-2 block text-sm text-[#757575]">
                    {item}
                  </label>

                  <button
                    type="button"
                    onClick={showUnavailableNotice}
                    className="flex h-16 w-full items-center justify-between rounded-xl border px-5 text-left transition hover:bg-neutral-50"
                  >
                    <span>20 minutes</span>
                    <ChevronDown size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8">
            <h2 className="mb-6 text-[28px] font-semibold">
              Rehabilitation Goals
            </h2>

            <div className="space-y-5">
              {[
                "Weekly Goal",
                "Exercise Difficulty",
                "Daily Exercise Target",
              ].map((item) => (
                <div key={item}>
                  <label className="mb-2 block text-sm text-[#757575]">
                    {item}
                  </label>

                  <button
                    type="button"
                    onClick={showUnavailableNotice}
                    className="flex h-16 w-full items-center justify-between rounded-xl border px-5 text-left transition hover:bg-neutral-50"
                  >
                    <span>Beginner</span>
                    <ChevronDown size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white">
            <div className="border-b p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium">Show Exercise Tips</h3>
                  <p className="text-sm text-[#757575]">
                    Display helpful guidance during exercises.
                  </p>
                </div>

                <Switch
                  defaultChecked
                  onCheckedChange={showUnavailableNotice}
                />
              </div>
            </div>

            <div className="border-b p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium">Voice Encouragement</h3>
                  <p className="text-sm text-[#757575]">
                    Receive motivational prompts during sessions.
                  </p>
                </div>

                <Switch
                  defaultChecked
                  onCheckedChange={showUnavailableNotice}
                />
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium">Daily Check-In</h3>
                  <p className="text-sm text-[#757575]">
                    Receive wellbeing prompts.
                  </p>
                </div>

                <Switch
                  defaultChecked
                  onCheckedChange={showUnavailableNotice}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white">
            <div className="border-b p-6">
              <h2 className="mb-6 text-[28px] font-semibold">
                Data & Privacy
              </h2>

              <div className="space-y-6">
                {[
                  "Save Exercise Data",
                  "Clear Local Data",
                  "Share Data with Therapist",
                  "Share Data with Caregiver",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-medium">{item}</h3>
                    </div>

                    <Switch
                      defaultChecked
                      onCheckedChange={showUnavailableNotice}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <button
                type="button"
                onClick={showUnavailableNotice}
                className="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition hover:bg-neutral-50"
              >
                <Download size={18} />
                <span>Export Rehabilitation Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}