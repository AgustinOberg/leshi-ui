# Leshi UI CLI

🎨 **Professional CLI for React Native UI components** - Build beautiful React Native apps with copy-paste components, custom theming, and enterprise-grade tooling.

## 🚀 Quick Start

```bash
# Initialize your project
npx leshi-ui@latest init

# Add your first component
npx leshi-ui@latest add component button

# Explore available components
npx leshi-ui@latest list component

# Get component documentation
npx leshi-ui@latest guide component button
```

## ✨ Features

- **🎯 Copy-Paste Components** - Own your components, no dependencies
- **🎨 Custom Theming** - Beautiful themes with dark/light mode support
- **⚡ Zero Runtime Overhead** - Only the components you use
- **🔧 TypeScript First** - Full TypeScript support out of the box
- **📱 Cross-Platform** - Works with Expo, React Native CLI, and Expo Router
- **🎪 Multiple Styling** - Support for both StyleSheet and Unistyles v3

## 📦 Available Components

| Component | Description |
|-----------|-------------|
| **avatar** | Profile pictures with fallback support |
| **badge** | Status indicators and labels |
| **button** | Interactive buttons with multiple variants |
| **card** | Content containers with header/footer |
| **dialog** | Modal dialogs with backdrop |
| **input** | Text inputs with validation |
| **modal** | Full-screen modals with animations |
| **progress** | Progress indicators |
| **skeleton** | Loading placeholders |
| **switch** | Toggle switches with animations |
| **text** | Typography with semantic variants |
| **toast** | Notification system |

## 🎨 Built-in Themes

- **Light/Dark** - Classic light and dark themes
- **Spotify** - Music streaming inspired theme
- **Twitter** - Social media inspired theme
- **Supabase** - Developer-first theme
- **Custom Themes** - Create your own themes easily

## 📖 Documentation

- [Quick Start Guide](https://github.com/AgustinOberg/leshi-ui/blob/main/docs/quick-start.md)
- [CLI Usage Guide](https://github.com/AgustinOberg/leshi-ui/blob/main/docs/cli-usage.md)
- [Component Guide](https://github.com/AgustinOberg/leshi-ui/blob/main/docs/components.md)
- [Theming Guide](https://github.com/AgustinOberg/leshi-ui/blob/main/docs/theming.md)

## 🛠️ Installation

### Global Installation
```bash
npm install -g leshi-ui
leshi-ui --version
```

### npx Usage (Recommended)
```bash
npx leshi-ui@latest init
npx leshi-ui@latest add component button
```

## 💡 Usage Examples

### Initialize a new project
```bash
# Interactive setup
leshi-ui init

# Quick setup with defaults
leshi-ui init --yes

# Setup with Unistyles support
leshi-ui init --unistyles
```

### Add components
```bash
# Add a single component
leshi-ui add component button

# Add multiple components
leshi-ui add component button text input card

# Interactive component selection
leshi-ui add component
```

### Explore components
```bash
# List all available components
leshi-ui list component

# Show only installed components
leshi-ui list component --installed

# Get component documentation
leshi-ui guide component button
```

## 🏗️ Project Structure

After initialization, your project will have:

```
your-project/
├── components/
│   └── ui/           # Your UI components
├── styles/           # Theme system and context
├── lib/              # Utility functions
└── leshi-ui.json     # Configuration file
```

## 🎯 Philosophy

- **Copy-Paste Approach** - Components are copied into your project, not imported as dependencies
- **Full Ownership** - Modify components completely since you own the code
- **Theme-First Design** - All components built with comprehensive theming support
- **Performance Focus** - Zero runtime overhead, optimized StyleSheet patterns
- **Developer Experience** - TypeScript-first with excellent tooling

## 🤝 Contributing

We welcome contributions! Please see our [Development Guide](https://github.com/AgustinOberg/leshi-ui/blob/main/docs/development.md) for details.

## 📝 License

MIT © [Agustin Oberg](https://github.com/AgustinOberg)

## 🔗 Links

- [GitHub Repository](https://github.com/AgustinOberg/leshi-ui)
- [NPM Package](https://www.npmjs.com/package/leshi-ui)
- [Issues & Support](https://github.com/AgustinOberg/leshi-ui/issues)
- [Author LinkedIn](https://www.linkedin.com/in/oberg-agustin)

---

Built with ❤️ for the React Native community