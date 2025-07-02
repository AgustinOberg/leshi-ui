import type { Theme } from '../theme';
import { fonts, shadows, sizes, radii, backdrop } from './common';

export const bubblegumDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: 'hsl(280.8000 58.1395% 8.4314%)',
    foreground: 'hsl(300 100% 85.0980%)',
    primary: 'hsl(306.4865 100% 70.9804%)',
    primaryForeground: 'hsl(300 65.5172% 5.6863%)',
    secondary: 'hsl(288.5106 42.3423% 21.7647%)',
    secondaryForeground: 'hsl(300 100% 85.0980%)',
    muted: 'hsl(279 44.4444% 17.6471%)',
    mutedForeground: 'hsl(300 52.8736% 65.8824%)',
    accent: 'hsl(297.0968 50.0000% 24.3137%)',
    destructive: 'hsl(338.2326 100.0000% 57.8431%)',
    destructiveForeground: 'hsl(0 0% 97.6471%)',
    border: 'hsl(281.4706 55.7377% 23.9216%)',
    card: 'hsl(280 45.2055% 14.3137%)',
    input: 'hsl(288.5106 42.3423% 21.7647%)',
    inputSurface: 'hsl(279 44.4444% 17.6471%)',
  },
};
