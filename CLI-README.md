# Leshi UI CLI

A powerful, enterprise-grade CLI for adding React Native UI components to your project. Built with TypeScript, featuring atomic operations, dependency resolution, and automatic framework detection.

## 🚀 Features

- ✨ **Smart Framework Detection**: Automatically detects Expo, React Native, or Expo Router
- 🔧 **Atomic Operations**: All-or-nothing file operations with automatic rollback
- 📦 **Dependency Resolution**: Multi-pass recursive dependency resolution
- 🎯 **Import Transformation**: Automatic path fixing using Babel AST transformation
- 🛡️ **Type Safety**: Full TypeScript support with Zod validation
- 🎨 **Dual Package Support**: Both React Native and Unistyles variants
- 📋 **Comprehensive Testing**: 100% test coverage with Jest
- 🔄 **Rollback on Failure**: Automatic cleanup if operations fail

## 📦 Installation

```bash
# Global installation
npm install -g @leshi-ui/cli

# Or use with npx
npx @leshi-ui/cli@latest
```

## 🎯 Quick Start

```bash
# Initialize leshi-ui in your project
leshi-ui init

# Add components
leshi-ui add component button text

# Add Unistyles variant
leshi-ui add component button --unistyles

# View available components
leshi-ui guide components
```

## 📚 Commands

### `init [target]`

Initialize leshi-ui in your React Native project.

```bash
leshi-ui init [rn|unistyles] [options]
```

**Arguments:**
- `target` - Target implementation (`rn` | `unistyles`) (default: `rn`)

**Options:**
- `-y, --yes` - Skip confirmation prompts
- `-c, --cwd <path>` - Working directory (default: current directory)
- `-s, --silent` - Mute output

**Examples:**
```bash
# Initialize with React Native StyleSheet
leshi-ui init

# Initialize with Unistyles
leshi-ui init unistyles

# Skip prompts
leshi-ui init -y
```

**What it does:**
- 🔍 Detects your project type (Expo/React Native/Expo Router)
- 📁 Creates recommended directory structure
- 📝 Generates `leshi-ui.json` configuration
- 🎨 Copies base theme files
- ⚙️ Sets up TypeScript configuration if detected

---

### `add component <components...>`

Add UI components to your project with automatic dependency resolution.

```bash
leshi-ui add component <component-names...> [options]
```

**Arguments:**
- `components` - Component names to add (space-separated)

**Options:**
- `--unistyles` - Use Unistyles implementation
- `-y, --yes` - Skip confirmation prompts
- `-o, --overwrite` - Overwrite existing files
- `-c, --cwd <path>` - Working directory
- `-a, --all` - Add all available components
- `-p, --path <path>` - Custom installation path
- `-s, --silent` - Mute output

**Examples:**
```bash
# Add single component
leshi-ui add component button

# Add multiple components
leshi-ui add component button text modal

# Add with Unistyles
leshi-ui add component button --unistyles

# Add all components
leshi-ui add component --all

# Overwrite existing files
leshi-ui add component button --overwrite

# Silent installation
leshi-ui add component button --silent
```

**Smart Features:**
- 🧠 **Automatic Dependency Resolution**: Installs required dependencies
- 🔄 **Import Path Transformation**: Fixes imports using Babel AST
- 📦 **Utility Files**: Copies related utility and provider files
- 🎯 **Framework Adaptation**: Adapts code for your specific framework
- ⚡ **Atomic Operations**: All files installed or none (with rollback)

---

### `guide`

Access component documentation and examples.

#### `guide components`

List all available components.

```bash
leshi-ui guide components
# Alias: leshi-ui guide list
```

**Output:**
```
📖 Available Components:

   button          UI component with variants and sizes
   text            Typography component with semantic variants  
   modal           Flexible modal with animations
   dialog          Dialog built on modal
   alert-dialog    Confirmation dialogs
   surface         Surface with elevation and variants
   text-input      Input with validation states
   text-area       Multi-line text input
   checkbox        Custom styled checkbox
   switch          Animated switch component
   progress        Progress bar with animations
   skeleton        Loading skeleton
   avatar          Avatar with fallback
   badge           Status and label badges
   divider         Visual separator
   icon            Icon component
   label           Form labels
   radio           Radio group and items
   slot            Component composition

💡 View detailed guide: leshi-ui guide component <name>
```

#### `guide component <name>`

Show detailed guide for a specific component.

```bash
leshi-ui guide component button
```

**Features:**
- 📖 Component description
- 🔗 Dependencies and setup instructions
- 💡 Usage examples
- 🎨 Available variants and props
- 📦 External dependencies

---

### `theme`

Manage themes (future implementation).

```bash
leshi-ui theme add <name> [options]
```

---

## 🗂️ Project Structure

After initialization, your project will have:

```
your-project/
├── leshi-ui.json              # Configuration file
├── components/
│   └── ui/                    # UI components
│       ├── button.tsx
│       ├── text.tsx
│       └── ...
├── lib/                       # Utility functions
│   ├── modal-utils.ts
│   └── ...
├── styles/                    # Theme system
│   ├── context.tsx           # Theme provider
│   ├── theme.ts             # Theme hooks
│   ├── theme.d.ts           # Theme types
│   └── themes/              # Theme definitions
│       ├── light.ts
│       ├── dark.ts
│       └── common.ts
└── utils/                     # General utilities
```

## ⚙️ Configuration

### `leshi-ui.json`

