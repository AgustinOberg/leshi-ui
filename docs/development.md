# Development Guide

Comprehensive guide for developing, contributing to, and extending the Leshi UI ecosystem. This guide covers everything from local setup to advanced development workflows.

## 🛠️ Development Environment Setup

### **Prerequisites**

```bash
# Required tools
Node.js 18+ (20+ recommended)
Bun (recommended for development)
npm (required for publishing)
Git

# Platform-specific requirements
# iOS: Xcode, CocoaPods
# Android: Android Studio, Java 11+
```

### **Repository Setup**

```bash
# Clone the repository
git clone https://github.com/AgustinOberg/leshi-ui.git
cd leshi-ui

# Install dependencies (uses bun.lockb)
bun install

# Verify setup
bun run --help
```

### **Project Structure**

```
leshi-ui/
├── cli/                         # Enterprise CLI package
│   ├── src/
│   │   ├── commands/            # CLI command implementations
│   │   ├── services/            # Business logic services
│   │   ├── types/               # TypeScript type definitions
│   │   └── utils/               # Utility functions
│   ├── scripts/             # Development and CI scripts
│   ├── dist/                # Built CLI output
│   └── package.json         # CLI package configuration
├── packages/                    # Component packages
│   ├── rn/                  # React Native StyleSheet components
│   └── unistyles/           # Unistyles v3 components
├── apps/                        # Demo applications
│   ├── demo/                # Main component showcase
│   └── playground/          # Development playground
├── docs/                        # Centralized documentation
├── scripts/                     # Root-level build scripts
└── package.json                 # Root package configuration
```

## 🚀 Quick Development Commands

### **CLI Development**

```bash
# Navigate to CLI directory
cd cli

# Development workflow
bun run build              # Build TypeScript CLI
bun run dev                # Watch mode development
bun run test               # Run unit tests
bun run test:e2e           # End-to-end testing
bun run lint               # ESLint validation
bun run test:typescript    # TypeScript validation

# Quality assurance
bun run pre-commit         # Comprehensive pre-commit checks
bun run test:all           # Complete test suite
```

### **Demo App Development**

```bash
# Navigate to demo app
cd apps/demo

# Start development server
bun start                  # Start Expo dev server
bun run ios                # iOS simulator
bun run android            # Android emulator
bun run web                # Web browser

# Production builds
bun run build              # Build for production
```

### **Component Package Development**

```bash
# React Native StyleSheet components
cd packages/rn
npx tsc --noEmit          # TypeScript validation

# Unistyles components
cd packages/unistyles
npx tsc --noEmit          # TypeScript validation
```

## 🏗️ CLI Development

### **CLI Architecture**

The CLI follows enterprise patterns with atomic operations and comprehensive error handling:

```typescript
// Service-oriented architecture
services/
├── component-registry.ts     # Component metadata management
├── github-service.ts         # GitHub API integration
├── github-project-service.ts # GitHub project operations
└── project-service.ts        # Local project management

// Command implementations
commands/
├── init.ts                   # Project initialization
├── add.ts                    # Component installation
├── list.ts                   # Component listing
└── guide.ts                  # Documentation command
```

### **Adding New CLI Commands**

1. **Create Command File**:
```typescript
// cli/src/commands/new-command.ts
import { Command } from 'commander';
import { z } from 'zod';
import { Logger } from '../utils/logger.js';

const optionsSchema = z.object({
  example: z.boolean().default(false),
});

export function createNewCommand(): Command {
  return new Command()
    .name('new-command')
    .description('Description of new command')
    .option('--example', 'Example option')
    .action(async (options) => {
      const validatedOptions = optionsSchema.parse(options);
      
      try {
        Logger.info('Executing new command...');
        // Implementation here
        Logger.success('Command completed successfully!');
      } catch (error) {
        Logger.error('Command failed:', error);
        process.exit(1);
      }
    });
}
```

2. **Register Command**:
```typescript
// cli/src/index.ts
import { createNewCommand } from './commands/new-command.js';

program.addCommand(createNewCommand());
```

3. **Add Tests**:
```typescript
// cli/src/__tests__/new-command.test.ts
import { createNewCommand } from '../commands/new-command.js';

describe('new-command', () => {
  it('should execute successfully', async () => {
    // Test implementation
  });
});
```

