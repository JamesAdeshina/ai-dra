"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

type ExerciseDemoModalProps = {
  exercise: {
    title: string;
    demoVideo?: string;
    images: {
      states: {
        active: string;
      };
    };
  };
  onClose: () => void;
};

export function ExerciseDemoModal({ exercise, onClose }: ExerciseDemoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
      <div className="w-[980px] rounded-[24px] bg-white p-5">
        <div className="flex h-[620px] items-center justify-center overflow-hidden rounded-[20px] bg-[#F7F4F2]">
          {exercise.demoVideo ? (
            <video
              src={exercise.demoVideo}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <Image
              src={exercise.images.states.active}
              alt={`${exercise.title} demo`}
              width={900}
              height={600}
              quality={100}
              className="h-full w-full object-contain"
            />
          )}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <Button className="h-14 rounded-full bg-[#592EBD] px-8 text-[18px] text-white hover:bg-[#4B24A8]">
            <Play className="mr-2 h-5 w-5" fill="white" />
            Replay Demo
          </Button>

          <Button
            onClick={onClose}
            className="h-14 rounded-full bg-[#BDBDBD] px-8 text-[18px] text-white hover:bg-[#A8A8A8]"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}