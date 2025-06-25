import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii, backdrop } from "./common";

export const spotify: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: "hsl(0 0% 0%)",
    foreground: "hsl(0 0% 100%)",
    primary: "hsl(141 73% 45%)",
    primaryForeground: "hsl(0 0% 0%)",

    secondary: "hsl(0 0% 12%)",
    secondaryForeground: "hsl(0 0% 100%)",

    muted: "hsl(0 0% 16%)",
    mutedForeground: "hsl(0 0% 60%)",

    accent: "hsl(300 100% 70%)",

    destructive: "hsl(0 80% 60%)",
    destructiveForeground: "hsl(0 0% 100%)",

    border: "hsl(0 0% 20%)",
    card: "hsl(0 0% 10%)",

    input: "hsl(0 0% 12%)",
    inputSurface: "hsl(0 0% 20%)",
  },
};
