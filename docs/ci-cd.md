# Leshi UI - CI/CD System

Enterprise-grade CI/CD system with comprehensive testing, validation, and deployment automation.

## 🎯 CI/CD Overview

### **Pipeline Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Quality       │    │   Unit Tests    │    │   E2E Local     │
│   & TypeScript  │ -> │   (Node 18,20)  │ -> │   Packages      │
│   (fastest)     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         v                       v                       v
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   E2E GitHub    │    │   Deployment    │    │   🎉 Ready      │
│   (main only)   │    │   Ready Check   │    │   to Deploy     │
│   (optional)    │    │   (main only)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Stage Details**

#### 🏃‍♂️ **Stage 1: Quality & TypeScript** (10 min)
- **Fastest feedback**: Fails immediately on code quality issues
- **TypeScript validation**: CLI + packages/rn + packages/unistyles
- **ESLint**: Code style and consistency
- **Build verification**: Ensures CLI compiles correctly

#### 🧪 **Stage 2: Unit Tests** (5 min, parallel)
- **Multi-node testing**: Node.js 18.x and 20.x
- **Jest unit tests**: CLI business logic validation
- **Coverage reports**: Uploaded for Node 20.x
- **Fast execution**: Mocked dependencies

#### 🔬 **Stage 3: E2E Local Packages** (15 min)
- **Local package testing**: Uses YOUR code before commit
- **Real CLI execution**: Full integration testing
- **Component installation**: All local components tested
- **TypeScript validation**: Ensures user code compiles

#### 🌐 **Stage 4: E2E GitHub** (10 min, main branch only)
- **GitHub integration**: Validates live repository
- **Optional**: Doesn't fail CI if GitHub has issues
- **Production readiness**: Confirms live system works

#### 🚀 **Stage 5: Deployment Ready** (5 min, main branch only)
- **Package validation**: npm pack verification
- **Size check**: Enforces 1MB limit
- **Production build**: Final build verification

## 🚀 Development Workflow

### **Local Development Commands**
```bash
# Quick validation (before coding)
cd cli
bun run build
bun run test:typescript

# Pre-commit validation (comprehensive)
bun run pre-commit

# Complete test suite
bun run test:all

# Individual testing
bun test                 # Unit tests only
bun run test:e2e         # E2E with local packages
bun run test:e2e-github  # E2E with GitHub
bun run lint             # ESLint only
```

### **Release Workflow**
```bash
# Automated release process
bun run release 0.0.16-beta.4   # Specific version
bun run release patch            # Auto-increment patch
bun run release minor            # Auto-increment minor
bun run release major            # Auto-increment major

# Manual process (if needed)
bun run test:all                 # Validate everything
git tag v0.0.16-beta.4          # Create tag
git push origin main            # Push code
git push origin v0.0.16-beta.4  # Push tag
npm publish                     # Publish to npm
```

## 📊 CI Performance Metrics

### **Pipeline Timing** (targets)
- **Quality Check**: < 10 minutes
- **Unit Tests**: < 5 minutes
- **E2E Local**: < 15 minutes
- **E2E GitHub**: < 10 minutes
- **Total Pipeline**: < 30 minutes

### **Success Criteria**
- **Zero TypeScript errors**: All packages
- **100% unit test pass**: All Node versions
- **Local E2E success**: All local components install
- **Package size**: < 1MB
- **Build success**: Production ready

## 🚨 Failure Handling

### **Quality Stage Failure**
```bash
# Fix TypeScript errors
bun run test:typescript

# Fix ESLint issues
bun run lint --fix

# Rebuild and retest
bun run build
```

### **Unit Test Failure**
```bash
# Run tests locally
bun test

# Debug specific test
bun test --testNamePattern="ComponentRegistry"

# Update snapshots if needed
bunx jest --updateSnapshot
```

### **E2E Local Failure**
```bash
# Debug E2E issues
bun run test:e2e

# Check test project manually
cd test-cli-integration/react-native-stylesheet
bunx tsc --noEmit

# Clean and retry
bun run test:e2e
```

