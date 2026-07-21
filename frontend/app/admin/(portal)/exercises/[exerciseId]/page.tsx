import { notFound } from "next/navigation";

import { AdminExerciseDetailView } from "@/features/admin/components/exercises/admin-exercise-detail-view";
import { getAdminExerciseById } from "@/features/admin/data/admin-exercise-data";

type AdminExerciseDetailPageProps = {
  params: Promise<{
    exerciseId: string;
  }>;
};

export default async function AdminExerciseDetailPage({
  params,
}: AdminExerciseDetailPageProps) {
  const { exerciseId } = await params;

  const exercise =
    getAdminExerciseById(exerciseId);

  if (!exercise) {
    notFound();
  }

  return (
    <AdminExerciseDetailView
      exercise={exercise}
    />
  );
}