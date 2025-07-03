# Leshi UI CLI

A powerful, professional CLI for React Native UI components. Built with TypeScript, featuring smart dependency resolution, excellent UX, and zero configuration setup.

## 🚀 Features

- ✨ **Intuitive Commands**: Clean patterns with `npx leshi-ui@latest`
- 🧠 **Smart Dependency Resolution**: Automatic component dependency management
- 🎨 **Dual Framework Support**: React Native StyleSheet and Unistyles
- 📦 **Zero Configuration**: No config files, works out of the box
- 🎯 **Professional UX**: Beautiful CLI with colors, emojis, and helpful messages
- 🛡️ **Type Safety**: 100% TypeScript with zero errors
- 📖 **Built-in Documentation**: Component guides and examples included
- 🌐 **Universal Package Manager**: Works with npm, bun, pnpm, yarn

## 📦 Installation

No installation required! Use directly with any package manager:

**Requirements:**
- Node.js 18.0.0 or higher (required for native fetch API support)

```bash
# npm
npx leshi-ui@latest <command>

# bun  
bunx leshi-ui@latest <command>

# pnpm
pnpm dlx leshi-ui@latest <command>

# yarn
yarn dlx leshi-ui@latest <command>
```

## 🎯 Quick Start

```bash
# 1. Initialize your project
npx leshi-ui@latest init

# 2. Add components
npx leshi-ui@latest add component button

# 3. Explore what's available
npx leshi-ui@latest list component
```

## 📚 Commands

### `init [options]`

Initialize leshi-ui in your React Native project.

```bash
npx leshi-ui@latest init [--rn|--unistyles] [--yes]
```

**Options:**
- `--rn` - Use React Native StyleSheet (default)
- `--unistyles` - Use Unistyles implementation
- `--yes` - Skip confirmation prompts

**Examples:**
```bash
# Initialize with React Native StyleSheet
npx leshi-ui@latest init

# Initialize with Unistyles
npx leshi-ui@latest init --unistyles

# Skip prompts
npx leshi-ui@latest init --yes
```

**What it does:**
- 🔍 Detects your project type automatically
- 📁 Creates `components/ui/`, `styles/`, and `lib/` directories
- 🎨 Copies light and dark theme files
- ✅ Sets up the theme system for immediate use

---

### `add component <components...> [options]`

Add UI components with automatic dependency resolution.

```bash
npx leshi-ui@latest add component <names...> [--rn|--unistyles] [--overwrite] [--yes]
```

**Arguments:**
- `components` - Component names to add (space-separated)

**Options:**
- `--rn` - Use React Native StyleSheet (default)
- `--unistyles` - Use Unistyles implementation
- `--overwrite` - Overwrite existing files
- `--yes` - Skip confirmation prompts

**Examples:**
```bash
# Add single component
npx leshi-ui@latest add component button

# Add multiple components
npx leshi-ui@latest add component button text modal

# Add with Unistyles
npx leshi-ui@latest add component button --unistyles

# Overwrite existing files
npx leshi-ui@latest add component button --overwrite

# Interactive selection (if no components specified)
npx leshi-ui@latest add component
```

**Smart Features:**
- 🧠 **Automatic Dependency Resolution**: Installs required component dependencies
- 📦 **Utility Files**: Copies related utility files (e.g., `modal-utils.ts`)
- ⚠️ **External Dependency Warnings**: Alerts about required npm packages
- 🔧 **Setup Instructions**: Provides configuration guidance for complex components

---

### `add theme <themes...> [options]`

Add themes to your project.

```bash
npx leshi-ui@latest add theme <names...> [--rn|--unistyles] [--overwrite] [--yes]
```

**Examples:**
```bash
# Add a theme
npx leshi-ui@latest add theme ocean-dark

# Add multiple themes
npx leshi-ui@latest add theme spotify twitter-dark

# Interactive selection
npx leshi-ui@latest add theme
```

**What it does:**
- 📥 Copies theme files to `styles/themes/`
- 📝 Provides setup instructions
- 💡 Reminds to update `styles/themes/index.ts`

---

### `list component [options]`

List all available components with details.

```bash
npx leshi-ui@latest list component [--rn|--unistyles]
# Alias: npx leshi-ui@latest ls component
```

**Output:**
```
📋 Available Components
Framework: React Native StyleSheet

Component            Dependencies              External Deps
──────────────────────────────────────────────────────────────────────
button               text                      ─
modal                None                      ✅
dialog               modal, text, icon, slot   ✅
...
```

---

### `list theme [options]`

List all available themes categorized by type.

```bash
npx leshi-ui@latest list theme [--rn|--unistyles]
# Alias: npx leshi-ui@latest ls theme
```

