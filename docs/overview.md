# Leshi UI - Project Overview

A professional CLI for React Native that enables developers to build beautiful applications with copy-paste components, comprehensive theming, and excellent developer experience.

## 🎯 What is Leshi UI?

Leshi UI is a **component distribution system** that brings a proven copy-paste philosophy to React Native development. Instead of traditional component libraries that lock you into specific versions and APIs, Leshi UI gives you **full ownership** of your components through a sophisticated CLI that copies production-ready code directly into your project.

### **Core Philosophy**

```
┌─────────────────────────────────────────────────────────┐
│  "Copy, Don't Import" - Own Your Components            │
│                                                         │
│  ✅ Full customization control                          │
│  ✅ No runtime dependencies                             │
│  ✅ Zero vendor lock-in                                 │
│  ✅ TypeScript-first development                        │
│  ✅ Production-ready patterns                           │
└─────────────────────────────────────────────────────────┘
```

## 🏗️ Architecture Overview

### **System Components**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Enterprise    │    │   Component     │    │     Demo        │
│      CLI        │ -> │   Packages      │ -> │  Applications   │
│  (TypeScript)   │    │  (RN + Unist.)  │    │   (Expo)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        v                       v                       v
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Atomic Ops     │    │  Theme System   │    │  Real Examples  │
│  Dependency     │    │  StyleSheet     │    │  Interactive    │
│  Resolution     │    │  Variants       │    │  Testing        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Key Features**

#### 🚀 **Enterprise CLI**

- **Atomic Operations**: All-or-nothing file operations with automatic rollback
- **Multi-Pass Dependency Resolution**: Automatically resolves component dependencies
- **Framework Detection**: Auto-detects Expo, React Native, or Expo Router
- **Import Transformation**: Babel AST-based import path fixing
- **TypeScript Integration**: Full TypeScript support with validation

#### 📦 **Component System**

- **Dual Architecture**: React Native StyleSheet + Unistyles v3 variants
- **Theme-First Design**: All components built with comprehensive theming
- **Variant System**: Primary, secondary, outline, ghost patterns with consistent APIs
- **Size Consistency**: sm/base/lg sizing system across all components
- **Performance Optimized**: StyleSheet.create patterns, minimal re-renders

#### 🎨 **Advanced Theming**

- **Context-Based**: React Context with system/manual theme switching
- **Type-Safe**: Full TypeScript theme definitions
- **Extensible**: Easy custom theme creation and overrides
- **Platform-Aware**: Web and mobile optimizations

## 📊 Current Status (v0.0.16-beta.3)

### **Production Features**

- ✅ **CLI System**: Enterprise-grade with comprehensive error handling
- ✅ **Component Library**: 15+ production-ready components
- ✅ **Theme System**: Complete theming with light/dark modes
- ✅ **TypeScript**: 100% TypeScript coverage
- ✅ **Testing**: Comprehensive unit + E2E test suite
- ✅ **CI/CD**: Enterprise-grade automation
- ✅ **Documentation**: Complete developer documentation

### **Available Components**

```
UI Components:
├── button (variants: primary, secondary, outline, ghost, destructive)
├── text (variants: heading, body, caption with size system)
├── modal (with portal integration and animations)
├── input (with validation and error states)
├── icon (with custom icon support)
├── avatar (with fallbacks and sizes)
├── badge (with variants and sizes)
├── dialog (with animations and backdrop)
├── progress (linear with theming)
├── divider (horizontal/vertical)
├── skeleton (with animations)
└── switch (with smooth animations)

Utilities:
├── theme system (context + hooks)
├── modal utilities (portal management)
├── color utilities (theme helpers)
└── styling utilities (common patterns)
```

## 🛠️ Technology Stack

### **CLI Technology**

- **Language**: TypeScript with ES modules
- **Runtime**: Node.js 16+ (Bun recommended for development)
- **Dependencies**: Commander, Inquirer, Chalk, Ora, fs-extra, Zod
- **Testing**: Jest + Bun test with memfs mocking
- **Build**: TypeScript compiler with asset bundling

### **Component Technology**

- **React Native**: 0.72+ with modern patterns
- **Styling**: StyleSheet.create + Unistyles v3 alternatives
- **Theming**: React Context with TypeScript definitions
- **Animation**: React Native Reanimated (where needed)
- **Icons**: Lucide React Native (customizable)

### **Development Stack**

- **Package Manager**: Bun (development) / npm (publishing)
- **Linting**: ESLint with TypeScript rules
- **Testing**: Jest (coverage) + Bun (speed)
- **CI/CD**: GitHub Actions with multi-stage pipeline
- **Demo**: Expo with router for component showcase

## 🎯 Design Principles

### **1. Developer Experience First**

```bash
# Simple, intuitive commands
leshi-ui init                    # Setup in seconds
leshi-ui add component button    # Install with dependencies
leshi-ui list component          # Discover components
leshi-ui guide component button  # Built-in documentation
```

### **2. Performance by Default**

