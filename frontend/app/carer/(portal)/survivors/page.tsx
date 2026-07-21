import { SurvivorsView } from "@/features/carer/components/survivors/survivors-view";
import { getCarerSurvivorsDirectoryData } from "@/features/carer/services/carer-survivors-service";

export default async function CarerSurvivorsPage() {
  const {
    survivors,
    pendingInviteCount,
  } = await getCarerSurvivorsDirectoryData();

  return (
    <SurvivorsView
      survivors={survivors}
      pendingInviteCount={pendingInviteCount}
    />
  );
}