```json
{
  "$schema": "https://leshi-ui.dev/schema.json",
  "framework": "expo",
  "typescript": true,
  "style": "default",
  "aliases": {
    "components": "./components",
    "lib": "./lib", 
    "styles": "./styles",
    "utils": "./utils"
  },
  "unistyles": {
    "config": "./unistyles.config.ts",
    "themes": ["light", "dark"]
  }
}
```

**Schema Properties:**
- `framework` - Detected framework (`expo` | `react-native` | `expo-router`)
- `typescript` - TypeScript support detected
- `style` - Component style variant (`default` | `new-york`)
- `aliases` - Path aliases for different file types
- `unistyles` - Unistyles-specific configuration (optional)

## 🎨 Component System

### Available Components

| Component | Description | Dependencies | External Deps |
|-----------|-------------|--------------|---------------|
| `button` | Customizable button with variants | `text` | - |
| `text` | Typography with semantic variants | - | - |
| `modal` | Flexible modal with animations | - | `@gorhom/portal` |
| `dialog` | Dialog built on modal | `modal`, `text`, `icon`, `slot` | `@gorhom/portal` |
| `alert-dialog` | Confirmation dialogs | `modal`, `text`, `button`, `slot` | `@gorhom/portal` |
| `surface` | Surface with elevation | - | - |
| `text-input` | Input with validation | `label`, `text` | - |
| `text-area` | Multi-line text input | `label`, `text` | - |
| `checkbox` | Custom checkbox | `icon` | - |
| `switch` | Animated switch | - | `react-native-reanimated` |
| `progress` | Animated progress bar | - | `react-native-reanimated` |
| `skeleton` | Loading skeleton | - | `react-native-reanimated` |
| `avatar` | Avatar with fallback | `text` | - |
| `badge` | Status badges | `text` | - |
| `divider` | Visual separator | - | - |
| `icon` | Icon component | `text` | - |
| `label` | Form labels | `text` | - |
| `radio` | Radio group | `icon` | - |
| `slot` | Component composition | - | - |

### Component Variants

Most components support these patterns:

**Sizes:** `sm` | `base` | `lg` | `xl`
**Variants:** `primary` | `secondary` | `outline` | `ghost` | `destructive`

## 🔧 Framework Support

### Expo
- ✅ Automatic detection via `app.json` or `expo.json`
- ✅ Proper path aliases
- ✅ TypeScript support
- ✅ Metro config detection

### Expo Router  
- ✅ Detection via `app/_layout.tsx`
- ✅ App directory structure
- ✅ File-based routing support

### React Native
- ✅ Detection via `metro.config.js` and native folders
- ✅ Android/iOS platform support
- ✅ Proper src/ structure

## 🎯 Advanced Features

### Dependency Resolution

The CLI uses multi-pass recursive dependency resolution:

```typescript
// Example: Adding 'dialog' resolves to:
[
  'text',      // ← Required by icon, button
  'icon',      // ← Required by dialog  
  'slot',      // ← Required by dialog
  'button',    // ← Required by dialog
  'modal',     // ← Required by dialog
  'dialog'     // ← Target component
]
```

### Import Transformation

Automatically fixes import paths using Babel AST:

```typescript
// Before transformation
import { useTheme } from "../../styles/theme";
import { getBackdropConfig } from "./modal-utils";

// After transformation  
import { useTheme } from "../styles/theme";
import { getBackdropConfig } from "../../lib/modal-utils";
```

### Atomic Operations

All file operations are atomic with automatic rollback:

1. **Plan** - Validate all operations before execution
2. **Backup** - Create backups of existing files
3. **Execute** - Perform all operations
4. **Rollback** - Restore backups if any operation fails
5. **Cleanup** - Remove backups on success

### Error Handling

Structured error handling with helpful messages:

```bash
❌ Component 'buttom' not found
💡 Run `leshi-ui guide components` to see available components
Available components: button, text, modal...

❌ Invalid React Native project: Missing metro.config.js
💡 Make sure you're in a React Native project directory
💡 Run `leshi-ui init` to set up the project
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

**Test Coverage:**
- ✅ Dependency resolution
- ✅ Project detection
- ✅ File operations with rollback
- ✅ Import transformation
- ✅ Error handling
- ✅ CLI commands

## 🔍 Troubleshooting

### Common Issues

**Component not found:**
```bash
# List available components
leshi-ui guide components

# Check spelling and try again
leshi-ui add component button
```

**Project not detected:**
```bash
# Make sure you're in a React Native project
ls package.json metro.config.js

# Initialize if needed
leshi-ui init
```

**Import errors after installation:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Verify file structure matches aliases
cat leshi-ui.json
```

**Permission errors:**
```bash
# Check file permissions
ls -la components/

# Run with proper permissions
sudo leshi-ui add component button
```

### Debug Mode

Enable debug output:

```bash
DEBUG=1 leshi-ui add component button
```

### Configuration Issues

Validate your configuration:

```bash
# Check current config
cat leshi-ui.json

# Regenerate config
leshi-ui init --yes
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Credits

Built with ❤️ by Agustin Oberg  
Inspired by [shadcn/ui](https://ui.shadcn.com)

---

**💡 Pro Tips:**

- Use `--silent` flag in CI/CD pipelines
- Always test with `--yes` flag in automation
- Check component dependencies before installing
- Use `--unistyles` for better performance
- Keep your `leshi-ui.json` in version control