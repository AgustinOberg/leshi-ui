# Troubleshooting Guide

Common issues and solutions for Leshi UI. This guide covers installation problems, CLI errors, component issues, and platform-specific troubleshooting.

## 🚑 CLI Issues

### **"Command not found: leshi-ui"**

**Problem**: CLI not found after installation

**Solutions**:

```bash
# 1. Verify global installation
npm list -g leshi-ui

# 2. Reinstall globally
npm uninstall -g leshi-ui
npm install -g leshi-ui

# 3. Use npx instead
npx leshi-ui --version

# 4. Check PATH (macOS/Linux)
echo $PATH
which leshi-ui

# 5. Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
```

**Windows-specific**:
```cmd
# Check npm global path
npm config get prefix

# Add to PATH if missing
# %APPDATA%\npm should be in PATH
```

---

### **"Failed to load component registry"**

**Problem**: Network or GitHub access issues

**Solutions**:

```bash
# 1. Check internet connection
ping google.com

# 2. Test GitHub access
curl -I https://api.github.com

# 3. Check firewall/proxy settings
# Configure proxy if needed:
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 4. Clear npm cache
npm cache clean --force

# 5. Try different network
# Use mobile hotspot or different WiFi
```

**Corporate Networks**:
```bash
# Set npm registry
npm config set registry https://registry.npmjs.org/

# Configure certificates
npm config set ca null
npm config set strict-ssl false  # Only if necessary
```

---

### **"Project not initialized"**

**Problem**: Trying to add components before initialization

**Solutions**:

```bash
# 1. Initialize the project
leshi-ui init

# 2. Verify configuration file exists
ls -la leshi-ui.json

# 3. Check project structure
leshi-ui list component --installed

# 4. Re-initialize if corrupted
rm leshi-ui.json
leshi-ui init
```

---

### **"Component 'X' not found"**

**Problem**: Component name misspelled or doesn't exist

**Solutions**:

```bash
# 1. List available components
leshi-ui list component

# 2. Check spelling
leshi-ui guide component button  # Not 'btn'

# 3. Search for similar names
leshi-ui list component | grep -i text

# 4. Check component exists in registry
# Visit: https://github.com/AgustinOberg/leshi-ui/blob/main/component-registry.json
```

---

### **"TypeScript compilation failed"**

**Problem**: TypeScript errors after component installation

**Solutions**:

```bash
# 1. Check TypeScript errors
npx tsc --noEmit

# 2. Install missing dependencies
npm install
# or
bun install

# 3. Check import paths
# Verify components/ui directory exists
ls components/ui/

# 4. Fix import errors manually
# Update relative paths if needed

# 5. Reinstall component
leshi-ui add component button --overwrite
```

**Common TypeScript Fixes**:
```typescript
// ❌ Missing import
import { Button } from './components/ui/button';

// ✅ Correct import
import { Button } from '../components/ui/button';

// ❌ Wrong type
<Button size="medium">Click</Button>

// ✅ Correct type
<Button size="base">Click</Button>
```

---

### **"File already exists" warnings**

**Problem**: Components already installed, unsure whether to overwrite

**Solutions**:

```bash
# 1. Check differences first
diff components/ui/button.tsx.backup components/ui/button.tsx

# 2. Force overwrite if sure
leshi-ui add component button --overwrite

# 3. Backup manually first
cp components/ui/button.tsx components/ui/button.tsx.backup
leshi-ui add component button --overwrite

# 4. Skip if already customized
# Don't overwrite if you've made changes
```

## 📦 Component Issues

### **"useTheme is not defined"**

**Problem**: Theme provider not set up or imported incorrectly

**Solutions**:

```typescript
// 1. Check ThemeProvider is wrapping your app
// App.tsx or _layout.tsx
import { ThemeProvider } from './components/ui/theme-provider';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}

// 2. Check import path
import { useTheme } from './components/ui/theme-provider';
// or
import { useTheme } from '../components/ui/theme-provider';

// 3. Verify theme-provider exists
ls components/ui/theme-provider.tsx

// 4. Reinstall theme system
leshi-ui init --overwrite
```

---

### **"Styles not applying"**

**Problem**: Components render but don't look correct

**Solutions**:

```typescript
// 1. Check theme is being consumed
const theme = useTheme();
console.log('Theme:', theme);

// 2. Verify StyleSheet.create usage
const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary, // Should use theme
  }
});

// 3. Check platform-specific styles
const styles = StyleSheet.create({
  text: {
    fontFamily: theme.fonts.regular,
    ...(Platform.OS === 'web' && { fontWeight: '400' })
  }
});

// 4. Verify theme context
<ThemeProvider>
  <YourComponent /> {/* Should be inside provider */}
</ThemeProvider>
```

---

### **"Modal not appearing"**

**Problem**: Modal component doesn't show

**Solutions**:

