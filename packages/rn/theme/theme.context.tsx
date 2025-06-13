import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { themes } from "./themes";

export type ThemeName = keyof typeof themes;
export type Theme = (typeof themes)[ThemeName];
export type ThemeMode = "manual" | "system";

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getSystemTheme = (): ThemeName => {
  const scheme = useColorScheme();
  return scheme === "dark" && "dark" in themes ? "dark" : "light";
};

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  defaultMode?: ThemeMode;
}> = ({ children, defaultTheme = "light", defaultMode = "manual" }) => {
  const systemTheme = getSystemTheme();
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const resolvedThemeName = mode === "system" ? systemTheme : themeName;
  console.log({ mode, themeName, resolvedThemeName, systemTheme });

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[resolvedThemeName],
      themeName,
      setThemeName,
      mode,
      setMode,
    }),
    [resolvedThemeName, themeName, mode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (ctx) return ctx;

  const systemTheme = getSystemTheme();
  return {
    theme: themes[systemTheme],
    themeName: systemTheme,
    setThemeName: () =>
      console.warn("[Theme] No ThemeProvider mounted — ignoring setThemeName"),
    mode: "system",
    setMode: () =>
      console.warn("[Theme] No ThemeProvider mounted — ignoring setMode"),
  };
};
