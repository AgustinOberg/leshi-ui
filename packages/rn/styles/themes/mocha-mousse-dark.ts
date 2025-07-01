import type { Theme } from '../theme.d';
import { fonts, shadows, sizes, radii, backdrop } from './common';

export const mochaMousseDark: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: '#2d2521',
    foreground: '#F1F0E5',
    primary: '#C39E88',
    primaryForeground: '#2d2521',
    secondary: '#8A655A',
    secondaryForeground: '#F1F0E5',
    muted: '#56453F',
    mutedForeground: '#c5aa9b',
    accent: '#BAAB92',
    destructive: '#E57373',
    destructiveForeground: '#2d2521',
    border: '#56453F',
    card: '#3c332e',
    input: '#56453F',
    inputSurface: '#56453F',
  },
};
