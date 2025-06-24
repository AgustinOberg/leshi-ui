# Contributing to Leshi CLI

Thank you for wanting to contribute! Please follow these guidelines:

1. Fork the repository and create your branch from `main`.
2. Install dependencies using `bun install`.
3. Add or update tests when appropriate.
4. Run `bun test` and the TypeScript checks before submitting a pull request:
   ```bash
   npm run test
   npx tsc -p packages/unistiyles/tsconfig.json
   npx tsc -p packages/rn/tsconfig.json
   ```
5. Ensure your code follows existing style conventions.
6. Submit a pull request with a clear description of your changes.
