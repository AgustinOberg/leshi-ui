# CLI Usage Guide

Complete reference for the Leshi UI CLI - your command-line companion for managing React Native components with enterprise-grade reliability.

## 🚀 Installation & Setup

### **Global Installation**

```bash
# Install globally
npm install -g leshi-ui

# Verify installation
leshi-ui --version
# Output: 0.0.16-beta.3

# Check available commands
leshi-ui --help
```

### **npx Usage (No Installation)**

```bash
# Use without installing
npx leshi-ui init
npx leshi-ui add component button
npx leshi-ui list component
```

## 📝 Command Reference

### **`leshi-ui init`**

Initializes Leshi UI in your React Native project with framework detection and automatic setup.

```bash
leshi-ui init [options]
```

#### **Options**

- `--unistyles` - Initialize with Unistyles v3 support
- `--yes, -y` - Skip interactive prompts (use defaults)
- `--help, -h` - Show help for init command

#### **Examples**

```bash
# Interactive setup (recommended)
leshi-ui init

# Quick setup with defaults
leshi-ui init -y

# Setup with Unistyles support
leshi-ui init --unistyles

# Unistyles with no prompts
leshi-ui init --unistyles --yes
```

#### **What It Does**

```
✅ Detects project framework (Expo, React Native CLI, Expo Router)
✅ Creates leshi-ui.json configuration file
✅ Sets up directory structure (components/ui/, styles/, lib/)
✅ Installs base theme system and utilities
✅ Configures TypeScript aliases (if TypeScript detected)
✅ Validates setup with TypeScript compilation
```

---

### **`leshi-ui add`**

Adds components or themes to your project with automatic dependency resolution.

```bash
leshi-ui add <type> <name> [options]
```

#### **Types**

- `component` - Add UI components
- `theme` - Add theme configurations

#### **Options**

- `--unistyles` - Use Unistyles variant instead of StyleSheet
- `--overwrite` - Overwrite existing files without prompting
- `--yes, -y` - Skip confirmation prompts
- `--silent` - Suppress output (useful for scripts)
- `--help, -h` - Show help for add command

#### **Examples**

**Single Component:**

```bash
# Add a button component
leshi-ui add component button

# Add with Unistyles variant
leshi-ui add component button --unistyles

# Force overwrite existing files
leshi-ui add component button --overwrite

# Silent installation for scripts
leshi-ui add component button --yes --silent
```

**Multiple Components:**

```bash
# Add multiple components
leshi-ui add component button text input card

# Interactive component selection
leshi-ui add component
# Shows multi-select prompt with descriptions
```

**Advanced Usage:**

```bash
# Add complex component with dependencies
leshi-ui add component modal
# Automatically resolves: text → icon → button → modal-utils → modal

```

#### **Dependency Resolution**

The CLI automatically resolves and installs component dependencies:

```
Component Dependencies:
├── button
│   ├── text (typography)
│   └── icon (optional icons)
├── modal
│   ├── button (close button)
│   ├── text (content)
│   ├── modal-utils (utilities)
│   └── @gorhom/portal (external dependency)
└── card
    ├── text (title, description)
    └── separator (dividers)
```

---

### **`leshi-ui list`**

Displays available components and themes with descriptions and metadata.

```bash
leshi-ui list <type> [options]
```

#### **Types**

- `component` - List available components
- `theme` - List available themes

#### **Options**

- `--installed` - Show only installed components
- `--available` - Show only available (not installed) components
- `--json` - Output in JSON format
- `--help, -h` - Show help for list command

#### **Examples**

```bash
# List all available components
leshi-ui list component

# Show only installed components
leshi-ui list component --installed

# Show only available components
leshi-ui list component --available

# JSON output for scripting
leshi-ui list component --json
```

#### **Sample Output**

```
Available Components:

🟦 UI Components
• avatar      Profile picture with fallback support
• badge       Status indicators and labels
• button      Interactive button with variants
• dialog      Modal dialog with backdrop
• input       Text input with validation
• modal       Full-screen modal with animations
• progress    Progress indicator
• separator   Horizontal/vertical dividers
• skeleton    Loading placeholders
• switch      Toggle switch with animations
• tabs        Tabbed navigation
• text        Typography with semantic variants

🟨 Status
✅ Installed: 3 components
📚 Available: 11 components
```

---

### **`leshi-ui guide`**

Provides detailed documentation and usage examples for components.

```bash
leshi-ui guide <type> <name> [options]
```

#### **Types**

- `component` - Component documentation
- `theme` - Theme documentation

#### **Options**

- `--examples` - Show additional usage examples
- `--props` - Show detailed prop documentation
- `--help, -h` - Show help for guide command

#### **Examples**

```bash
# Get component documentation
leshi-ui guide component button

# Show detailed examples
leshi-ui guide component button --examples

# Show prop documentation
leshi-ui guide component button --props

# Theme documentation
leshi-ui guide theme
```

#### **Sample Output**

```
🔰 Button Component

A customizable button component with multiple variants and sizes.

📝 Basic Usage:

import { Button } from './components/ui/button';

<Button variant="primary" size="base" onPress={handlePress}>
  Click me
</Button>

🎨 Variants:
• primary    - Main action button (default)
• secondary  - Secondary actions
• outline    - Bordered button
• ghost      - Minimal button
• destructive - Dangerous actions

📎 Sizes:
• sm   - Small button (32px height)
• base - Standard button (44px height)
• lg   - Large button (56px height)

🔗 Dependencies:
• text component (for typography)
• icon component (for optional icons)

📚 Learn More:
• Component source: components/ui/button.tsx
• Theme tokens: styles/theme.ts
• Examples: Check the demo app
```

---

### **Global Options**

