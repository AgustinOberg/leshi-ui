# Theming System Overview

Leshi UI features a comprehensive theming system that enables consistent design across your React Native application with support for light/dark modes, custom themes, and platform-specific optimizations.

## 🎨 Theme Architecture

### **Core Concepts**

```typescript
// Theme structure
interface Theme {
  colors: ColorSystem;      // Semantic color tokens
  spacing: SpacingSystem;   // Consistent spacing scale
  typography: Typography;   // Font definitions
  borderRadius: Radii;      // Border radius scale
}

// Usage in components
const { theme, colorScheme, toggleTheme } = useTheme();
```

### **Color System**

```typescript
interface ColorSystem {
  // Primary brand colors
  primary: string;
  secondary: string;
  
  // Semantic colors
  destructive: string;
  warning: string;
  success: string;
  info: string;
  
  // Surface colors
  background: string;
  card: string;
  popover: string;
  
  // Text colors
  text: string;
  textMuted: string;
  textInverse: string;
  
  // Interactive colors
  border: string;
  input: string;
  ring: string;
  
  // State colors
  hover: string;
  pressed: string;
  disabled: string;
}
```

## 🚀 Quick Start

### **1. Basic Theme Setup**

```typescript
// App.tsx
import { ThemeProvider } from './components/ui/theme-provider';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### **2. Using Theme in Components**

```typescript
import { useTheme } from './components/ui/theme-provider';

const MyComponent = () => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.base,
      borderRadius: theme.borderRadius.base,
    },
    text: {
      color: theme.colors.text,
      fontSize: 16,
      fontFamily: theme.fonts.regular,
    }
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Themed Content</Text>
    </View>
  );
};
```

### **3. Theme Switching**

```typescript
const ThemeToggle = () => {
  const { colorScheme, toggleTheme } = useTheme();
  
  return (
    <Button onPress={toggleTheme}>
      {colorScheme === 'light' ? '🌙' : '☀️'} Toggle Theme
    </Button>
  );
};
```

## 🌈 Available Themes

### **Built-in Themes**

- **Light/Dark**: Default light and dark themes
- **Ocean**: Blue-inspired theme
- **Lavender**: Purple-inspired theme
- **Peach**: Orange-inspired theme
- **Mono**: Monochromatic theme
- **Retro**: Vintage-inspired theme
- **Bubblegum**: Pink-inspired theme
- **Grape**: Purple gradient theme
- **Mocha Mousse**: Brown coffee theme
- **Amethyst Haze**: Purple gemstone theme

### **Special Themes**

- **Spotify**: Spotify-inspired theme
- **Supabase**: Supabase brand colors
- **Twitter**: Twitter brand theme
- **T3 Chat**: T3 stack inspired

## 🛠️ Theme Tokens

### **Spacing System**

```typescript
const spacing = {
  xs: 4,     // Extra small spacing
  sm: 8,     // Small spacing
  base: 16,  // Base spacing (default)
  lg: 24,    // Large spacing
  xl: 32,    // Extra large spacing
  xxl: 48,   // Double extra large
};

// Usage
padding: theme.spacing.base,
margin: theme.spacing.lg,
gap: theme.spacing.sm,
```

### **Border Radius System**

```typescript
const borderRadius = {
  sm: 4,     // Small radius
  base: 8,   // Base radius (default)
  lg: 12,    // Large radius
  xl: 16,    // Extra large radius
  full: 999, // Fully rounded
};

// Usage
borderRadius: theme.borderRadius.base,
borderTopLeftRadius: theme.borderRadius.lg,
```

### **Typography System**

```typescript
const fonts = {
  regular: 'System',    // Regular weight
  medium: 'System',     // Medium weight
  bold: 'System',       // Bold weight
};

// Platform-specific usage
const styles = StyleSheet.create({
  text: {
    fontFamily: theme.fonts.regular,
    ...(Platform.OS === 'web' && { fontWeight: '400' })
  },
  boldText: {
    fontFamily: theme.fonts.bold,
    ...(Platform.OS === 'web' && { fontWeight: '700' })
  },
});
```

## 🎨 Custom Themes

### **Creating a Custom Theme**

```typescript
// custom-theme.ts
import { Theme } from '../styles/theme';
import { commonSpacing, commonBorderRadius } from '../styles/themes/common';

export const myCustomTheme: Theme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    destructive: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',
    
    background: '#ffffff',
    card: '#f8fafc',
    popover: '#ffffff',
    
    text: '#0f172a',
    textMuted: '#64748b',
    textInverse: '#ffffff',
    
    border: '#e2e8f0',
    input: '#ffffff',
    ring: '#6366f1',
    
    hover: '#f1f5f9',
    pressed: '#e2e8f0',
    disabled: '#f8fafc',
  },
  spacing: commonSpacing,
  borderRadius: commonBorderRadius,
  fonts: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    bold: 'Inter-Bold',
  },
};
```

### **Using Custom Theme**

```typescript
// App.tsx
import { ThemeProvider } from './components/ui/theme-provider';
import { myCustomTheme } from './themes/custom-theme';