### **CLI Testing Strategy**

#### **Unit Tests**
```bash
# Run specific test files
bun test component-registry.test.ts

# Run with coverage
bun run test:coverage

# Watch mode
bun test --watch
```

#### **E2E Testing**
```bash
# Test with local packages
bun run test:e2e

# Test with GitHub integration
bun run test:e2e-github

# Test specific scenarios
bun run test:e2e-simple
```

#### **TypeScript Validation**
```bash
# Validate CLI TypeScript
bun run test:typescript

# Validate all packages
node scripts/validate-typescript.js
```

### **Error Handling Patterns**

The CLI uses structured error handling:

```typescript
// Structured error types
export class ComponentNotFoundError extends Error {
  constructor(componentName: string) {
    super(`Component '${componentName}' not found`);
    this.name = 'ComponentNotFoundError';
  }
}

// Usage in commands
try {
  const component = await ComponentRegistryService.getComponent(name);
  if (!component) {
    throw new ComponentNotFoundError(name);
  }
} catch (error) {
  if (error instanceof ComponentNotFoundError) {
    Logger.error(error.message);
    Logger.info('Run `leshi-ui list component` to see available components');
  } else {
    Logger.error('Unexpected error:', error);
  }
  process.exit(1);
}
```

## 📦 Component Development

### **Component Development Workflow**

1. **Design Component API**:
```typescript
// Define clear TypeScript interfaces
export interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'base' | 'lg';
  children: React.ReactNode;
  onPress?: () => void;
}
```

2. **Implement Component**:
```typescript
// Follow established patterns
export const Component = ({ 
  variant = 'primary', 
  size = 'base',
  children,
  ...props 
}: ComponentProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  return (
    <Pressable 
      style={[styles.base, styles[variant], styles[size]]} 
      {...props}
    >
      {children}
    </Pressable>
  );
};

// Always use StyleSheet.create
const createStyles = (theme: Theme) => StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing.base,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  sm: {
    paddingVertical: theme.spacing.sm,
  },
});
```

3. **Register Dependencies**:
```typescript
// Update cli/src/services/component-registry.ts
const COMPONENT_REGISTRY = {
  'new-component': {
    name: 'new-component',
    type: 'registry:ui',
    dependencies: ['text', 'icon'],           // Component dependencies
    externalDeps: ['some-package'],           // npm dependencies  
    utilities: ['lib/component-utils.ts'],    // Utility files
    providers: [],                            // Provider components
    setup: [                                  // Setup instructions
      'Install external dependency: bun add some-package'
    ],
    description: 'Component description'
  }
};
```

4. **Add to Demo App**:
```typescript
// apps/demo/app/components/NewComponent.tsx
import { NewComponent } from '../../components/ui/new-component';

export default function NewComponentDemo() {
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text variant="heading" size="xl">New Component</Text>
      
      {/* Show all variants */}
      <Section title="Variants">
        <NewComponent variant="primary">Primary</NewComponent>
        <NewComponent variant="secondary">Secondary</NewComponent>
      </Section>
      
      {/* Show all sizes */}
      <Section title="Sizes">
        <NewComponent size="sm">Small</NewComponent>
        <NewComponent size="base">Base</NewComponent>
        <NewComponent size="lg">Large</NewComponent>
      </Section>
      
      {/* Interactive examples */}
      <Section title="Interactive">
        <NewComponent onPress={() => alert('Pressed!')}>
          Clickable Component
        </NewComponent>
      </Section>
    </ScrollView>
  );
}
```

### **Component Guidelines**

#### **API Design**
- **Consistent Props**: Follow modern patterns (`variant`, `size`, `children`)
- **Sensible Defaults**: Always provide good default values
- **TypeScript First**: Complete type definitions
- **Composition Friendly**: Design for component composition

#### **Performance**
- **StyleSheet.create**: Always use for styles
- **useMemo**: Memoize expensive calculations
- **Avoid Inline Styles**: Use StyleSheet for performance
- **Minimal Re-renders**: Optimize theme context usage

#### **Accessibility**
- **Touch Targets**: Minimum 44px for interactive elements
- **Screen Readers**: Proper accessibility labels
- **Keyboard Navigation**: Support where applicable
- **Color Contrast**: Follow WCAG guidelines

