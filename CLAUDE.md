# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Leshi UI is a **shadcn alternative for React Native** - a CLI tool and component library that enables developers to build their own UI systems with excellent developer experience and performance. The goal is to provide a curated catalog of copy-paste components that developers can customize and own, rather than a traditional component library dependency.

## Core Philosophy

### Developer Experience (DX)
- **Copy-paste approach**: Components are copied into the developer's project, not imported as dependencies
- **shadcn-inspired**: CLI commands and component patterns follow shadcn's proven DX patterns
- **Full ownership**: Developers can modify components completely since they own the code
- **Theme-first design**: All components are built with comprehensive theming support

### Performance Focus
- **Zero runtime overhead**: No component library bundle, only the components you use
- **Optimized StyleSheet patterns**: All styling uses React Native's optimized StyleSheet.create
- **Minimal re-renders**: Theme context designed for minimal component re-renders
- **Tree-shakeable**: Only copy components you actually need

## Architecture

### Monorepo Structure
- **CLI Tool** (`bin/cli.js`): Main CLI for copying components and themes
- **Component Library**:
  - `packages/rn/`: React Native components with theme integration
  - `packages/unistyles/`: Unistyles variant (alternative styling approach)
- **Demo Apps**: Showcase components and development testing

### Component Design Patterns
- **Theme-aware**: All components consume theme via `useTheme()` hook
- **Variant-based**: Primary/secondary/outline/ghost patterns like shadcn
- **Size consistency**: sm/base/lg sizing system across components
- **TypeScript-first**: Full TypeScript support with proper prop types
- **Composition-friendly**: Components designed to work together seamlessly

### Theme System Architecture
- **Context-based**: React Context with system/manual theme switching
- **Type-safe**: Full TypeScript theme definitions
- **Extensible**: Easy to add custom themes and override existing ones
- **Performance-optimized**: Theme context minimizes re-renders

## Development Commands

### CLI Development & Testing
- `bun run test`: Run CLI integration tests (ONLY testing for this project)
- `bun run release`: Publish to npm

### Demo App Development
- `cd apps/demo && bun start`: Start Expo development server for component testing
- `cd apps/demo && bun run ios/android/web`: Platform-specific development
- **Demo app MUST be updated**: Every component change requires updating the demo to showcase the component's full capabilities

## Component Development Guidelines

### Creating New Components
1. **Follow shadcn patterns**: Variant props, consistent API design
2. **Theme integration**: Use `useTheme()` hook, follow existing styling patterns
3. **Performance first**: Use StyleSheet.create, avoid inline styles
4. **TypeScript complete**: Proper prop interfaces, theme typing
5. **Composition ready**: Design for component composition and customization

### Component File Structure
```typescript
// Standard component pattern
export interface ComponentProps extends BaseProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "base" | "lg";
}

export const Component = ({ variant = "primary", ...props }: ComponentProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  // Implementation
};

const createStyles = (theme: Theme) => StyleSheet.create({
  // Theme-aware styles
});
```

### Adding Component Dependencies
- Update `component-notes.json` for components requiring external dependencies
- Provide clear installation instructions
- Document component interdependencies

## CLI Usage Patterns

### Component Management
- `leshi-ui add component <name>`: Copy component to user's project
- `leshi-ui add component <name> --unistyles`: Copy Unistyles variant

### Theme Management  
- `leshi-ui init`: Initialize base theme system (light/dark)
- `leshi-ui add theme <name>`: Add additional themes
- `leshi-ui themes`: List available themes

## Key Implementation Details

### Performance Optimizations
- Theme context uses useMemo to prevent unnecessary re-renders
- StyleSheet.create for all component styles (never inline styles)
- Minimal theme context value changes

### Developer Experience Features
- Automatic theme index file updates when adding themes
- Component dependency warnings via component-notes.json
- Clear error messages and helpful CLI output
- camelCase conversion for theme variable names

## Testing Strategy
- **CLI testing only**: Tests focus on CLI functionality (file copying, theme registration)
- **No component testing**: Components are copy-paste, developers test in their own projects
- **Integration tests**: Test complete CLI workflows in temporary directories

## Development Best Practices

### TypeScript Validation
- **ALWAYS run TypeScript checks**: Execute `npx tsc --noEmit` in relevant packages before completing tasks
- **Fix TypeScript errors immediately**: Never leave TypeScript errors unresolved
- **Use proper types**: Import correct types like `DimensionValue` from React Native for props like `width` and `height`
- **Type safety first**: Ensure all component props and theme interfaces are properly typed

### Unistyles v3 Implementation
When working with `packages/unistyles/`, follow the official Unistyles v3 API:

#### Required Documentation References:
- **StyleSheet**: https://www.unistyl.es/v3/references/stylesheet/
- **Variants**: https://www.unistyl.es/v3/references/variants/
- **Compound Variants**: https://www.unistyl.es/v3/references/compound-variants
- **useUnistyles Hook**: https://www.unistyl.es/v3/references/use-unistyles

