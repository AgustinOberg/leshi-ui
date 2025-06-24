# Project Overview

This monorepo provides a set of reusable React Native components alongside a demo Expo application. It uses **Bun** for package management and **react-native-unistyles** for theming. The Unistyles version lives in `packages/unistyles` and the plain StyleSheet implementation in `packages/rn`.

The goal is to offer a lightweight design system with customizable themes. The `unistyles.ts` file exposes a `createBase` helper which defines fonts, spacing and border radii. Each theme extends this base so radii can be overridden per theme. Color palettes for variants like `light`, `dark`, `chatgpt`, `vercel`, `unititled` and `cozy` showcase how to build different appearances.

The demo application under `apps/demo` shows how the primitives fit together. Running it with Expo lets you preview all components on Android, iOS or web. The root `index.ts` file is simply a Bun entry point used to confirm that the environment is configured.

Every UI element comes with a small markdown file under `packages/unistyles/ui/*.md` describing its purpose and prop interface. This approach allows you to copy what you need à la shadcn/ui, while keeping documentation close to the source. Because the library isn't published to npm, you are free to adapt the components as you see fit.

- **packages/unistyles** – Unistyles-based components
- **packages/rn** – React Native StyleSheet components
- **apps/demo** – Expo project showcasing the components
- **index.ts** – minimal Bun entry point

The project is written in TypeScript and follows a functional component approach. Each component exposes its prop types which are documented in the corresponding markdown files under `packages/unistyles/ui`.

