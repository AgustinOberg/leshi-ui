# Repo Guidelines

## Directory structure
- Unistyles components live under `packages/unistiyles`.
- Plain React Native StyleSheet components live under `packages/rn`.
- Keep both implementations; do not delete Unistyles files when working on the RN version.

## tsconfig
- Avoid modifying any `tsconfig.json` files unless compilation fails.

## Demo app
- `apps/demo/App.tsx` must display every component with each available variant and size. Update it whenever you add a new component or variant.

## Package names
- `packages/unistiyles/package.json` must use the name `@leshi/ui-unistyles`.
- `packages/rn/package.json` must use the name `@leshi/ui-rn`.

## Documentation
- `packages/rn/README.md` should explain how variants and theming work and mention that plain objects don't impact performance.

## Checks
Run the following after making changes:

```bash
npx tsc -p packages/unistiyles/tsconfig.json
npx tsc -p packages/rn/tsconfig.json
```
