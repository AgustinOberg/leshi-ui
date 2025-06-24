import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii } from "./common";

export const retroLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    background: "hsl(0 0% 80%)",
    foreground: "hsl(0 0% 12.1569%)",
    primary: "hsl(0 73.4597% 41.3725%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(82 38.9610% 30.1961%)",
    secondaryForeground: "hsl(0 0% 100%)",
    muted: "hsl(0 0% 72.1569%)",
    mutedForeground: "hsl(0 0% 29.0196%)",
    accent: "hsl(207.2727 44% 49.0196%)",
    destructive: "hsl(26.1176 100% 50%)",
    destructiveForeground: "hsl(0 0% 0%)",
    border: "hsl(0 0% 31.3725%)",
    card: "hsl(0 0% 69.0196%)",
    input: "hsl(0 0% 31.3725%)",
    inputSurface: "hsl(0 0% 72.1569%)",
  },
};

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
