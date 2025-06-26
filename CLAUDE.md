# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Leshi UI is a **shadcn alternative for React Native** - an enterprise-grade CLI tool and component library that enables developers to build their own UI systems with excellent developer experience and performance. The goal is to provide a curated catalog of copy-paste components that developers can customize and own, rather than a traditional component library dependency.

## Core Philosophy

### Developer Experience (DX)
- **Copy-paste approach**: Components are copied into the developer's project, not imported as dependencies
- **shadcn-inspired**: CLI commands and component patterns follow shadcn's proven DX patterns
- **Full ownership**: Developers can modify components completely since they own the code
- **Theme-first design**: All components are built with comprehensive theming support
- **Enterprise-grade tooling**: TypeScript-first with atomic operations and advanced error handling

### Performance Focus
- **Zero runtime overhead**: No component library bundle, only the components you use
- **Optimized StyleSheet patterns**: All styling uses React Native's optimized StyleSheet.create
- **Minimal re-renders**: Theme context designed for minimal component re-renders
- **Tree-shakeable**: Only copy components you actually need

## Architecture

### Monorepo Structure
- **Enterprise CLI** (`cli/`): TypeScript-based CLI with atomic operations, dependency resolution, and import transformation
- **Component Library**:
  - `packages/rn/`: React Native components with theme integration
  - `packages/unistyles/`: Unistyles variant (alternative styling approach)
- **Demo Apps**: Showcase components and development testing

### CLI Architecture (Enterprise-Grade)
```
cli/
├── src/
│   ├── commands/           # Modular command implementations
│   │   ├── add.ts         # Component installation with dependency resolution
│   │   ├── init.ts        # Project initialization with framework detection
│   │   └── guide.ts       # Documentation and help system
│   ├── services/          # Core business logic
│   │   ├── dependency-resolver.ts    # Multi-pass dependency resolution
│   │   ├── file-operations.ts       # Atomic file operations with rollback
│   │   ├── project-detector.ts      # Automatic framework detection
│   │   └── import-transformer.ts    # Babel-based import transformation
│   ├── schemas/           # Zod validation schemas
│   ├── errors/            # Structured error handling system
│   ├── types/             # TypeScript type definitions
│   └── __tests__/         # Comprehensive test suite
```

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
- **File structure**: Moved from `theme/` to `styles/` following shadcn patterns

## Development Commands

### CLI Development & Testing
- `npm run build`: Build the TypeScript CLI
- `npm run test`: Run comprehensive test suite with Jest
- `npm run test:coverage`: Generate coverage report
- `npm run dev`: Watch mode for development
- `npm run lint`: ESLint validation
- `bun run release`: Publish to npm (builds CLI first)

### Demo App Development
- `cd apps/demo && bun start`: Start Expo development server for component testing
- `cd apps/demo && bun run ios/android/web`: Platform-specific development
- **Demo app MUST be updated**: Every component change requires updating the demo to showcase the component's full capabilities

### CLI Usage in Development
```bash
# Test CLI locally
node cli/dist/index.js add component button

# Test framework detection
node cli/dist/index.js init --cwd /path/to/test-project

# Test dependency resolution
node cli/dist/index.js add component dialog --silent
```

## Component Development Guidelines

### Creating New Components
1. **Follow shadcn patterns**: Variant props, consistent API design
2. **Theme integration**: Use `useTheme()` hook, follow existing styling patterns
3. **Performance first**: Use StyleSheet.create, avoid inline styles
4. **TypeScript complete**: Proper prop interfaces, theme typing
5. **Composition ready**: Design for component composition and customization
6. **Dependency registration**: Update dependency resolver service

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
- **Update `cli/src/services/dependency-resolver.ts`**: Add component to COMPONENT_REGISTRY
- **External dependencies**: List in `dependencies` array
- **Component dependencies**: List in `registryDependencies` array
- **Utility files**: List in `utilities` array (e.g., `lib/modal-utils.ts`)
- **Provider files**: List in `providers` array if component needs providers

#### Example Registry Entry:
```typescript
modal: {
  name: 'modal',
  type: 'registry:ui',
  dependencies: ['@gorhom/portal'],           // External npm packages
  registryDependencies: [],                   // Other components
  utilities: ['lib/modal-utils.ts'],          // Utility files
  providers: ['components/ui/modal-provider.tsx'], // Provider components
  setup: [
    'Install external dependency: bun add @gorhom/portal',
    'Wrap your app with ModalProvider in _layout.tsx'
  ],
  description: 'A flexible modal component with animations'
}
```

## CLI System Architecture

### Enterprise Features Implemented

#### 1. Atomic File Operations
- **All-or-nothing**: Operations succeed completely or rollback automatically
- **Backup system**: Automatic backup creation before operations
- **Validation**: Pre-flight validation of all operations
- **Error handling**: Graceful failure with detailed error messages

#### 2. Multi-Pass Dependency Resolution
- **Recursive resolution**: Automatically resolves component dependencies
- **Circular detection**: Prevents infinite loops in dependency chains
- **Dependency ordering**: Installs dependencies before dependents
- **External dependency tracking**: Tracks npm packages required

#### 3. Framework-Aware Operations
- **Auto-detection**: Detects Expo, React Native, or Expo Router automatically
- **Path adaptation**: Adjusts file paths based on framework conventions
- **TypeScript detection**: Automatically detects TypeScript usage
- **Configuration generation**: Creates appropriate project config

