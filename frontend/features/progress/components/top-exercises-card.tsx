import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const topExercises = [
  { name: "Shoulder Flexion", score: "94%", color: "#7875FB" },
  { name: "Elbow Flexion", score: "76%", color: "#111111" },
  { name: "Wrist Extension", score: "79%", color: "#ED3A3A" },
  { name: "Cup to Shelf", score: "81%", color: "#F5A94C" },
  { name: "Bilateral Arm Raise", score: "77%", color: "#2DD4BF" },
];

type TopExercisesCardProps = {
  hasData?: boolean;
};

export function TopExercisesCard({ hasData = false }: TopExercisesCardProps) {
  return (
    <Card className="h-[348px] rounded-2xl border-0 bg-white p-6 shadow-none">
      <h2 className="text-[18px] font-semibold text-[#1E1E1E]">
        Top Exercises
      </h2>

      {hasData ? (
        <div className="mt-8 space-y-6">
          {topExercises.map((exercise) => (
            <div key={exercise.name} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span
                  className="h-10 w-1 rounded-full"
                  style={{ backgroundColor: exercise.color }}
                />
                <span className="text-[16px] text-[#1E1E1E]">
                  {exercise.name}
                </span>
              </div>

              <span className="text-[16px] font-bold text-[#1E1E1E]">
                {exercise.score}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[280px] flex-col items-center justify-center text-center">
          <div className="text-[72px]">📄</div>

          <p className="mt-3 max-w-[240px] text-[18px] font-semibold leading-[140%] text-[#1E1E1E]">
            Your most completed exercises will appear here after your first
            session.
          </p>

          <Link href="/exercises" className="mt-6">
            <Button className="h-[44px] rounded-full bg-[#592EBD] px-8 text-[16px] hover:bg-[#4B24A8]">
              Browse Exercises
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}