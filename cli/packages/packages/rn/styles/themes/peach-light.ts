import type { Theme } from "../theme.d";
import { fonts, shadows, sizes, radii, backdrop } from "./common";

export const peachLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: "hsl(330 47.0588% 93.3333%)",
    foreground: "hsl(0 0% 35.6863%)",
    primary: "hsl(325.5814 57.8475% 56.2745%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(181.6901 43.5583% 68.0392%)",
    secondaryForeground: "hsl(0 0% 20%)",
    muted: "hsl(190.5263 58.7629% 80.9804%)",
    mutedForeground: "hsl(0 0% 47.8431%)",
    accent: "hsl(42.1429 91.3043% 81.9608%)",
    destructive: "hsl(359.5652 92.0000% 70.5882%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(325.5814 57.8475% 56.2745%)",
    card: "hsl(41.5385 92.8571% 89.0196%)",
    input: "hsl(0 0% 89.4118%)",
    inputSurface: "hsl(181.6901 43.5583% 68.0392%)",
  },
};