#### Correct Unistyles Patterns:
```typescript
// ✅ CORRECT: Unistyles v3 API
import { StyleSheet } from "react-native-unistyles";

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    variants: {
      size: {
        small: { padding: theme.spacing.sm },
        large: { padding: theme.spacing.lg }
      }
    }
  }
}));

export const Component = ({ size = "small" }) => {
  styles.useVariants({ size });
  return <View style={styles.container} />;
};
```

#### Common Mistakes to Avoid:
- ❌ Using `useStyles()` (doesn't exist in v3)
- ❌ Using `useUnistyles()` for variants (use `styles.useVariants()`)
- ❌ Calling styles as functions: `styles.text({ variant })` 
- ✅ Use `styles.useVariants({ variant })` then `styles.text`

### Demo App Requirements
When creating or modifying components:

#### Component Showcase Standards
- **Complete variant coverage**: Demo must show ALL variants (primary, secondary, outline, ghost, destructive, etc.)
- **Size demonstrations**: Display all available sizes (sm, base, lg, xl, etc.) 
- **State examples**: Show different states (default, disabled, loading, pressed, etc.)
- **Interactive examples**: Include functional examples that users can interact with
- **Edge cases**: Demonstrate edge cases like long text, empty states, error states
- **Composition patterns**: Show how components work together in real scenarios

#### Demo File Organization
- **Component-specific demo**: Each component should have its dedicated demo screen in `apps/demo/app/components/`
- **Real-world examples**: Include practical usage examples in `apps/demo/app/examples/`
- **Visual consistency**: Follow existing demo patterns and styling
- **Code examples**: Include code snippets showing how to use each variant

### Platform-Specific Development
When working with React Native components that need to work across web and mobile:

#### Cross-Platform Styling Best Practices
- **Platform checks**: Use `Platform.OS === 'web'` for web-specific styles
- **FontWeight handling**: Use `fontWeight` only on web, rely on `fontFamily` variants on mobile
- **Conditional style spreading**: Use `...(Platform.OS === 'web' && { style })` pattern
- **Import Platform**: Always import `Platform` from `react-native` when needed

#### Example Pattern:
```typescript
import { Platform } from "react-native";

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.fonts.regular,
    ...(Platform.OS === 'web' && { fontWeight: '400' as const })
  }
});
```

### Component Performance Optimization
- **Memoization**: Use `useMemo` for expensive style calculations in RN components
- **StyleSheet.create**: Always use `StyleSheet.create()` for all styles, never inline
- **Minimal re-renders**: Avoid creating new objects in render functions
- **Theme dependencies**: Only recreate styles when theme changes

### shadcn Pattern Adherence
When creating or modifying components, follow shadcn's design principles:

#### Component API Design
- **Semantic variants**: Use meaningful names like `heading`, `body`, `caption` vs generic names
- **Consistent props**: Follow size patterns: `sm`, `base`, `lg` | variant patterns: `primary`, `secondary`, `outline`, `ghost`
- **Sensible defaults**: Always provide good default values for optional props
- **Composition over configuration**: Design for flexibility and customization

#### Mobile-First Adaptations
- **Touch targets**: Ensure minimum 44px touch targets for interactive elements
- **Spacing**: Use appropriate spacing for mobile (larger than web)
- **Typography scale**: Adapt font sizes for mobile readability
- **Platform conventions**: Follow iOS/Android design guidelines where applicable

### Demo Organization Best Practices
- **Categorized sections**: Group by functionality (sizes, variants, weights, etc.)
- **Progressive complexity**: Start with simple examples, build to complex compositions
- **Real-world scenarios**: Include practical examples developers will actually use
- **Edge case coverage**: Show error states, loading states, empty states
- **Performance considerations**: Avoid creating layouts that could break on different screen sizes

### Debugging and Troubleshooting
Common issues and solutions:
- **Styles not applying**: Check if using correct platform-specific styles
- **TypeScript errors**: Ensure proper type imports (DimensionValue vs string/number)
- **Unistyles not working**: Verify `styles.useVariants()` syntax and theme structure
- **Demo app crashes**: Check for missing imports or circular dependencies
- **Font weights not visible**: Verify Platform.OS checks and fontFamily/fontWeight usage

### Code Quality Checklist
Before completing any task:
1. ✅ Run `npx tsc --noEmit` in affected packages
2. ✅ Verify Unistyles v3 API usage is correct
3. ✅ Check that all TypeScript errors are resolved
4. ✅ Ensure proper React Native type imports (DimensionValue, etc.)
5. ✅ Test that changes don't break existing functionality
6. ✅ **Update demo app to showcase ALL component capabilities**
7. ✅ **Verify demo displays all variants, sizes, and states**
8. ✅ **Check platform-specific implementations work correctly**
9. ✅ **Ensure proper performance optimizations are in place**