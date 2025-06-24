import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii } from "./common";

export const grapeLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    background: "hsl(260 23.0769% 97.4510%)",
    foreground: "hsl(243.1579 13.6691% 27.2549%)",
    primary: "hsl(260.4000 22.9358% 57.2549%)",
    primaryForeground: "hsl(260 23.0769% 97.4510%)",
    secondary: "hsl(258.9474 33.3333% 88.8235%)",
    secondaryForeground: "hsl(243.1579 13.6691% 27.2549%)",
    muted: "hsl(258.0000 15.1515% 87.0588%)",
    mutedForeground: "hsl(247.5000 10.3448% 45.4902%)",
    accent: "hsl(342.4615 56.5217% 77.4510%)",
    destructive: "hsl(0 62.1891% 60.5882%)",
    destructiveForeground: "hsl(260 23.0769% 97.4510%)",
    border: "hsl(258.7500 17.3913% 81.9608%)",
    card: "hsl(0 0% 100%)",
    input: "hsl(260.0000 23.0769% 92.3529%)",
    inputSurface: "hsl(258.9474 33.3333% 88.8235%)",
  },
};

export const grapeDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    background: "hsl(250.9091 18.6441% 11.5686%)",
    foreground: "hsl(250.0000 36.0000% 90.1961%)",
    primary: "hsl(263.0769 32.5000% 68.6275%)",
    primaryForeground: "hsl(250.9091 18.6441% 11.5686%)",
    secondary: "hsl(254.4828 14.8718% 38.2353%)",
    secondaryForeground: "hsl(250.0000 36.0000% 90.1961%)",
    muted: "hsl(254.1176 20.9877% 15.8824%)",
    mutedForeground: "hsl(258.9474 10.3825% 64.1176%)",
    accent: "hsl(271.7647 15.5963% 21.3725%)",
    destructive: "hsl(0 68.6747% 67.4510%)",
    destructiveForeground: "hsl(250.9091 18.6441% 11.5686%)",
    border: "hsl(252 18.5185% 21.1765%)",
    card: "hsl(251.2500 20% 15.6863%)",
    input: "hsl(249.4737 19.5876% 19.0196%)",
    inputSurface: "hsl(254.4828 14.8718% 38.2353%)",
  },
};