#### 4. Import Transformation
- **Babel AST**: Uses Babel parser for reliable import transformation
- **Path fixing**: Automatically fixes relative import paths
- **Alias resolution**: Handles TypeScript path aliases
- **Platform adaptation**: Adds platform-specific imports when needed

### CLI Command Patterns

#### Enhanced Add Command
```bash
# Basic usage with automatic dependency resolution
leshi-ui add component dialog
# Resolves: text → icon → slot → button → modal → dialog

# Advanced options
leshi-ui add component button --unistyles --overwrite --silent

# Interactive mode (if no components specified)
leshi-ui add component
# Shows multi-select prompt with descriptions
```

#### Smart Init Command
```bash
# Auto-detects framework and creates optimal structure
leshi-ui init

# Unistyles variant
leshi-ui init unistyles

# Creates:
# - Project config (leshi-ui.json)
# - Directory structure
# - Base theme files
# - Framework-specific aliases
```

## Key Implementation Details

### File Organization Patterns
- **Components**: `packages/{rn|unistyles}/components/ui/`
- **Utilities**: `packages/{rn|unistyles}/lib/` (moved from mixed locations)
- **Styles**: `packages/{rn|unistyles}/styles/` (renamed from `theme/`)
- **CLI**: `cli/src/` (enterprise TypeScript implementation)

### Performance Optimizations
- **Theme context**: Uses useMemo to prevent unnecessary re-renders
- **StyleSheet.create**: Always used for all component styles (never inline)
- **Import caching**: CLI caches resolved dependencies
- **Minimal file operations**: Only copies necessary files

### Developer Experience Features
- **Structured errors**: 12 specific error types with helpful messages
- **Progress indicators**: Spinner feedback during operations
- **Validation**: Comprehensive input validation with Zod
- **Rollback protection**: Automatic cleanup on failure
- **Silent mode**: Supports CI/CD automation

## Testing Strategy

### CLI Testing (Comprehensive)
- **Unit tests**: All services tested independently
- **Integration tests**: End-to-end command execution
- **Mocked filesystem**: Uses memfs for reliable testing
- **Error scenarios**: Tests failure modes and rollback
- **Coverage**: 100% test coverage requirement

### Component Testing
- **Copy-paste philosophy**: Components are copy-paste, developers test in their own projects
- **Demo app validation**: All components must be showcased in demo app
- **Platform testing**: Ensure components work on iOS/Android/Web

### Test Commands
```bash
cd cli && npm test              # Run all tests
cd cli && npm run test:coverage # Coverage report
cd cli && npm run test:watch   # Watch mode
```

## Development Best Practices

### TypeScript Validation
- **ALWAYS run TypeScript checks**: Execute `npx tsc --noEmit` in relevant packages before completing tasks
- **Fix TypeScript errors immediately**: Never leave TypeScript errors unresolved
- **Use proper types**: Import correct types like `DimensionValue` from React Native for props like `width` and `height`
- **Type safety first**: Ensure all component props and theme interfaces are properly typed
- **CLI type safety**: All CLI operations are fully typed with Zod validation

### CLI Development Best Practices
- **Service-oriented**: Keep business logic in services, commands are thin wrappers
- **Error-first**: Always consider error cases and provide helpful messages
- **Atomic operations**: Design operations to be atomic (all-or-nothing)
- **Testing**: Write tests for all new functionality
- **Documentation**: Update CLI-README.md for user-facing changes

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
- **CLI errors**: Check `cli/dist/` exists and run `npm run build` in cli folder
- **Dependency resolution**: Verify component is registered in dependency resolver
- **Import transformation**: Check Babel AST transformation in import-transformer service
- **Styles not applying**: Check if using correct platform-specific styles
- **TypeScript errors**: Ensure proper type imports (DimensionValue vs string/number)
- **Unistyles not working**: Verify `styles.useVariants()` syntax and theme structure
- **Demo app crashes**: Check for missing imports or circular dependencies
- **Font weights not visible**: Verify Platform.OS checks and fontFamily/fontWeight usage

### Code Quality Checklist
Before completing any task:
1. ✅ Run `npx tsc --noEmit` in affected packages
2. ✅ Run `cd cli && npm test` to ensure CLI tests pass
3. ✅ Verify Unistyles v3 API usage is correct
4. ✅ Check that all TypeScript errors are resolved
5. ✅ Ensure proper React Native type imports (DimensionValue, etc.)
6. ✅ Test that changes don't break existing functionality
7. ✅ **Update demo app to showcase ALL component capabilities**
8. ✅ **Verify demo displays all variants, sizes, and states**
9. ✅ **Check platform-specific implementations work correctly**
10. ✅ **Ensure proper performance optimizations are in place**
11. ✅ **Update dependency resolver if adding new components**
12. ✅ **Test CLI functionality with the new/modified components**

## Enterprise CLI Development Guidelines

### Adding New CLI Commands
1. Create command file in `cli/src/commands/`
2. Add Zod schema for options validation
3. Implement error handling with structured errors
4. Add comprehensive tests
5. Update CLI-README.md documentation

### Modifying Services
1. Maintain backwards compatibility
2. Add unit tests for new functionality
3. Use TypeScript strict mode
4. Handle all error cases gracefully
5. Update type definitions

### CLI Testing Requirements
- All new services must have 100% test coverage
- Integration tests for command workflows
- Error scenario testing
- Filesystem operation testing with memfs

This enterprise-grade CLI system provides the foundation for a production-ready component distribution system that rivals and exceeds shadcn/ui in functionality and reliability.