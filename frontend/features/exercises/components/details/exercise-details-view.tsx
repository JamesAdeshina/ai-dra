import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Play,
  RotateCw,
  Timer,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ExerciseDetails = {
  slug: string;
  title: string;
  category: string;
  description: string;
  level: string;
  reps: string;
  duration: string;
  type: string;
  instruction: string;
  images: {
    thumbnail: string;
    states: {
      start: string;
      active: string;
    };
  };
  benefits: string[];
  activities: string[];
  steps: string[];
};

type ExerciseDetailsViewProps = {
  exercise: ExerciseDetails;
};

export function ExerciseDetailsView({ exercise }: ExerciseDetailsViewProps) {
  const startImage = exercise.images.states.start;
  const activeImage = exercise.images.states.active;
  const thumbnailImage = exercise.images.thumbnail;

  return (
    <div className="space-y-6">
      <Link
        href="/exercises"
        className="inline-flex items-center gap-2 text-[16px] font-medium text-[#7875FB]"
      >
        <ArrowLeft size={18} />
        Back to Exercises
      </Link>

      <div className="grid grid-cols-[1.6fr_1fr] gap-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-[112px] w-[112px] items-center justify-center rounded-2xl bg-white p-2">
              <ExerciseImage src={thumbnailImage} alt={exercise.title} />
            </div>

            <div>
              <h1 className="text-[28px] font-bold text-[#1E1E1E]">
                {exercise.title}
              </h1>
              <span className="mt-3 inline-flex rounded-full bg-[#7875FB]/15 px-6 py-2 text-[16px] font-semibold text-[#7875FB]">
                {exercise.category}
              </span>
            </div>
          </div>

          <Card className="grid grid-cols-[1fr_260px] rounded-2xl border-0 bg-white p-5 shadow-none">
            <div className="rounded-2xl bg-[#F7F4F2] p-8">
              <ExerciseAnimation
                startImage={startImage}
                endImage={activeImage}
                title={exercise.title}
              />

              <div className="mt-5 rounded-2xl bg-[#ECE8FF] px-6 py-5 text-[18px] font-semibold text-[#1E1E1E]">
                {exercise.instruction}
              </div>
            </div>

            <div className="space-y-6 border-l px-6">
              <SummaryItem icon={<RotateCw />} label="Difficulty" value={exercise.level} />
              <SummaryItem icon={<RotateCw />} label="Repetitions" value={exercise.reps} />
              <SummaryItem icon={<Timer />} label="Duration" value={exercise.duration} />
              <SummaryItem icon={<ThumbsUp />} label="Exercise Type" value={exercise.type} />
            </div>
          </Card>

          <Card className="rounded-2xl border-0 bg-white p-5 shadow-none">
            <h2 className="text-[20px] font-semibold text-[#1E1E1E]">
              How To Perform
            </h2>

            <div className="mt-4 grid grid-cols-5 gap-4">
              {exercise.steps.map((step, index) => {
                const stepImage =
                  index === 0 || index === 2 ? startImage : activeImage;

                return (
                  <div key={step} className="rounded-2xl bg-[#F7F4F2] p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#ECE8FF] text-[16px] font-semibold text-[#7875FB]">
                      {index + 1}
                    </div>

                    <div className="flex h-[120px] items-center justify-center">
                      {index === 4 ? (
                        <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#ECE8FF] text-[#7875FB]">
                          <RotateCw size={44} />
                        </div>
                      ) : (
                        <div className="h-[310px] w-[310px]">
                          <ExerciseImage
                            src={stepImage}
                            alt={`${exercise.title} step ${index + 1}`}
                          />
                        </div>
                      )}
                    </div>

                    <p className="mt-3 text-[16px] font-medium leading-[140%]">
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-2xl border-0 bg-white p-6 shadow-none">
            <h2 className="text-[22px] font-bold text-[#1E1E1E]">
              About This Exercise
            </h2>
            <p className="mt-0 text-[16px] leading-[150%] text-[#666666]">
              {exercise.description}
            </p>

            <h3 className="mt-2 text-[22px] font-bold">Benefits</h3>
            <div className="mt-1 space-y-2">
              {exercise.benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F4F2] text-[#592EBD]">
                    <Heart size={20} fill="#592EBD" />
                  </div>
                  <span className="text-[16px]">{benefit}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border-0 bg-white p-6 shadow-none">
            <h2 className="text-[22px] font-bold text-[#1E1E1E]">
              What Daily Activities Does This Help With?
            </h2>

            <div className="mt-5 grid grid-cols-4 gap-3">
              {exercise.activities.map((activity) => (
                <div key={activity} className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F7F4F2] text-4xl">
                    ☕
                  </div>
                  <p className="mt-2 text-[14px] font-medium leading-[140%]">
                    {activity}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="h-16 rounded-full text-[18px]">
              <Link href={`/exercises/${exercise.slug}/demo`}>
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>

            <Button
              asChild
              className="h-16 rounded-full bg-[#592EBD] text-[18px] hover:bg-[#4B24A8]"
            >
              <Link href={`/exercises/${exercise.slug}/start`}>
                Start Exercise
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExerciseAnimation({
  startImage,
  endImage,
  title,
}: {
  startImage: string;
  endImage: string;
  title: string;
}) {
  return (
    <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-[#F7F4F2]">
      <Image
        src={startImage}
        alt={`${title} starting position`}
        width={520}
        height={520}
        quality={100}
        priority
        className="absolute h-[420px] w-[420px] object-contain animate-[fadeOne_2.4s_ease-in-out_infinite]"
      />

      <Image
        src={endImage}
        alt={`${title} exercise position`}
        width={520}
        height={520}
        quality={100}
        priority
        className="absolute h-[420px] w-[420px] object-contain animate-[fadeTwo_2.4s_ease-in-out_infinite]"
      />
    </div>
  );
}

function ExerciseImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={520}
      height={520}
      quality={100}
      className="h-full w-full object-contain"
    />
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b pb-4 last:border-b-0">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ECE8FF] text-[#592EBD]">
        {icon}
      </div>
      <div>
        <p className="text-[14px] text-[#888888]">{label}</p>
        <p className="text-[16px] font-semibold text-[#1E1E1E]">{value}</p>
      </div>
    </div>
  );
}