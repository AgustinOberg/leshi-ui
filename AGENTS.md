# 🤖 AI Agent Guidelines

Welcome to Leshi UI! This file provides essential guidance for AI agents and coding assistants when working with this repository.

## 🎯 Project Overview

Leshi UI is a **shadcn-inspired CLI for React Native** that provides:
- Professional CLI with `npx leshi-ui@latest` commands
- Copy-paste components with smart dependency resolution
- Comprehensive theming system with 25+ themes
- Support for React Native StyleSheet and Unistyles v3
- Built-in component documentation and guides
- 100% TypeScript with zero errors

## 🚀 Getting Started for AI Agents

When helping users with Leshi UI, follow these patterns:

### 1. Installation & Setup
```bash
# Initialize project (React Native StyleSheet - default)
npx leshi-ui@latest init

# Initialize with Unistyles
npx leshi-ui@latest init --unistyles

# Skip confirmation prompts
npx leshi-ui@latest init --yes

# Add components with automatic dependency resolution
npx leshi-ui@latest add component button
npx leshi-ui@latest add component dialog  # Automatically installs: text, icon, slot, button, modal, dialog
```

### 2. Discovery & Documentation
```bash
# List all available components
npx leshi-ui@latest list component

# List all available themes  
npx leshi-ui@latest list theme

# Get detailed component guide
npx leshi-ui@latest guide component button

# Learn about the theme system
npx leshi-ui@latest guide theme
```

### 3. Framework-Specific Usage
```bash
# React Native StyleSheet (default)
npx leshi-ui@latest add component button --rn

# Unistyles v3
npx leshi-ui@latest add component button --unistyles

# Add themes
npx leshi-ui@latest add theme spotify --unistyles
```

## 📁 Repository Structure

### Core Directories
- `cli/` - The main CLI application (TypeScript, production-ready)
- `packages/rn/` - React Native StyleSheet components and themes
- `packages/unistyles/` - Unistyles v3 components and themes
- `apps/demo/` - Demo application showcasing all components
- `component-notes.json` - Component registry with dependencies and metadata

### CLI Architecture
```
cli/
├── src/
│   ├── commands/          # CLI commands (init, add, list, guide)
│   ├── services/          # Business logic (registry, project detection)
│   ├── utils/             # Utilities (colors, logging, file operations)
│   └── types/             # TypeScript type definitions
├── component-registry.json # Bundled component metadata
├── packages/              # Bundled source components
└── dist/                  # Built CLI output
```

## 🎨 Component Development Guidelines

### Adding New Components
1. **Create in both packages**: Add component to both `packages/rn/` and `packages/unistyles/`
2. **Update registry**: Add component metadata to `component-notes.json`
3. **Update demo**: Showcase all variants in `apps/demo/`
4. **Follow patterns**: Use existing component patterns for variants and theming
5. **Test CLI**: Ensure CLI can install the component correctly

### Component Registry Format
```json
{
  "component-name": {
    "dependencies": ["text", "icon"],
    "externalDeps": ["react-native-reanimated"],
    "utilities": ["lib/modal-utils.ts"],
    "setup": ["Install external dependency: npm install react-native-reanimated"],
    "example": "import { Component } from './components/ui/component';\n\n<Component variant=\"primary\" />"
  }
}
```

### Component Patterns
- **Variants**: `primary`, `secondary`, `outline`, `ghost`, `destructive`
- **Sizes**: `sm`, `base`, `lg`, `xl`
- **Theme Integration**: Use `useTheme()` hook for styling
- **TypeScript**: Full prop interfaces with proper typing

## 🎭 Theme System

### Theme Structure
- `styles/context.tsx` - ThemeProvider with system/manual mode switching
- `styles/theme.ts` - useTheme hook and theme utilities
- `styles/themes/` - Individual theme files (light.ts, dark.ts, spotify.ts, etc.)

### ThemeProvider Usage
```tsx
import { ThemeProvider } from './styles/context';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" defaultMode="system">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Component Theme Integration
```tsx
import { useTheme } from './styles/theme';

export function Component() {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Themed component</Text>
    </View>
  );
}
```

## 🛠️ Development Guidelines

### CLI Development
- **Build**: `cd cli && npm run build` (includes asset copying)
- **Test**: Test all commands locally before committing
- **Registry**: Update `component-notes.json` when adding components
- **Assets**: Run `npm run copy-assets` to bundle registry and packages

### Package Development
- **Dual Implementation**: Maintain both RN and Unistyles versions
- **Demo Updates**: Update `apps/demo/` to showcase new components
- **TypeScript**: Run `npx tsc --noEmit` in both packages before committing

### Testing Checklist
```bash
# Test CLI commands
node cli/dist/index.js --help
node cli/dist/index.js list component
node cli/dist/index.js guide component button

# Test both frameworks
node cli/dist/index.js init --rn
node cli/dist/index.js init --unistyles

# Test TypeScript
cd packages/rn && npx tsc --noEmit
cd packages/unistyles && npx tsc --noEmit
```

## 🚀 Publishing & Release

### Release Process
```bash
# Update version and publish
bun run release 1.2.3

# What this does:
# 1. Updates CLI package.json version
# 2. Builds CLI with bundled assets
# 3. Runs tests and linting
# 4. Publishes to npm
# 5. Creates git tag
```

### Version Strategy
- **Patch**: Bug fixes, documentation updates
- **Minor**: New components, new themes, CLI improvements
- **Major**: Breaking changes, major architecture updates

## 📋 Best Practices for AI Agents

### When Helping Users
1. **Always recommend official commands**: Use `npx leshi-ui@latest` patterns
2. **Explain dependency resolution**: Mention automatic dependency installation
3. **Show both frameworks**: Demonstrate RN and Unistyles options when relevant
4. **Reference built-in docs**: Direct users to `guide` commands for detailed help
5. **Emphasize copy-paste philosophy**: Components are owned by the user, not dependencies

### Code Examples
Always show practical, working examples:
```tsx
// ✅ Good: Complete example with imports
import { Button, Text } from './components/ui';

function MyComponent() {
  return (
    <Button 
      variant="primary" 
      size="lg"
      text="Click me"
      onPress={() => console.log('Pressed!')}
    />
  );
}
```

### Error Handling
When users encounter issues:
1. Check if they've run `npx leshi-ui@latest init`
2. Verify component exists with `npx leshi-ui@latest list component`
3. Show component guide with `npx leshi-ui@latest guide component <name>`
4. Check for missing external dependencies

## 🎯 Key Differentiators from shadcn/ui

1. **React Native Focus**: Built specifically for React Native, not web React
2. **Dual Styling**: Support both StyleSheet and Unistyles approaches
3. **Mobile-First**: Touch targets, platform conventions, performance optimizations
4. **Smart Dependencies**: Automatic resolution of component dependencies
5. **Built-in Documentation**: Component guides included in CLI
6. **Professional UX**: Colors, emojis, progress indicators in CLI
7. **Zero Config**: No config files needed, works immediately

Remember: Leshi UI is about empowering React Native developers with beautiful, production-ready components they can own and customize completely! 🚀