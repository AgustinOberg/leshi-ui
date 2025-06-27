# CI/CD Pipeline Documentation

This repository uses a comprehensive CI/CD pipeline to ensure the CLI and components always work perfectly. Every PR to `main` triggers extensive testing to prevent any regressions.

## 🔧 Workflows Overview

### 1. `test-cli.yml` - Core CLI Functionality Testing
**Triggers:** PR to main, push to main  
**Purpose:** Tests all CLI functionality end-to-end

#### Test Matrix:
- **Package Managers:** npm, bun
- **Operating Systems:** Ubuntu, macOS, Windows  
- **Node Versions:** 18, 20

#### What it tests:
- ✅ TypeScript compilation
- ✅ Unit tests pass
- ✅ CLI package creation
- ✅ `init` command functionality
- ✅ Theme files creation (light/dark)
- ✅ Component installation (`add` command)
- ✅ Dependency resolution (simple & complex)
- ✅ Guide commands
- ✅ Unistyles variant support
- ✅ Cross-platform compatibility

#### Example test flow:
```bash
# For both npm and bun:
npx leshi-ui init --yes
npx leshi-ui add modal --yes
npx leshi-ui add button --yes  # Tests dependency resolution (text)
npx leshi-ui add dialog --yes  # Tests complex dependencies (modal, text, icon, slot)
npx leshi-ui guide components
```

### 2. `validate-components.yml` - Component Registry Validation
**Triggers:** PR to main with changes to `packages/` or `cli/`  
**Purpose:** Ensures component registry matches actual files

#### What it validates:
- ✅ All registry components exist in filesystem
- ✅ All component files are readable
- ✅ Dependency chains are valid (no circular deps)
- ✅ Theme files consistency between RN/Unistyles
- ✅ TypeScript compilation for all packages
- ✅ Individual component installation
- ✅ Regression testing

#### Registry validation:
```bash
# Checks each component in the registry:
for component in button text modal dialog...; do
  # Verify files exist
  test -f packages/rn/components/ui/$component.tsx
  test -f packages/unistyles/components/ui/$component.tsx
  
  # Test installation
  npx leshi-ui add $component --yes
done
```

### 3. `test-production.yml` - Production Simulation
**Triggers:** PR to main, push to main  
**Purpose:** Simulates real user experience

#### Production scenarios tested:
- ✅ NPX usage (without global install)
- ✅ BUNX usage (without global install)
- ✅ Package structure validation
- ✅ Performance testing
- ✅ Different project structures (Expo, RN)
- ✅ Error handling

#### Simulation flow:
```bash
# Creates isolated user environment
mkdir /tmp/user-project
cd /tmp/user-project

# Simulates: npm install -g leshi-ui
npm install ../cli/leshi-ui-*.tgz

# Tests real user workflow
npx leshi-ui init --yes
npx leshi-ui add button --yes
npx leshi-ui add dialog --yes
```

### 4. `release.yml` - Automated Release
**Triggers:** Push to main (after all tests pass)  
**Purpose:** Publishes CLI to npm registry

#### Release process:
1. ⏳ **Wait for all tests to pass**
2. 🏗️ **Build CLI** (`cd cli && npm run build`)
3. 📦 **Version bump** (`npm version patch`)
4. 🚀 **Publish to npm** (`npm publish`)
5. 📝 **Git tag and push**

## 🛡️ Quality Gates

### PR Requirements
Before any PR can be merged to `main`, these must pass:
- ✅ All CLI functionality tests (npm + bun)
- ✅ Component registry validation
- ✅ Production simulation tests
- ✅ Cross-platform compatibility tests
- ✅ TypeScript compilation
- ✅ Unit tests

### Release Requirements
Before any release to npm:
- ✅ All PR requirements above
- ✅ CLI package structure validation
- ✅ Performance benchmarks
- ✅ Error handling validation

## 🔍 Test Coverage

### CLI Commands Tested:
- `leshi-ui --help` / `--version`
- `leshi-ui init [rn|unistyles]`
- `leshi-ui add <component>...`
- `leshi-ui guide components`
- `leshi-ui guide component <name>`

### Component Installation Tested:
- **Simple components:** `modal`, `button`, `text`
- **Complex dependencies:** `dialog` → `modal`, `text`, `icon`, `slot`
- **All registry components** individually
- **Utility files:** `modal-utils.ts`
- **Provider files:** `modal-provider.tsx`

### Project Types Tested:
- React Native (bare)
- Expo (managed)
- Expo Router
- TypeScript projects
- JavaScript projects

### Package Managers Tested:
- npm (install, npx execution)
- bun (install, bunx execution)

## 🚨 Failure Scenarios

### If tests fail:
1. **CLI Functionality Test Fails:**
   - Check TypeScript compilation errors
   - Verify component files exist
   - Check dependency resolution logic

2. **Component Validation Fails:**
   - Missing component files
   - Invalid dependency chains
   - Theme file inconsistencies

3. **Production Simulation Fails:**
   - Package structure issues
   - Missing files in npm package
   - CLI not executable

4. **Release Blocked:**
   - Any of the above test failures
   - CI automatically prevents release

## 📊 Performance Monitoring

### Benchmarks tracked:
- CLI initialization time
- Component installation time
- Package size
- Dependency resolution speed

### Alerts if:
- Tests take longer than expected
- Package size grows significantly
- Any test failure occurs

## 🔧 Maintenance

### Adding new components:
1. Add component files to `packages/rn/` and `packages/unistyles/`
2. Update dependency registry in `cli/src/services/dependency-resolver.ts`
3. Tests automatically validate new component
4. CI ensures no regressions

### Modifying CLI:
1. Update CLI code in `cli/src/`
2. Add/update unit tests
3. CI runs full test suite
4. Release only if all tests pass

## 🎯 Success Metrics

### Green CI Pipeline means:
- ✅ CLI works with both npm and bun
- ✅ All components can be installed
- ✅ Dependency resolution works perfectly
- ✅ Package is ready for production
- ✅ No regressions in existing functionality
- ✅ Cross-platform compatibility verified

This comprehensive testing ensures that **every single change** is validated before reaching users, maintaining the same quality standards as established tools like shadcn/ui.