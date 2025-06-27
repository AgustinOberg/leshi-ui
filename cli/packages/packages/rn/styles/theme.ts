import { useThemeContext } from "./context";

// Re-export Theme type for convenience
export type { Theme } from "./theme.d";

export const useTheme = () => useThemeContext().theme;
export const useThemeName = () => ({
  themeName: useThemeContext().themeName,
  setThemeName: useThemeContext().setThemeName,
});

export const useThemeMode = () => ({
  mode: useThemeContext().mode,
  setMode: useThemeContext().setMode,
});
