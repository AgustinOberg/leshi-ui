import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii, backdrop } from "./common";

export const dark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    /** Main background color */
    background: "hsl(240 10% 3.9%)",
    /** Default text color */
    foreground: "hsl(0 0% 98%)",
    /** Brand color for primary actions */
    primary: "hsl(0 0% 98%)",
    /** Text on primary backgrounds */
    primaryForeground: "hsl(240 5.9% 10%)",
    /** Subtle backgrounds such as surfaces */
    secondary: "hsl(240 3.7% 15.9%)",
    /** Text on secondary backgrounds */
    secondaryForeground: "hsl(0 0% 98%)",
    /** Muted backgrounds like separators */
    muted: "hsl(240 3.7% 15.9%)",
    /** Text on muted elements */
    mutedForeground: "hsl(240 5% 64.9%)",
    /** Accent color used sparingly */
    accent: "hsl(240 3.7% 15.9%)",
    /** Danger and error color */
    destructive: "hsl(0 62.8% 30.6%)",
    /** Text on destructive backgrounds */
    destructiveForeground: "hsl(0 0% 98%)",
    /** Outline and border color */
    border: "hsl(240 3.7% 15.9%)",
    /** Card background surfaces */
    card: "hsl(240 10% 3.9%)",
    /** Input backgrounds */
    input: "hsl(240 3.7% 15.9%)",
    /** Track color for unchecked switches */
    inputSurface: "hsl(240 3.7% 15.9%)",
  },
};
