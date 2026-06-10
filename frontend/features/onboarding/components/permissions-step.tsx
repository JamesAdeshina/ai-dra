import { Camera, Check, LockKeyhole, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

type PermissionsStepProps = {
  onNext: () => void;
};

export function PermissionsStep({ onNext }: PermissionsStepProps) {
  return (
    <div className="text-center">
      <h1 className="text-[28px] font-bold text-[#010E0E]">
        Camera Permission
      </h1>

      <p className="mx-auto mt-3 max-w-[430px] text-[16px] leading-[150%] text-[#757575]">
        AI-DRA uses your device camera to monitor rehabilitation exercises and
        provide feedback.
      </p>

      <div className="mx-auto mt-10 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#F5F5F5]">
        <div className="relative">
          <Camera className="h-12 w-12 text-[#757575]" />
          <div className="absolute -bottom-4 -right-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#2F80ED] text-white">
            <Check size={22} />
          </div>
        </div>
      </div>

      <p className="mt-8 text-[17px] text-[#757575]">
        No videos are shared without your permission.
      </p>

      <div className="mt-8 flex items-center gap-4 rounded-xl bg-[#F1ECFF] p-5 text-left">
        <Shield className="h-10 w-10 fill-[#2F80ED] text-white" />

        <div>
          <p className="font-semibold text-[#1E1E1E]">
            Your privacy is our priority
          </p>
          <p className="text-[15px] text-[#424242]">
            Your video is processed securely on your device. We do not record,
            store, or share your videos.
          </p>
        </div>
      </div>

      <Button
        onClick={onNext}
        className="mt-8 h-16 w-full rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8]"
      >
        Allow Camera Access
      </Button>

      <Button
        onClick={onNext}
        variant="outline"
        className="mt-3 h-14 w-full rounded-full"
      >
        Not Now
      </Button>

      <p className="mt-5 flex items-center justify-center gap-2 text-[15px] text-[#757575]">
        <LockKeyhole size={18} />
        You can change this later in Settings
      </p>
    </div>
  );
}