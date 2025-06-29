#!/usr/bin/env node

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, rmSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = dirname(__dirname);
const TEST_PROJECT_PATH = join(CLI_ROOT, 'test-projects', 'test-rn');
const CLI_BINARY = join(CLI_ROOT, 'dist', 'index.js');

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

function cleanProject() {
  log('🧹 Cleaning test project...', 'blue');
  
  const pathsToClean = [
    join(TEST_PROJECT_PATH, 'components'),
    join(TEST_PROJECT_PATH, 'styles'),
    join(TEST_PROJECT_PATH, 'lib'),
    join(TEST_PROJECT_PATH, 'leshi-ui.json')
  ];

  pathsToClean.forEach(path => {
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
      log(`  ✅ Removed ${path.replace(TEST_PROJECT_PATH, '.')}`);
    }
  });
}

function initProject() {
  log('🚀 Initializing leshi-ui project...', 'blue');
  exec(`node "${CLI_BINARY}" init --yes`);
  log('  ✅ Project initialized successfully');
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
    exec(`bun add ${depsArray.join(' ')}`);
    log(`  ✅ External dependencies installed successfully`);
  } else {
    log(`  ✅ No external dependencies required`);
  }
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

function verifyInstallation() {
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
  
  // Check that lib directory exists
  const libPath = join(TEST_PROJECT_PATH, 'lib');
  if (!existsSync(libPath)) {
    throw new Error('lib directory not found');
  }
  
  log('  ✅ All directories verified');
}

async function main() {
  const startTime = Date.now();
  
  log('🧪 Starting E2E Integration Test', 'cyan');
  log('====================================', 'cyan');
  
  try {
    // Step 1: Verify CLI is built
    if (!existsSync(CLI_BINARY)) {
      throw new Error(`CLI binary not found at ${CLI_BINARY}. Run 'bun run build' first.`);
    }
    log('✅ CLI binary found', 'green');
    
    // Step 2: Verify test project exists
    if (!existsSync(TEST_PROJECT_PATH)) {
      throw new Error(`Test project not found at ${TEST_PROJECT_PATH}`);
    }
    log('✅ Test project found', 'green');
    
    // Step 3: Clean previous test artifacts
    cleanProject();
    
    // Step 4: Initialize leshi-ui
    initProject();
    
    // Step 5: Verify basic installation
    verifyInstallation();
    
    // Step 6: Get all components from registry
    const { components, registry } = getAllComponents();
    
    // Step 7: Install external dependencies
    installExternalDependencies(registry, components);
    
    // Step 8: Install all components
    log(`📦 Installing ${components.length} components...`, 'blue');
    for (const component of components) {
      installComponent(component);
    }
    
    // Step 9: Run TypeScript check
    runTypeScriptCheck();
    
    // Success!
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('====================================', 'green');
    log('🎉 E2E Integration Test PASSED!', 'green');
    log(`✅ Successfully installed ${components.length} components`, 'green');
    log(`✅ TypeScript compilation successful`, 'green');
    log(`⏱️  Total time: ${duration}s`, 'green');
    log('====================================', 'green');
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('====================================', 'red');
    log('❌ E2E Integration Test FAILED!', 'red');
    log(`Error: ${error.message}`, 'red');
    log(`⏱️  Failed after: ${duration}s`, 'red');
    log('====================================', 'red');
    process.exit(1);
  }
}

main();