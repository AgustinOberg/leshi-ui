# GitHub Actions Workflows

This project includes two GitHub Actions workflows to automate testing and deployment.

## 🧪 Automatic Workflow: Tests and TypeScript

**File:** `test.yml`  
**Trigger:** Automatic on PRs and commits to `main`  
**Runtime:** ⚡ **Bun** (3-10x faster than npm)

### What it does:
- ✅ TypeScript check of the CLI
- ✅ Runs CLI tests with `bun test`
- ✅ Runs CLI linting
- ✅ Builds CLI to verify compilation
- ✅ Basic functional test of the CLI

### Packages verified:
- `cli/` - Main CLI (with Bun)
- `packages/rn/` - Copy-paste components (validated when installed)
- `packages/unistyles/` - Copy-paste components (validated when installed)

---

## 🚀 Manual Workflow: Release to NPM

**File:** `release.yml`  
**Trigger:** Manual from GitHub Actions tab  
**Runtime:** ⚡ **Bun** for build + **npm** for publish

### Required parameters:
- **Branch:** Branch to deploy from (default: `main`)
- **Version:** Semantic version number (e.g.: `1.0.0`, `1.0.0-beta.1`)

### Release process:
1. 🔍 Validates version format
2. 🧪 Runs tests and TypeScript checks with **Bun** ⚡
3. 📝 Updates `package.json` with new version
4. 🏗️ Builds CLI with **Bun** ⚡
5. 🧪 Functional test of built CLI
6. 📝 Commits version bump
7. 🏷️ Creates and pushes git tag `v{version}`
8. 📦 Publishes to NPM (using npm for compatibility)
9. 📋 Creates GitHub Release

### How to execute release:

1. Go to **Actions** tab in GitHub
2. Select **"Manual Release to NPM"**
3. Click **"Run workflow"**
4. Fill in the fields:
   - **Branch:** `main` (or your desired branch)
   - **Version:** `1.0.0` (your desired version)
5. Click **"Run workflow"**

### Prerequisites:

#### NPM Token:
Add `NPM_TOKEN` in GitHub Settings > Secrets:
1. Create token at [npmjs.com](https://npmjs.com) → Access Tokens
2. GitHub Repo → Settings → Secrets and variables → Actions
3. New repository secret: `NPM_TOKEN`

#### Permissions:
The workflow needs permissions to:
- Create releases (`GITHUB_TOKEN` - automatic)
- Push tags and commits
- Publish to NPM (`NPM_TOKEN` - manual)

---

## 🔗 Version Pinning

The versioning system guarantees that:
- CLI version `1.0.0` always downloads components from tag `v1.0.0`
- CLI version `1.0.0-beta.1` downloads from tag `v1.0.0-beta.1`
- Total consistency between CLI and GitHub components

### Example usage post-release:
```bash
# Users will install:
npx leshi-ui@1.0.0 init
npx leshi-ui@1.0.0 add component button

# And will always download components from GitHub tag v1.0.0
```