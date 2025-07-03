import { fonts, shadows, sizes, radii, backdrop } from './themes/common';

export type Theme = {
  fonts: typeof fonts;
  shadows: typeof shadows;
  sizes: typeof sizes;
  radii: typeof radii;
  backdrop: typeof backdrop;
  colors: {
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
};