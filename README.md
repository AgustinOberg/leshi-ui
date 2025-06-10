# Leshi UI Monorepo

This repository contains a React Native component library (`packages/ui`) and an Expo demo application (`apps/demo`).

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

All components live under `packages/ui`. This project isn't published to npm. Instead, copy the pieces you need into your own codebase—similar to the [shadcn/ui](https://ui.shadcn.com/) approach.

```tsx
// after copying a component
import { Button, Text } from './path-to-copied-components';
```

The theme configuration is handled by `react-native-unistyles`. Edit `packages/ui/theme/unistyles.ts` to customise colors or add new themes. You can also override border radii per theme using the `createBase()` helper.

## Project structure

```
leshi-ui/
├─ apps/            # Example applications
│  └─ demo/         # Expo demo showcasing the components
├─ packages/
│  └─ ui/           # Reusable UI library
├─ index.ts         # Simple Bun entry point
└─ bun.lockb        # Bun lockfile
```

## Development scripts

- `bun install` – install dependencies
- `bun run index.ts` – run the root script
- Inside `apps/demo` you can run Expo scripts like `bun run start`

---

This project was bootstrapped with **Bun** v1.1.33.
