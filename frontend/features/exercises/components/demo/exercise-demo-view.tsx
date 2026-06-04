import Link from "next/link";
import { Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ExerciseDemoViewProps = {
  exerciseId: string;
};

export function ExerciseDemoView({ exerciseId }: ExerciseDemoViewProps) {
  return (
    <div className="grid grid-cols-[2fr_1fr] gap-6">
      <Card className="rounded-2xl border-0 bg-white p-6 shadow-none">
        <div>
          <h1 className="text-[28px] font-bold text-[#1E1E1E]">
            Shoulder Flexion
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[18px] font-bold">10 reps</span>
            <span className="rounded-full bg-[#7875FB]/15 px-2 py-1 text-[14px] font-semibold text-[#7875FB]">
              Level 2
            </span>
          </div>
        </div>

        <div className="mt-10 flex h-[610px] items-center justify-center rounded-2xl bg-[#F7F4F2] text-[220px]">
          🧍
        </div>

        <div className="mx-auto mt-10 flex max-w-[650px] items-center gap-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="flex flex-1 items-center">
              <div
                className={`h-[6px] flex-1 ${
                  index < 4 ? "bg-[#592EBD]" : "bg-[#C8E3F8]"
                }`}
              />
              <div
                className={`h-6 w-6 rounded-full ${
                  index < 4 ? "bg-[#592EBD]" : "bg-[#BDBDBD]"
                }`}
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-col">
        <Card className="rounded-2xl border-0 bg-white p-8 text-center shadow-none">
          <div className="text-[90px]">☕</div>

          <h2 className="mt-10 text-[42px] font-medium leading-[150%] text-[#1E1E1E]">
            This movement supports reaching for household items and everyday
            activities.
          </h2>

          <div className="mt-10 flex items-center rounded-full bg-[#ECE8FF] p-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7875FB] text-white">
              <Volume2 size={24} />
            </div>

            <span className="ml-4 flex-1 text-left text-[18px] font-semibold">
              Play Instruction
            </span>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
              <Play size={22} />
            </div>
          </div>
        </Card>

        <Link href={`/session?exercise=${exerciseId}`} className="mt-4">
          <Button
            variant="outline"
            className="h-20 w-full rounded-full text-[20px]"
          >
            <Play className="mr-2 h-5 w-5" />
            Skip Demo
          </Button>
        </Link>

        <div className="mt-auto">
          <Link href={`/session?exercise=${exerciseId}`}>
            <Button className="h-24 w-full rounded-full bg-[#592EBD] text-[24px] hover:bg-[#4B24A8]">
              Start Exercise
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}