import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii } from "./common";

export const retroDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    background: "hsl(0 0% 10.1961%)",
    foreground: "hsl(0 0% 87.8431%)",
    primary: "hsl(1.3636 77.1930% 55.2941%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(92.0388 47.9070% 42.1569%)",
    secondaryForeground: "hsl(0 0% 0%)",
    muted: "hsl(0 0% 14.5098%)",
    mutedForeground: "hsl(0 0% 62.7451%)",
    accent: "hsl(206.7123 89.0244% 67.8431%)",
    destructive: "hsl(37.6471 100% 50%)",
    destructiveForeground: "hsl(0 0% 0%)",
    border: "hsl(0 0% 29.0196%)",
    card: "hsl(0 0% 16.4706%)",
    input: "hsl(0 0% 29.0196%)",
    inputSurface: "hsl(0 0% 14.5098%)",
  },
};
