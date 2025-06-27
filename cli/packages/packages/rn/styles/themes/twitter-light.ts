import type { Theme } from "../theme.d";
import { fonts, shadows, sizes, radii, backdrop } from "./common";

export const twitterLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: "#ffffff",
    foreground: "#0f1419",
    primary: "#1e9df1",
    primaryForeground: "#ffffff",
    secondary: "#0f1419",
    secondaryForeground: "#ffffff",
    muted: "#E5E5E6",
    mutedForeground: "#0f1419",
    accent: "#E3ECF6",
    destructive: "#f4212e",
    destructiveForeground: "#ffffff",
    border: "#e1eaef",
    card: "#f7f8f8",
    input: "#f7f9fa",
    inputSurface: "#f7f9fa",
  },
};
