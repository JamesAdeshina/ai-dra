import { CameraPlaceholder } from "./camera-placeholder";
import { LiveFeedbackCard } from "./live-feedback-card";
import { RangeOfMotionCard } from "./range-of-motion-card";
import { RepProgressCard } from "./rep-progress-card";
import { SessionControls } from "./session-controls";
import { SessionCompleteModal } from "./session-complete-modal"; // <-- import it
import { SupportModal } from "./support-modal";

export function SessionView() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_446px] gap-[26px]">
      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="flex items-center justify-between px-[30px] py-4">
          <div className="flex items-center gap-[13px]">
            <div className="flex h-[91px] w-[91px] items-center justify-center rounded-xl bg-[#F7F4F2] text-5xl">
              🧍
            </div>

            <div>
              <h1 className="text-[28px] font-semibold leading-[150%] text-[#1E1E1E]">
                Shoulder Flexion
              </h1>
              <p className="text-[20px] leading-[150%] text-[#888888]">
                Lift your arm forward and up.
              </p>
            </div>
          </div>

          <div className="rounded-[30px] bg-black/10 p-2 backdrop-blur-md">
            <div className="rounded-[24px] bg-[#40C057] px-6 py-4 text-[18px] font-semibold text-white">
              Good Form 👍
            </div>
          </div>
        </div>

        <CameraPlaceholder />

        <div className="px-[30px] py-6">
          <SessionControls />
        </div>

        {/* TEMPORARY: show the modal for preview */}
        <SessionCompleteModal />
        <SupportModal />
      </div>

      <div className="space-y-[26px]">
        <LiveFeedbackCard />
        <RepProgressCard />
        <RangeOfMotionCard />
      </div>
    </div>
  );
}