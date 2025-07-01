# 📘 Leshi UI Usage Guide

Complete guide for using leshi-ui CLI and components in your React Native projects.

## 🚀 Getting Started

### 1. Initialize Your Project

```bash
# React Native StyleSheet (recommended)
npx leshi-ui@latest init

# Unistyles v3 (alternative styling)
npx leshi-ui@latest init --unistyles

# Skip prompts (useful for CI/CD)
npx leshi-ui@latest init --yes
```

**What this does:**
- Creates `components/ui/`, `styles/`, and `lib/` directories
- Copies light and dark theme files
- Sets up the theme system with TypeScript types
- Detects your project framework automatically

### 2. Add Components

```bash
# Add a single component
npx leshi-ui@latest add component button

# Add multiple components at once
npx leshi-ui@latest add component button text modal

# Interactive selection (shows all available components)
npx leshi-ui@latest add component

# Add with specific framework
npx leshi-ui@latest add component button --unistyles

# Overwrite existing files
npx leshi-ui@latest add component button --overwrite
```

**Smart Features:**
- **Automatic dependency resolution**: Adding `dialog` automatically installs `text`, `icon`, `slot`, `button`, and `modal`
- **External dependency warnings**: Alerts you about required npm packages
- **Setup instructions**: Provides configuration guidance for complex components

### 3. Add Themes

```bash
# Add a beautiful theme
npx leshi-ui@latest add theme spotify

# Add multiple themes
npx leshi-ui@latest add theme ocean-dark twitter-light retro-dark

# Interactive theme selection
npx leshi-ui@latest add theme
```

### 4. Explore and Learn

```bash
# List all components with dependencies
npx leshi-ui@latest list component

# List all themes (categorized)
npx leshi-ui@latest list theme

# Get detailed component guide
npx leshi-ui@latest guide component button

# Learn about the theme system
npx leshi-ui@latest guide theme

# Show CLI help
npx leshi-ui@latest --help
```

## 🎨 Theme System Setup

### Basic Setup

```tsx
// App.tsx or _layout.tsx
import { ThemeProvider } from './styles/context';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" defaultMode="system">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Theme Provider Props

- `defaultTheme`: Initial theme name (e.g., `"light"`, `"dark"`, `"spotify"`)
- `defaultMode`: 
  - `"system"` - Automatically switches based on device settings
  - `"manual"` - Manual theme switching only

### Using Themes in Components

```tsx
import { useTheme } from './styles/theme';
import { View, Text, StyleSheet } from 'react-native';

function MyComponent() {
  const theme = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
    },
    text: {
      color: theme.colors.text,
      fontSize: theme.fonts.sizes.lg,
      fontFamily: theme.fonts.heading,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Themed Component</Text>
    </View>
  );
}
```

### Manual Theme Switching

```tsx
import { useTheme } from './styles/theme';
import { Button } from './components/ui';

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme.name === 'light' ? 'dark' : 'light');
  };

  return (
    <Button 
      text={`Switch to ${theme.name === 'light' ? 'Dark' : 'Light'} Mode`}
      onPress={toggleTheme}
    />
  );
}
```

## 📦 Component Usage Examples

### Button Component

```tsx
import { Button } from './components/ui';

function ButtonExamples() {
  return (
    <>
      {/* Basic variants */}
      <Button variant="primary" text="Primary Button" />
      <Button variant="secondary" text="Secondary Button" />
      <Button variant="outline" text="Outline Button" />
      <Button variant="ghost" text="Ghost Button" />
      <Button variant="destructive" text="Destructive Button" />
      
      {/* Different sizes */}
      <Button variant="primary" size="sm" text="Small" />
      <Button variant="primary" size="base" text="Base" />
      <Button variant="primary" size="lg" text="Large" />
      
      {/* With loading state */}
      <Button 
        variant="primary" 
        text="Loading..." 
        loading={true}
        disabled={true}
      />
      
      {/* Custom onPress */}
      <Button 
        variant="primary" 
        text="Click me"
        onPress={() => console.log('Button pressed!')}
      />
    </>
  );
}
```

### Text Component

```tsx
import { Text } from './components/ui';

function TextExamples() {
  return (
    <>
      {/* Semantic variants */}
      <Text variant="heading" size="xl">Main Heading</Text>
      <Text variant="heading" size="lg">Section Heading</Text>
      <Text variant="body">Regular body text for paragraphs</Text>
      <Text variant="caption" size="sm">Small caption text</Text>
      
      {/* Different weights */}
      <Text weight="light">Light text</Text>
      <Text weight="regular">Regular text</Text>
      <Text weight="medium">Medium text</Text>
      <Text weight="bold">Bold text</Text>
      
      {/* Custom styling */}
      <Text variant="body" style={{ color: 'red' }}>
        Custom styled text
      </Text>
    </>
  );
}
```

### Modal Components Setup

For modal-based components (Modal, Dialog, AlertDialog), you need additional setup:

```bash
# Install required dependency
npm install @gorhom/portal

