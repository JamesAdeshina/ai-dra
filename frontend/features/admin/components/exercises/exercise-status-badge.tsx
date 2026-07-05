import type {
  AdminExerciseDifficulty,
  AdminExerciseStatus,
} from "@/features/admin/types/admin-exercise";
import { cn } from "@/lib/utils";

type ExerciseStatusBadgeProps = {
  value: AdminExerciseStatus | AdminExerciseDifficulty;
};

const badgeClasses = {
  Active: "bg-[#E6F7EF] text-[#18834D]",
  Inactive: "bg-[#FFE7E7] text-[#D43D3D]",
  Draft: "bg-[#FFF4DD] text-[#B16C00]",
  Archived: "bg-[#EEF1F5] text-[#667085]",

  Easy: "bg-[#E6F7EF] text-[#18834D]",
  Medium: "bg-[#FFF4DD] text-[#B16C00]",
  Hard: "bg-[#FFE7E7] text-[#D43D3D]",
};

export function ExerciseStatusBadge({
  value,
}: ExerciseStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
        badgeClasses[value]
      )}
    >
      {value}
    </span>
  );
}