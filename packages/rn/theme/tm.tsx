// Theme definitions for React Native components

// --- Font families for each weight ---
export const fonts = {
  thin: 'System',
  extralight: 'System',
  light: 'System',
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
  extrabold: 'System',
  black: 'System',
} as const;

// --- Shadow presets used across components ---
export const shadows = {
  xs: {
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  xl: {
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  "2xl": {
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
  },
  "3xl": {
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 16,
  },
} as const;

// --- Sizing helpers ---
export const sizes = {
  fonts: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
    "6xl": 64,
    "7xl": 72,
    "8xl": 96,
    "9xl": 128,
  },
  height: (n: number) => n * 4,
  width: (n: number) => n * 4,
  gap: (n: number) => n * 4,
  padding: (n: number) => n * 4,
} as const;

// --- Radii values used for rounded components ---
export const radii = {
  md: 8,
  xl: 14,
  full: 9999,
} as const;

// --- Shared theme shape ---
export type Theme = {
  fonts: typeof fonts;
  shadows: typeof shadows;
  sizes: typeof sizes;
  radii: typeof radii;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    card: string;
    input: string;
    inputSurface: string;
  };
};

// --- Color palette for the light theme ---
export const light: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    /** Main background color */
    background: 'hsl(0 0% 100%)',
    /** Default text color */
    foreground: 'hsl(240 10% 3.9%)',
    /** Brand color for primary actions */
    primary: 'hsl(240 5.9% 10%)',
    /** Text on primary backgrounds */
    primaryForeground: 'hsl(0 0% 98%)',
    /** Subtle backgrounds such as surfaces */
    secondary: 'hsl(240 4.8% 95.9%)',
    /** Text on secondary backgrounds */
    secondaryForeground: 'hsl(240 5.9% 10%)',
    /** Muted backgrounds like separators */
    muted: 'hsl(240 4.8% 95.9%)',
    /** Text on muted elements */
    mutedForeground: 'hsl(240 3.8% 46.1%)',
    /** Accent color used sparingly */
    accent: 'hsl(240 4.8% 95.9%)',
    /** Danger and error color */
    destructive: 'hsl(0 72.2% 50.6%)',
    /** Text on destructive backgrounds */
    destructiveForeground: 'hsl(0 0% 98%)',
    /** Outline and border color */
    border: 'hsl(240 5.9% 90%)',
    /** Card background surfaces */
    card: 'hsl(0 0% 100%)',
    /** Input backgrounds */
    input: 'hsl(240 5.9% 90%)',
    /** Track color for unchecked switches */
    inputSurface: 'hsl(240 4.8% 95.9%)',
  },
};

// --- Color palette for the dark theme ---
export const dark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    /** Main background color */
    background: 'hsl(240 10% 3.9%)',
    /** Default text color */
    foreground: 'hsl(0 0% 98%)',
    /** Brand color for primary actions */
    primary: 'hsl(0 0% 98%)',
    /** Text on primary backgrounds */
    primaryForeground: 'hsl(240 5.9% 10%)',
    /** Subtle backgrounds such as surfaces */
    secondary: 'hsl(240 3.7% 15.9%)',
    /** Text on secondary backgrounds */
    secondaryForeground: 'hsl(0 0% 98%)',
    /** Muted backgrounds like separators */
    muted: 'hsl(240 3.7% 15.9%)',
    /** Text on muted elements */
    mutedForeground: 'hsl(240 5% 64.9%)',
    /** Accent color used sparingly */
    accent: 'hsl(240 3.7% 15.9%)',
    /** Danger and error color */
    destructive: 'hsl(0 62.8% 30.6%)',
    /** Text on destructive backgrounds */
    destructiveForeground: 'hsl(0 0% 98%)',
    /** Outline and border color */
    border: 'hsl(240 3.7% 15.9%)',
    /** Card background surfaces */
    card: 'hsl(240 10% 3.9%)',
    /** Input backgrounds */
    input: 'hsl(240 3.7% 15.9%)',
    /** Track color for unchecked switches */
    inputSurface: 'hsl(240 3.7% 15.9%)',
  },
};

export const themes = { light, dark } as const;

