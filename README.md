<<<<<<< HEAD
# Leshi CLI

> A **powerful CLI** for managing themes and UI components in React Native and Unistyles projects. Quickly bootstrap themes, scaffold styled components, and maintain a clean, standardized design system.

---

![npm](https://img.shields.io/npm/v/leshi-ui?color=%2332C037&label=npm) ![license](https://img.shields.io/badge/license-MIT-blue) ![node version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen) ![bun version](https://img.shields.io/badge/bun-%3E%3D1.0.0-orange)

---

## ⚡️ Features

✅ **Theme initialization** — Quickly bootstrap `theme` files for React Native or Unistyles
✅ **Add components** — Quickly scaffold styled components
✅ **Add themes** — Create new theme files and auto‑register them
✅ **Easy to use** — Simple CLI syntax with meaningful commands
✅ **Works with** — **Bun**, **npm**, and any Node.js environment

---

## 🚀 Install

With **Bun**:

```bash
bun add -g leshi-ui
```

With **npm**:

```bash
npm install -g leshi-ui
```

---

## 🛠️ Usage

### Initialize Themes

| Command                        | Description                    |
| ------------------------------ | ------------------------------ |
| `bunx leshi-ui init`           | Copy base theme files (light & dark) |
| `bunx leshi-ui init rn`        | Explicit RN theme init         |
| `bunx leshi-ui init unistyles` | Copy Unistyles theme files     |

---

### Add Components

| Command                                          | Description                            |
| ------------------------------------------------ | -------------------------------------- |
| `bunx leshi-ui add component <name>`             | Add a RN component in `components/ui/` |
| `bunx leshi-ui add component <name> --unistyles` | Add a Unistyles component              |

---

### Add Themes

| Command                                      | Description                          |
| -------------------------------------------- | ------------------------------------ |
| `bunx leshi-ui add theme <name>`             | Add RN theme file to `theme/themes/` |
| `bunx leshi-ui add theme <name> --unistyles` | Add Unistyles theme file             |
| `bunx leshi-ui themes`                       | List available themes                |

---

### Others

| Command              | Description                 |
| -------------------- | --------------------------- |
| `bunx leshi-ui help` | List all available commands |

---

## 🧑‍💻 Examples

#### Initialize RN Themes

```bash
bunx leshi-ui init
```
This copies only the **light** and **dark** themes. Use `bunx leshi-ui add theme <name>` to add more.

#### Add a Button Component

```bash
bunx leshi-ui add component button
```

#### Add a New Unistyles Theme

```bash
bunx leshi-ui add theme spotify --unistyles
```

#### See All Available Commands

```bash
bunx leshi-ui help
```

---

## ⚡️ Notes

Some added components will print post‑install messages like:

```
bunx leshi-ui add component modal
# -> message about installing react-native-modal
```

These messages guide you to install optional dependencies or configure related features.

Edit `component-notes.json` if you’d like to customize these messages.

---

## 👥 Contributing

Contributions are always welcome!
If you’d like to help:

1. Fork the repo
2. Create your branch (`git checkout -b feature/my-new-command`)
3. Commit your changes (`git commit -m "feat: add new command"`)
4. Push to the branch (`git push origin feature/my-new-command`)
5. Open a Pull Request

---

## 👤 About the Author

Built with ❤️ by **Agustin Oberg**
[LinkedIn → linkedin.com/in/oberg-agustin](https://www.linkedin.com/in/oberg-agustin)
=======
# 🐱 Leshi UI

> **Modern CLI for React Native** — Build beautiful React Native apps with copy-paste components, comprehensive theming, and excellent developer experience.

![npm](https://img.shields.io/npm/v/leshi-ui?color=%2332C037&label=npm) ![license](https://img.shields.io/badge/license-MIT-blue) ![node version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)

## ✨ Features

- 🎨 **Copy-paste components** — Own your code, don't depend on packages
- 🚀 **Professional CLI** — Intuitive command patterns with `npx leshi-ui@latest`
- ⚡️ **Zero runtime overhead** — Only copy the components you actually use
- 🎭 **Comprehensive theming** — 25+ themes with light/dark mode support
- 📱 **React Native + Web** — Works everywhere React Native does
- 🎨 **StyleSheet + Unistyles** — Choose your preferred styling approach
- 🧠 **Smart dependency resolution** — Automatic component dependency management
- 📖 **Built-in documentation** — Component guides and examples included
- 🔧 **100% TypeScript** — Fully typed with zero TypeScript errors
- 🌟 **Professional UX** — Beautiful CLI with colors, emojis, and helpful messages

## 🚀 Quick Start

No installation required! Use directly with any package manager:

```bash
# React Native StyleSheet (default)
npx leshi-ui@latest init

# Unistyles variant
npx leshi-ui@latest init --unistyles
```

### 1. Initialize Your Project

```bash
# Initialize with React Native StyleSheet
npx leshi-ui@latest init

# Initialize with Unistyles
npx leshi-ui@latest init --unistyles

# Skip confirmation prompts
npx leshi-ui@latest init --yes
```

### 2. Add Components

```bash
# Add a single component
npx leshi-ui@latest add component button

# Add multiple components
npx leshi-ui@latest add component button text modal

# Add with Unistyles
npx leshi-ui@latest add component button --unistyles

# Overwrite existing files
npx leshi-ui@latest add component button --overwrite
```

### 3. Explore and Learn

```bash
# List all available components
npx leshi-ui@latest list component

# Get detailed component guide
npx leshi-ui@latest guide component button

# List all available themes
npx leshi-ui@latest list theme

# Learn about the theme system
npx leshi-ui@latest guide theme
```

## 📋 Commands Reference

### Initialization
```bash
# Initialize with React Native StyleSheet
npx leshi-ui@latest init [--rn] [--yes]

# Initialize with Unistyles  
npx leshi-ui@latest init --unistyles [--yes]
```

### Components
```bash
# Add components (with automatic dependency resolution)
npx leshi-ui@latest add component <name> [--rn|--unistyles] [--overwrite] [--yes]

# List all components
npx leshi-ui@latest list component [--rn|--unistyles]

# Component documentation
npx leshi-ui@latest guide component <name>
```

### Themes
```bash
# Add themes
npx leshi-ui@latest add theme <name> [--rn|--unistyles] [--overwrite] [--yes]

# List all themes
npx leshi-ui@latest list theme [--rn|--unistyles]

# Theme system guide
npx leshi-ui@latest guide theme
```

### Package Manager Support
```bash
npx leshi-ui@latest <command>     # npm
bunx leshi-ui@latest <command>    # bun  
pnpm dlx leshi-ui@latest <command> # pnpm
yarn dlx leshi-ui@latest <command> # yarn
```

## 🎯 Available Components

Over 18 production-ready components with smart dependency resolution:

| Component | Description | Dependencies | External Deps |
|-----------|-------------|--------------|---------------|
| **button** | Versatile button with variants and sizes | `text` | None |
| **text** | Typography with semantic variants | None | None |
| **modal** | Flexible modal with animations | None | `@gorhom/portal` |
| **dialog** | Dialog built on modal system | `modal`, `text`, `icon`, `slot` | `@gorhom/portal` |
| **alert-dialog** | Confirmation dialogs | `modal`, `text`, `button`, `slot` | `@gorhom/portal` |
| **surface** | Container with elevation | None | None |
| **text-input** | Input with validation states | `label`, `text` | None |
| **text-area** | Multi-line text input | `label`, `text` | None |
| **checkbox** | Custom styled checkbox | `icon` | None |
| **switch** | Animated toggle switch | None | `react-native-reanimated` |
| **progress** | Animated progress bar | None | `react-native-reanimated` |
| **skeleton** | Loading skeleton | None | `react-native-reanimated` |
| **avatar** | Avatar with fallback | `text` | None |
| **badge** | Status badges | `text` | None |
| **divider** | Visual separator | None | None |
| **icon** | Icon component | `text` | None |
| **label** | Form labels | `text` | None |
| **radio** | Radio group | `icon` | None |
| **slot** | Component composition | None | None |
| **spinner** | Loading spinner | None | `react-native-reanimated` |

> **Smart Dependencies**: The CLI automatically installs required components and warns about external dependencies.

## 💡 Built-in Documentation

Every component includes comprehensive documentation accessible via CLI:

```bash
# List all components with dependencies and external deps
npx leshi-ui@latest list component

# Get detailed guide for any component
npx leshi-ui@latest guide component button
```

**Component guides include:**
- 📖 Component description and capabilities
- 🔗 leshi-ui component dependencies (automatically installed)
- 📦 External npm dependencies (with install instructions)
- 📋 Step-by-step setup instructions
- 💻 Setup code examples
- 💡 Real usage examples

## 🎨 Comprehensive Theme System

25+ beautiful themes with smart system integration:

```bash
# List all available themes (categorized by light/dark)
npx leshi-ui@latest list theme

# Add any theme to your project
npx leshi-ui@latest add theme spotify

# Learn about the theme system
npx leshi-ui@latest guide theme
```

**Theme Features:**
- 🌓 **Automatic light/dark switching** - Follows system preferences
- 🎨 **25+ pre-built themes** - spotify, twitter, supabase, retro, grape, ocean, etc.
- 🔧 **Manual override** - `defaultMode="manual"` for user control
- ⚡ **Performance optimized** - Minimal re-renders
- 🛡️ **Type-safe** - Full TypeScript theme definitions

**Popular themes:** `spotify`, `twitter-dark`, `supabase-light`, `retro-dark`, `ocean-light`, `grape-dark`, `mono-light`

## 🧑‍💻 Usage Examples

### Basic Component Usage

```tsx
import { Button, Text, Surface } from './components/ui';

function MyComponent() {
  return (
    <Surface variant="accent" padding="lg" radius="md">
      <Text variant="heading" size="lg">
        Welcome to Leshi UI
      </Text>
      <Text variant="body">
        Beautiful components for React Native
      </Text>
      <Button 
        variant="primary" 
        text="Get Started"
        onPress={() => console.log('Hello!')}
      />
    </Surface>
  );
}
```

### Modal & Dialog Components

```tsx
import { Dialog, Button, Text } from './components/ui';
import { useState } from 'react';

function MyDialog() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button text="Open Dialog" />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Confirm Action</Dialog.Title>
        </Dialog.Header>
        <Text>Are you sure you want to continue?</Text>
        <Dialog.Footer>
          <Button variant="outline" text="Cancel" />
          <Button text="Confirm" />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

### Theme Integration

```tsx
import { useTheme } from './styles/theme';
import { View, Text } from 'react-native';

function ThemedComponent() {
  const theme = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg
    }}>
      <Text style={{ 
        color: theme.colors.text,
        fontSize: theme.fonts.sizes.lg 
      }}>
        Themed content that respects user preferences
      </Text>
    </View>
  );
}
```

### Complete App Setup

```tsx
// App.tsx or _layout.tsx
import { ThemeProvider } from './styles/context';
import { ModalProvider } from './components/ui/modal';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" defaultMode="system">
      <ModalProvider>
        <YourApp />
      </ModalProvider>
    </ThemeProvider>
  );
}
```

## ⚡️ Architecture & Philosophy

### Copy-Paste Approach

Leshi UI follows the proven **copy-paste philosophy**:

- ✅ **Full ownership** - Components live in your codebase, you control everything
- ✅ **Zero runtime overhead** - No component library bundle, only what you use
- ✅ **Complete customization** - Modify any component to fit your exact needs
- ✅ **No vendor lock-in** - Your components, your code, your decisions
- ✅ **Framework flexibility** - Choose between StyleSheet or Unistyles

### Performance Optimizations

- **StyleSheet.create()** - All RN components use optimized StyleSheet patterns
- **Unistyles v3** - Modern CSS-in-JS with superior performance
- **Theme context optimization** - Minimal re-renders with smart context design
- **Platform-specific code** - Automatic iOS/Android/Web optimizations
- **Tree-shakeable by nature** - Only install components you actually use

### CLI Features

- **Smart dependency resolution** - Automatically installs required components
- **Professional UX** - Colors, emojis, progress indicators, helpful error messages
- **Framework detection** - Automatically detects React Native project type
- **Built-in documentation** - No need for external docs, everything is in the CLI
- **Universal package manager support** - Works with npm, bun, pnpm, yarn

## 🚀 Publishing & Release

Ready to publish your own version or contribute:

```bash
# Smart release with automatic versioning
bun run release 1.2.3
```

This handles building, testing, publishing to npm, and creating git tags automatically.

## 👥 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository** on GitHub
2. **Clone your fork**: `git clone https://github.com/yourusername/leshi-ui`
3. **Create a feature branch**: `git checkout -b feature/amazing-new-component`
4. **Make your changes** following our guidelines in [AGENTS.md](AGENTS.md)
5. **Test thoroughly**:
   ```bash
   cd cli && npm run build
   node dist/index.js list component
   # Test your changes
   ```
6. **Commit with clear messages**: `git commit -m "feat: add amazing new component"`
7. **Push and create a Pull Request**

### Development Guidelines

- **Component changes**: Update both `packages/rn/` and `packages/unistyles/`
- **CLI changes**: Test all commands locally before committing
- **Registry updates**: Add new components to `component-notes.json`
- **Demo updates**: Showcase new components in `apps/demo/`
- **TypeScript**: Ensure zero TypeScript errors across all packages

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Credits

**Built with ❤️ by [Agustin Oberg](https://www.linkedin.com/in/oberg-agustin)**

Bringing excellent developer experience to React Native development.

---

**☕ Support the project**

If Leshi UI has been helpful for your projects, consider supporting the development:

[![Cafecito](https://img.shields.io/badge/☕_Support_on-Cafecito-orange?style=for-the-badge)](https://cafecito.app/agustin-oberg)

Your support helps maintain and improve this project! 🚀

---

**Ready to build something amazing?** 

```bash
npx leshi-ui@latest init
```

Join the community of developers building beautiful React Native apps with leshi-ui! 🚀
>>>>>>> feature/import-alias