- **Zero Runtime Overhead**: No component library bundle
- **Optimized Patterns**: StyleSheet.create for all styling
- **Minimal Re-renders**: Efficient theme context design
- **Tree-Shakeable**: Only copy components you use

### **3. Enterprise Ready**

- **Atomic Operations**: Bulletproof file operations
- **Error Recovery**: Automatic rollback on failures
- **Comprehensive Testing**: Unit + Integration + E2E
- **Production Validation**: Real-world usage patterns

### **4. Mobile-First Design**

- **Touch Targets**: Minimum 44px interactive elements
- **Platform Conventions**: iOS/Android design guidelines
- **Responsive**: Adaptive layouts for different screen sizes
- **Accessibility**: Built-in accessibility patterns

## 🚀 Getting Started

### **Quick Installation**

```bash
# Install CLI globally
npm install -g leshi-ui

# Initialize in your React Native project
leshi-ui init

# Add your first component
leshi-ui add component button
```

### **What Gets Installed**

```
your-project/
├── components/ui/
│   ├── button.tsx              # Component implementation
│   └── theme-provider.tsx      # Theme context
├── styles/
│   ├── theme.ts               # Theme definitions
│   └── colors.ts              # Color system
├── lib/
│   └── utils.ts               # Utility functions
└── leshi-ui.json              # Project configuration
```

## 🎨 Theming System

### **Theme Structure**

```typescript
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    // ... complete color system
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  spacing: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    base: number;
    lg: number;
  };
}
```

### **Usage Example**

```typescript
import { useTheme } from "./components/ui/theme-provider";

export const MyComponent = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.base,
      borderRadius: theme.borderRadius.base,
    },
  });

  return <View style={styles.container} />;
};
```

## 📱 Platform Support

### **React Native Platforms**

- ✅ **iOS**: Native iOS styling and interactions
- ✅ **Android**: Material Design adaptations
- ✅ **Web**: React Native Web with responsive design
- ✅ **Windows/macOS**: Cross-platform support available

### **Framework Support**

- ✅ **Expo**: Full Expo SDK integration
- ✅ **React Native CLI**: Bare React Native projects
- ✅ **Expo Router**: File-based routing support
- ✅ **TypeScript**: First-class TypeScript support

## 🔄 Comparison with Alternatives

| Feature            | Leshi UI           | NativeBase      | React Native Elements | Tamagui         |
| ------------------ | ------------------ | --------------- | --------------------- | --------------- |
| **Ownership**      | ✅ Copy & Own      | ❌ Dependency   | ❌ Dependency         | ❌ Dependency   |
| **Bundle Size**    | ✅ Zero runtime    | ❌ Large bundle | ❌ Large bundle       | ⚠️ Medium       |
| **Customization**  | ✅ Full control    | ⚠️ Limited      | ⚠️ Limited            | ✅ High         |
| **TypeScript**     | ✅ 100% coverage   | ✅ Good         | ⚠️ Partial            | ✅ Excellent    |
| **Performance**    | ✅ Optimal         | ⚠️ Good         | ⚠️ Good               | ✅ Excellent    |
| **Learning Curve** | ✅ Minimal         | ❌ Steep        | ✅ Easy               | ❌ Steep        |
| **Maintenance**    | ✅ Self-maintained | ❌ External dep | ❌ External dep       | ❌ External dep |

## 🎯 Use Cases

### **Perfect For:**

- 🏢 **Enterprise Applications**: Full control and customization
- 🚀 **Startups**: Rapid prototyping with production-ready code
- 👩‍💻 **Freelancers**: Consistent component library across projects
- 🎨 **Design Systems**: Custom design system implementation
- 📱 **Cross-Platform Apps**: Unified component system

### **Not Ideal For:**

- 🏃‍♂️ **Quick Prototypes**: Use if you plan to customize heavily
- 👶 **Learning Projects**: May be overkill for simple learning apps
- 🔒 **Locked Ecosystems**: If you prefer dependency-managed libraries

## 💡 Extensible Architecture

Leshi UI is designed with extensibility and community contributions in mind:

- 🔧 **Plugin-Ready Architecture**: Built with extension patterns for community contributions
- 🌐 **Multi-Framework Support**: Designed to support additional frameworks through adapters
- 📊 **Analytics-Ready**: Architecture supports usage tracking and optimization features
- 🤖 **AI-Friendly**: Component generation patterns ready for AI assistance integration

## 🤝 Community & Support

- **GitHub**: [Leshi UI Repository](https://github.com/AgustinOberg/leshi-ui)
- **Issues**: [Bug Reports & Feature Requests](https://github.com/AgustinOberg/leshi-ui/issues)
- **Discussions**: [Community Discussions](https://github.com/AgustinOberg/leshi-ui/discussions)
- **License**: MIT (completely free and open source)
- **Maintainer**: [Agustin Oberg](https://www.linkedin.com/in/oberg-agustin)

---

**Ready to get started?** Check out our [Quick Start Guide](./quick-start.md) or explore the [CLI Usage](./cli-usage.md) documentation.
