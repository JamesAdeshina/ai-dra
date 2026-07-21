import { AdminExercisesView } from "@/features/admin/components/exercises/admin-exercises-view";
import { getAdminExercises } from "@/features/admin/data/admin-exercise-data";

export default function AdminExercisesPage() {
  return (
    <AdminExercisesView
      exercises={getAdminExercises()}
    />
  );
}