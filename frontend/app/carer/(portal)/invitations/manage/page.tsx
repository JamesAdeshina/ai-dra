import { ManageLinkedSurvivorsView } from "@/features/carer/components/invitations/manage-linked-survivors-view";
import { getManageLinkedSurvivorRecords } from "@/features/carer/services/carer-invitation-service";

export default async function ManageLinkedSurvivorsPage() {
  const survivors =
    await getManageLinkedSurvivorRecords();

  return (
    <ManageLinkedSurvivorsView
      initialSurvivors={survivors}
    />
  );
}
