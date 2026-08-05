import { Suspense } from "react";

import { AppLayout } from "@/components/layout/app-layout";
import { SettingsView } from "@/features/settings/components/settings-view";

export default function SettingsPage() {
  return (
    <AppLayout>
      <Suspense fallback={null}>
        <SettingsView />
      </Suspense>
    </AppLayout>
  );
}