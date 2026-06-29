"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getCurrentProfile,
  type CurrentProfile,
} from "@/features/profile/services/profile-service";

export function useCurrentProfile() {
  const [profile, setProfile] =
    useState<CurrentProfile | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refreshProfile =
    useCallback(async () => {
      setIsLoading(true);

      try {
        const currentProfile =
          await getCurrentProfile();

        setProfile(currentProfile);
        setError(null);

        return currentProfile;
      } catch (profileError) {
        const message =
          profileError instanceof Error
            ? profileError.message
            : "Unable to load profile.";

        setError(message);
        throw profileError;
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    refreshProfile().catch(() => undefined);
  }, [refreshProfile]);

  return {
    profile,
    isLoading,
    error,
    refreshProfile,
  };
}