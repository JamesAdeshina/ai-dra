"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { exerciseDetails } from "@/features/exercises/data/exercise-details";

type ExerciseDemoViewProps = {
  exerciseId: string;
};

export function ExerciseDemoView({ exerciseId }: ExerciseDemoViewProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const exercise =
    exerciseDetails[exerciseId as keyof typeof exerciseDetails] ??
    exerciseDetails["target-touch"];

  const sessionHref = `/exercises/${exercise.slug}/start`;

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (nextMuted && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handlePlayInstruction = () => {
    if (!("speechSynthesis" in window)) return;

    if (isMuted) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(exercise.instruction);

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    setIsSpeaking(true);
  };

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

          <div className="mt-6 flex h-[470px] items-center justify-center overflow-hidden rounded-2xl bg-[#F7F4F2]">
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
              <Image
                src={exercise.images.states.active}
                alt={`${exercise.title} demo`}
                width={720}
                height={720}
                quality={100}
                className="h-full w-full object-contain"
              />
            )}
          </div>
        </Card>

        <div className="flex flex-col">
          <Card className="rounded-2xl border-0 bg-white p-6 text-center shadow-none">
            <div className="mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-2xl bg-[#F7F4F2] p-2">
              <Image
                src={exercise.images.thumbnail}
                alt={exercise.title}
                width={260}
                height={260}
                quality={100}
                className="h-full w-full object-contain"
              />
            </div>

            <h2 className="mt-8 text-[30px] font-medium leading-[145%] text-[#1E1E1E]">
              {exercise.demoText}
            </h2>

            <div className="mt-8 flex items-center rounded-full bg-[#ECE8FF] p-2">
              <button
                type="button"
                onClick={handleToggleMute}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7875FB] text-white"
                aria-label={isMuted ? "Unmute instruction" : "Mute instruction"}
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>

              <span className="ml-4 flex-1 text-left text-[18px] font-semibold">
                {isMuted ? "Instruction Muted" : "Play Instruction"}
              </span>

              <button
                type="button"
                onClick={handlePlayInstruction}
                disabled={isMuted}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white disabled:opacity-50"
                aria-label={isSpeaking ? "Stop instruction" : "Play instruction"}
              >
                {isSpeaking ? <Square size={22} /> : <Play size={22} />}
              </button>
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