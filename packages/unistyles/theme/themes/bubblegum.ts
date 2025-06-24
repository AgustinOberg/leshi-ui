import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii } from "./common";

export const bubblegumLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
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

export const bubblegumDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    background: "hsl(280.8000 58.1395% 8.4314%)",
    foreground: "hsl(300 100% 85.0980%)",
    primary: "hsl(306.4865 100% 70.9804%)",
    primaryForeground: "hsl(300 65.5172% 5.6863%)",
    secondary: "hsl(288.5106 42.3423% 21.7647%)",
    secondaryForeground: "hsl(300 100% 85.0980%)",
    muted: "hsl(279 44.4444% 17.6471%)",
    mutedForeground: "hsl(300 52.8736% 65.8824%)",
    accent: "hsl(297.0968 50.0000% 24.3137%)",
    destructive: "hsl(338.2326 100.0000% 57.8431%)",
    destructiveForeground: "hsl(0 0% 97.6471%)",
    border: "hsl(281.4706 55.7377% 23.9216%)",
    card: "hsl(280 45.2055% 14.3137%)",
    input: "hsl(288.5106 42.3423% 21.7647%)",
    inputSurface: "hsl(279 44.4444% 17.6471%)",
  },
};
