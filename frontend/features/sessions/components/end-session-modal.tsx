import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type EndSessionModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function EndSessionModal({ onCancel, onConfirm }: EndSessionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
      <div className="w-[420px] rounded-[24px] bg-white p-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF1F1] text-[#ED3A3A]">
          <AlertTriangle size={38} />
        </div>

        <h2 className="mt-6 text-[22px] font-semibold text-[#1E1E1E]">
          End Session?
        </h2>

        <p className="mt-2 text-[16px] leading-[150%] text-[#757575]">
          Are you sure you want to end this rehabilitation session? Your current
          progress will be saved once the session ends.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="h-14 rounded-full text-[16px]"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            className="h-14 rounded-full bg-[#ED3A3A] text-[16px] text-white hover:bg-[#D92F2F]"
          >
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
}