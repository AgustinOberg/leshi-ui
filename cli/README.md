# Leshi UI CLI

A powerful, professional CLI for React Native UI components. Build beautiful React Native apps with copy-paste components, comprehensive theming, and excellent developer experience.

![npm](https://img.shields.io/npm/v/leshi-ui?color=%2332C037&label=npm) ![license](https://img.shields.io/badge/license-MIT-blue) ![node version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)

## 🚀 Features

- ✨ **Intuitive CLI** — Clean command patterns with `npx leshi-ui@latest`
- 🧠 **Smart Dependency Resolution** — Automatic component dependency management
- 🎨 **Dual Framework Support** — React Native StyleSheet and Unistyles v3
- 📦 **Zero Configuration** — No config files, works out of the box
- 🎯 **Professional UX** — Beautiful CLI with colors, emojis, and helpful messages
- 🛡️ **Type Safety** — 100% TypeScript with zero errors
- 📖 **Built-in Documentation** — Component guides and examples included
- 🌐 **Universal Package Manager** — Works with npm, bun, pnpm, yarn

## 🎯 Quick Start

```bash
# 1. Initialize your project
npx leshi-ui@latest init

# 2. Add components
npx leshi-ui@latest add component button

# 3. Explore what's available
npx leshi-ui@latest list component
```

## 📋 Commands

### Initialize Project
```bash
npx leshi-ui@latest init [--rn|--unistyles] [--yes]
```

### Add Components
```bash
npx leshi-ui@latest add component <names...> [--rn|--unistyles] [--overwrite] [--yes]
```

### Add Themes
```bash
npx leshi-ui@latest add theme <names...> [--rn|--unistyles] [--overwrite] [--yes]
```

### List & Explore
```bash
npx leshi-ui@latest list component [--rn|--unistyles]
npx leshi-ui@latest list theme [--rn|--unistyles]
npx leshi-ui@latest guide component <name>
npx leshi-ui@latest guide theme
```

## 🎯 Available Components

Over 18 production-ready components with smart dependency resolution:

| Component | Description | Dependencies | External Deps |
|-----------|-------------|--------------|---------------|
| **button** | Versatile button with variants and sizes | `text` | None |
| **text** | Typography with semantic variants | None | None |
| **modal** | Flexible modal with animations | None | `@gorhom/portal` |
| **dialog** | Dialog built on modal system | `modal`, `text`, `icon`, `slot` | `@gorhom/portal` |
| **surface** | Container with elevation | None | None |
| **text-input** | Input with validation states | `label`, `text` | None |
| **checkbox** | Custom styled checkbox | `icon` | None |
| **switch** | Animated toggle switch | None | `react-native-reanimated` |
| **progress** | Animated progress bar | None | `react-native-reanimated` |
| **skeleton** | Loading skeleton | None | `react-native-reanimated` |
| **avatar** | Avatar with fallback | `text` | None |
| **badge** | Status badges | `text` | None |
| ...and more! | | | |

## 🎨 Theme System

25+ beautiful themes with smart system integration:

```bash
# List all available themes (categorized by light/dark)
npx leshi-ui@latest list theme

# Add any theme to your project
npx leshi-ui@latest add theme spotify

# Learn about the theme system
npx leshi-ui@latest guide theme
```

**Popular themes:** `spotify`, `twitter-dark`, `supabase-light`, `retro-dark`, `ocean-light`, `grape-dark`

## 🧑‍💻 Usage Example

```tsx
// Initialize your project
// npx leshi-ui@latest init

// App.tsx or _layout.tsx
import { ThemeProvider } from './styles/context';
import { Button, Text, Surface } from './components/ui';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" defaultMode="system">
      <Surface variant="accent" padding="lg">
        <Text variant="heading" size="lg">
          Welcome to Leshi UI
        </Text>
        <Button 
          variant="primary" 
          text="Get Started"
          onPress={() => console.log('Hello!')}
        />
      </Surface>
    </ThemeProvider>
  );
}
```

## ⚡️ Key Benefits

### Copy-Paste Philosophy
- ✅ **Full ownership** — Components live in your codebase
- ✅ **Zero runtime overhead** — No component library bundle
- ✅ **Complete customization** — Modify any component
- ✅ **No vendor lock-in** — Your components, your code

### Smart Features
- 🧠 **Automatic dependency resolution** — Adding `dialog` installs `text`, `icon`, `slot`, `button`, `modal`
- ⚠️ **External dependency warnings** — Alerts about required npm packages
- 🔧 **Setup instructions** — Configuration guidance for complex components
- 📖 **Built-in docs** — No need for external documentation

## 📦 Package Manager Support

```bash
npx leshi-ui@latest <command>     # npm
bunx leshi-ui@latest <command>    # bun  
pnpm dlx leshi-ui@latest <command> # pnpm
yarn dlx leshi-ui@latest <command> # yarn
```

## 🎯 Framework Support

### React Native StyleSheet (Default)
- ✅ Uses `StyleSheet.create()` for optimal performance
- ✅ Platform-specific optimizations (iOS/Android/Web)
- ✅ Full TypeScript support

### Unistyles v3
- ✅ Modern CSS-in-JS with better performance
- ✅ Built-in responsive design features
- ✅ Advanced theming capabilities

Switch between frameworks:
```bash
npx leshi-ui@latest add component button --rn      # StyleSheet
npx leshi-ui@latest add component button --unistyles # Unistyles
```

## 🛡️ Error Handling

Professional error messages with helpful suggestions:

```bash
❌ Component 'buttom' not found
💡 Run `npx leshi-ui@latest list component` to see available components

❌ External dependencies required:
  • @gorhom/portal
💡 Install with: npm install @gorhom/portal
```

## 📄 License

MIT License

## 🙏 Credits

Built with ❤️ by [Agustin Oberg](https://www.linkedin.com/in/oberg-agustin)

---

**Ready to build something amazing?**

```bash
npx leshi-ui@latest init
```

Join the community building beautiful React Native apps with leshi-ui! 🚀