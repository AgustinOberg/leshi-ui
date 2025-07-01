import type { Theme } from '../theme';
import { fonts, shadows, sizes, radii, backdrop } from './common';

export const retroLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: 'hsl(0 0% 80%)',
    foreground: 'hsl(0 0% 12.1569%)',
    primary: 'hsl(0 73.4597% 41.3725%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(82 38.9610% 30.1961%)',
    secondaryForeground: 'hsl(0 0% 100%)',
    muted: 'hsl(0 0% 72.1569%)',
    mutedForeground: 'hsl(0 0% 29.0196%)',
    accent: 'hsl(207.2727 44% 49.0196%)',
    destructive: 'hsl(26.1176 100% 50%)',
    destructiveForeground: 'hsl(0 0% 0%)',
    border: 'hsl(0 0% 31.3725%)',
    card: 'hsl(0 0% 69.0196%)',
    input: 'hsl(0 0% 31.3725%)',
    inputSurface: 'hsl(0 0% 72.1569%)',
  },
};
