import { CameraPlaceholder } from "./camera-placeholder";
import { LiveFeedbackCard } from "./live-feedback-card";
import { RangeOfMotionCard } from "./range-of-motion-card";
import { RepProgressCard } from "./rep-progress-card";
import { SessionControls } from "./session-controls";

export function SessionView() {
  return (
    <div className="grid grid-cols-[2fr_1fr] gap-6">
      <div className="space-y-5">
        <div className="rounded-2xl bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-[32px] font-bold text-[#1E1E1E]">
                Shoulder Flexion
              </h1>
              <p className="mt-1 text-[20px] text-[#8A8A8A]">
                Lift your arm forward and up.
              </p>
            </div>

            <div className="rounded-full bg-[#42B267] px-6 py-4 text-[18px] font-semibold text-white">
              Good Form 👍
            </div>
          </div>

          <CameraPlaceholder />

          <div className="mt-5">
            <SessionControls />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <LiveFeedbackCard />
        <RepProgressCard />
        <RangeOfMotionCard />

        <div className="rounded-2xl bg-[#ECE8FF] p-6">
          <h2 className="text-[22px] font-bold text-[#1E1E1E]">
            Session Tips
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] text-[#333333]">
            <li>Keep shoulders relaxed</li>
            <li>Move slowly and steadily</li>
            <li>Take breaks when needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}