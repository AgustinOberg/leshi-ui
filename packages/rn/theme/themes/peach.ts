import type { Theme } from "../theme";
import { fonts, shadows, sizes, radii } from "./common";

export const peachLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
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

export const peachDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  colors: {
    background: "hsl(201.4286 43.7500% 12.5490%)",
    foreground: "hsl(333.7500 40.0000% 92.1569%)",
    primary: "hsl(42.1429 91.3043% 81.9608%)",
    primaryForeground: "hsl(201.4286 43.7500% 12.5490%)",
    secondary: "hsl(346.3636 55.0000% 76.4706%)",
    secondaryForeground: "hsl(201.4286 43.7500% 12.5490%)",
    muted: "hsl(214.2857 8.8608% 15.4902%)",
    mutedForeground: "hsl(346.3636 55.0000% 76.4706%)",
    accent: "hsl(338.4000 39.6825% 62.9412%)",
    destructive: "hsl(328.4211 70.3704% 62.9412%)",
    destructiveForeground: "hsl(201.4286 43.7500% 12.5490%)",
    border: "hsl(206.1538 28.0576% 27.2549%)",
    card: "hsl(201.4286 33.3333% 16.4706%)",
    input: "hsl(200.6897 31.1828% 18.2353%)",
    inputSurface: "hsl(346.3636 55.0000% 76.4706%)",
  },
};