**Output:**
```
🎨 Available Themes
Framework: React Native StyleSheet

Light Themes:
  • light
  • ocean-light
  • grape-light
  ...

Dark Themes:
  • dark
  • ocean-dark
  • spotify
  ...
```

---

### `guide component <name>`

Show detailed guide for a specific component.

```bash
npx leshi-ui@latest guide component button
```

**Output includes:**
- 📖 Component description and capabilities
- 🔗 leshi-ui component dependencies
- 📦 External npm dependencies
- 📋 Step-by-step setup instructions
- 💻 Setup code examples
- 💡 Usage examples with real code

---

### `guide theme`

Show comprehensive theme system guide.

```bash
npx leshi-ui@latest guide theme
```

**Covers:**
- 🎨 Theme system overview
- ⚙️ ThemeProvider setup with `defaultMode`
- 🔄 Theme switching (system vs manual)
- 💻 Using themes in components
- 📝 Available theme properties

## 🎯 Component Dependency System

The CLI features intelligent dependency resolution:

### Automatic Resolution
```bash
# Adding 'dialog' automatically resolves to:
npx leshi-ui@latest add component dialog
# → Installs: text, icon, slot, button, modal, dialog
```

### Dependency Tree Example
```
dialog
├── modal
├── text
├── icon
│   └── text ✓ (already resolved)
├── slot  
└── button
    └── text ✓ (already resolved)
```

### External Dependencies
Components with external dependencies show warnings:
```
⚠️ External dependencies required:
  • @gorhom/portal
💡 Install with: npm install @gorhom/portal
```

## 🎨 Framework Support

### React Native StyleSheet (Default)
- ✅ Uses `StyleSheet.create()` for optimal performance
- ✅ Platform-specific optimizations (iOS/Android/Web)
- ✅ Full TypeScript support with proper types

### Unistyles v3
- ✅ Modern CSS-in-JS with better performance
- ✅ Built-in responsive design features
- ✅ Advanced theming capabilities
- ✅ Breakpoint support

Switch between frameworks with flags:
```bash
# React Native StyleSheet
npx leshi-ui@latest add component button --rn

# Unistyles
npx leshi-ui@latest add component button --unistyles
```

## 🛡️ Error Handling

Professional error messages with helpful suggestions:

```bash
❌ Component 'buttom' not found
💡 Run `npx leshi-ui@latest list component` to see available components
Available components: button, text, modal...

❌ Theme 'ocen-dark' not found  
💡 Run `npx leshi-ui@latest list theme` to see available themes
Did you mean: ocean-dark?
```

## 🔧 Advanced Usage

### Silent Mode (CI/CD)
```bash
npx leshi-ui@latest add component button --yes --overwrite
```

### Batch Operations
```bash
# Add multiple components at once
npx leshi-ui@latest add component button text surface modal dialog
```

### Framework-Specific Workflows
```bash
# Pure Unistyles workflow
npx leshi-ui@latest init --unistyles
npx leshi-ui@latest add component button --unistyles
npx leshi-ui@latest add theme spotify --unistyles
```

## 🏗️ Project Structure

After initialization:

```
your-project/
├── components/
│   └── ui/                    # UI components
│       ├── button.tsx
│       ├── text.tsx
│       └── ...
├── lib/                       # Utility functions
│   ├── modal-utils.ts
│   └── ...
└── styles/                    # Theme system
    ├── context.tsx           # Theme provider
    ├── theme.ts              # Theme hooks
    ├── theme.d.ts            # Theme types (RN only)
    ├── breakpoints.ts        # Breakpoints (Unistyles only)
    └── themes/               # Theme definitions
        ├── light.ts
        ├── dark.ts
        └── index.ts
```

## 🧪 Development

The CLI is built with enterprise-grade architecture:

- **TypeScript-first**: 100% TypeScript with strict mode
- **Zero dependencies**: Minimal, focused dependency tree
- **Atomic operations**: All-or-nothing file operations
- **Professional UX**: Colors, emojis, progress indicators
- **Comprehensive testing**: Full test coverage
- **Cross-platform**: Works on macOS, Linux, Windows

### Building from Source

```bash
# Clone and build
git clone https://github.com/your-repo/leshi-ui
cd leshi-ui/cli
npm install
npm run build

# Test locally
node dist/index.js --help
```

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

## 🙏 Credits

Built with ❤️ by Agustin Oberg  
Professional React Native development tools

---

**💡 Pro Tips:**

- Use `--yes` flag in CI/CD pipelines for non-interactive mode
- Check component dependencies before installing complex components
- Use `npx leshi-ui@latest guide component <name>` for setup instructions
- List components regularly to discover new additions