import { StyleSheet } from "react-native-unistyles";

const createBase = (
  radii: { sm: number; md: number; lg: number; full: number; default: number } = {
    sm: 4,
    md: 6,
    lg: 8,
    full: 9999,
    default: 10,
  }
) => ({
  gap: (n: number) => n * 4,
  radii,
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
});
const light = {
  ...createBase(),
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
  ...createBase(),
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

const chatgpt = {
  ...createBase(),
  colors: {
    background: "#343541",
    foreground: "#ececf1",
    card: "#444654",
    cardForeground: "#ececf1",
    popover: "#444654",
    popoverForeground: "#ececf1",
    primary: "#10a37f",
    onPrimary: "#ffffff",
    secondary: "#202123",
    onSecondary: "#ececf1",
    muted: "#3e3f4b",
    onMuted: "#a1a1aa",
    accent: "#10a37f",
    onAccent: "#ffffff",
    destructive: "#e7000b",
    onDestructive: "#ffffff",
    border: "#3e3f4b",
    input: "#3e3f4b",
    ring: "#10a37f",
    link: "#10a37f",
    disabledBg: "#202123",
    disabledText: "#52525b",
  },
};

const vercel = {
  ...createBase(),
  colors: {
    background: "#000000",
    foreground: "#ffffff",
    card: "#111111",
    cardForeground: "#ffffff",
    popover: "#111111",
    popoverForeground: "#ffffff",
    primary: "#ffffff",
    onPrimary: "#000000",
    secondary: "#333333",
    onSecondary: "#ffffff",
    muted: "#333333",
    onMuted: "#dddddd",
    accent: "#646cff",
    onAccent: "#ffffff",
    destructive: "#ff5555",
    onDestructive: "#000000",
    border: "#222222",
    input: "#222222",
    ring: "#646cff",
    link: "#646cff",
    disabledBg: "#333333",
    disabledText: "#888888",
  },
};

const unititled = {
  ...createBase(),
  colors: {
    background: "#f9fafb",
    foreground: "#111827",
    card: "#ffffff",
    cardForeground: "#111827",
    popover: "#ffffff",
    popoverForeground: "#111827",
    primary: "#2563eb",
    onPrimary: "#ffffff",
    secondary: "#e5e7eb",
    onSecondary: "#111827",
    muted: "#e5e7eb",
    onMuted: "#6b7280",
    accent: "#2563eb",
    onAccent: "#ffffff",
    destructive: "#dc2626",
    onDestructive: "#ffffff",
    border: "#d1d5db",
    input: "#d1d5db",
    ring: "#2563eb",
    link: "#2563eb",
    disabledBg: "#e5e7eb",
    disabledText: "#9ca3af",
  },
};

const cozy = {
  ...createBase({ sm: 6, md: 10, lg: 14, full: 9999, default: 12 }),
  colors: {
    background: "#fdf6e3",
    foreground: "#002b36",
    card: "#fefbec",
    cardForeground: "#002b36",
    popover: "#fefbec",
    popoverForeground: "#002b36",
    primary: "#b58900",
    onPrimary: "#fdf6e3",
    secondary: "#eee8d5",
    onSecondary: "#002b36",
    muted: "#eee8d5",
    onMuted: "#586e75",
    accent: "#cb4b16",
    onAccent: "#fdf6e3",
    destructive: "#dc322f",
    onDestructive: "#fdf6e3",
    border: "#e1dbcd",
    input: "#e1dbcd",
    ring: "#b58900",
    link: "#268bd2",
    disabledBg: "#eee8d5",
    disabledText: "#93a1a1",
  },
};

export const themes = { light, dark, chatgpt, vercel, unititled, cozy } as const;
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
