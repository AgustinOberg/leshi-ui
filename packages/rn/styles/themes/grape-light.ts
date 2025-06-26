import type { Theme } from "../theme.d";
import { fonts, shadows, sizes, radii, backdrop } from "./common";

export const grapeLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
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
