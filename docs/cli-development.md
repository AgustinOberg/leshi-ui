# Leshi UI CLI - Development Guide

Enterprise-grade development and testing documentation for the Leshi UI CLI system.

## 🏗️ Architecture Overview

### Pure GitHub Distribution
- **Zero bundled files**: CLI contains only TypeScript source code, no components
- **GitHub-first**: All components downloaded directly from GitHub releases  
- **Version consistency**: Each CLI version maps to specific GitHub tag for reproducible builds
- **Single source of truth**: Only `packages/` directory in project root contains components

### Test-Driven Development
- **Isolated testing**: Each test runs in temporary directories with automatic cleanup
- **Zero external dependencies**: Tests run without GitHub API calls for CI/CD reliability
- **Complete validation**: TypeScript, ESLint, unit tests, and E2E testing
- **Atomic operations**: All CLI operations succeed completely or rollback entirely

## 🧪 Testing System

### Test Commands
```bash
npm run build              # Build CLI TypeScript → JavaScript
npm run test:all          # Complete test suite (recommended)
npm run test              # Unit tests only  
npm run test:typescript   # TypeScript validation (CLI + packages)
npm run test:e2e         # End-to-end integration tests
npm run test:coverage    # Unit tests with coverage report
npm run lint             # ESLint validation
```

### Test Architecture

#### 1. Unit Tests (`npm run test`)
- **Location**: `src/__tests__/`
- **Strategy**: Mock-based testing of CLI services and utilities
- **Coverage**: 95%+ code coverage required
- **Speed**: < 10 seconds execution time

#### 2. TypeScript Validation (`npm run test:typescript`)
- **Location**: `scripts/validate-typescript.js`
- **Validates**: CLI + packages/rn + packages/unistyles
- **Requirements**: Zero TypeScript errors, strict mode compliance
- **Speed**: < 15 seconds execution time

#### 3. E2E Integration Tests (`npm run test:e2e`)
- **Location**: `scripts/test-e2e.js`
- **Strategy**: Real CLI execution in isolated temporary directories
- **Validation**: Component installation, TypeScript compilation, file verification
- **Cleanup**: Automatic cleanup of temporary directories
- **Speed**: < 45 seconds execution time

#### 4. Complete Test Suite (`npm run test:all`)
- **Strategy**: Sequential execution with fast failure
- **Includes**: Build → Unit → TypeScript → Lint → E2E
- **Total time**: < 60 seconds
- **CI/CD ready**: Perfect for automated environments

## 🔧 Development Workflow

### Making Component Changes
1. **Edit components** in `packages/rn/` or `packages/unistyles/`
2. **Validate TypeScript**: `npm run test:typescript`
3. **Test installation**: `npm run test:e2e`
4. **Commit changes** - immediately available via GitHub

### Making CLI Changes
1. **Edit CLI code** in `cli/src/`
2. **Build**: `npm run build`
3. **Full validation**: `npm run test:all`
4. **Ensure all tests pass** before committing

### Release Process
1. **Complete validation**: `npm run test:all` (all tests must pass)
2. **Update version**: Edit `cli/package.json`
3. **Create GitHub tag**: Tag must match package.json version
4. **Automatic distribution**: CLI automatically uses tagged version

## 📁 Project Structure

```
leshi-ui/
├── packages/                     # Single source of truth
│   ├── rn/                      # React Native StyleSheet components
│   │   ├── components/ui/       # Component implementations
│   │   ├── lib/                 # Utility functions
│   │   ├── styles/              # Theme system
│   │   └── tsconfig.json        # TypeScript config
│   └── unistyles/               # Unistyles v3 components
│       ├── components/ui/       # Component implementations
│       ├── lib/                 # Utility functions  
│       ├── styles/              # Theme system
│       └── tsconfig.json        # TypeScript config
├── cli/                         # CLI source (no bundled files)
│   ├── src/                     # TypeScript source code
│   │   ├── commands/            # CLI command implementations
│   │   ├── services/            # Business logic services
│   │   ├── utils/               # Utility functions
│   │   └── types/               # TypeScript type definitions
│   ├── scripts/                 # Testing and build scripts
│   │   ├── test-all.js          # Complete test suite
│   │   ├── test-e2e.js          # E2E integration tests
│   │   └── validate-typescript.js # TypeScript validation
│   ├── dist/                    # Built JavaScript (git ignored)
│   ├── component-registry.json  # Component metadata (temporary for testing)
│   └── package.json             # CLI package configuration
├── .github/workflows/           # CI/CD automation
│   └── ci.yml                   # GitHub Actions workflow
└── apps/demo/                   # Component showcase
```

