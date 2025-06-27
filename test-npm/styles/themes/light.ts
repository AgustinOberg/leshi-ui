import type { Theme } from "../theme.d";
import { fonts, shadows, sizes, radii, backdrop } from "./common";

export const light: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(240 10% 3.9%)",
    primary: "hsl(240 5.9% 10%)",
    primaryForeground: "hsl(0 0% 98%)",
    secondary: "hsl(240 4.8% 95.9%)",
    secondaryForeground: "hsl(240 5.9% 10%)",
    muted: "hsl(240 4.8% 95.9%)",
    mutedForeground: "hsl(240 3.8% 46.1%)",
    accent: "hsl(240 4.8% 95.9%)",
    destructive: "hsl(0 72.2% 50.6%)",
    destructiveForeground: "hsl(0 0% 98%)",
    border: "hsl(240 5.9% 90%)",
    card: "hsl(0 0% 100%)",
    input: "transparent",
    inputSurface: "hsl(240 4.8% 95.9%)",
  },
};
