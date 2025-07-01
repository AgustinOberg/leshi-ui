import type { Theme } from '../theme.d';
import { fonts, shadows, sizes, radii, backdrop } from './common';

export const peachDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: 'hsl(201.4286 43.7500% 12.5490%)',
    foreground: 'hsl(333.7500 40.0000% 92.1569%)',
    primary: 'hsl(42.1429 91.3043% 81.9608%)',
    primaryForeground: 'hsl(201.4286 43.7500% 12.5490%)',
    secondary: 'hsl(346.3636 55.0000% 76.4706%)',
    secondaryForeground: 'hsl(201.4286 43.7500% 12.5490%)',
    muted: 'hsl(214.2857 8.8608% 15.4902%)',
    mutedForeground: 'hsl(346.3636 55.0000% 76.4706%)',
    accent: 'hsl(338.4000 39.6825% 62.9412%)',
    destructive: 'hsl(328.4211 70.3704% 62.9412%)',
    destructiveForeground: 'hsl(201.4286 43.7500% 12.5490%)',
    border: 'hsl(206.1538 28.0576% 27.2549%)',
    card: 'hsl(201.4286 33.3333% 16.4706%)',
    input: 'hsl(200.6897 31.1828% 18.2353%)',
    inputSurface: 'hsl(346.3636 55.0000% 76.4706%)',
  },
};
