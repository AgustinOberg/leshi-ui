# Component Development Directives

## 🎯 Philosophy

Leshi UI follows a **component-first, theme-aware, performance-optimized** approach with modern patterns adapted for React Native. Every component should be:

- **Copy-pasteable**: Components are owned by the developer, not imported as dependencies
- **Theme-aware**: Fully integrated with the theme system
- **Performance-first**: Optimized for React Native with minimal re-renders
- **Consistent APIs**: Well-designed API patterns and naming conventions
- **Mobile-optimized**: Touch-first design with proper accessibility

## 🏗️ Component Architecture

Leshi UI supports **two styling approaches**: React Native StyleSheet and Unistyles v3. Both follow the same component patterns but with different styling implementations.

### React Native StyleSheet (Default)

```tsx
// components/ui/your-component.tsx
import React, { useMemo } from "react";
import { Pressable, StyleSheet, /* ... */ } from "react-native";
import { useTheme } from "../../styles/theme";
import type { Theme } from "../../styles/theme";

// Dependencies (only when needed)
import { Text } from "./text";

export type YourComponentVariant = "primary" | "secondary" | "outline";
export type YourComponentSize = "sm" | "base" | "lg";

export interface YourComponentProps extends BaseReactNativeProps {
  variant?: YourComponentVariant;
  size?: YourComponentSize;
  // ... component-specific props
}

export const YourComponent = ({ 
  variant = "primary",
  size = "base", 
  ...props 
}: YourComponentProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  // Component logic here
};

const createStyles = (theme: Theme) => {
  // StyleSheet.create implementation
};
```

### Unistyles v3 (Alternative)

```tsx
// components/ui/your-component.tsx
import React, { useMemo } from "react";
import { Pressable, /* ... */ } from "react-native";
import { StyleSheet } from "react-native-unistyles";

// Dependencies (only when needed)  
import { Text } from "./text";

export type YourComponentVariant = "primary" | "secondary" | "outline";
export type YourComponentSize = "sm" | "base" | "lg";

export interface YourComponentProps extends BaseReactNativeProps {
  variant?: YourComponentVariant;
  size?: YourComponentSize;
  // ... component-specific props
}

export const YourComponent = ({ 
  variant = "primary",
  size = "base", 
  ...props 
}: YourComponentProps) => {
  // Use variants with Unistyles
  styles.useVariants({ variant, size });
  // Component logic here
};

const styles = StyleSheet.create((theme) => ({
  // Unistyles implementation with built-in variants
}));
```

## 📋 Core Principles

### 1. **Theme Integration** 

#### React Native StyleSheet
✅ **Always use the theme system**
```tsx
const theme = useTheme();
const styles = useMemo(() => createStyles(theme), [theme]);
```

#### Unistyles v3
✅ **Theme is automatically passed**
```tsx
const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.primary,
    padding: theme.sizes.padding(4),
  },
}));
```

❌ **Never hardcode values (both approaches)**
```tsx
// DON'T DO THIS
backgroundColor: '#3b82f6'
padding: 16

// DO THIS INSTEAD  
backgroundColor: theme.colors.primary
padding: theme.sizes.padding(4)
```

### 2. **Performance Optimization**

#### React Native StyleSheet
✅ **Use useMemo for styles and computations**
```tsx
const styles = useMemo(() => createStyles(theme), [theme]);
const combinedStyle = useMemo(() => {
  // Style computation logic
  return [styles.base, styles.variant[variant], style];
}, [styles, variant, style]);
```

✅ **Always use StyleSheet.create**
```tsx
const createStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    container: {
      // Base styles here
    },
  });

  const variant = StyleSheet.create({
    primary: { /* styles */ },
    secondary: { /* styles */ },
  });

  return { ...baseStyles, variant };
};
```

#### Unistyles v3
✅ **Use variants system for performance**
```tsx
const styles = StyleSheet.create((theme) => ({
  container: {
    // Base styles
    backgroundColor: theme.colors.background,
    variants: {
      variant: {
        primary: { backgroundColor: theme.colors.primary },
        secondary: { backgroundColor: theme.colors.secondary },
      },
      size: {
        sm: { padding: theme.sizes.padding(2) },
        lg: { padding: theme.sizes.padding(4) },
      },
    },
  },
}));

// Use variants in component
styles.useVariants({ variant, size });
```

### 3. **Variant System**
Follow modern component patterns with React Native adaptations:

```tsx
export type ButtonVariant = 
  | "primary"      // Primary action - filled background
  | "secondary"    // Secondary action - subtle background  
  | "outline"      // Alternative - border only
  | "ghost"        // Minimal - transparent background
  | "destructive"  // Danger actions - red theme
  | "link";        // Text-only - no background

export type ButtonSize = 
  | "sm"     // Small - 32px height
  | "base"   // Default - 40px height  
  | "lg"     // Large - 48px height
  | "icon";  // Square - 40x40px
```

