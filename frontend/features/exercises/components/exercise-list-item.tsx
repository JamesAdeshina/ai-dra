import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

type ExerciseListItemProps = {
  id: string;
  title: string;
  description: string;
  level: string;
  reps: string;
  difficulty: string;
  illustration: string;
};

export function ExerciseListItem({
  id,
  title,
  description,
  level,
  reps,
  difficulty,
  illustration,
}: ExerciseListItemProps) {
  const isImagePath = illustration.startsWith("/");

  return (
    <Card className="grid grid-cols-[112px_1fr_130px_140px_48px] items-center gap-6 rounded-2xl border-0 bg-white p-4 shadow-none">
      <div className="flex h-[112px] w-[112px] items-center justify-center rounded-2xl bg-[#F7F4F2] p-2">
        {isImagePath ? (
          <Image
            src={illustration}
            alt={title}
            width={96}
            height={96}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-5xl">{illustration}</span>
        )}
      </div>

      <div>
        <h3 className="text-[24px] font-semibold text-[#1E1E1E]">{title}</h3>
        <p className="mt-1 text-[22px] leading-[140%] text-[#8A8A8A]">
          {description}
        </p>
      </div>

      <div className="flex h-[60px] items-center justify-center rounded-2xl border border-[#7875FB] bg-[#7875FB]/10 text-[18px] font-semibold text-[#7875FB]">
        {level}
      </div>

      <div>
        <p className="text-[28px] font-bold text-[#010E0E]">{reps}</p>
        <p className="text-[22px] text-[#8A8A8A]">{difficulty}</p>
      </div>

      <Link
        href={`/exercises/${id}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
      >
        <ArrowUpRight size={22} />
      </Link>
    </Card>
  );
}