## 🎯 Quality Standards

### Zero Tolerance Policy
- **No TypeScript errors**: Strict type checking enforced across all packages
- **No CLI breakage**: All commands must work perfectly in all scenarios
- **No user errors**: E2E testing prevents any user-facing TypeScript issues
- **No duplicated packages**: Single source of truth rigorously maintained
- **No GitHub API in tests**: Ensures reliable CI/CD execution

### Performance Requirements
- **Fast builds**: TypeScript compilation < 10 seconds
- **Quick tests**: Complete test suite < 60 seconds  
- **Lightweight CLI**: Package size < 1MB (no bundled components)
- **Efficient downloads**: Only downloads required components and dependencies

## 🚨 CI/CD Integration

### GitHub Actions
- **File**: `.github/workflows/ci.yml`
- **Triggers**: All PRs and commits to main/develop
- **Node versions**: 18.x and 20.x matrix testing
- **Dependencies**: Automatically installs all package dependencies
- **Test execution**: Runs complete test suite (`npm run test:all`)
- **Artifact upload**: Preserves test results and temp directories on failure

### PR Requirements
1. ✅ All tests pass: `npm run test:all`
2. ✅ TypeScript strict mode compliance
3. ✅ ESLint rules followed (zero warnings)
4. ✅ New features include comprehensive tests
5. ✅ Breaking changes documented in PR description

## 🔐 Security & Reliability

### Security Measures
- **No secrets exposure**: Code analysis prevents accidental secret commits
- **Input validation**: All user inputs validated with Zod schemas
- **Safe file operations**: Atomic file operations with backup/rollback
- **Dependency scanning**: Regular security audits of external dependencies

### Reliability Features
- **Graceful error handling**: 12 structured error types with recovery guidance
- **Automatic cleanup**: Temporary files and directories always cleaned up
- **Transaction safety**: Operations succeed completely or rollback entirely
- **Network resilience**: Retry logic for network operations with exponential backoff

## 🐛 Debugging & Troubleshooting

### Common Issues

#### CLI Build Failures
```bash
# Clean and rebuild
rm -rf dist/
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

#### E2E Test Failures
```bash
# Run with verbose output
DEBUG=1 npm run test:e2e

# Check temporary directory (preserved on failure)
ls /tmp/leshi-test-*/
```

#### Component Installation Issues
```bash
# Test specific component
node dist/index.js add component button --yes

# Check GitHub connectivity
curl -I https://api.github.com/repos/AgustinOberg/leshi-ui
```

### Development Tips
- **Use `npm run test:all`** before every commit
- **Test both RN and Unistyles** when making component changes
- **Check temporary directories** when E2E tests fail (they're preserved)
- **Use TypeScript strict mode** - it catches issues early
- **Run tests in watch mode** during development: `npm run dev`

## 📊 Metrics & Monitoring

### Test Coverage Requirements
- **Unit tests**: 95%+ code coverage
- **Integration tests**: All CLI commands tested
- **Type coverage**: 100% TypeScript coverage  
- **E2E coverage**: All components installation tested

### Performance Benchmarks
- **Build time**: < 10 seconds (TypeScript compilation)
- **Test suite time**: < 60 seconds (complete test suite)
- **Component download**: < 5 seconds per component
- **Memory usage**: < 100MB during operations

## 🚀 Advanced Development

### Adding New Components
1. **Create component** in `packages/rn/components/ui/`
2. **Add TypeScript types** and proper exports
3. **Update component registry** in the dependency resolver
4. **Write tests** for the component
5. **Update demo app** to showcase component
6. **Validate**: `npm run test:all`

### Adding New CLI Commands
1. **Create command file** in `src/commands/`
2. **Add to index.ts** command registration
3. **Write unit tests** in `src/__tests__/`
4. **Add E2E test coverage** in `scripts/test-e2e.js`
5. **Update documentation** in README.md
6. **Validate**: `npm run test:all`

### Modifying GitHub Service
1. **Edit** `src/services/github-service.ts`
2. **Maintain backward compatibility** with existing API
3. **Add comprehensive tests** for new functionality
4. **Test with real GitHub** (manual verification)
5. **Validate**: `npm run test:all`

This development system ensures enterprise-grade reliability, maintainability, and developer experience for the Leshi UI CLI ecosystem.