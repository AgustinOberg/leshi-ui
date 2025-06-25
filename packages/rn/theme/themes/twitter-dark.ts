import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii, backdrop } from "./common";

export const twitterDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: "#000000",
    foreground: "#e7e9ea",
    primary: "#1c9cf0",
    primaryForeground: "#ffffff",
    secondary: "#f0f3f4",
    secondaryForeground: "#0f1419",
    muted: "#181818",
    mutedForeground: "#72767a",
    accent: "#061622",
    destructive: "#f4212e",
    destructiveForeground: "#ffffff",
    border: "#242628",
    card: "#17181c",
    input: "#22303c",
    inputSurface: "#22303c",
  },
};
