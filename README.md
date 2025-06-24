# 🚀 Leshi CLI 🚀

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

| Command                        | Description                          |
| ------------------------------ | ------------------------------------ |
| `bunx leshi-ui init`           | Copy base theme files (light & dark) |
| `bunx leshi-ui init rn`        | Explicit RN theme init               |
| `bunx leshi-ui init unistyles` | Copy Unistyles theme files           |

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
