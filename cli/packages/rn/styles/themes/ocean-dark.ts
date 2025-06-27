import type { Theme } from "../theme.d";
import { fonts, shadows, sizes, radii, backdrop } from "./common";

export const oceanDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: "hsl(0 0% 0%)",
    foreground: "hsl(200 6.6667% 91.1765%)",
    primary: "hsl(203.7736 87.6033% 52.5490%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(195.0000 15.3846% 94.9020%)",
    secondaryForeground: "hsl(210 25% 7.8431%)",
    muted: "hsl(0 0% 9.4118%)",
    mutedForeground: "hsl(210 3.3898% 46.2745%)",
    accent: "hsl(205.7143 70% 7.8431%)",
    destructive: "hsl(356.3033 90.5579% 54.3137%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(210 5.2632% 14.9020%)",
    card: "hsl(228 9.8039% 10%)",
    input: "hsl(207.6923 27.6596% 18.4314%)",
    inputSurface: "hsl(0 0% 9.4118%)",
  },
};
