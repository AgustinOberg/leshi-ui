import type { Theme } from '../theme.d';
import { fonts, shadows, sizes, radii, backdrop } from './common';

export const grapeDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: 'hsl(250.9091 18.6441% 11.5686%)',
    foreground: 'hsl(250.0000 36.0000% 90.1961%)',
    primary: 'hsl(263.0769 32.5000% 68.6275%)',
    primaryForeground: 'hsl(250.9091 18.6441% 11.5686%)',
    secondary: 'hsl(254.4828 14.8718% 38.2353%)',
    secondaryForeground: 'hsl(250.0000 36.0000% 90.1961%)',
    muted: 'hsl(254.1176 20.9877% 15.8824%)',
    mutedForeground: 'hsl(258.9474 10.3825% 64.1176%)',
    accent: 'hsl(271.7647 15.5963% 21.3725%)',
    destructive: 'hsl(0 68.6747% 67.4510%)',
    destructiveForeground: 'hsl(250.9091 18.6441% 11.5686%)',
    border: 'hsl(252 18.5185% 21.1765%)',
    card: 'hsl(251.2500 20% 15.6863%)',
    input: 'hsl(249.4737 19.5876% 19.0196%)',
    inputSurface: 'hsl(254.4828 14.8718% 38.2353%)',
  },
};
