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
    <main className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[340px_minmax(0,1fr)]">
      <SettingsSidebar
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "Personal Information" && (
        <div className="grid min-w-0 grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
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
        <div className="min-w-0">
          <ChangePasswordSettings />
        </div>
      )}

      {activeTab === "Linked Carer" && (
        <div className="min-w-0">
          <LinkedCarerSettings />
        </div>
      )}

      {activeTab === "Accessibility" && (
        <div className="min-w-0">
          <AccessibilitySettings />
        </div>
      )}

      {activeTab === "Preferences" && (
        <div className="min-w-0">
          <PreferencesSettings />
        </div>
      )}

      {activeTab === "Help & Support" && (
        <div className="min-w-0">
          <HelpSupportSettings />
        </div>
      )}

      {activeTab === "About" && (
        <div className="min-w-0">
          <AboutSettings />
        </div>
      )}
    </main>
  );
}
