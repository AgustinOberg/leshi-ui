# Quick Start Guide

Get started with Leshi UI in under 5 minutes. This guide will have you installing and using components in your React Native project immediately.

## 🚀 Installation

### **1. Install the CLI**

```bash
# Install globally with npm
npm install -g leshi-ui

# Or with yarn
yarn global add leshi-ui

# Or use with npx (no installation)
npx leshi-ui --help
```

### **2. Verify Installation**

```bash
leshi-ui --version
# Should output: 0.0.16-beta.3

leshi-ui --help
# Shows available commands
```

## 🏗️ Project Setup

### **Option 1: New React Native Project**

```bash
# Create new React Native project
npx create-expo-app@latest MyApp
cd MyApp

# Initialize Leshi UI
leshi-ui init
```

### **Option 2: Existing React Native Project**

```bash
# Navigate to your project
cd your-react-native-project

# Initialize Leshi UI
leshi-ui init
```

### **What `leshi-ui init` Does**

```
✅ Detects your project framework (Expo, React Native CLI, Expo Router)
✅ Creates project configuration (leshi-ui.json)
✅ Sets up directory structure
✅ Installs base theme system
✅ Configures TypeScript aliases (if using TypeScript)
```

**Files Created:**
```
your-project/
├── components/ui/
│   └── theme-provider.tsx      # Theme context provider
├── styles/
│   ├── theme.ts               # Theme definitions
│   └── colors.ts              # Color system
├── lib/
│   └── utils.ts               # Utility functions
└── leshi-ui.json              # Configuration file
```

## 📦 Adding Components

### **Your First Component**

```bash
# Add a button component
leshi-ui add component button

# The CLI will:
# ✓ Download button component
# ✓ Resolve dependencies (text, icon, etc.)
# ✓ Fix import paths automatically
# ✓ Validate TypeScript compilation
```

### **Using the Component**

```typescript
// App.tsx
import React from 'react';
import { View } from 'react-native';
import { ThemeProvider } from './components/ui/theme-provider';
import { Button } from './components/ui/button';

export default function App() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          variant="primary"
          size="base"
          onPress={() => console.log('Button pressed!')}
        >
          Hello Leshi UI!
        </Button>
      </View>
    </ThemeProvider>
  );
}
```

### **Exploring Variants**

```typescript
// Try different button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Try different sizes
<Button size="sm">Small</Button>
<Button size="base">Base</Button>
<Button size="lg">Large</Button>
```

## 🎨 Theme Setup

### **Using the Theme Provider**

Wrap your app with the `ThemeProvider` to enable theming:

```typescript
// App.tsx or _layout.tsx (Expo Router)
import { ThemeProvider } from './components/ui/theme-provider';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### **Switching Themes**

```typescript
import { useTheme } from './components/ui/theme-provider';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant="outline" 
      onPress={toggleTheme}
    >
      {theme === 'light' ? '🌙' : '☀️'} Toggle Theme
    </Button>
  );
}
```

## 🔍 Discovering Components

### **List Available Components**

```bash
# Show all available components
leshi-ui list component

# Output:
# Available Components:
# • avatar - Profile picture with fallback support
# • badge - Status indicators and labels
# • button - Interactive button with variants
# • card - Content container with header/footer
# • dialog - Modal dialog with backdrop
# • input - Text input with validation
# • modal - Full-screen modal with animations
# • progress - Progress indicator
# • text - Typography with semantic variants
# ... and more
```

### **Get Component Documentation**

```bash
# Get detailed info about a component
leshi-ui guide component button

# Shows:
# - Usage examples
# - Available props
# - Variant options
# - Dependencies
# - Installation notes
```

## 📱 Framework-Specific Setup

### **Expo Router Projects**

```typescript
// app/_layout.tsx
import { ThemeProvider } from '../components/ui/theme-provider';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
```

### **React Navigation Projects**

```typescript
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './components/ui/theme-provider';

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        {/* Your navigation */}
      </NavigationContainer>
    </ThemeProvider>
  );
}
```

## 🛠️ Common Workflows

### **Installing Multiple Components**

```bash
# Install multiple components at once
leshi-ui add component button text input card

# Or interactively select components
leshi-ui add component
# Shows a multi-select prompt
```

### **Project Structure After Setup**

```
your-project/
├── components/ui/
│   ├── button.tsx
│   ├── text.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── theme-provider.tsx
├── styles/
│   ├── theme.ts
│   └── colors.ts
├── lib/
│   └── utils.ts
└── leshi-ui.json
```

### **Customizing Components**

Since components are copied to your project, you have full control:

```typescript
// Edit components/ui/button.tsx directly
export const Button = ({ variant = "primary", ...props }: ButtonProps) => {
  // Add your custom logic here
  const customStyle = {
    // Your custom styles
  };
  
  // Modify behavior as needed
  return (
    <Pressable style={[styles.base, styles[variant], customStyle]} {...props}>
      {/* Your customizations */}
    </Pressable>
  );
};
```

## 🌍 Using with Unistyles

For projects using Unistyles v3:

```bash
# Initialize with Unistyles support
leshi-ui init --unistyles

# Add components with Unistyles variants
leshi-ui add component button --unistyles
```

## ⚡ Performance Tips

### **Import Optimization**

```typescript
// ✅ Good: Direct imports
import { Button } from './components/ui/button';
import { Text } from './components/ui/text';

// ❌ Avoid: Barrel imports (creates larger bundles)
import { Button, Text } from './components/ui';
```

### **Theme Performance**

```typescript
// ✅ Good: Use StyleSheet.create
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  }
});

// ❌ Avoid: Inline styles with theme
<View style={{ backgroundColor: theme.colors.background }} />
```

## 🛠️ Troubleshooting

### **Common Issues**

#### **"Command not found: leshi-ui"**
```bash
# Verify global installation
npm list -g leshi-ui

# Or use npx
npx leshi-ui --version
```

#### **"Module not found" errors**
```bash
# Reinstall dependencies
npm install
# or
yarn install

# Check TypeScript configuration
npx tsc --noEmit
```

#### **Theme not applying**
```typescript
// Ensure ThemeProvider wraps your app
<ThemeProvider>
  <YourApp />
</ThemeProvider>
```

### **Getting Help**

```bash
# Show help for any command
leshi-ui --help
leshi-ui init --help
leshi-ui add --help

# Check project configuration
cat leshi-ui.json
```

## 🎉 Next Steps

Now that you have Leshi UI set up:

1. **Explore Components**: Check out the [Component Guide](./components.md)
2. **Customize Themes**: Learn about [Theming](./theming/overview.md)
3. **Advanced Usage**: Read the [CLI Usage](./cli-usage.md) guide
4. **Development**: See the [Development Guide](./development.md)

## 🔗 Quick Links

- [Component Catalog](./components.md) - Browse all available components
- [CLI Reference](./cli-usage.md) - Complete CLI documentation
- [Theming Guide](./theming/overview.md) - Customize colors and styling
- [Examples](./examples/basic.md) - Real-world usage examples
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions

---

**🎆 You're all set!** You now have a professional component system ready for building beautiful React Native applications.
