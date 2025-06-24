import { useThemeContext } from "./theme.context";

export const useTheme = () => useThemeContext().theme;
export const useThemeName = () => ({
  themeName: useThemeContext().themeName,
  setThemeName: useThemeContext().setThemeName,
});

export const useThemeMode = () => ({
  mode: useThemeContext().mode,
  setMode: useThemeContext().setMode,
});
