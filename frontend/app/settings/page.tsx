import { AppLayout } from "@/components/layout/app-layout";
import { SettingsView } from "@/features/settings/components/settings-view";

export default function SettingsPage() {
  return (
    <AppLayout>
      <SettingsView hasData={true} />
    </AppLayout>
  );
}