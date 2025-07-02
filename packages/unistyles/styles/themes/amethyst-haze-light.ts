import type { Theme } from '../theme';
import { fonts, shadows, sizes, radii, backdrop } from './common';

export const amethystHazeLight: Theme = {
  fonts,
  shadows,
  sizes,
  radii,
  backdrop,
  colors: {
    background: '#f8f7fa',
    foreground: '#3d3c4f',
    primary: '#8a79ab',
    primaryForeground: '#f8f7fa',
    secondary: '#dfd9ec',
    secondaryForeground: '#3d3c4f',
    muted: '#dcd9e3',
    mutedForeground: '#6b6880',
    accent: '#e6a5b8',
    destructive: '#d95c5c',
    destructiveForeground: '#f8f7fa',
    border: '#cec9d9',
    card: '#ffffff',
    input: '#eae7f0',
    inputSurface: '#eae7f0',
  },
};