```typescript
// 1. Check ModalProvider is set up
// App.tsx
import { ModalProvider } from './components/ui/modal';

export default function App() {
  return (
    <ModalProvider>
      <ThemeProvider>
        {/* Your app */}
      </ThemeProvider>
    </ModalProvider>
  );
}

// 2. Install required dependency
bun add @gorhom/portal
# or
npm install @gorhom/portal

// 3. Check modal visibility state
const [visible, setVisible] = useState(false);

<Modal visible={visible} onClose={() => setVisible(false)}>
  Content
</Modal>

// 4. Verify portal setup
// Should be at root level of app
```

---

### **"Icons not displaying"**

**Problem**: Icon component shows nothing or errors

**Solutions**:

```bash
# 1. Install icon dependency
bun add lucide-react-native
# or
npm install lucide-react-native

# 2. Check icon name is valid
# Visit: https://lucide.dev/icons/
```

```typescript
// 3. Correct icon usage
import { Icon } from './components/ui/icon';

// ✅ Correct
<Icon name="home" size={24} />

// ❌ Wrong
<Icon name="house" size={24} /> // 'house' doesn't exist

// 4. Check import
import { Home } from 'lucide-react-native'; // Direct import if needed
```

## 📱 Platform-Specific Issues

### **iOS Issues**

#### **"Fonts not loading"**
```bash
# 1. Check font files in assets
ls assets/fonts/

# 2. Update app.json
{
  "expo": {
    "assetBundlePatterns": [
      "assets/fonts/*"
    ]
  }
}

# 3. Restart development server
bun start --clear-cache
```

