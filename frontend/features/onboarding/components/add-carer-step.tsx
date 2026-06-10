import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddCarerStepProps = {
  onNext: () => void;
};

export function AddCarerStep({ onNext }: AddCarerStepProps) {
  return (
    <div>
      <h1 className="text-[40px] font-bold text-[#010E0E]">
        Add a Caregiver
      </h1>

      <p className="mt-3 max-w-[420px] text-[16px] leading-[150%] text-[#757575]">
        You can add a family member or caregiver to receive updates about your
        progress.
      </p>

      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Caregiver First name</label>
            <Input
              className="mt-2 h-16 rounded-xl"
              placeholder="Enter caregiver first name"
            />
          </div>

          <div>
            <label className="text-sm">Caregiver Last name</label>
            <Input
              className="mt-2 h-16 rounded-xl"
              placeholder="Enter caregiver last name"
            />
          </div>
        </div>

        <div>
          <label className="text-sm">Email Address</label>
          <Input
            className="mt-2 h-16 rounded-xl"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="text-sm">Relationship</label>
          <Input
            className="mt-2 h-16 rounded-xl"
            placeholder="Enter your relationship"
          />
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-[14px] text-[#757575]">
        <Info size={18} className="fill-[#9E9E9E] text-white" />
        You can do this later.
      </p>

      <Button
        onClick={onNext}
        className="mt-10 h-16 w-full rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8]"
      >
        Add Caregiver
      </Button>

      <button
        onClick={onNext}
        className="mt-6 w-full text-center text-[16px] text-[#1E1E1E]"
      >
        Skip for Now
      </button>
    </div>
  );
}