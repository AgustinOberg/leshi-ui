import { useThemeContext } from './context';
import { fonts, shadows, sizes, radii, backdrop } from './themes/common';

// Re-export Theme types for convenience
export type { Theme, PartialTheme, ThemeColors, ThemeRadii, ThemeSizes } from './theme.d';

export const useTheme = () => useThemeContext().theme;
export const useThemeName = () => ({
  themeName: useThemeContext().themeName,
  setThemeName: useThemeContext().setThemeName,
});

export const useThemeMode = () => ({
  mode: useThemeContext().mode,
  setMode: useThemeContext().setMode,
});

// Helper function to create custom themes with partial overrides
export const createTheme = (overrides: import('./theme.d').PartialTheme): import('./theme.d').Theme => {
  const baseTheme = {
    fonts,
    shadows,
    sizes,
    radii,
    backdrop,
    colors: overrides.colors, // Colors are required
  };

  return {
    fonts: { ...baseTheme.fonts, ...overrides.fonts },
    shadows: { ...baseTheme.shadows, ...overrides.shadows },
    sizes: {
      fonts: { ...baseTheme.sizes.fonts, ...overrides.sizes?.fonts },
      height: overrides.sizes?.height || baseTheme.sizes.height,
      width: overrides.sizes?.width || baseTheme.sizes.width,
      gap: overrides.sizes?.gap || baseTheme.sizes.gap,
      padding: overrides.sizes?.padding || baseTheme.sizes.padding,
    },
    radii: { ...baseTheme.radii, ...overrides.radii },
    backdrop: { ...baseTheme.backdrop, ...overrides.backdrop },
    colors: overrides.colors,
  };
};