export default function App() {
  return (
    <ThemeProvider defaultTheme={myCustomTheme}>
      {/* Your app */}
    </ThemeProvider>
  );
}
```

### **Dynamic Theme Switching**

```typescript
const ThemeSelector = () => {
  const { setTheme } = useTheme();
  
  const themes = {
    'Custom': myCustomTheme,
    'Ocean': oceanTheme,
    'Lavender': lavenderTheme,
  };
  
  return (
    <View>
      {Object.entries(themes).map(([name, theme]) => (
        <Button
          key={name}
          variant="outline"
          onPress={() => setTheme(theme)}
        >
          {name}
        </Button>
      ))}
    </View>
  );
};
```

## 📱 Platform Considerations

### **iOS-Specific Theming**

```typescript
const createIOSStyles = (theme: Theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: theme.borderRadius.lg,
  },
});
```

### **Android-Specific Theming**

```typescript
const createAndroidStyles = (theme: Theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    elevation: 4,
    borderRadius: theme.borderRadius.lg,
  },
});
```

### **Web-Specific Theming**

```typescript
const createWebStyles = (theme: Theme) => StyleSheet.create({
  text: {
    fontFamily: theme.fonts.regular,
    fontWeight: '400',
    color: theme.colors.text,
  },
  button: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.colors.hover,
    },
  },
});
```

## ⚡ Performance Optimization

### **Memoizing Theme-Dependent Styles**

```typescript
// ✅ Good: Memoize expensive style calculations
const useThemedStyles = (theme: Theme) => {
  return useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
    },
    text: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
    }
  }), [theme.colors, theme.fonts]);
};

// Usage
const MyComponent = () => {
  const { theme } = useTheme();
  const styles = useThemedStyles(theme);
  
  return <View style={styles.container} />;
};
```

### **Avoiding Unnecessary Re-renders**

```typescript
// ✅ Good: Theme context is optimized
const ThemeContext = createContext<ThemeContextValue>({} as ThemeContextValue);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  
  // Memoize to prevent unnecessary re-renders
  const value = useMemo(() => ({
    theme: colorScheme === 'light' ? lightTheme : darkTheme,
    colorScheme,
    toggleTheme: () => setColorScheme(prev => prev === 'light' ? 'dark' : 'light'),
  }), [colorScheme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## 🌍 Accessibility

### **Color Contrast**

```typescript
// Ensure WCAG AA compliance
const accessibleTheme: Theme = {
  colors: {
    // High contrast ratios
    text: '#000000',        // 21:1 on white
    textMuted: '#666666',   // 4.5:1 on white
    primary: '#0066cc',     // 4.5:1 on white
    // ...
  }
};
```

### **System Theme Detection**

```typescript
import { useColorScheme } from 'react-native';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [userPreference, setUserPreference] = useState<'light' | 'dark' | 'system'>('system');
  
  const effectiveColorScheme = userPreference === 'system' 
    ? systemColorScheme || 'light'
    : userPreference;
  
  // Theme logic based on effective color scheme
};
```

### **Reduced Motion Support**

```typescript
import { AccessibilityInfo } from 'react-native';

const useReducedMotion = () => {
  const [reduceMotion, setReduceMotion] = useState(false);
  
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);
  
  return reduceMotion;
};

// Use in animations
const MyComponent = () => {
  const reduceMotion = useReducedMotion();
  
  const animationDuration = reduceMotion ? 0 : 200;
  
  // Apply to animations
};
```

## 📚 Best Practices

### **Theme Design Guidelines**

1. **Semantic Colors**: Use semantic names (`primary`, `destructive`) over descriptive ones (`blue`, `red`)
2. **Consistent Scale**: Maintain consistent spacing and radius scales
3. **Accessibility**: Ensure sufficient color contrast
4. **Platform Adaptation**: Consider platform-specific design patterns
5. **Performance**: Memoize expensive style calculations

### **Theme Usage Patterns**

```typescript
// ✅ Good: Semantic color usage
backgroundColor: theme.colors.destructive,

// ❌ Bad: Hardcoded colors
backgroundColor: '#ff0000',

// ✅ Good: Consistent spacing
padding: theme.spacing.base,
margin: theme.spacing.lg,

// ❌ Bad: Arbitrary values
padding: 17,
margin: 23,
```

## 🔗 Advanced Topics

### **Theme Composition**

```typescript
// Compose themes from base + overrides
const createTheme = (overrides: Partial<Theme>): Theme => {
  return {
    ...baseTheme,
    ...overrides,
    colors: {
      ...baseTheme.colors,
      ...overrides.colors,
    },
  };
};

// Usage
const brandTheme = createTheme({
  colors: {
    primary: '#your-brand-color',
    secondary: '#your-secondary-color',
  }
});
```

### **Theme Persistence**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const usePersistedTheme = () => {
  const [theme, setTheme] = useState<Theme>(lightTheme);
  
  useEffect(() => {
    // Load saved theme
    AsyncStorage.getItem('theme').then(saved => {
      if (saved) {
        setTheme(JSON.parse(saved));
      }
    });
  }, []);
  
  const saveTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    AsyncStorage.setItem('theme', JSON.stringify(newTheme));
  }, []);
  
  return { theme, setTheme: saveTheme };
};
```

---

## 🔗 Related Documentation

- [Available Themes](./themes.md) - Browse all built-in themes
- [Custom Themes](./custom.md) - Create your own themes
- [Component Guide](../components.md) - How components use themes
- [Development Guide](../development.md) - Theme development workflows

**Ready to customize your app's appearance?** Start with the [Quick Start](../quick-start.md) guide or browse [Available Themes](./themes.md)!
