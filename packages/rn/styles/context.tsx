import React, { createContext, useContext, useMemo, useState } from 'react';
import { type ColorSchemeName, useColorScheme } from 'react-native';
import { themes } from './themes';

export type ThemeName = keyof typeof themes;
export type Theme = (typeof themes)[ThemeName];
export type ThemeMode = 'manual' | 'system';

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getSystemTheme = (scheme: ColorSchemeName): ThemeName => {
  return scheme === 'dark' && 'dark' in themes ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  defaultMode?: ThemeMode;
}> = ({ children, defaultTheme = 'light', defaultMode = 'manual' }) => {
  const scheme = useColorScheme();
  const systemTheme = getSystemTheme(scheme);
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const resolvedThemeName = mode === 'system' ? systemTheme : themeName;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[resolvedThemeName],
      themeName,
      setThemeName,
      mode,
      setMode,
    }),
    [resolvedThemeName, themeName, mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  const scheme = useColorScheme();
  if (ctx) return ctx;
  const systemTheme = getSystemTheme(scheme);
  return {
    theme: themes[systemTheme],
    themeName: systemTheme,
    setThemeName: () => {
      // No-op: ThemeProvider not mounted, theme changes ignored
    },
    mode: 'system',
    setMode: () => {
      // No-op: ThemeProvider not mounted, mode changes ignored
    },
  };
};
