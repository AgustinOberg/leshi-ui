# 🐱 Leshi UI

> **Beautiful components for React Native** — A powerful CLI tool and component library that enables developers to build their own UI systems with excellent developer experience and performance.

---

![npm](https://img.shields.io/npm/v/leshi-ui?color=%2332C037&label=npm) ![license](https://img.shields.io/badge/license-MIT-blue) ![node version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen) ![bun version](https://img.shields.io/badge/bun-%3E%3D1.0.0-orange)

---

## ✨ Features

🎨 **Copy-paste components** — Own your components, don't depend on them  
🎯 **Intuitive CLI** — Familiar CLI patterns and component APIs  
⚡️ **Performance optimized** — Zero runtime overhead, only components you use  
🎭 **Theme-first design** — Comprehensive theming with light/dark mode support  
📱 **Cross-platform** — Works on React Native (iOS, Android, Web)  
🎨 **Unistyles support** — Alternative styling approach with Unistyles v3  
📖 **Rich documentation** — Built-in component guides and examples  
🔧 **TypeScript ready** — Full TypeScript support with proper types

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

## 🚀 Quick Start

### 1. Initialize Your Project

```bash
# Initialize theme system (React Native)
npx leshi-ui@latest init

# Or for Unistyles
npx leshi-ui@latest init unistyles
```

### 2. Add Components

```bash
# Add a component with automatic setup guidance
npx leshi-ui@latest add component button

# View detailed component guide
npx leshi-ui@latest guide component button
```

### 3. Set Up Modal Components (if needed)

For modal-based components (Modal, Dialog, AlertDialog):

```bash
# Install required dependency
bun add @gorhom/portal

# Add ModalProvider to your _layout.tsx
import { ModalProvider } from './components/ui/modal';

export default function Layout() {
  return (
    <ModalProvider>
      <YourApp />
    </ModalProvider>
  );
}
```

---

## 📚 Commands Reference

### Component Management

| Command                                          | Description                              |
| ------------------------------------------------ | ---------------------------------------- |
| `npx leshi-ui@latest add component <name>`             | Add React Native component               |
| `npx leshi-ui@latest add component <name> --unistyles` | Add Unistyles component                  |
| `npx leshi-ui@latest guide component <name>`           | Show detailed component guide            |
| `npx leshi-ui@latest guide components`                 | List all available components            |

### Theme Management

| Command                                      | Description                          |
| -------------------------------------------- | ------------------------------------ |
| `npx leshi-ui@latest init`                         | Initialize React Native themes       |
| `npx leshi-ui@latest init unistyles`               | Initialize Unistyles themes          |
| `npx leshi-ui@latest add theme <name>`             | Add React Native theme               |
| `npx leshi-ui@latest add theme <name> --unistyles` | Add Unistyles theme                  |
| `npx leshi-ui@latest themes`                       | List available themes                |

### Help & Discovery

| Command                      | Description                 |
| ---------------------------- | --------------------------- |
| `npx leshi-ui@latest help`         | Show all commands           |
| `npx leshi-ui@latest guide --help` | Show guide command help     |

---

## 🎯 Available Components

Leshi UI provides a curated set of components with consistent design patterns:

### Basic Components
- **Text** - Typography with variants (heading, body, caption) and weights
- **Button** - Interactive buttons with variants (primary, secondary, outline, ghost, destructive)
- **Surface** - Container with elevation, padding, and radius variants

### Form Components
- **TextInput** - Input fields with labels, validation states, and helper text
- **TextArea** - Multi-line text input with row control
- **Checkbox** - Checkboxes with custom styling and labels
- **Switch** - Toggle switches with smooth animations

### Layout & Navigation
- **Modal** - Full-screen and centered modals with portal rendering
- **Dialog** - Dialogs with header, content, and footer sections
- **AlertDialog** - Confirmation dialogs with action buttons

### Feedback & Display
- **Badge** - Status indicators and labels
- **Avatar** - User profile images with fallbacks
- **Skeleton** - Loading placeholders with animations
- **Progress** - Progress bars and indicators
- **Icon** - Icon components with customizable sizes and colors

### Utility
- **Label** - Form labels with required indicators
- **Slot** - Component composition utility

---

## 💡 Component Guide System

Each component comes with comprehensive documentation:

```bash
# List all components with dependencies
npx leshi-ui@latest guide components

# Get detailed guide for specific component
npx leshi-ui@latest guide component button
```

Component guides include:
- 📦 **Dependencies** - Required internal and external dependencies
- 📋 **Setup instructions** - Step-by-step installation guide  
- ⚙️ **Setup code** - Code snippets for configuration
- 💡 **Usage examples** - Real-world usage patterns

---

## 🎨 Theme System

Leshi UI uses a powerful theme system supporting:

- **Light/Dark modes** - Automatic system detection and manual control
- **Custom themes** - 25+ pre-built themes (spotify, twitter, supabase, etc.)
- **Type-safe** - Full TypeScript support for theme properties
- **Performance optimized** - Minimal re-renders with optimized context

### Available Themes

Popular themes include: `spotify`, `twitter-light`, `twitter-dark`, `supabase-light`, `supabase-dark`, `retro-dark`, `grape-light`, and many more.

```bash
# List all available themes
npx leshi-ui@latest themes

# Add a specific theme  
npx leshi-ui@latest add theme spotify
```

---

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

### Dialog Example

```tsx
import { Dialog, Button } from './components/ui';

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
import { useTheme } from './theme/native';

function ThemedComponent() {
  const theme = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.background,
      padding: theme.sizes.padding(4)
    }}>
      <Text style={{ color: theme.colors.foreground }}>
        Themed content
      </Text>
    </View>
  );
}
```

---

## ⚡️ Architecture

### Copy-Paste Philosophy

Unlike traditional component libraries, Leshi UI follows the **copy-paste approach**:

- ✅ **Full ownership** - Components are copied to your project, you own the code
- ✅ **No dependencies** - No runtime bundle, only the components you use  
- ✅ **Complete customization** - Modify components however you need
- ✅ **Zero vendor lock-in** - You control the entire codebase

### Performance Features

- **StyleSheet optimization** - All styles use React Native's optimized StyleSheet.create
- **Minimal re-renders** - Theme context designed for optimal performance
- **Tree-shakeable** - Only copy components you actually need
- **Platform-specific** - Automatic iOS/Android/Web optimizations

---

## 👥 Contributing

Contributions are always welcome!
If you'd like to help:

1. Fork the repo
2. Create your branch (`git checkout -b feature/my-new-command`)
3. Commit your changes (`git commit -m "feat: add new command"`)
4. Push to the branch (`git push origin feature/my-new-command`)
5. Open a Pull Request

---

## 👤 About the Author

Built with ❤️ by **Agustin Oberg**
[LinkedIn → linkedin.com/in/oberg-agustin](https://www.linkedin.com/in/oberg-agustin)