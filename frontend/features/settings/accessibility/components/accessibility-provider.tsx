"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

import {
  applyAccessibilityPreferences,
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  persistAccessibilityPreferences,
  readStoredAccessibilityPreferences,
} from "@/features/settings/accessibility/utils/accessibility-runtime";

import {
  getOrCreateAccessibilityPreferences,
} from "@/features/settings/accessibility/services/accessibility-service";

import type {
  AccessibilityPreferences,
} from "@/features/settings/accessibility/types/accessibility";

type AccessibilityContextValue = {
  preferences: AccessibilityPreferences;
  isReady: boolean;
  setPreferences: (
    preferences: AccessibilityPreferences
  ) => void;
};

const AccessibilityContext =
  createContext<AccessibilityContextValue>({
    preferences:
      DEFAULT_ACCESSIBILITY_PREFERENCES,
    isReady: false,
    setPreferences: () => {},
  });

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferencesState] =
    useState<AccessibilityPreferences>(
      DEFAULT_ACCESSIBILITY_PREFERENCES
    );

  const [isReady, setIsReady] =
    useState(false);

  useEffect(() => {
    const supabase = createClient();

    let active = true;

    const storedPreferences =
      readStoredAccessibilityPreferences();

    setPreferencesState(
      storedPreferences
    );

    applyAccessibilityPreferences(
      storedPreferences
    );

    const loadDatabasePreferences =
      async () => {
        try {
          const {
            data: { user },
            error: userError,
          } =
            await supabase.auth.getUser();

          if (!active) {
            return;
          }

          /*
           * Login, registration and public pages do not have
           * an authenticated user. Keep local preferences and
           * do not call the protected database service.
           */
          if (userError || !user) {
            setIsReady(true);
            return;
          }

          const databasePreferences =
            await getOrCreateAccessibilityPreferences();

          if (!active) {
            return;
          }

          setPreferencesState(
            databasePreferences
          );

          persistAccessibilityPreferences(
            databasePreferences
          );
        } catch (error) {
          /*
           * Local preferences have already been applied, so
           * a database failure should not break public pages
           * or the rest of the application.
           */
          console.warn(
            "Using locally stored accessibility preferences:",
            error
          );
        } finally {
          if (active) {
            setIsReady(true);
          }
        }
      };

    void loadDatabasePreferences();

    /*
     * Reload database preferences when a user signs in
     * without requiring a full page refresh.
     */
    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (event) => {
          if (
            event === "SIGNED_IN"
          ) {
            void loadDatabasePreferences();
          }

          if (
            event === "SIGNED_OUT"
          ) {
            const localPreferences =
              readStoredAccessibilityPreferences();

            setPreferencesState(
              localPreferences
            );

            applyAccessibilityPreferences(
              localPreferences
            );

            setIsReady(true);
          }
        }
      );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handleSystemThemeChange =
      () => {
        if (
          preferences.colorTheme ===
          "SYSTEM"
        ) {
          applyAccessibilityPreferences(
            preferences
          );
        }
      };

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );
    };
  }, [preferences]);

  const value = useMemo(
    () => ({
      preferences,
      isReady,
      setPreferences: (
        nextPreferences: AccessibilityPreferences
      ) => {
        setPreferencesState(
          nextPreferences
        );

        persistAccessibilityPreferences(
          nextPreferences
        );
      },
    }),
    [preferences, isReady]
  );

  return (
    <AccessibilityContext.Provider
      value={value}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(
    AccessibilityContext
  );
}