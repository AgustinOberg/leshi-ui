import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii } from "./common";

export const supabaseDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    background: "#121212",
    foreground: "#e2e8f0",
    primary: "#006239",
    primaryForeground: "#dde8e3",
    secondary: "#242424",
    secondaryForeground: "#fafafa",
    muted: "#1f1f1f",
    mutedForeground: "#a2a2a2",
    accent: "#313131",
    destructive: "#541c15",
    destructiveForeground: "#ede9e8",
    border: "#292929",
    card: "#171717",
    input: "#242424",
    inputSurface: "#242424",
  },
};
