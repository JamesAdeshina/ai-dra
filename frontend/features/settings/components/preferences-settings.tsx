import { ChevronDown, Download } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function PreferencesSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[40px] font-bold text-[#1E1E1E]">
          Preferences
        </h1>

        <p className="mt-1 text-[20px] text-[#424242]">
          Customize your rehabilitation experience and session settings.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-6">
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

                  <button className="flex h-16 w-full items-center justify-between rounded-xl border px-5">
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

                  <button className="flex h-16 w-full items-center justify-between rounded-xl border px-5">
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Show Exercise Tips</h3>
                  <p className="text-sm text-[#757575]">
                    Display helpful guidance during exercises.
                  </p>
                </div>

                <Switch defaultChecked />
              </div>
            </div>

            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Voice Encouragement</h3>
                  <p className="text-sm text-[#757575]">
                    Receive motivational prompts during sessions.
                  </p>
                </div>

                <Switch defaultChecked />
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Daily Check-In</h3>
                  <p className="text-sm text-[#757575]">
                    Receive wellbeing prompts.
                  </p>
                </div>

                <Switch defaultChecked />
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
                    className="flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{item}</h3>
                    </div>

                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <button className="flex w-full items-center gap-3 rounded-xl border p-4 text-left">
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