## 🎯 Quality Gates

### **Automatic Checks**
- ✅ **TypeScript**: Zero errors in CLI + packages
- ✅ **ESLint**: Zero warnings/errors
- ✅ **Unit Tests**: 100% pass rate
- ✅ **E2E Local**: All local components install
- ✅ **Build**: Successful production build
- ✅ **Package Size**: Under 1MB limit

### **Manual Reviews** (for complex changes)
- 📝 **Code Review**: Peer review for architecture changes
- 🧪 **Manual Testing**: Complex integration scenarios
- 📚 **Documentation**: Updates for new features
- 🔐 **Security Review**: External dependency changes

## 🚀 Deployment Strategy

### **Environments**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Development │    │   Staging   │    │ Production  │
│   (local)   │ -> │  (GitHub)   │ -> │    (npm)    │
└─────────────┘    └─────────────┘    └─────────────┘
```

### **Branch Strategy**
- **`main`**: Production-ready code, auto-deployed to npm
- **`develop`**: Integration branch, triggers full CI
- **`feature/*`**: Feature branches, run quality + unit tests
- **`hotfix/*`**: Emergency fixes, fast-track to main

### **Release Strategy**
- **Semantic Versioning**: MAJOR.MINOR.PATCH(-beta.X)
- **Git Tags**: Each release tagged (v0.0.16-beta.4)
- **GitHub Releases**: Auto-generated from tags
- **npm Publishing**: Manual trigger after CI passes

## 📈 Monitoring & Metrics

### **CI Health Metrics**
- **Success Rate**: Target 95%+
- **Pipeline Duration**: Target < 30 minutes
- **Failure Recovery**: Target < 10 minutes
- **False Positive Rate**: Target < 5%

### **Quality Metrics**
- **Test Coverage**: Target 95%+
- **TypeScript Coverage**: 100%
- **Documentation Coverage**: Target 90%+
- **Performance**: CLI commands < 5 seconds

### **Alerts & Notifications**
- **GitHub Actions**: CI status updates
- **Email Notifications**: Critical failures
- **GitHub Status**: PR status updates
- **Dependency Alerts**: Security vulnerability scanning

## 🔒 Security & Compliance

### **Security Measures**
- **Dependency Scanning**: Automated vulnerability checks
- **Code Scanning**: GitHub Security scanning
- **Secret Detection**: No hardcoded secrets
- **Access Control**: Restricted deployment permissions

### **Compliance Requirements**
- **Audit Trail**: All deployments logged
- **Code Review**: Required for main branch
- **Testing Evidence**: Complete test reports
- **Change Management**: Documented release process

## 🎛️ CI Configuration

### **Environment Variables**
```yaml
CI: true                           # Enables CI mode
NEXT_TELEMETRY_DISABLED: 1        # Disables telemetry
NODE_ENV: test                     # Test environment
```

### **Caching Strategy**
- **bun cache**: Dependencies cached per package.json hash
- **Node modules**: Cached across pipeline stages
- **Build artifacts**: CLI dist/ cached between jobs

### **Timeout Strategy**
- **Quality Check**: 10 minutes
- **Unit Tests**: 5 minutes
- **E2E Tests**: 15 minutes
- **Total Pipeline**: 45 minutes (with buffer)

## 🛠️ Scripts Reference

### **Pre-commit Validation**
```bash
bun run pre-commit  # Comprehensive pre-commit checks
```

**Includes:**
- CLI build validation
- TypeScript compilation
- ESLint code style
- Unit test execution
- E2E local package testing

### **Release Management**
```bash
bun run release <version>  # Full release process
```

**Process:**
1. Git status validation
2. Version increment/validation
3. Complete test suite
4. Production build
5. Package verification
6. Git commit and tag creation

### **Test Execution**
```bash
bun run test:all           # Complete test suite
bun run test:typescript    # TypeScript validation
bun run test:e2e          # E2E local packages
bun run test:e2e-github   # E2E GitHub integration
```

This enterprise-grade CI/CD system ensures production-ready releases with comprehensive validation and automated quality gates.
