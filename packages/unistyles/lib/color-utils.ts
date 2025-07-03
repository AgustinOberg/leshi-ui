/**
 * Color utility functions for React Native with Unistyles
 * Handles color transformations and opacity modifications for any color format
 */

/**
 * Parses various color formats and returns RGB values
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Remove any whitespace
  color = color.trim();

  // Handle hex colors (#fff, #ffffff)
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    
    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }
  }

  // Handle rgb() and rgba() colors
  const rgbMatch = color.match(/rgba?\((\d+),?\s*(\d+),?\s*(\d+)(?:,?\s*[\d.]+)?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  // Handle hsl() and hsla() colors
  const hslMatch = color.match(/hsla?\((\d+),?\s*(\d+)%,?\s*(\d+)%(?:,?\s*[\d.]+)?\)/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10);
    const s = parseInt(hslMatch[2], 10) / 100;
    const l = parseInt(hslMatch[3], 10) / 100;
    
    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    
    let r, g, b;
    if (h >= 0 && h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (h >= 60 && h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (h >= 120 && h < 180) {
      [r, g, b] = [0, c, x];
    } else if (h >= 180 && h < 240) {
      [r, g, b] = [0, x, c];
    } else if (h >= 240 && h < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }
    
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  // Handle named colors (basic set)
  const namedColors: Record<string, { r: number; g: number; b: number }> = {
    transparent: { r: 0, g: 0, b: 0 }, // Special case - will be handled separately
    black: { r: 0, g: 0, b: 0 },
    white: { r: 255, g: 255, b: 255 },
    red: { r: 255, g: 0, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    yellow: { r: 255, g: 255, b: 0 },
    cyan: { r: 0, g: 255, b: 255 },
    magenta: { r: 255, g: 0, b: 255 },
    gray: { r: 128, g: 128, b: 128 },
    grey: { r: 128, g: 128, b: 128 },
    orange: { r: 255, g: 165, b: 0 },
    purple: { r: 128, g: 0, b: 128 },
    brown: { r: 165, g: 42, b: 42 },
    pink: { r: 255, g: 192, b: 203 },
  };

  const lowerColor = color.toLowerCase();
  if (namedColors[lowerColor]) {
    return namedColors[lowerColor];
  }

  return null;
}

/**
 * Adds opacity to any color format supported by React Native
 * @param color - Any valid React Native color (hex, rgb, rgba, hsl, hsla, named)
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string with specified opacity
 */
export const withOpacity = (color: string, opacity: number = 1): string => {
  // Clamp opacity between 0 and 1
  opacity = Math.max(0, Math.min(1, opacity));

  // Handle special case for transparent
  if (color.toLowerCase() === 'transparent') {
    return 'rgba(0, 0, 0, 0)';
  }

  // Parse the color
  const parsed = parseColor(color);
  if (!parsed) {
    console.warn(`Unable to parse color: ${color}. Returning original color.`);
    return color;
  }

  return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${opacity})`;
};

/**
 * Creates a hex color with opacity (converts to RGBA)
 * @param hex - Hex color string (#fff or #ffffff)
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string
 */
export const hex2rgba = (hex: string, opacity: number = 1): string => {
  return withOpacity(hex, opacity);
};

/**
 * Common opacity values for consistent theming
 */
export const opacity = {
  disabled: 0.6,
  pressed: 0.8,
  muted: 0.5,
  subtle: 0.1,
  medium: 0.3,
  high: 0.7,
} as const;

/**
 * Transparent constant for true transparency
 */
export const transparent = 'transparent';

/**
 * Helper function to create theme-aware transparent colors
 * @param color - Base color from theme
 * @param level - Opacity level ('subtle' | 'medium' | 'muted' | 'high' | 'disabled' | 'pressed')
 * @returns RGBA color with specified opacity level
 */
export const withThemeOpacity = (
  color: string,
  level: keyof typeof opacity
): string => {
  return withOpacity(color, opacity[level]);
};

/**
 * Determines if a color is light or dark (useful for contrast)
 * @param color - Any valid React Native color
 * @returns true if the color is light, false if dark
 */
export const isLightColor = (color: string): boolean => {
  const parsed = parseColor(color);
  if (!parsed) return false;

  // Calculate relative luminance
  const { r, g, b } = parsed;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

/**
 * Gets contrast color (black or white) for optimal readability
 * @param backgroundColor - Background color to contrast against
 * @returns 'white' for dark backgrounds, 'black' for light backgrounds
 */
export const getContrastColor = (backgroundColor: string): 'black' | 'white' => {
  return isLightColor(backgroundColor) ? 'black' : 'white';
};