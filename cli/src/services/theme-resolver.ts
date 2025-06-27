import { DependencyResolutionError } from '../errors/index.js';

// Available themes registry
const AVAILABLE_THEMES: Record<string, {
  name: string;
  type: 'light' | 'dark';
  description: string;
  packageType: 'rn' | 'unistyles';
  filename: string;
}> = {
  // Light themes
  'light': {
    name: 'light',
    type: 'light',
    description: 'Default light theme with clean design',
    packageType: 'rn',
    filename: 'light.ts'
  },
  'grape-light': {
    name: 'grape-light', 
    type: 'light',
    description: 'Light theme with grape purple accents',
    packageType: 'rn',
    filename: 'grape-light.ts'
  },
  'peach-light': {
    name: 'peach-light',
    type: 'light', 
    description: 'Light theme with warm peach tones',
    packageType: 'rn',
    filename: 'peach-light.ts'
  },
  'retro-light': {
    name: 'retro-light',
    type: 'light',
    description: 'Light theme with retro aesthetic',
    packageType: 'rn', 
    filename: 'retro-light.ts'
  },
  'mono-light': {
    name: 'mono-light',
    type: 'light',
    description: 'Minimalist monochrome light theme',
    packageType: 'rn',
    filename: 'mono-light.ts'
  },
  'lavender-light': {
    name: 'lavender-light',
    type: 'light',
    description: 'Light theme with soft lavender hues',
    packageType: 'rn',
    filename: 'lavender-light.ts'
  },
  'ocean-light': {
    name: 'ocean-light',
    type: 'light',
    description: 'Light theme inspired by ocean blues',
    packageType: 'rn',
    filename: 'ocean-light.ts'
  },
  'bubblegum-light': {
    name: 'bubblegum-light',
    type: 'light',
    description: 'Light theme with playful bubblegum colors',
    packageType: 'rn',
    filename: 'bubblegum-light.ts'
  },
  't3-chat-light': {
    name: 't3-chat-light',
    type: 'light',
    description: 'Light theme optimized for chat interfaces',
    packageType: 'rn',
    filename: 't3-chat-light.ts'
  },
  'twitter-light': {
    name: 'twitter-light',
    type: 'light',
    description: 'Light theme inspired by Twitter design',
    packageType: 'rn',
    filename: 'twitter-light.ts'
  },
  'mocha-mousse-light': {
    name: 'mocha-mousse-light',
    type: 'light',
    description: 'Light theme with warm coffee tones',
    packageType: 'rn',
    filename: 'mocha-mousse-light.ts'
  },
  'amethyst-haze-light': {
    name: 'amethyst-haze-light',
    type: 'light',
    description: 'Light theme with mystical amethyst colors',
    packageType: 'rn',
    filename: 'amethyst-haze-light.ts'
  },
  'supabase-light': {
    name: 'supabase-light',
    type: 'light',
    description: 'Light theme inspired by Supabase brand',
    packageType: 'rn',
    filename: 'supabase-light.ts'
  },

  // Dark themes
  'dark': {
    name: 'dark',
    type: 'dark',
    description: 'Default dark theme with elegant contrast',
    packageType: 'rn',
    filename: 'dark.ts'
  },
  'grape-dark': {
    name: 'grape-dark',
    type: 'dark',
    description: 'Dark theme with grape purple accents',
    packageType: 'rn',
    filename: 'grape-dark.ts'
  },
  'peach-dark': {
    name: 'peach-dark',
    type: 'dark',
    description: 'Dark theme with warm peach highlights',
    packageType: 'rn',
    filename: 'peach-dark.ts'
  },
  'retro-dark': {
    name: 'retro-dark',
    type: 'dark',
    description: 'Dark theme with retro neon vibes',
    packageType: 'rn',
    filename: 'retro-dark.ts'
  },
  'mono-dark': {
    name: 'mono-dark',
    type: 'dark',
    description: 'Minimalist monochrome dark theme',
    packageType: 'rn',
    filename: 'mono-dark.ts'
  },
  'lavender-dark': {
    name: 'lavender-dark',
    type: 'dark',
    description: 'Dark theme with deep lavender accents',
    packageType: 'rn',
    filename: 'lavender-dark.ts'
  },
  'ocean-dark': {
    name: 'ocean-dark',
    type: 'dark',
    description: 'Dark theme with deep ocean blues',
    packageType: 'rn',
    filename: 'ocean-dark.ts'
  },
  'bubblegum-dark': {
    name: 'bubblegum-dark',
    type: 'dark',
    description: 'Dark theme with vibrant bubblegum accents',
    packageType: 'rn',
    filename: 'bubblegum-dark.ts'
  },
  't3-chat-dark': {
    name: 't3-chat-dark',
    type: 'dark',
    description: 'Dark theme optimized for chat interfaces',
    packageType: 'rn',
    filename: 't3-chat-dark.ts'
  },
  'twitter-dark': {
    name: 'twitter-dark',
    type: 'dark',
    description: 'Dark theme inspired by Twitter dark mode',
    packageType: 'rn',
    filename: 'twitter-dark.ts'
  },
  'mocha-mousse-dark': {
    name: 'mocha-mousse-dark',
    type: 'dark',
    description: 'Dark theme with rich coffee tones',
    packageType: 'rn',
    filename: 'mocha-mousse-dark.ts'
  },
  'amethyst-haze-dark': {
    name: 'amethyst-haze-dark',
    type: 'dark',
    description: 'Dark theme with deep amethyst mystery',
    packageType: 'rn',
    filename: 'amethyst-haze-dark.ts'
  },
  'supabase-dark': {
    name: 'supabase-dark',
    type: 'dark',
    description: 'Dark theme inspired by Supabase brand',
    packageType: 'rn',
    filename: 'supabase-dark.ts'
  },
  'spotify': {
    name: 'spotify',
    type: 'dark',
    description: 'Dark theme inspired by Spotify design',
    packageType: 'rn',
    filename: 'spotify.ts'
  }
};

export class ThemeResolver {
  
  /**
   * Get all available themes
   */
  public getAvailableThemes(): string[] {
    return Object.keys(AVAILABLE_THEMES).sort();
  }

  /**
   * Get themes filtered by type
   */
  public getThemesByType(type: 'light' | 'dark'): string[] {
    return Object.values(AVAILABLE_THEMES)
      .filter(theme => theme.type === type)
      .map(theme => theme.name)
      .sort();
  }

  /**
   * Check if theme exists
   */
  public hasTheme(name: string): boolean {
    return name in AVAILABLE_THEMES;
  }

  /**
   * Get theme metadata
   */
  public getTheme(name: string) {
    const theme = AVAILABLE_THEMES[name];
    if (!theme) {
      throw new DependencyResolutionError(name, [`Theme "${name}" not found`]);
    }
    return theme;
  }

  /**
   * Get themes for specific package type
   */
  public getThemesForPackage(packageType: 'rn' | 'unistyles'): string[] {
    return Object.values(AVAILABLE_THEMES)
      .filter(theme => theme.packageType === packageType)
      .map(theme => theme.name)
      .sort();
  }
}