import type { Theme } from '../theme.d';
import { fonts, shadows, sizes, radii, backdrop } from './common';

export const monoLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(0 0% 3.9216%)',
    primary: 'hsl(0 0% 45.0980%)',
    primaryForeground: 'hsl(0 0% 98.0392%)',
    secondary: 'hsl(0 0% 96.0784%)',
    secondaryForeground: 'hsl(0 0% 9.0196%)',
    muted: 'hsl(0 0% 96.0784%)',
    mutedForeground: 'hsl(0 0% 44.3137%)',
    accent: 'hsl(0 0% 96.0784%)',
    destructive: 'hsl(357.1429 100% 45.2941%)',
    destructiveForeground: 'hsl(0 0% 96.0784%)',
    border: 'hsl(0 0% 89.8039%)',
    card: 'hsl(0 0% 100%)',
    input: 'hsl(0 0% 89.8039%)',
    inputSurface: 'hsl(0 0% 96.0784%)',
  },
};
