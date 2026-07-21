"use client";

import { useState } from "react";

import { AboutSettings } from "./about-settings";
import { AccessibilitySettings } from "./accessibility-settings";
import { HelpSupportSettings } from "./help-support-settings";
import { LinkedCarerSettings } from "./linked-carer-settings";
import { PreferencesSettings } from "./preferences-settings";
import { ProfileSettings } from "./profile-settings";
import { ProfileSummaryCard } from "./profile-summary-card";
import { ChangePasswordSettings } from "./change-password-settings";

import {
  SettingsSidebar,
  type SettingsTab,
} from "./settings-sidebar";

import { useCurrentProfile } from "@/features/profile/hooks/use-current-profile";

export function SettingsView() {
  const [activeTab, setActiveTab] =
    useState<SettingsTab>("Personal Information");

  const {
    profile,
    isLoading,
    error,
    refreshProfile,
  } = useCurrentProfile();

  return (
    <main className="grid grid-cols-[360px_minmax(0,1fr)] gap-6">
      <SettingsSidebar
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "Personal Information" && (
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_340px] gap-6">
          <ProfileSettings
            profile={profile}
            isLoading={isLoading}
            error={error}
            onProfileUpdated={refreshProfile}
            onChangePassword={() =>
              setActiveTab("Change Password")
            }
          />

          <ProfileSummaryCard
            profile={profile}
            isLoading={isLoading}
            onProfileUpdated={refreshProfile}
          />
        </div>
      )}

      {activeTab === "Change Password" && (
        <ChangePasswordSettings />
      )}

      {activeTab === "Linked Carer" && (
        <LinkedCarerSettings />
      )}

      {activeTab === "Accessibility" && (
        <AccessibilitySettings />
      )}

      {activeTab === "Preferences" && (
        <PreferencesSettings />
      )}

      {activeTab === "Help & Support" && (
        <HelpSupportSettings />
      )}

      {activeTab === "About" && (
        <AboutSettings />
      )}
    </main>
  );
}
