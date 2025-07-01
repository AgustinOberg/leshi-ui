#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, rmSync, mkdirSync, cpSync, writeFileSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { createHash } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = dirname(__dirname);
const PROJECT_ROOT = dirname(CLI_ROOT);
const CLI_BINARY = join(CLI_ROOT, 'dist', 'index.js');

// Create unique test directory
const TEST_ID = createHash('md5').update(Date.now().toString()).digest('hex').substring(0, 8);
const TEST_DIR = join(tmpdir(), `leshi-test-${TEST_ID}`);
const TEST_PROJECT_PATH = join(TEST_DIR, 'test-rn');

// Colors for output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, cwd = TEST_PROJECT_PATH) {
  try {
    log(`📝 Executing: ${command}`, 'cyan');
    const output = execSync(command, { 
      cwd, 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    return output;
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red');
    log(`Error: ${error.message}`, 'red');
    if (error.stdout) log(`STDOUT: ${error.stdout}`, 'yellow');
    if (error.stderr) log(`STDERR: ${error.stderr}`, 'yellow');
    throw error;
  }
}

function cleanup() {
  log('🧹 Cleaning up temporary test directory...', 'blue');
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true });
    log(`  ✅ Removed ${TEST_DIR}`, 'green');
  }
}

function setupTestEnvironment() {
  log('🏗️  Setting up test environment...', 'blue');
  
  // Create test directory
  mkdirSync(TEST_DIR, { recursive: true });
  mkdirSync(TEST_PROJECT_PATH, { recursive: true });
  
  // Create minimal React Native project structure
  const packageJson = {
    name: "test-rn-app",
    version: "1.0.0",
    main: "index.js",
    dependencies: {
      "react": "^18.2.0",
      "react-native": "^0.72.0"
    },
    devDependencies: {
      "typescript": "^5.2.2",
      "@types/react": "^18.2.0",
      "@types/react-native": "^0.72.0"
    }
  };
  
  writeFileSync(
    join(TEST_PROJECT_PATH, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create basic tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: "es2017",
      lib: ["es2017"],
      allowSyntheticDefaultImports: true,
      jsx: "react-native",
      module: "commonjs",
      moduleResolution: "node",
      noEmit: true,
      resolveJsonModule: true,
      strict: true,
      skipLibCheck: true,
      esModuleInterop: true
    },
    include: [
      "**/*.ts",
      "**/*.tsx"
    ],
    exclude: [
      "node_modules"
    ]
  };
  
  writeFileSync(
    join(TEST_PROJECT_PATH, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );
  
  log(`  ✅ Test environment created at ${TEST_DIR}`, 'green');
}

function mockGitHubService() {
  log('🔧 Setting up GitHub service mock...', 'blue');
  
  // Copy packages from project root to test directory
  const sourcePakcages = join(PROJECT_ROOT, 'packages');
  const targetPackages = join(TEST_DIR, 'mock-github', 'packages');
  
  mkdirSync(join(TEST_DIR, 'mock-github'), { recursive: true });
  cpSync(sourcePakcages, targetPackages, { recursive: true });
  
  // Copy component registry from project root
  const sourceRegistry = join(PROJECT_ROOT, 'cli', 'component-registry.json');
  const targetRegistry = join(TEST_DIR, 'mock-github', 'cli', 'component-registry.json');
  
  mkdirSync(join(TEST_DIR, 'mock-github', 'cli'), { recursive: true });
  cpSync(sourceRegistry, targetRegistry);
  
  // Create a modified GitHub service that uses local files
  const githubServicePath = join(CLI_ROOT, 'dist', 'services', 'github-service.js');
  const originalService = readFileSync(githubServicePath, 'utf8');
  
  // Replace GitHub URLs with local file paths
  const mockedService = originalService
    .replace(
      /https:\/\/raw\.githubusercontent\.com\/[^\/]+\/[^\/]+\/[^\/]+\//g,
      `file://${TEST_DIR}/mock-github/`
    )
    .replace(
      /const response = await fetch\(([^)]+)\);/g,
      `const response = await import($1.replace('file://', ''));`
    );
  
  writeFileSync(githubServicePath + '.backup', originalService);
  writeFileSync(githubServicePath, mockedService);
  
  log('  ✅ GitHub service mocked to use local files', 'green');
}

function restoreGitHubService() {
  log('🔧 Restoring original GitHub service...', 'blue');
  
  const githubServicePath = join(CLI_ROOT, 'dist', 'services', 'github-service.js');
  const backupPath = githubServicePath + '.backup';
  
  if (existsSync(backupPath)) {
    const originalService = readFileSync(backupPath, 'utf8');
    writeFileSync(githubServicePath, originalService);
    rmSync(backupPath);
    log('  ✅ GitHub service restored', 'green');
  }
}

function getAllComponents() {
  log('📋 Reading component registry...', 'blue');
  const registryPath = join(CLI_ROOT, 'component-registry.json');
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  const components = Object.keys(registry);
  log(`  ✅ Found ${components.length} components: ${components.join(', ')}`);
  return { components, registry };
}

