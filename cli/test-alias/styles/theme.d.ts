import { fonts, shadows, sizes, radii, backdrop } from './themes/common';

// Base types for theme structure - allows partial overrides
export type ThemeFonts = {
  thin: string;
  extralight: string;
  light: string;
  regular: string;
  medium: string;
  semibold: string;
  bold: string;
  extrabold: string;
  black: string;
};

export type ThemeShadows = {
  xs: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  md: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  lg: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  xl: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  '2xl': {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  '3xl': {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
};

export type ThemeSizes = {
  fonts: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
    '7xl': number;
    '8xl': number;
    '9xl': number;
  };
  height: (n: number) => number;
  width: (n: number) => number;
  gap: (n: number) => number;
  padding: (n: number) => number;
};

export type ThemeRadii = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  full: number;
};

export type ThemeBackdrop = {
  color: string;
  opacity: number;
};

export type ThemeColors = {
  /** Main background color */
  background: string;
  /** Default text color */
  foreground: string;
  /** Brand color for primary actions */
  primary: string;
  /** Text on primary backgrounds */
  primaryForeground: string;
  /** Subtle backgrounds such as surfaces */
  secondary: string;
  /** Text on secondary backgrounds */
  secondaryForeground: string;
  /** Muted backgrounds like separators */
  muted: string;
  /** Text on muted elements */
  mutedForeground: string;
  /** Accent color used sparingly */
  accent: string;
  /** Danger and error color */
  destructive: string;
  /** Text on destructive backgrounds */
  destructiveForeground: string;
  /** Outline and border color */
  border: string;
  /** Card background surfaces */
  card: string;
  /** Input backgrounds */
  input: string;
  /** Track color for unchecked switches */
  inputSurface: string;
};

// Main theme type
export type Theme = {
  fonts: ThemeFonts;
  shadows: ThemeShadows;
  sizes: ThemeSizes;
  radii: ThemeRadii;
  backdrop: ThemeBackdrop;
  colors: ThemeColors;
};

// Partial theme types for custom themes - allows overriding only what you want
export type PartialTheme = {
  fonts?: Partial<ThemeFonts>;
  shadows?: Partial<ThemeShadows>;
  sizes?: {
    fonts?: Partial<ThemeSizes['fonts']>;
    height?: ThemeSizes['height'];
    width?: ThemeSizes['width'];
    gap?: ThemeSizes['gap'];
    padding?: ThemeSizes['padding'];
  };
  radii?: Partial<ThemeRadii>;
  backdrop?: Partial<ThemeBackdrop>;
  colors: ThemeColors; // Colors are required for themes
};

// Helper to merge themes
export type CreateTheme = (overrides: PartialTheme) => Theme;
