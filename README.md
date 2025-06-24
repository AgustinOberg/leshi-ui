# Leshi UI Monorepo

This repository contains a React Native component library powered by Unistyles (`packages/unistiyles`) and a plain StyleSheet version (`packages/rn`). It also includes an Expo demo application (`apps/demo`).

## Requirements

- [Bun](https://bun.sh/) runtime
- Node.js 18 or newer
- Yarn or npm (only for Expo CLI if desired)
- Expo CLI (`npm install -g expo-cli`)

## Installing dependencies

Install all workspace packages using **Bun**:

```bash
bun install
```

This command installs dependencies for the root package, the UI library and the demo app.

## Running the demo application

1. Navigate to the demo directory:

   ```bash
   cd apps/demo
   ```

2. Start the Expo development server:

   ```bash
   bun run start
   ```

   You can also run `bun run android`, `bun run ios` or `bun run web` to target specific platforms.

## Using the UI package

The Unistyles components live under `packages/unistiyles` while the bare React Native version lives in `packages/rn`. This project isn't published to npm. Instead, copy the pieces you need into your own codebase—similar to the [shadcn/ui](https://ui.shadcn.com/) approach.

```tsx
// after copying a component
import { Button, Text } from './path-to-copied-components';
```

The Unistyles theme configuration is handled by `react-native-unistyles`. Edit `packages/unistiyles/theme/unistyles.ts` to customise colors or add new themes. The bare RN package exposes a `useTheme` hook under `packages/rn/theme` with light and dark palettes.

## Project structure

```
leshi-ui/
├─ apps/            # Example applications
│  └─ demo/         # Expo demo showcasing the components
├─ packages/
│  ├─ unistiyles/   # Unistyles based components
│  └─ rn/           # Plain StyleSheet components
├─ index.ts         # Simple Bun entry point
└─ bun.lockb        # Bun lockfile
```

## Development scripts

- `bun install` – install dependencies
- `bun run index.ts` – run the root script
- Inside `apps/demo` you can run Expo scripts like `bun run start`

---

This project was bootstrapped with **Bun** v1.1.33.

## CLI Usage
See [USAGE.md](USAGE.md) for instructions on using the Leshi CLI. Some components will output additional notes defined in `component-notes.json`.
