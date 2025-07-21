/**
 * Color utility functions for React Native
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
      hex = hex
        .split('')
        .map((char) => char + char)
        .join('');
    }

    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }
  }

  // Handle rgb() and rgba() colors
  const rgbMatch = color.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/,
  );
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  // Handle hsl() and hsla() colors - Support both comma and space-separated formats
  // Modern CSS format: hsl(158 64.4% 51.6%) or hsla(158 64.4% 51.6% / 0.5)
  // Legacy format: hsl(158, 64.4%, 51.6%) or hsla(158, 64.4%, 51.6%, 0.5)
  const hslSpaceMatch = color.match(
    /hsla?\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%(?:\s*\/\s*([\d.]+))?\s*\)/,
  );
  const hslCommaMatch = color.match(
    /hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)/,
  );

  const hslMatch = hslSpaceMatch || hslCommaMatch;
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]) / 100;
    const l = parseFloat(hslMatch[3]) / 100;

    // Convert HSL to RGB using improved algorithm
    const hueToRgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      // Achromatic (gray)
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const hNormalized = h / 360;

      r = hueToRgb(p, q, hNormalized + 1 / 3);
      g = hueToRgb(p, q, hNormalized);
      b = hueToRgb(p, q, hNormalized - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
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
 * Extracts alpha value from color string if present
 */
function extractAlpha(color: string): number {
  color = color.trim();

  // Extract alpha from rgba()
  const rgbaMatch = color.match(
    /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/,
  );
  if (rgbaMatch) {
    return parseFloat(rgbaMatch[1]);
  }

  // Extract alpha from hsla() - Support both formats
  const hslaSpaceMatch = color.match(
    /hsla\(\s*[\d.]+\s+[\d.]+%\s+[\d.]+%\s*\/\s*([\d.]+)\s*\)/,
  );
  const hslaCommaMatch = color.match(
    /hsla\(\s*[\d.]+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*,\s*([\d.]+)\s*\)/,
  );

  if (hslaSpaceMatch) {
    return parseFloat(hslaSpaceMatch[1]);
  }
  if (hslaCommaMatch) {
    return parseFloat(hslaCommaMatch[1]);
  }

  return 1; // Default alpha
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
  level: keyof typeof opacity,
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
export const getContrastColor = (
  backgroundColor: string,
): 'black' | 'white' => {
  return isLightColor(backgroundColor) ? 'black' : 'white';
};

/**
 * Converts RGB to HSL
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns HSL object with h (0-360), s (0-100), l (0-100)
 */
export const rgbToHsl = (
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const sum = max + min;

  const l = sum / 2;

  if (diff === 0) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const s = l > 0.5 ? diff / (2 - sum) : diff / sum;

  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / diff + 2) / 6;
      break;
    case b:
      h = ((r - g) / diff + 4) / 6;
      break;
    default:
      h = 0;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

/**
 * Converts any color to HSL string
 * @param color - Any valid React Native color
 * @returns HSL color string or null if parsing fails
 */
export const toHsl = (color: string): string | null => {
  const parsed = parseColor(color);
  if (!parsed) return null;

  const { h, s, l } = rgbToHsl(parsed.r, parsed.g, parsed.b);
  return `hsl(${h}, ${s}%, ${l}%)`;
};
