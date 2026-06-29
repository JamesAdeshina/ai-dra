"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  Camera,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  removeProfileAvatar,
  uploadProfileAvatar,
  type CurrentProfile,
} from "@/features/profile/services/profile-service";

type ProfileSummaryCardProps = {
  profile: CurrentProfile | null;
  isLoading: boolean;
  onProfileUpdated: () => Promise<CurrentProfile>;
};

function formatMemberSince(
  createdAt: string | null | undefined
) {
  if (!createdAt) {
    return "Not Set";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Not Set";
  }

  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function ProfileSummaryCard({
  profile,
  isLoading,
  onProfileUpdated,
}: ProfileSummaryCardProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] =
    useState(false);

  const [isRemoving, setIsRemoving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const displayName =
    profile?.display_name?.trim() ||
    [profile?.first_name, profile?.last_name]
      .filter(Boolean)
      .join(" ") ||
    "AI-DRA Survivor";

  const initials =
    [profile?.first_name, profile?.last_name]
      .filter(
        (name): name is string =>
          typeof name === "string" &&
          name.trim().length > 0
      )
      .map((name) =>
        name.trim().charAt(0).toUpperCase()
      )
      .join("")
      .slice(0, 2) ||
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .map((name) =>
        name.charAt(0).toUpperCase()
      )
      .join("")
      .slice(0, 2) ||
    "AD";

  const memberSince = formatMemberSince(
    profile?.created_at
  );

  const rehabilitationLevel =
    profile?.rehabilitation_level?.trim() ||
    "Not Assessed Yet";

  const weeklyGoal =
    typeof profile?.weekly_goal_minutes ===
      "number" &&
    profile.weekly_goal_minutes > 0
      ? `${profile.weekly_goal_minutes} Minutes`
      : "Not Set";

  const sessionsCompleted =
    profile?.sessions_completed ?? 0;

  const isBusy =
    isUploading || isRemoving;

  const openFilePicker = () => {
    if (isBusy) return;

    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file || isBusy) return;

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await uploadProfileAvatar(file);
      await onProfileUpdated();

      setSuccessMessage(
        "Your profile picture has been updated."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to upload profile picture."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!profile?.avatar_path || isBusy) {
      return;
    }

    setIsRemoving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await removeProfileAvatar();
      await onProfileUpdated();

      setSuccessMessage(
        "Your profile picture has been removed."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to remove profile picture."
      );
    } finally {
      setIsRemoving(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="rounded-2xl bg-white p-8">
        <h2 className="text-[24px] font-semibold text-[#1E1E1E]">
          Profile Summary
        </h2>

        <p className="mt-8 text-[#666666]">
          Loading profile summary...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8">
      <h2 className="text-[24px] font-semibold text-[#1E1E1E]">
        Profile Summary
      </h2>

      {errorMessage && (
        <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <div className="relative">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              className="h-[130px] w-[130px] rounded-full border-4 border-[#E7C83F] object-cover"
            />
          ) : (
            <div className="flex h-[130px] w-[130px] items-center justify-center rounded-full border-4 border-[#E7C83F] bg-[#E9E3F8] text-[38px] font-semibold text-[#592EBD]">
              {initials}
            </div>
          )}

          <button
            type="button"
            onClick={openFilePicker}
            disabled={isBusy}
            aria-label="Change profile picture"
            className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5] shadow-sm transition hover:bg-[#EAEAEA] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? (
              <Camera
                size={18}
                className="animate-pulse"
              />
            ) : (
              <Pencil size={18} />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={openFilePicker}
          disabled={isBusy}
          className="h-12 w-full rounded-full"
        >
          <Camera size={17} />

          {isUploading
            ? "Uploading..."
            : profile?.avatar_path
              ? "Change Photo"
              : "Add Photo"}
        </Button>

        {profile?.avatar_path && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleRemovePhoto}
            disabled={isBusy}
            className="h-12 w-full rounded-full text-[#F23636] hover:bg-red-50 hover:text-[#D82727]"
          >
            <Trash2 size={17} />

            {isRemoving
              ? "Removing..."
              : "Remove Photo"}
          </Button>
        )}
      </div>

      <div className="mt-10 space-y-6">
        <div>
          <p className="text-[16px] text-[#1E1E1E]">
            Member Since
          </p>

          <p className="mt-1 text-[28px] text-[#1E1E1E]">
            {memberSince}
          </p>
        </div>

        <div>
          <p className="text-[16px] text-[#1E1E1E]">
            Rehabilitation Level
          </p>

          <p className="mt-1 text-[28px] leading-tight text-[#1E1E1E]">
            {rehabilitationLevel}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[16px] text-[#1E1E1E]">
              Weekly Goal
            </p>

            <p className="mt-1 text-[28px] leading-tight text-[#1E1E1E]">
              {weeklyGoal}
            </p>
          </div>

          <button
            type="button"
            disabled
            title="Weekly goals will be available later"
            className="h-14 shrink-0 rounded-full border px-6 text-[16px] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {profile?.weekly_goal_minutes
              ? "Edit"
              : "Set Goal"}
          </button>
        </div>

        <div>
          <p className="text-[16px] text-[#1E1E1E]">
            Sessions Completed
          </p>

          <p className="mt-1 text-[28px] text-[#1E1E1E]">
            {sessionsCompleted}
          </p>
        </div>
      </div>
    </div>
  );
}