### 4. **TypeScript Excellence**
✅ **Extend proper React Native types**
```tsx
export interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  // ... other props
}
```

✅ **Export all types for reusability**
```tsx
export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "base" | "lg";
export interface ButtonProps extends PressableProps {
  // ...
}
```

## 🛠️ Implementation Pattern

### Step 1: Define Types (Same for Both Approaches)
```tsx
export type ComponentVariant = "primary" | "secondary" | "outline";
export type ComponentSize = "sm" | "base" | "lg";

export interface ComponentProps extends BaseRNProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
```

### Step 2: Component Logic

#### React Native StyleSheet Approach
```tsx
export const Component = ({
  variant = "primary",
  size = "base",
  fullWidth = false,
  disabled = false,
  children,
  style,
  ...rest
}: ComponentProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  const combinedStyle = useMemo(() => {
    return [
      styles.container,
      styles.variant[variant],
      styles.size[size],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      style
    ];
  }, [styles, variant, size, fullWidth, disabled, style]);

  return (
    <Pressable style={combinedStyle} disabled={disabled} {...rest}>
      {children}
    </Pressable>
  );
};
```

#### Unistyles v3 Approach
```tsx
export const Component = ({
  variant = "primary",
  size = "base",
  fullWidth = false,
  disabled = false,
  children,
  style,
  ...rest
}: ComponentProps) => {
  // Use Unistyles variants
  styles.useVariants({ variant, size, fullWidth });

  return (
    <Pressable 
      style={(state) => [
        styles.container,
        disabled && styles.disabled,
        state.pressed && !disabled && styles.pressed,
        style,
      ]} 
      disabled={disabled} 
      {...rest}
    >
      {children}
    </Pressable>
  );
};
```

### Step 3: Styles Implementation

#### React Native StyleSheet
```tsx
const createStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    container: {
      // Base styles that apply to all variants
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radii.md,
    },
    disabled: {
      opacity: 0.6,
    },
    fullWidth: {
      width: "100%",
    },
  });

  const variant = StyleSheet.create({
    primary: {
      backgroundColor: theme.colors.primary,
      ...theme.shadows.xs,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      ...theme.shadows.xs,
    },
    outline: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      backgroundColor: theme.colors.background,
    },
  });

  const size = StyleSheet.create({
    sm: {
      height: 32,
      paddingHorizontal: theme.sizes.padding(3),
    },
    base: {
      height: 40,
      paddingHorizontal: theme.sizes.padding(4),
    },
    lg: {
      height: 48,
      paddingHorizontal: theme.sizes.padding(6),
    },
  });

  return { ...baseStyles, variant, size };
};
```

#### Unistyles v3
```tsx
const styles = StyleSheet.create((theme) => ({
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.6,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radii.md,
    variants: {
      fullWidth: {
        true: { width: "100%" },
        false: { width: "auto" },
      },
      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
          ...theme.shadows.xs,
        },
        secondary: {
          backgroundColor: theme.colors.secondary,
          ...theme.shadows.xs,
        },
        outline: {
          borderColor: theme.colors.border,
          borderWidth: 1,
          backgroundColor: theme.colors.background,
        },
      },
      size: {
        sm: {
          height: 32,
          paddingHorizontal: theme.sizes.padding(3),
        },
        base: {
          height: 40,
          paddingHorizontal: theme.sizes.padding(4),
        },
        lg: {
          height: 48,
          paddingHorizontal: theme.sizes.padding(6),
        },
      },
    },
  },
}));
```

## 🎨 Theme Integration Best Practices

### Colors
```tsx
// ✅ Use semantic color tokens
backgroundColor: theme.colors.primary
color: theme.colors.primaryForeground

// ✅ Use muted colors for subtle elements
backgroundColor: theme.colors.muted
color: theme.colors.mutedForeground

// ✅ Use destructive for error states
backgroundColor: theme.colors.destructive
color: theme.colors.destructiveForeground
```

### Spacing & Sizing
```tsx
// ✅ Use theme spacing functions
padding: theme.sizes.padding(4)        // 16px
margin: theme.sizes.margin(2)          // 8px
gap: theme.sizes.gap(3)                // 12px

// ✅ Use theme font sizes
fontSize: theme.sizes.fonts.base       // Base font size
fontSize: theme.sizes.fonts.lg         // Large font size
```

### Shadows & Effects
```tsx
// ✅ Use theme shadows
...theme.shadows.xs    // Subtle shadow
...theme.shadows.sm    // Small shadow
...theme.shadows.md    // Medium shadow

// ✅ Use theme border radius
borderRadius: theme.radii.sm   // Small radius
borderRadius: theme.radii.md   // Medium radius  
borderRadius: theme.radii.lg   // Large radius
```

