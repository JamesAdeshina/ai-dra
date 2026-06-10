"use client";

import { useState } from "react";
import { AboutSettings } from "./about-settings";
import { AccessibilitySettings } from "./accessibility-settings";
import { HelpSupportSettings } from "./help-support-settings";
import { PreferencesSettings } from "./preferences-settings";
import { ProfileSettings } from "./profile-settings";
import { ProfileSummaryCard } from "./profile-summary-card";
import { SettingsSidebar, type SettingsTab } from "./settings-sidebar";

type SettingsViewProps = {
  hasData?: boolean;
};

export function SettingsView({ hasData = true }: SettingsViewProps) {
  const [activeTab, setActiveTab] =
    useState<SettingsTab>("Personal Information");

  return (
    <main className="grid grid-cols-[360px_1fr] gap-6">
      <SettingsSidebar active={activeTab} onChange={setActiveTab} />

      {activeTab === "Personal Information" && (
        <div className="grid grid-cols-[1fr_340px] gap-6">
          <ProfileSettings hasData={hasData} />
          <ProfileSummaryCard hasData={hasData} />
        </div>
      )}

      {activeTab === "Accessibility" && <AccessibilitySettings />}

      {activeTab === "Preferences" && <PreferencesSettings />}

      {activeTab === "Help & Support" && <HelpSupportSettings />}

      {activeTab === "About" && <AboutSettings />}
    </main>
  );
}