import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Volume2 } from "lucide-react";

export function AccessibilitySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[40px] font-bold text-[#1E1E1E]">
          Accessibility
        </h1>

        <p className="mt-1 text-[20px] text-[#424242]">
          Customize the app to match your rehabilitation and accessibility
          needs.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-white p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border">
          <AlertTriangle size={20} />
        </div>

        <p className="text-[#757575]">
          Accessibility settings are applied automatically across the app.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-8">
        <h2 className="text-[28px] font-semibold">Text & Display</h2>

        <div className="mt-8 space-y-8">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span>Text Size</span>

              <div className="flex items-center gap-6">
                <span>A</span>

                <div className="w-[220px]">
                  <Slider defaultValue={[60]} />
                </div>

                <span className="text-[28px]">A</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <div>
              <h3 className="font-medium">High Contrast</h3>
              <p className="text-sm text-[#757575]">
                Improve visibility using stronger colour contrast.
              </p>
            </div>

            <Switch />
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <div>
              <h3 className="font-medium">Reduce Text Animations</h3>
              <p className="text-sm text-[#757575]">
                Minimize screen movement and visual distractions.
              </p>
            </div>

            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-8">
        <h2 className="text-[28px] font-semibold">Audio & Voice</h2>

        <div className="mt-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Voice Guidance</h3>
              <p className="text-sm text-[#757575]">
                Receive spoken instructions and exercise feedback.
              </p>
            </div>

            <Switch />
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <div>
              <h3 className="font-medium">Sound Effects</h3>
              <p className="text-sm text-[#757575]">
                Play sounds for prompts, reminders, and progress updates.
              </p>
            </div>

            <Switch />
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center gap-4">
              <Volume2 size={18} />

              <div className="flex-1">
                <Slider defaultValue={[65]} />
              </div>

              <span className="font-medium">65%</span>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <span>Slow</span>

              <div className="w-[260px]">
                <Slider defaultValue={[50]} />
              </div>

              <span className="font-medium">Normal</span>

              <span>Fast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}