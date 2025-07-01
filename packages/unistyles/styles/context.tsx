import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { themes } from './themes';
import type { ThemeName } from './themes';
import type { Theme } from './theme';
import { breakpoints } from './breakpoints';

type AppThemes = typeof themes;
type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

export type ThemeMode = 'manual' | 'system';

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
  return scheme === 'dark' && 'dark' in themes ? 'dark' : 'light';
};

StyleSheet.configure({
  themes,
  breakpoints,
  settings: { initialTheme: 'light' },
});

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  defaultMode?: ThemeMode;
}> = ({ children, defaultTheme = 'light', defaultMode = 'manual' }) => {
  const systemTheme = getSystemTheme();
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  const resolvedThemeName = mode === 'system' ? systemTheme : themeName;

  React.useEffect(() => {
    if (mode === 'system') {
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setAdaptiveThemes(false);
      UnistylesRuntime.setTheme(themeName);
    }
  }, [mode, themeName]);

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
  if (ctx) return ctx;

  const systemTheme = getSystemTheme();
  return {
    theme: themes[systemTheme],
    themeName: systemTheme,
    setThemeName: () =>
      console.warn('[Theme] No ThemeProvider mounted — ignoring setThemeName'),
    mode: 'system',
    setMode: () =>
      console.warn('[Theme] No ThemeProvider mounted — ignoring setMode'),
  };
};

export const useTheme = () => useThemeContext().theme;
export const useThemeName = () => ({
  themeName: useThemeContext().themeName,
  setThemeName: useThemeContext().setThemeName,
});
export const useThemeMode = () => ({
  mode: useThemeContext().mode,
  setMode: useThemeContext().setMode,
});
