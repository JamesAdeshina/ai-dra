import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type WelcomeStepProps = {
  onNext: () => void;
};

const benefits = [
  {
    title: "Guided exercises",
    image: "/images/guided_exercises.png",
  },
  {
    title: "Live Feedback",
    image: "/images/live_feedback.png",
  },
  {
    title: "Progress tracking",
    image: "/images/progress_tracking.png",
  },
  {
    title: "Friendly reminders",
    image: "/images/friendly_reminders.png",
  },
];

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div>
      <h1 className="text-center text-[28px] font-bold text-[#010E0E]">
        Welcome to AI-DRA
      </h1>

      <p className="mx-auto mt-1 max-w-[420px] text-center text-[16px] leading-[150%] text-[#757575]">
        Supporting your rehabilitation journey with guided exercises, instant
        feedback, and progress tracking.
      </p>

      <h2 className="mt-5 text-center text-[18px] font-semibold">
        How AI-DRA Helps You
      </h2>

      <div className="mx-auto mt-4 grid max-w-[380px] grid-cols-2 gap-4">
        {benefits.map((benefit) => (
          <div key={benefit.title}>
            <div className="flex h-[112px] items-center justify-center rounded-xl bg-[#F5F5F5]">
              <Image
                src={benefit.image}
                alt={benefit.title}
                width={220}
                height={120}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 fill-[#42B267] text-white" />
              <span className="text-[16px] text-[#757575]">
                {benefit.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={onNext}
        className="mt-8 h-16 w-full rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8]"
      >
        Get Started
      </Button>
    </div>
  );
}