#### **"Safe area issues"**
```typescript
// Install safe area package
bun add react-native-safe-area-context

// Wrap app with SafeAreaProvider
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* App content */}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

---

### **Android Issues**

#### **"Shadows not visible"**
```typescript
// Use elevation for Android shadows
const styles = StyleSheet.create({
  card: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

#### **"Ripple effects not working"**
```typescript
// Use TouchableNativeFeedback for Android
import { Platform, TouchableNativeFeedback, TouchableOpacity } from 'react-native';

const TouchableComponent = Platform.OS === 'android' 
  ? TouchableNativeFeedback 
  : TouchableOpacity;

<TouchableComponent
  background={Platform.OS === 'android' 
    ? TouchableNativeFeedback.Ripple('#e0e0e0', false)
    : undefined
  }
>
  <View>{/* Content */}</View>
</TouchableComponent>
```

---

### **Web Issues**

#### **"Font weights not visible"**
```typescript
// Use fontWeight only on web
const styles = StyleSheet.create({
  text: {
    fontFamily: theme.fonts.regular,
    ...(Platform.OS === 'web' && { 
      fontWeight: '400' as const 
    })
  },
  boldText: {
    fontFamily: theme.fonts.bold,
    ...(Platform.OS === 'web' && { 
      fontWeight: '700' as const 
    })
  },
});
```

#### **"Hover states not working"**
```typescript
// Web-specific hover styles
const [isHovered, setIsHovered] = useState(false);

const webProps = Platform.OS === 'web' ? {
  onMouseEnter: () => setIsHovered(true),
  onMouseLeave: () => setIsHovered(false),
} : {};

<Pressable
  {...webProps}
  style={[
    styles.button,
    Platform.OS === 'web' && isHovered && styles.buttonHover
  ]}
>
  Content
</Pressable>
```

## 🛠️ Development Issues

### **"Metro bundler errors"**

**Problem**: Build or bundling failures

**Solutions**:

```bash
# 1. Clear Metro cache
bun start --clear-cache
# or
npx expo start -c

# 2. Reset Metro cache completely
rm -rf node_modules/.cache
rm -rf .expo
npm start

# 3. Check for circular dependencies
# Look for "Require cycle" warnings

# 4. Restart development server
# Stop with Ctrl+C, then restart
```

---

### **"Hot reload not working"**

**Solutions**:

```bash
# 1. Restart with cache clear
bun start --clear-cache

# 2. Check for syntax errors
# Fix any TypeScript/JavaScript errors

# 3. Try Fast Refresh reset
# Press 'r' in Metro terminal

# 4. Restart completely
# Stop Metro, close simulators, restart
```

---

### **"Build errors in production"**

**Solutions**:

```bash
# 1. Test production build locally
bun run build

# 2. Check for development-only code
# Remove console.log statements
# Remove development-only imports

# 3. Verify dependencies
# All used packages should be in dependencies, not devDependencies

# 4. Test on actual devices
# Simulator != real device behavior
```

## 🔄 Version Issues

### **"Incompatible React Native version"**

**Problem**: Components designed for different RN version

**Solutions**:

```bash
# 1. Check React Native version
npx react-native --version

# 2. Update React Native (if safe)
# Follow official upgrade guide

# 3. Check component compatibility
# Leshi UI supports RN 0.72+

# 4. Downgrade CLI if needed
npm install -g leshi-ui@previous-version
```

---

### **"TypeScript version conflicts"**

**Solutions**:

```bash
# 1. Check TypeScript version
npx tsc --version

# 2. Update TypeScript
npm install -D typescript@latest

# 3. Update type definitions
npm install -D @types/react@latest @types/react-native@latest

# 4. Check tsconfig.json
# Ensure compatible TypeScript configuration
```

---

### **"Node.js version issues"**

**Solutions**:

```bash
# 1. Check Node version
node --version

# 2. Update Node.js
# Leshi UI requires Node 16+, recommends 18+

# 3. Use nvm for version management
nvm install 18
nvm use 18

# 4. Clear npm cache after Node update
npm cache clean --force
```

## 🧪 Testing Issues

### **"Tests failing after component installation"**

**Solutions**:

```bash
# 1. Update test setup
# Mock theme provider in tests

# 2. Install test dependencies
npm install -D @testing-library/react-native

# 3. Mock external dependencies
# Mock @gorhom/portal, lucide-react-native, etc.
```

```typescript
// Test setup example
// __mocks__/@gorhom/portal.tsx
export const Portal = ({ children }: any) => children;
export const PortalHost = ({ children }: any) => children;

// Test with theme provider
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../components/ui/theme-provider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};
```

## 📊 Performance Issues

### **"App running slowly"**

**Solutions**:

```typescript
// 1. Check for unnecessary re-renders
// Use React DevTools Profiler

// 2. Memoize expensive calculations
const styles = useMemo(() => 
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background
    }
  }), [theme.colors.background]
);

// 3. Optimize StyleSheet usage
// ✅ Good
const styles = StyleSheet.create({
  container: { padding: 16 }
});

// ❌ Bad
<View style={{ padding: 16 }} />

// 4. Check image optimization
// Use optimized image formats and sizes
```

### **"Large bundle size"**

**Solutions**:

```bash
# 1. Analyze bundle
npx expo install --fix

# 2. Check for unused dependencies
npm install -g depcheck
depcheck

# 3. Use direct imports
# ✅ Good
import { Button } from './components/ui/button';

# ❌ Bad (if creating barrel exports)
import { Button } from './components/ui';
```

## 🔍 Debugging Tools

### **Diagnostic Commands**

```bash
# Check CLI status
leshi-ui --version
leshi-ui list component --installed
cat leshi-ui.json

# Check project health
npx tsc --noEmit
npm list
bun run build  # or npm run build

# Check React Native setup
npx react-native doctor  # For RN CLI projects
npx expo doctor          # For Expo projects
```

### **Development Tools**

```bash
# Enable verbose logging
leshi-ui add component button --verbose

# Debug mode
DEBUG=leshi-ui:* leshi-ui add component button

# Check network requests
curl -I https://api.github.com/repos/AgustinOberg/leshi-ui
```

### **Component Debugging**

```typescript
// Debug theme
const theme = useTheme();
console.log('Current theme:', theme);

// Debug styles
const styles = createStyles(theme);
console.log('Generated styles:', styles);

// Debug props
console.log('Component props:', { variant, size, ...props });

// Debug rendering
const [debugMode, setDebugMode] = useState(__DEV__);

if (debugMode) {
  console.log('Rendering component with:', { variant, size });
}
```

## 🆘 Getting Help

### **Before Asking for Help**

1. **Check this troubleshooting guide**
2. **Search existing GitHub issues**
3. **Try the solutions above**
4. **Test with a fresh project**
5. **Gather diagnostic information**

### **When Reporting Issues**

Include this information:

```bash
# System info
node --version
npm --version
leshi-ui --version
npx react-native --version  # or expo --version

# Project info
cat package.json | head -20
cat leshi-ui.json

# Error logs
# Copy the full error message and stack trace
```

### **Where to Get Help**

- **GitHub Issues**: [Bug reports and feature requests](https://github.com/AgustinOberg/leshi-ui/issues)
- **GitHub Discussions**: [Questions and community help](https://github.com/AgustinOberg/leshi-ui/discussions)
- **Documentation**: [Complete documentation](./README.md)

### **Creating Good Bug Reports**

```markdown
## Bug Description
Clear description of the problem

## Steps to Reproduce
1. Run `leshi-ui init`
2. Run `leshi-ui add component button`
3. Error occurs

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: macOS 13.0
- Node: 18.17.0
- React Native: 0.72.3
- Leshi UI: 0.0.16-beta.3

## Error Logs
```
Paste full error logs here
```

## Additional Context
Any other relevant information
```

---

## 🎆 Quick Fixes Summary

| Issue | Quick Fix |
|-------|----------|
| CLI not found | `npm install -g leshi-ui` |
| Component not found | `leshi-ui list component` |
| TypeScript errors | `npx tsc --noEmit` |
| Theme not working | Check `ThemeProvider` wrapper |
| Styles not applying | Use `StyleSheet.create` |
| Modal not showing | Install `@gorhom/portal` |
| Icons not displaying | Install `lucide-react-native` |
| Metro cache issues | `bun start --clear-cache` |
| Network errors | Check internet/proxy settings |
| File conflicts | Use `--overwrite` flag |

**Still having issues?** Check the [Development Guide](./development.md) or open an issue on GitHub!
