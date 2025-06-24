import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii } from "./common";

export const oceanLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(210 25% 7.8431%)",
    primary: "hsl(203.8863 88.2845% 53.1373%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(210 25% 7.8431%)",
    secondaryForeground: "hsl(0 0% 100%)",
    muted: "hsl(240 1.9608% 90%)",
    mutedForeground: "hsl(210 25% 7.8431%)",
    accent: "hsl(211.5789 51.3514% 92.7451%)",
    destructive: "hsl(356.3033 90.5579% 54.3137%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(201.4286 30.4348% 90.9804%)",
    card: "hsl(180 6.6667% 97.0588%)",
    input: "hsl(200 23.0769% 97.4510%)",
    inputSurface: "hsl(240 1.9608% 90%)",
  },
};
