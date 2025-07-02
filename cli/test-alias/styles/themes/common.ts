// --- Font families for each weight ---
// Use the default system font available in React Native
export const fonts = {
  thin: 'System',
  extralight: 'System',
  light: 'System',
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
  extrabold: 'System',
  black: 'System',
} as const;

// --- Shadow presets used across components ---
export const shadows = {
  xs: {
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: 'rgba(0,0,0,0.09)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 6,
  },
  xl: {
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  '2xl': {
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
  },
  '3xl': {
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 16,
  },
} as const;

// --- Sizing helpers ---
export const sizes = {
  fonts: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 64,
    '7xl': 72,
    '8xl': 96,
    '9xl': 128,
  },
  height: (n: number) => n * 4,
  width: (n: number) => n * 4,
  gap: (n: number) => n * 4,
  padding: (n: number) => n * 4,
} as const;

// --- Radii values used for rounded components ---
export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 14,
  '2xl': 20,
  full: 9999,
} as const;

// --- Modal backdrop configuration ---
export const backdrop = {
  color: 'rgba(0, 0, 0, 0.5)',
  opacity: 0.5,
} as const;