function installExternalDependencies(registry, components) {
  log('📦 Installing external dependencies...', 'blue');
  
  const externalDeps = new Set();
  
  components.forEach(componentName => {
    const component = registry[componentName];
    if (component.externalDeps && component.externalDeps.length > 0) {
      component.externalDeps.forEach(dep => externalDeps.add(dep));
    }
  });
  
  if (externalDeps.size > 0) {
    const depsArray = Array.from(externalDeps);
    log(`  📦 Installing: ${depsArray.join(', ')}`);
    exec(`npm install ${depsArray.join(' ')}`);
    log(`  ✅ External dependencies installed successfully`);
  } else {
    log(`  ✅ No external dependencies required`);
  }
}

function initProject() {
  log('🚀 Initializing leshi-ui project...', 'blue');
  exec(`node "${CLI_BINARY}" init --yes`);
  log('  ✅ Project initialized successfully');
}

function installComponent(componentName) {
  log(`📦 Installing component: ${componentName}`, 'blue');
  exec(`node "${CLI_BINARY}" add component ${componentName} --yes`);
  log(`  ✅ Component ${componentName} installed successfully`);
}

function runTypeScriptCheck() {
  log('🔍 Running TypeScript check...', 'blue');
  exec('npx tsc --noEmit');
  log('  ✅ TypeScript check passed - no type errors!', 'green');
}

function verifyInstallation(components) {
  log('🔍 Verifying installation...', 'blue');
  
  // Check that components directory exists
  const componentsPath = join(TEST_PROJECT_PATH, 'components', 'ui');
  if (!existsSync(componentsPath)) {
    throw new Error('components/ui directory not found');
  }
  
  // Check that styles directory exists
  const stylesPath = join(TEST_PROJECT_PATH, 'styles');
  if (!existsSync(stylesPath)) {
    throw new Error('styles directory not found');
  }
  
  // Check that each component file exists
  components.forEach(componentName => {
    const componentPath = join(componentsPath, `${componentName}.tsx`);
    if (!existsSync(componentPath)) {
      throw new Error(`Component file not found: ${componentName}.tsx`);
    }
  });
  
  log(`  ✅ All ${components.length} components verified`);
}

// Graceful cleanup on process exit
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(1);
});
process.on('SIGTERM', () => {
  cleanup();
  process.exit(1);
});

async function main() {
  const startTime = Date.now();
  
  log('🧪 Starting E2E Integration Test with Temporary Environment', 'cyan');
  log('================================================================', 'cyan');
  log(`📁 Test directory: ${TEST_DIR}`, 'blue');
  
  try {
    // Step 1: Verify CLI is built
    if (!existsSync(CLI_BINARY)) {
      throw new Error(`CLI binary not found at ${CLI_BINARY}. Run 'bun run build' first.`);
    }
    log('✅ CLI binary found', 'green');
    
    // Step 2: Verify project packages exist
    const packagesPath = join(PROJECT_ROOT, 'packages');
    if (!existsSync(packagesPath)) {
      throw new Error(`Project packages not found at ${packagesPath}`);
    }
    log('✅ Project packages found', 'green');
    
    // Step 3: Setup test environment
    setupTestEnvironment();
    
    // Step 4: Mock GitHub service (commented out for now - we'll use real GitHub)
    // mockGitHubService();
    
    // Step 5: Get all components from registry
    const { components, registry } = getAllComponents();
    
    // Step 6: Initialize leshi-ui
    initProject();
    
    // Step 7: Install external dependencies
    installExternalDependencies(registry, components);
    
    // Step 8: Install all components
    log(`📦 Installing ${components.length} components...`, 'blue');
    for (const component of components) {
      installComponent(component);
    }
    
    // Step 9: Verify installation
    verifyInstallation(components);
    
    // Step 10: Run TypeScript check
    runTypeScriptCheck();
    
    // Success!
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('================================================================', 'green');
    log('🎉 E2E Integration Test PASSED!', 'green');
    log(`✅ Successfully installed ${components.length} components`, 'green');
    log(`✅ TypeScript compilation successful`, 'green');
    log(`⏱️  Total time: ${duration}s`, 'green');
    log(`📁 Test performed in: ${TEST_DIR}`, 'green');
    log('================================================================', 'green');
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('================================================================', 'red');
    log('❌ E2E Integration Test FAILED!', 'red');
    log(`Error: ${error.message}`, 'red');
    log(`⏱️  Failed after: ${duration}s`, 'red');
    log(`📁 Test directory preserved for debugging: ${TEST_DIR}`, 'yellow');
    log('================================================================', 'red');
    
    // Don't cleanup on failure so we can debug
    process.removeListener('exit', cleanup);
    
    process.exit(1);
  } finally {
    // Restore GitHub service if it was mocked
    // restoreGitHubService();
  }
}

main();