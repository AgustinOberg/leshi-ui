import type { Theme } from '../theme.d';
import { fonts, shadows, sizes, radii, backdrop } from './common';

export const mochaMousseLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: '#F1F0E5',
    foreground: '#56453F',
    primary: '#A37764',
    primaryForeground: '#FFFFFF',
    secondary: '#BAAB92',
    secondaryForeground: '#ffffff',
    muted: '#E4C7B8',
    mutedForeground: '#8A655A',
    accent: '#E4C7B8',
    destructive: '#1f1a17',
    destructiveForeground: '#FFFFFF',
    border: '#BAAB92',
    card: '#F1F0E5',
    input: '#BAAB92',
    inputSurface: '#BAAB92',
  },
};