These options work with all commands:

- `--version, -v` - Show CLI version
- `--help, -h` - Show help information
- `--verbose` - Enable verbose logging
- `--quiet` - Suppress non-error output

## 🛠️ Advanced Usage

### **Scripting & Automation**

```bash
#!/bin/bash
# Setup script for new projects

# Initialize project
leshi-ui init --yes

# Install common components silently
leshi-ui add component button text input card --yes --silent

# Verify installation
leshi-ui list component --installed
```

### **CI/CD Integration**

```yaml
# GitHub Actions example
- name: Setup Leshi UI Components
  run: |
    npm install -g leshi-ui
    leshi-ui init --yes
    leshi-ui add component button text --yes --silent
```

### **Project Configuration**

The `leshi-ui.json` file stores project configuration:

```json
{
  "framework": "expo",
  "typescript": true,
  "unistyles": false,
  "components": {
    "ui": "./components/ui",
    "styles": "./styles",
    "lib": "./lib"
  },
  "aliases": {
    "@/components": "./components",
    "@/styles": "./styles",
    "@/lib": "./lib"
  }
}
```

### **Custom Directory Structure**

Modify `leshi-ui.json` to use custom paths:

```json
{
  "components": {
    "ui": "./src/components/ui",
    "styles": "./src/styles",
    "lib": "./src/lib"
  }
}
```

## 🚑 Error Handling

### **Common Error Types**

#### **1. Project Not Initialized**

```bash
❌ Error: Project not initialized
→ Run: leshi-ui init
```

#### **2. Component Not Found**

```bash
❌ Error: Component 'nonexistent' not found
→ Run: leshi-ui list component
```

#### **3. File Conflicts**

```bash
⚠️ Warning: File already exists: components/ui/button.tsx
→ Use --overwrite to replace
→ Or backup and try again
```

#### **4. TypeScript Errors**

```bash
❌ Error: TypeScript compilation failed
→ Check: npx tsc --noEmit
→ Fix errors and try again
```

#### **5. Network Issues**

```bash
❌ Error: Failed to fetch component registry
→ Check internet connection
→ Verify GitHub access
```

### **Rollback Protection**

The CLI uses atomic operations with automatic rollback:

```
🔄 Starting component installation...
✅ Creating backup of existing files...
✅ Downloading component files...
✅ Resolving dependencies...
✅ Transforming imports...
❌ TypeScript validation failed!
✅ Rolling back changes...
✅ Restored original files

❌ Installation failed - no changes made
```

## 📊 Performance & Optimization

### **CLI Performance**

- **Parallel Operations**: Dependencies resolved in parallel
- **Caching**: GitHub responses cached for 15 minutes
- **Incremental Updates**: Only changed files are processed
- **Validation**: TypeScript validation runs incrementally

### **Best Practices**

```bash
# ✅ Good: Install related components together
leshi-ui add component button text input

# ✅ Good: Use --yes for known safe operations
leshi-ui add component button --yes

# ✅ Good: Use --silent in scripts
leshi-ui add component button --yes --silent

# ❌ Avoid: Installing components one by one
leshi-ui add component button
leshi-ui add component text
leshi-ui add component input
```

## 🔍 Debugging

### **Verbose Mode**

```bash
# Enable detailed logging
leshi-ui add component button --verbose

# Shows:
# • File operations
# • Network requests
# • Dependency resolution
# • Import transformations
# • TypeScript validation steps
```

### **Configuration Check**

```bash
# Verify project configuration
cat leshi-ui.json

# Check TypeScript setup
npx tsc --noEmit

# Verify component installation
find . -name "*.tsx" -path "*/components/ui/*"
```

### **Manual Recovery**

```bash
# If CLI state is corrupted
rm leshi-ui.json
leshi-ui init

# If components are broken
rm -rf components/ui
leshi-ui add component button text input
```

## 🔗 Integration Examples

### **Package.json Scripts**

```json
{
  "scripts": {
    "ui:init": "leshi-ui init --yes",
    "ui:add": "leshi-ui add component",
    "ui:list": "leshi-ui list component",
    "ui:setup-common": "leshi-ui add component button text input card --yes"
  }
}
```

### **Development Workflow**

```bash
# Daily workflow
npm run ui:list              # Check available components
npm run ui:add               # Add new components interactively
leshi-ui guide component button  # Get usage help
```

### **Team Setup**

```bash
# Team onboarding script
#!/bin/bash
echo "Setting up Leshi UI..."
leshi-ui init --yes
leshi-ui add component button text input card avatar badge --yes
echo "Setup complete! Check components/ui/ folder"
```

## 🔄 Migration & Updates

### **Updating Components**

```bash
# Update existing component
leshi-ui add component button --overwrite

# Update multiple components
leshi-ui add component button text input --overwrite --yes
```

### **Version Management**

```bash
# Check CLI version
leshi-ui --version

# Update CLI
npm update -g leshi-ui

# Check for component updates
leshi-ui list component  # Shows latest versions
```

---

## 🔗 Quick Reference

| Command           | Purpose            | Example                           |
| ----------------- | ------------------ | --------------------------------- |
| `init`            | Initialize project | `leshi-ui init`                   |
| `add component`   | Install components | `leshi-ui add component button`   |
| `list component`  | Show components    | `leshi-ui list component`         |
| `guide component` | Component docs     | `leshi-ui guide component button` |
| `--help`          | Show help          | `leshi-ui --help`                 |
| `--version`       | Show version       | `leshi-ui --version`              |

**Need more help?** Check out:

- [Quick Start Guide](./quick-start.md) - Get started in 5 minutes
- [Component Guide](./components.md) - Browse available components
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
- [Development Guide](./development.md) - Contributing to Leshi UI
