import type { Theme } from "../theme.d";
import { fonts, shadows, sizes, radii, backdrop } from "./common";

export const bubblegumLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: "hsl(328 100% 97.0588%)",
    foreground: "hsl(326.2810 71.5976% 33.1373%)",
    primary: "hsl(328.9286 94.9153% 46.2745%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(300 100.0000% 91.9608%)",
    secondaryForeground: "hsl(326.2810 71.5976% 33.1373%)",
    muted: "hsl(327.8571 100% 94.5098%)",
    mutedForeground: "hsl(329.0476 50.0000% 50.5882%)",
    accent: "hsl(327.0968 100% 87.8431%)",
    destructive: "hsl(340.7843 62.4490% 51.9608%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(326.7857 100.0000% 89.0196%)",
    card: "hsl(322.5000 100.0000% 98.4314%)",
    input: "hsl(300 100.0000% 91.9608%)",
    inputSurface: "hsl(327.8571 100% 94.5098%)",
  },
};
