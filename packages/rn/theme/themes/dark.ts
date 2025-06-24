import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii } from "./common";

export const dark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    background: "hsl(240 10% 3.9%)",
    foreground: "hsl(0 0% 98%)",
    primary: "hsl(0 0% 98%)",
    primaryForeground: "hsl(240 5.9% 10%)",
    secondary: "hsl(240 3.7% 15.9%)",
    secondaryForeground: "hsl(0 0% 98%)",
    muted: "hsl(240 3.7% 15.9%)",
    mutedForeground: "hsl(240 5% 64.9%)",
    accent: "hsl(240 3.7% 15.9%)",
    destructive: "hsl(0 62.8% 30.6%)",
    destructiveForeground: "hsl(0 0% 98%)",
    border: "hsl(240 3.7% 15.9%)",
    card: "hsl(240 10% 3.9%)",
    input: "hsl(240 3.7% 15.9%)",
    inputSurface: "hsl(240 3.7% 15.9%)",
  },
};
