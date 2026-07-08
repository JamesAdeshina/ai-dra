"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
    const stored =
      readStoredAccessibilityPreferences();

    setPreferencesState(stored);
    applyAccessibilityPreferences(
      stored
    );

    let active = true;

    void getOrCreateAccessibilityPreferences()
      .then((databasePreferences) => {
        if (!active) {
          return;
        }

        setPreferencesState(
          databasePreferences
        );

        persistAccessibilityPreferences(
          databasePreferences
        );
      })
      .catch((error: unknown) => {
        console.error(
          "Failed to initialise accessibility preferences:",
          error
        );
      })
      .finally(() => {
        if (active) {
          setIsReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handleSystemThemeChange = () => {
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
