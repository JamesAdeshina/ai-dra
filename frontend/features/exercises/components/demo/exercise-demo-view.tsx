"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ImageIcon,
  Play,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type {
  Exercise,
} from "@/features/exercises/types";

type ExerciseDemoViewProps = {
  exercise: Exercise;
};

export function ExerciseDemoView({
  exercise,
}: ExerciseDemoViewProps) {
  const [isMuted, setIsMuted] =
    useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const instruction = useMemo(() => {
    return (
      exercise.steps[0]?.instruction ??
      exercise.shortDescription ??
      exercise.description ??
      "Follow the demonstration carefully before beginning the exercise."
    );
  }, [exercise]);

  const demoText = useMemo(() => {
    return (
      exercise.shortDescription ??
      exercise.description ??
      instruction
    );
  }, [exercise, instruction]);

  const displayImage =
    exercise.activeImageUrl ??
    exercise.startImageUrl ??
    exercise.thumbnailUrl;

  const thumbnailImage =
    exercise.thumbnailUrl ??
    exercise.startImageUrl ??
    exercise.activeImageUrl;

  const sessionHref =
    `/exercises/${exercise.slug}/start`;

  useEffect(() => {
    return () => {
      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;

    setIsMuted(nextMuted);

    if (
      nextMuted &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handlePlayInstruction = () => {
    if (
      !("speechSynthesis" in window) ||
      isMuted
    ) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(
        instruction
      );

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(
      utterance
    );

    setIsSpeaking(true);
  };

  return (
    <div className="space-y-4">
      <Link
        href={`/exercises/${exercise.slug}`}
        className="inline-flex items-center gap-2 text-[16px] font-medium text-[#7875FB] transition hover:text-[#592EBD]"
      >
        <ArrowLeft size={18} />
        Back to Exercise
      </Link>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_0.95fr]">
        <Card className="rounded-2xl border-0 bg-white p-6 shadow-none">
          <div>
            <h1 className="text-[28px] font-bold text-[#1E1E1E]">
              {exercise.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[18px] font-bold text-[#1E1E1E]">
                {
                  exercise.defaultTargetReps
                }{" "}
                reps
              </span>

              <span className="rounded-full bg-[#7875FB]/15 px-3 py-1 text-[14px] font-semibold text-[#7875FB]">
                {formatLabel(
                  exercise.trackerType
                )}
              </span>

              <span className="rounded-full bg-[#F2EEFC] px-3 py-1 text-[14px] font-semibold text-[#592EBD]">
                {formatLabel(
                  exercise.primaryMetric
                )}
              </span>
            </div>
          </div>

          <div className="mt-6 flex h-[470px] items-center justify-center overflow-hidden rounded-2xl bg-[#F7F4F2]">
            {exercise.demoVideoUrl ? (
              <video
                src={
                  exercise.demoVideoUrl
                }
                controls
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="h-full w-full rounded-2xl object-contain"
              >
                Your browser does not support
                video playback.
              </video>
            ) : displayImage ? (
              <Image
                src={displayImage}
                alt={`${exercise.title} demonstration`}
                width={720}
                height={720}
                quality={100}
                priority
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-neutral-500">
                <ImageIcon
                  aria-hidden="true"
                  className="h-16 w-16"
                />

                <p className="text-[16px] font-medium">
                  Demonstration media is
                  not available yet.
                </p>
              </div>
            )}
          </div>
        </Card>

        <div className="flex flex-col">
          <Card className="rounded-2xl border-0 bg-white p-6 text-center shadow-none">
            <div className="mx-auto flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-2xl bg-[#F7F4F2] p-2">
              {thumbnailImage ? (
                <Image
                  src={thumbnailImage}
                  alt={exercise.title}
                  width={260}
                  height={260}
                  quality={100}
                  className="h-full w-full object-contain"
                />
              ) : (
                <ImageIcon
                  aria-hidden="true"
                  className="h-12 w-12 text-neutral-400"
                />
              )}
            </div>

            <h2 className="mt-8 text-[26px] font-medium leading-[145%] text-[#1E1E1E]">
              {demoText}
            </h2>

            <div className="mt-8 flex items-center rounded-full bg-[#ECE8FF] p-2">
              <button
                type="button"
                onClick={
                  handleToggleMute
                }
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#7875FB] text-white transition hover:bg-[#6764E8] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7875FB]/25"
                aria-label={
                  isMuted
                    ? "Unmute instruction"
                    : "Mute instruction"
                }
              >
                {isMuted ? (
                  <VolumeX size={24} />
                ) : (
                  <Volume2 size={24} />
                )}
              </button>

              <span className="ml-4 flex-1 text-left text-[18px] font-semibold">
                {isMuted
                  ? "Instruction Muted"
                  : isSpeaking
                    ? "Instruction Playing"
                    : "Play Instruction"}
              </span>

              <button
                type="button"
                onClick={
                  handlePlayInstruction
                }
                disabled={isMuted}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#1E1E1E] transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7875FB]/25"
                aria-label={
                  isSpeaking
                    ? "Stop instruction"
                    : "Play instruction"
                }
              >
                {isSpeaking ? (
                  <Square size={22} />
                ) : (
                  <Play size={22} />
                )}
              </button>
            </div>

            {exercise.steps.length >
            0 ? (
              <div className="mt-6 rounded-2xl bg-[#F7F4F2] px-5 py-4 text-left">
                <p className="text-[14px] font-semibold uppercase tracking-wide text-[#7875FB]">
                  First Step
                </p>

                <p className="mt-2 text-[16px] leading-[150%] text-[#444444]">
                  {
                    exercise.steps[0]
                      .instruction
                  }
                </p>
              </div>
            ) : null}
          </Card>

          <div className="mt-4">
            <Button
              asChild
              className="h-20 w-full rounded-full bg-[#592EBD] text-[22px] hover:bg-[#4B24A8]"
            >
              <Link href={sessionHref}>
                Start Exercise
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatLabel(
  value: string
): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}