### **Unistyles v3 Development**

For Unistyles variants, follow the official v3 API:

```typescript
// packages/unistyles/components/ui/component.tsx
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    variants: {
      size: {
        small: { padding: theme.spacing.sm },
        large: { padding: theme.spacing.lg }
      },
      variant: {
        primary: { backgroundColor: theme.colors.primary },
        secondary: { backgroundColor: theme.colors.secondary }
      }
    },
    compoundVariants: [
      {
        size: 'small',
        variant: 'primary',
        style: {
          borderWidth: 2
        }
      }
    ]
  }
}));

export const Component = ({ size = 'small', variant = 'primary' }) => {
  styles.useVariants({ size, variant });
  
  return <View style={styles.container} />;
};
```

## 🧪 Testing Strategy

### **Component Testing**

Components use copy-paste philosophy, so testing focuses on integration:

```typescript
// Test in demo app
// Manual testing across platforms
// Visual regression testing
// Accessibility testing
```

### **CLI Testing (Comprehensive)**

#### **Unit Tests (Jest + Bun)**
```typescript
// cli/src/__tests__/services/component-registry.test.ts
import { ComponentRegistryService } from '../../services/component-registry.js';

describe('ComponentRegistryService', () => {
  beforeEach(() => {
    // Reset cache
    ComponentRegistryService['registryCache'] = null;
  });
  
  it('should load registry from GitHub', async () => {
    const registry = await ComponentRegistryService.getRegistry();
    expect(registry).toBeDefined();
    expect(registry.button).toBeDefined();
  });
  
  it('should resolve dependencies correctly', async () => {
    const resolved = await ComponentRegistryService.resolveDependencies(['modal']);
    expect(resolved).toContain('text');
    expect(resolved).toContain('button');
    expect(resolved).toContain('modal');
  });
});
```

#### **E2E Tests (Integration)**
```bash
# E2E test structure
test-cli-integration/
├── react-native-stylesheet/    # StyleSheet variant testing
└── react-native-unistyles/     # Unistyles variant testing

# Each test project validates:
# ✓ CLI initialization
# ✓ Component installation
# ✓ Dependency resolution
# ✓ TypeScript compilation
# ✓ Import transformation
```

### **Demo App Testing**

```bash
# Visual testing
cd apps/demo
bun start

# Platform testing
bun run ios      # iOS simulator
bun run android  # Android emulator
bun run web      # Web browser

# Build testing
bun run build    # Production build validation
```

## 🔄 Release Process

### **Automated Release Workflow**

```bash
# Version increment and release
cd cli
bun run release 0.0.17-beta.1   # Specific version
bun run release patch            # Auto-increment patch
bun run release minor            # Auto-increment minor
bun run release major            # Auto-increment major
```

### **Release Process Steps**

1. **Pre-release Validation**:
   - Complete test suite execution
   - TypeScript validation
   - ESLint compliance
   - E2E test validation
   - Production build verification

2. **Version Management**:
   - Semantic versioning (MAJOR.MINOR.PATCH)
   - Git tag creation
   - Changelog generation
   - Package.json updates

3. **Publication**:
   - npm package publishing
   - GitHub release creation
   - Documentation updates

### **Manual Release Steps**

```bash
# If automation fails
cd cli

# 1. Validate everything
bun run test:all

# 2. Build for production
bun run build

# 3. Update version
npm version patch

# 4. Create git tag
git tag v0.0.17-beta.1

# 5. Push to GitHub
git push origin main
git push origin v0.0.17-beta.1

# 6. Publish to npm
npm publish
```

## 📊 CI/CD Development

### **GitHub Actions Workflow**

The project uses a multi-stage CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  quality-check:
    # TypeScript + ESLint + Build
    
  unit-tests:
    # Jest unit tests (Node 18, 20)
    
  e2e-local:
    # E2E with local packages
    
  e2e-github:
    # E2E with GitHub (main only)
    
  deployment-ready:
    # Package validation (main only)
```

### **Local CI Simulation**

```bash
# Simulate CI pipeline locally
cd cli

# Stage 1: Quality check
bun run test:typescript
bun run lint
bun run build

# Stage 2: Unit tests
bun test

# Stage 3: E2E tests
bun run test:e2e

