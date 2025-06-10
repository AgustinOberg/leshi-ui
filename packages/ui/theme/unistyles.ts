import { StyleSheet } from "react-native-unistyles";
const base = {
  gap: (n: number) => n * 4,
  radii: { sm: 4, md: 6, lg: 8, full: 9999, default: 10 },
  /* theme.ts – solo la parte fonts */
  fonts: {
    family: {
      /* Roman (normal) */
      regular: "System",
      medium: "System",
      semibold: "System",
      bold: "System",
    },

    /* escala tipográfica */
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 28,
    },
  },
};
const light = {
  ...base,
  colors: {
    background: "#ffffff",
    foreground: "#171717",
    card: "#ffffff",
    cardForeground: "#171717",
    popover: "#ffffff",
    popoverForeground: "#171717",
    primary: "#1e1e1e",
    onPrimary: "#fafafa",
    secondary: "#f4f4f5",
    onSecondary: "#1e1e1e",
    muted: "#f4f4f5",
    onMuted: "#71717a",
    accent: "#f4f4f5",
    onAccent: "#1e1e1e",
    destructive: "#E7000B",
    onDestructive: "#ffffff",
    border: "#e4e4e7",
    input: "#e4e4e7",
    ring: "#a1a1aa",
    link: "#1e1e1e",
    disabledBg: "#f4f4f5",
    disabledText: "#a1a1aa",
  },
};

const dark = {
  ...base,
  colors: {
    background: "#171717",
    foreground: "#fafafa",
    card: "#1e1e1e",
    cardForeground: "#fafafa",
    popover: "#27272a",
    popoverForeground: "#fafafa",
    primary: "#e4e4e7",
    onPrimary: "#1e1e1e",
    secondary: "#27272a",
    onSecondary: "#fafafa",
    muted: "#27272a",
    onMuted: "#a1a1aa",
    accent: "#3f3f46",
    onAccent: "#fafafa",
    destructive: "#E7000B",
    onDestructive: "#ffffff",
    border: "#ffffff1a",
    input: "#ffffff26",
    ring: "#71717a",
    link: "#e4e4e7",
    disabledBg: "#27272a",
    disabledText: "#52525b",
  },
};

export const themes = { light, dark } as const;
export const breakpoints = {
  xs: 0,
  sm: 360,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

type AppThemes = typeof themes;
type AppBreakpoints = typeof breakpoints;
declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes,
  breakpoints,
  settings: { initialTheme: "dark" }, // auto light/dark
});
