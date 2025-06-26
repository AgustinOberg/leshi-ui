import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii, backdrop } from "./common";

export const light: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    /** Main background color */
    background: "hsl(0 0% 100%)",
    /** Default text color */
    foreground: "hsl(240 10% 3.9%)",
    /** Brand color for primary actions */
    primary: "hsl(240 5.9% 10%)",
    /** Text on primary backgrounds */
    primaryForeground: "hsl(0 0% 98%)",
    /** Subtle backgrounds such as surfaces */
    secondary: "hsl(240 4.8% 95.9%)",
    /** Text on secondary backgrounds */
    secondaryForeground: "hsl(240 5.9% 10%)",
    /** Muted backgrounds like separators */
    muted: "hsl(240 4.8% 95.9%)",
    /** Text on muted elements */
    mutedForeground: "hsl(240 3.8% 46.1%)",
    /** Accent color used sparingly */
    accent: "hsl(240 4.8% 95.9%)",
    /** Danger and error color */
    destructive: "hsl(0 72.2% 50.6%)",
    /** Text on destructive backgrounds */
    destructiveForeground: "hsl(0 0% 98%)",
    /** Outline and border color */
    border: "hsl(240 5.9% 90%)",
    /** Card background surfaces */
    card: "hsl(0 0% 100%)",
    /** Input backgrounds */
    input: "transparent",
    /** Track color for unchecked switches */
    inputSurface: "hsl(240 4.8% 95.9%)",
  },
};
