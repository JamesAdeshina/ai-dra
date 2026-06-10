import Link from "next/link";
import {  ArrowLeft, Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { exerciseDetails } from "@/features/exercises/data/exercise-details";

type ExerciseDemoViewProps = {
  exerciseId: string;
};

export function ExerciseDemoView({ exerciseId }: ExerciseDemoViewProps) {
  const exercise =
    exerciseDetails[exerciseId as keyof typeof exerciseDetails] ??
    exerciseDetails["shoulder-flexion"];

  const sessionHref = `/exercises/${exercise.slug}/start`;

  return (
        <div className="space-y-4">
    <Link
      href={`/exercises/${exercise.slug}`}
      className="inline-flex items-center gap-2 text-[16px] font-medium text-[#7875FB]"
    >
      <ArrowLeft size={18} />
      Back to Exercise
    </Link>


    <div className="grid grid-cols-[2fr_0.95fr] gap-6">
      <Card className="rounded-2xl border-0 bg-white p-6 shadow-none">
        <div>
          <h1 className="text-[28px] font-bold text-[#1E1E1E]">
            {exercise.title}
          </h1>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-[18px] font-bold">{exercise.reps}</span>
            <span className="rounded-full bg-[#7875FB]/15 px-2 py-1 text-[14px] font-semibold text-[#7875FB]">
              {exercise.level}
            </span>
          </div>
        </div>

        <div className="mt-6 flex h-[470px] items-center justify-center rounded-2xl bg-[#F7F4F2]">
          {exercise.demoVideo ? (
            <video
              src={exercise.demoVideo}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full rounded-2xl object-contain"
            />
          ) : (
            <span className="text-[160px]">{exercise.demoFallbackIcon}</span>
          )}
        </div>

      </Card>

      <div className="flex flex-col">
        <Card className="rounded-2xl border-0 bg-white p-6 text-center shadow-none">
          <div className="text-[64px]">{exercise.demoFallbackIcon}</div>

          <h2 className="mt-8 text-[32px] font-medium leading-[145%] text-[#1E1E1E]">
            {exercise.demoText}
          </h2>

          <div className="mt-8 flex items-center rounded-full bg-[#ECE8FF] p-2">
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

        <Link href={sessionHref} className="mt-4">
          <Button
            variant="outline"
            className="h-16 w-full rounded-full text-[18px]"
          >
            <Play className="mr-2 h-5 w-5" />
            Skip Demo
          </Button>
        </Link>

        <div className="mt-4">
          <Link href={sessionHref}>
            <Button className="h-20 w-full rounded-full bg-[#592EBD] text-[22px] hover:bg-[#4B24A8]">
              Start Exercise
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}