# Then add the ModalProvider to your app
```

```tsx
// App.tsx or _layout.tsx
import { ThemeProvider } from './styles/context';
import { ModalProvider } from './components/ui/modal-provider';

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

### Dialog Component

```tsx
import { Dialog, Button, Text } from './components/ui';
import { useState } from 'react';

function DialogExample() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button text="Open Dialog" />
      </Dialog.Trigger>
      
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Confirm Action</Dialog.Title>
          <Dialog.Description>
            This action cannot be undone. Are you sure?
          </Dialog.Description>
        </Dialog.Header>
        
        <Text>Additional content can go here...</Text>
        
        <Dialog.Footer>
          <Dialog.Cancel>
            <Button variant="outline" text="Cancel" />
          </Dialog.Cancel>
          <Dialog.Action>
            <Button variant="destructive" text="Delete" />
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

### Form Components

```tsx
import { TextInput, TextArea, Checkbox, Switch, Button } from './components/ui';
import { useState } from 'react';

function FormExample() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <>
      <TextInput
        label="Full Name"
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        variant="outline"
        size="lg"
      />
      
      <TextArea
        label="Bio"
        placeholder="Tell us about yourself..."
        value={bio}
        onChangeText={setBio}
        rows={4}
      />
      
      <Checkbox
        checked={agreed}
        onCheckedChange={setAgreed}
        label="I agree to the terms and conditions"
      />
      
      <Switch
        checked={notifications}
        onCheckedChange={setNotifications}
        label="Enable push notifications"
      />
      
      <Button 
        variant="primary" 
        text="Submit"
        disabled={!agreed}
        onPress={() => console.log('Form submitted!')}
      />
    </>
  );
}
```

## 🎯 Framework-Specific Usage

### React Native StyleSheet (Default)

```tsx
import { StyleSheet } from 'react-native';
import { useTheme } from './styles/theme';

function MyComponent() {
  const theme = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
  });

  return (
    <View style={styles.container}>
      {/* Your content */}
    </View>
  );
}
```

### Unistyles v3

```tsx
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    variants: {
      size: {
        small: { padding: theme.spacing.sm },
        large: { padding: theme.spacing.xl },
      },
    },
  },
}));

function MyComponent({ size = 'small' }) {
  styles.useVariants({ size });
  
  return (
    <View style={styles.container}>
      {/* Your content */}
    </View>
  );
}
```

## 🔧 Advanced Usage

### Custom Theme Creation

1. Add a new theme file:
```tsx
// styles/themes/my-custom-theme.ts
import { Theme } from '../theme';

export const myCustomTheme: Theme = {
  name: 'my-custom',
  colors: {
    background: '#1a1a1a',
    text: '#ffffff',
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    // ... other colors
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  // ... other theme properties
};
```

2. Register it in your themes index:
```tsx
// styles/themes/index.ts
export { myCustomTheme } from './my-custom-theme';
```

3. Use it in your app:
```tsx
<ThemeProvider defaultTheme="my-custom" defaultMode="manual">
  <YourApp />
</ThemeProvider>
```

### Component Customization

Since components are copied to your project, you can modify them however you need:

```tsx
// components/ui/button.tsx - Customize as needed
export interface ButtonProps {
  // Add your own props
  customVariant?: 'special' | 'unique';
  // Modify existing props
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'custom';
}

export function Button({ customVariant, ...props }: ButtonProps) {
  // Add your own logic
  if (customVariant === 'special') {
    // Custom behavior
  }
  
  // Rest of the component...
}
```

### CI/CD Integration

```bash
# In your CI/CD pipeline
npx leshi-ui@latest init --yes
npx leshi-ui@latest add component button text modal --yes --overwrite
```

## ❓ Troubleshooting

### Common Issues

**Component not found:**
```bash
npx leshi-ui@latest list component  # Check available components
```

**External dependency missing:**
```bash
# Install the required package
npm install @gorhom/portal
npm install react-native-reanimated
```

**Theme not working:**
```tsx
// Make sure you've wrapped your app with ThemeProvider
<ThemeProvider defaultTheme="light" defaultMode="system">
  <YourApp />
</ThemeProvider>
```

**TypeScript errors:**
```bash
# Check that you've initialized the project
npx leshi-ui@latest init

# Ensure you're importing from the correct paths
import { Button } from './components/ui';
import { useTheme } from './styles/theme';
```

### Getting Help

```bash
# Show all available commands
npx leshi-ui@latest --help

# Get detailed component information
npx leshi-ui@latest guide component <component-name>

# Learn about themes
npx leshi-ui@latest guide theme
```

## 🎉 Next Steps

1. **Explore all components**: `npx leshi-ui@latest list component`
2. **Try different themes**: `npx leshi-ui@latest list theme`
3. **Read component guides**: `npx leshi-ui@latest guide component button`
4. **Customize components** to fit your design system
5. **Share your themes** with the community

Ready to build something amazing with leshi-ui! 🚀