export function AccessibilityBootstrapScript() {
  const script = `
    (function () {
      try {
        var key = "ai-dra-accessibility-preferences";
        var stored = window.localStorage.getItem(key);
        var preferences = stored ? JSON.parse(stored) : {};
        var root = document.documentElement;
        var textScale = Number(preferences.textScale || 100);
        var theme = preferences.colorTheme || "SYSTEM";

        root.style.setProperty(
          "--ai-dra-text-scale",
          String(textScale / 100)
        );

        root.dataset.highContrast =
          String(Boolean(preferences.highContrast));

        root.dataset.reduceMotion =
          String(preferences.reduceMotion !== false);

        root.dataset.largeButtons =
          String(preferences.largerButtons !== false);

        root.dataset.stepGuidance =
          String(preferences.stepByStepGuidance !== false);

        root.dataset.voiceGuidance =
          String(preferences.voiceGuidanceEnabled !== false);

        root.dataset.soundEffects =
          String(preferences.soundEffectsEnabled !== false);

        var dark =
          theme === "DARK" ||
          (
            theme === "SYSTEM" &&
            window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches
          );

        root.classList.toggle(
          "dark",
          dark
        );

        root.dataset.colorTheme =
          String(theme).toLowerCase();
      } catch (error) {
        console.error(
          "Accessibility bootstrap failed:",
          error
        );
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: script,
      }}
    />
  );
}
