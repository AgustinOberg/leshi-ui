import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii } from "./common";

export const supabaseLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    background: "#fcfcfc",
    foreground: "#171717",
    primary: "#72e3ad",
    primaryForeground: "#1e2723",
    secondary: "#fdfdfd",
    secondaryForeground: "#171717",
    muted: "#ededed",
    mutedForeground: "#202020",
    accent: "#ededed",
    destructive: "#ca3214",
    destructiveForeground: "#fffcfc",
    border: "#dfdfdf",
    card: "#fcfcfc",
    input: "#f6f6f6",
    inputSurface: "#f6f6f6",
  },
};