## 🔧 Advanced Patterns

### State Management
```tsx
const [pressed, setPressed] = useState(false);

const handlePressIn = useCallback(() => setPressed(true), []);
const handlePressOut = useCallback(() => setPressed(false), []);

const combinedStyle = useMemo(() => {
  const styleArray = [
    styles.container,
    styles.variant[variant],
    styles.size[size],
  ];

  if (pressed && !disabled) {
    styleArray.push(styles.pressed);
  }

  if (disabled) {
    styleArray.push(styles.disabled);
  }

  return styleArray;
}, [styles, variant, size, pressed, disabled]);
```

### Dynamic Style Functions
```tsx
// For complex state-dependent styling
const combinedStyle = useMemo(() => {
  return (state: { pressed: boolean }) => {
    const styleArray: StyleProp<ViewStyle>[] = [
      styles.container,
      styles.variant[variant],
      styles.size[size],
    ];

    if (state.pressed && !disabled) {
      styleArray.push(styles.pressed);
    }

    return styleArray;
  };
}, [styles, variant, size, disabled]);

return (
  <Pressable style={combinedStyle} {...rest}>
    {children}
  </Pressable>
);
```

### Complex Component Composition
```tsx
// For components that need multiple text elements
const TEXT_VARIANT: Record<ButtonVariant, TextVariant> = {
  primary: "primaryForeground",
  secondary: "secondaryForeground",
  outline: "primary",
  ghost: "primary",
  destructive: "destructiveForeground",
  link: "primary",
};

const textVariant = useMemo(() => TEXT_VARIANT[variant], [variant]);

return (
  <Pressable style={combinedStyle} {...rest}>
    {loading && <ActivityIndicator size="small" color={spinnerColor} />}
    {!loading && prefix && <>{prefix}</>}
    {text && !loading && (
      <Text weight="medium" variant={textVariant}>
        {text}
      </Text>
    )}
    {!loading && suffix && <>{suffix}</>}
  </Pressable>
);
```

## ♿ Accessibility Requirements

### Always include accessibility props:
```tsx
return (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel || text}
    accessibilityState={{ disabled: isDisabled }}
    accessibilityHint={accessibilityHint}
    style={combinedStyle}
    {...rest}
  >
    {children}
  </Pressable>
);
```

### Common accessibility patterns:
```tsx
// For buttons
accessibilityRole="button"
accessibilityState={{ disabled: isDisabled }}

// For text inputs
accessibilityRole="textbox" 
accessibilityState={{ disabled: isDisabled }}

// For checkboxes
accessibilityRole="checkbox"
accessibilityState={{ checked: isChecked }}

// For switches
accessibilityRole="switch"
accessibilityState={{ checked: isOn }}
```

## 🚀 Performance Optimizations

### 1. **Memoization Strategy**
```tsx
// ✅ Memoize styles creation
const styles = useMemo(() => createStyles(theme), [theme]);

// ✅ Memoize complex style computations
const combinedStyle = useMemo(() => {
  // Complex style logic here
}, [dependencies]);

// ✅ Memoize derived values
const textVariant = useMemo(() => TEXT_VARIANT[variant], [variant]);
const spinnerColor = useMemo(() => {
  return variant === 'ghost' ? theme.colors.primary : theme.colors.primaryForeground;
}, [variant, theme.colors.primary, theme.colors.primaryForeground]);
```

### 2. **Platform Optimizations**
```tsx
import { Platform } from "react-native";

// ✅ Platform-specific optimizations
const weight = StyleSheet.create({
  medium: { 
    fontFamily: theme.fonts.medium,
    ...(Platform.OS === 'web' && { fontWeight: '500' as const })
  },
});

// ✅ Conditional platform styles
const platformSpecific = Platform.select({
  ios: { shadowOffset: { width: 0, height: 2 } },
  android: { elevation: 2 },
  web: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
});
```

## 📝 Documentation Requirements

### Each component should include:

1. **JSDoc comments**
```tsx
/**
 * A flexible button component with multiple variants and sizes.
 * 
 * @example
 * <Button variant="primary" size="lg" text="Click me" onPress={handlePress} />
 */
export const Button = ({ ... }) => { ... };
```

2. **Prop documentation**
```tsx
export interface ButtonProps extends PressableProps {
  /** Button visual style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Text to display inside the button */
  text?: string;
  /** Show loading spinner and disable interaction */
  loading?: boolean;
}
```

3. **Usage examples in comments**
```tsx
/**
 * @example
 * // Basic usage
 * <Button text="Click me" onPress={handlePress} />
 * 
 * @example  
 * // With different variants
 * <Button variant="secondary" text="Cancel" />
 * <Button variant="destructive" text="Delete" />
 * 
 * @example
 * // With loading state
 * <Button text="Saving..." loading={isSaving} disabled={isSaving} />
 */
```

