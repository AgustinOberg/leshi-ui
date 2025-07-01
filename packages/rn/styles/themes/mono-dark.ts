import type { Theme } from '../theme.d';
import { fonts, shadows, sizes, radii, backdrop } from './common';

export const monoDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: 'hsl(0 0% 3.9216%)',
    foreground: 'hsl(0 0% 98.0392%)',
    primary: 'hsl(0 0% 45.0980%)',
    primaryForeground: 'hsl(0 0% 98.0392%)',
    secondary: 'hsl(0 0% 14.9020%)',
    secondaryForeground: 'hsl(0 0% 98.0392%)',
    muted: 'hsl(0 0% 14.9020%)',
    mutedForeground: 'hsl(0 0% 63.1373%)',
    accent: 'hsl(0 0% 25.0980%)',
    destructive: 'hsl(358.8387 100% 69.6078%)',
    destructiveForeground: 'hsl(0 0% 14.9020%)',
    border: 'hsl(0 0% 21.9608%)',
    card: 'hsl(0 0% 9.8039%)',
    input: 'hsl(0 0% 32.1569%)',
    inputSurface: 'hsl(0 0% 14.9020%)',
  },
};