# Stage 4: Full pipeline
bun run test:all
```

## 🛠️ Development Tools

### **Recommended VSCode Extensions**

```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-typescript.typescript",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-react-native"
  ]
}
```

### **VSCode Settings**

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.expo": true
  }
}
```

### **Development Scripts**

```bash
# Root level scripts
scripts/
├── pre-commit.js           # Pre-commit validation
├── release.js              # Release automation
├── test-all.js             # Complete test suite
├── test-e2e-*.js           # E2E test variants
└── validate-typescript.js  # TypeScript validation

# CLI specific scripts
cli/scripts/
├── pre-commit.js           # CLI pre-commit checks
├── release.js              # CLI release process
└── test-*.js               # Various test scripts
```

## 🎨 Theme Development

### **Adding New Themes**

1. **Create Theme File**:
```typescript
// packages/rn/styles/themes/new-theme-light.ts
import { Theme } from '../theme';
import { commonColors, commonSpacing } from './common';

export const newThemeLight: Theme = {
  colors: {
    ...commonColors,
    primary: '#your-primary-color',
    background: '#ffffff',
    // ... complete color system
  },
  spacing: commonSpacing,
  borderRadius: {
    sm: 4,
    base: 8,
    lg: 12,
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
};
```

2. **Register Theme**:
```typescript
// packages/rn/styles/themes/index.ts
export { newThemeLight } from './new-theme-light';
export { newThemeDark } from './new-theme-dark';
```

3. **Add to Demo**:
```typescript
// apps/demo/app/Theme.tsx
const availableThemes = {
  // existing themes...
  'new-theme': {
    light: newThemeLight,
    dark: newThemeDark,
  },
};
```

## 💬 Debugging

### **CLI Debugging**

```bash
# Enable verbose logging
leshi-ui add component button --verbose

# Debug specific issues
cd cli
bun run test:e2e --verbose

# Check CLI state
cat leshi-ui.json
npx tsc --noEmit
```

### **Component Debugging**

```typescript
// Debug theme issues
const { theme } = useTheme();
console.log('Current theme:', theme);

// Debug StyleSheet
const styles = createStyles(theme);
console.log('Generated styles:', styles);

// Debug props
console.log('Component props:', { variant, size, ...props });
```

### **Demo App Debugging**

```bash
# Metro bundler logs
bun start --verbose

# Platform-specific debugging
bun run ios --verbose
bun run android --verbose

# Clear cache
bun start --clear-cache
```

## 📚 Learning Resources

### **Internal Documentation**
- [Architecture Guide](./architecture.md) - System design details
- [CLI Usage](./cli-usage.md) - Complete CLI reference
- [Component Guide](./components.md) - Component catalog
- [Contributing](./contributing.md) - Contribution guidelines

### **External Resources**
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Unistyles v3 Documentation](https://www.unistyl.es/v3/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Native Design Guidelines](https://reactnative.dev/docs/design) - Platform design principles

## 🔗 Development Workflows

### **Daily Development**

```bash
# Morning routine
git pull origin main
bun install
cd cli && bun run build

# Feature development
git checkout -b feature/new-component
# ... development work ...
bun run pre-commit
git commit -m "feat: add new component"

# Pre-merge validation
bun run test:all
git push origin feature/new-component
```

### **Component Development**

```bash
# 1. Design and implement component
cd packages/rn/components/ui
# ... create component ...

# 2. Register dependencies
cd ../../../cli/src/services
# ... update component-registry.ts ...

# 3. Add to demo
cd ../../../apps/demo/app/components
# ... create demo screen ...

# 4. Test everything
cd ../../../cli
bun run test:all
```

### **Bug Fix Workflow**

```bash
# 1. Reproduce issue
cd cli
bun run test:e2e

# 2. Write failing test
# ... add test case ...

# 3. Fix implementation
# ... fix code ...

# 4. Validate fix
bun run test
bun run test:e2e

# 5. Submit fix
git commit -m "fix: resolve component installation issue"
```

---

## 🎉 Getting Started

Ready to contribute? Start with:

1. **Fork the repository**
2. **Set up development environment**
3. **Run the test suite**
4. **Pick an issue or feature**
5. **Follow the development workflow**

For detailed contribution guidelines, see [Contributing Guide](./contributing.md).

**Need help?** Open an issue or start a discussion on GitHub!