## ⚠️ Common Pitfalls to Avoid

### ❌ **Don't hardcode values**
```tsx
// BAD
paddingHorizontal: 16,
backgroundColor: '#3b82f6',
fontSize: 14,
```

### ❌ **Don't create styles in render**
```tsx
// BAD - Creates new objects every render
<View style={{ padding: theme.sizes.padding(4) }}>

// GOOD - Use memoized styles
<View style={styles.container}>
```

### ❌ **Don't skip accessibility**
```tsx
// BAD - No accessibility support
<Pressable onPress={onPress}>

// GOOD - Proper accessibility
<Pressable 
  accessibilityRole="button"
  accessibilityLabel="Submit form"
  onPress={onPress}
>
```

### ❌ **Don't ignore platform differences**
```tsx
// BAD - Web will have no font weight
fontFamily: theme.fonts.bold

// GOOD - Platform-aware font weight
fontFamily: theme.fonts.bold,
...(Platform.OS === 'web' && { fontWeight: '700' as const })
```

## 🎯 Button Component Analysis

The `Button` component exists in both implementations and serves as the perfect example of these principles:

### React Native StyleSheet Button
1. **✅ Theme Integration**: Uses `useTheme()` and theme tokens throughout
2. **✅ Performance**: `useMemo` for styles and complex computations
3. **✅ Variants**: Comprehensive variant system with manual style lookups
4. **✅ TypeScript**: Fully typed with exported types
5. **✅ Accessibility**: Proper `accessibilityRole` and `accessibilityState`
6. **✅ Composition**: Supports `prefix`, `suffix`, `loading` states
7. **✅ Platform Support**: Web-aware font weights
8. **✅ State Management**: Handles `pressed`, `disabled`, `loading` states with `useMemo`
9. **✅ Flexibility**: Accepts custom `style` prop and spreads `...rest`

### Unistyles v3 Button
1. **✅ Theme Integration**: Theme automatically passed to StyleSheet.create
2. **✅ Performance**: Built-in variant optimization and caching
3. **✅ Variants**: Uses Unistyles built-in variant system with `styles.useVariants()`
4. **✅ TypeScript**: Fully typed with exported types
5. **✅ Accessibility**: Proper `accessibilityRole` and `accessibilityState`
6. **✅ Composition**: Supports `prefix`, `suffix`, `loading` states
7. **✅ Platform Support**: Web-aware through Unistyles
8. **✅ State Management**: Handles states with dynamic style functions
9. **✅ Flexibility**: Accepts custom `style` prop and spreads `...rest`

### Key Differences

#### Styling Approach
- **StyleSheet**: Manual variant lookup and `useMemo` optimization
- **Unistyles**: Built-in variant system with automatic optimization

#### Performance
- **StyleSheet**: Requires careful `useMemo` usage for optimal performance
- **Unistyles**: Built-in performance optimizations and caching

#### Developer Experience
- **StyleSheet**: More explicit control, familiar React Native patterns
- **Unistyles**: More concise, built-in responsive design features

Both implementations serve as the gold standard for their respective styling approaches in the system.

## 🏁 Component Checklist

### Universal Requirements (Both Approaches)
- [ ] ✅ Uses theme tokens exclusively (no hardcoded values)
- [ ] ✅ Follows consistent variant naming conventions
- [ ] ✅ Includes proper TypeScript types
- [ ] ✅ Exports all types for reusability
- [ ] ✅ Implements accessibility props
- [ ] ✅ Supports custom `style` prop
- [ ] ✅ Spreads `...rest` props appropriately
- [ ] ✅ Handles platform differences (especially web)
- [ ] ✅ Includes JSDoc documentation
- [ ] ✅ Performant with minimal re-renders
- [ ] ✅ Follows the established file structure

### React Native StyleSheet Specific
- [ ] ✅ Uses `useTheme()` hook for theme access
- [ ] ✅ Implements `useMemo` for style computations  
- [ ] ✅ Uses `StyleSheet.create` for all styles
- [ ] ✅ Creates style objects outside component for reusability
- [ ] ✅ Properly memoizes complex style combinations

### Unistyles v3 Specific
- [ ] ✅ Uses `StyleSheet.create((theme) => ({}))` pattern
- [ ] ✅ Implements variants using built-in `variants` object
- [ ] ✅ Uses `styles.useVariants()` for applying variants
- [ ] ✅ Leverages Unistyles performance optimizations
- [ ] ✅ Follows Unistyles v3 API conventions

### Framework Detection
Choose the appropriate approach based on your project:
- **React Native StyleSheet**: Default choice, broader compatibility
- **Unistyles v3**: Advanced features, better performance, responsive design

Following these directives ensures every component maintains the high quality, performance, and developer experience that defines the Leshi UI system across both styling approaches.