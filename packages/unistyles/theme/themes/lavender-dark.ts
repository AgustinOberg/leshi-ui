import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii } from "./common";

export const lavenderDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    background: "hsl(24 9.8039% 10%)",
    foreground: "hsl(226.4516 100% 93.9216%)",
    primary: "hsl(255.9036 95.4023% 82.9412%)",
    primaryForeground: "hsl(24 9.8039% 10%)",
    secondary: "hsl(272.5000 19.3548% 24.3137%)",
    secondaryForeground: "hsl(216.0000 12.1951% 83.9216%)",
    muted: "hsl(270 17.7778% 17.6471%)",
    mutedForeground: "hsl(217.8947 10.6145% 64.9020%)",
    accent: "hsl(266.8966 19.2053% 29.6078%)",
    destructive: "hsl(0 93.5484% 81.7647%)",
    destructiveForeground: "hsl(24 9.8039% 10%)",
    border: "hsl(272.5000 19.3548% 24.3137%)",
    card: "hsl(270 17.7778% 17.6471%)",
    input: "hsl(272.5000 19.3548% 24.3137%)",
    inputSurface: "hsl(272.5000 19.3548% 24.3137%)",
  },
};
