import type { Theme } from '../theme';
import { fonts, shadows, sizes, radii, backdrop } from './common';

export const lavenderLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: 'hsl(280.0000 33.3333% 96.4706%)',
    foreground: 'hsl(216.9231 19.1176% 26.6667%)',
    primary: 'hsl(255.1351 91.7355% 76.2745%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(267.5676 90.2439% 91.9608%)',
    secondaryForeground: 'hsl(215 13.7931% 34.1176%)',
    muted: 'hsl(268.6957 100.0000% 95.4902%)',
    mutedForeground: 'hsl(220 8.9362% 46.0784%)',
    accent: 'hsl(292.5000 44.4444% 92.9412%)',
    destructive: 'hsl(0 93.5484% 81.7647%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(267.5676 90.2439% 91.9608%)',
    card: 'hsl(0 0% 100%)',
    input: 'hsl(267.5676 90.2439% 91.9608%)',
    inputSurface: 'hsl(267.5676 90.2439% 91.9608%)',
  },
};
