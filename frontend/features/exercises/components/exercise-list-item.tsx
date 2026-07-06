import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ImageIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";

type ExerciseListItemProps = {
  slug: string;
  title: string;
  description: string;
  trackerType: string;
  primaryMetric: string;
  targetReps: number;
  illustration: string | null;
};

function formatLabel(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export function ExerciseListItem({
  slug,
  title,
  description,
  trackerType,
  primaryMetric,
  targetReps,
  illustration,
}: ExerciseListItemProps) {
  return (
    <Card className="grid grid-cols-1 gap-5 rounded-2xl border-0 bg-white p-4 shadow-none lg:grid-cols-[112px_minmax(0,1fr)_180px_160px_48px] lg:items-center lg:gap-6">
      <div className="flex h-[112px] w-[112px] items-center justify-center overflow-hidden rounded-2xl bg-[#F7F4F2] p-2">
        {illustration ? (
          <Image
            src={illustration}
            alt=""
            width={240}
            height={240}
            quality={100}
            className="h-full w-full object-contain"
          />
        ) : (
          <ImageIcon
            aria-hidden="true"
            className="h-10 w-10 text-neutral-400"
          />
        )}
      </div>

      <div className="min-w-0">
        <h3 className="text-[24px] font-semibold text-[#1E1E1E]">
          {title}
        </h3>

        <p className="mt-1 text-[18px] leading-[140%] text-[#8A8A8A] xl:text-[20px]">
          {description}
        </p>

        <p className="mt-2 text-sm font-medium text-neutral-500">
          Primary metric:{" "}
          {formatLabel(primaryMetric)}
        </p>
      </div>

      <div className="flex min-h-[60px] items-center justify-center rounded-2xl border border-[#7875FB] bg-[#7875FB]/10 px-4 text-center text-[16px] font-semibold text-[#7875FB]">
        {formatLabel(trackerType)}
      </div>

      <div>
        <p className="text-[28px] font-bold text-[#010E0E]">
          {targetReps} reps
        </p>

        <p className="text-[18px] text-[#8A8A8A]">
          Session target
        </p>
      </div>

      <Link
        href={`/exercises/${slug}`}
        aria-label={`View ${title}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition hover:bg-neutral-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#592EBD]/25"
      >
        <ArrowUpRight size={22} />
      </Link>
    </Card>
  );
}