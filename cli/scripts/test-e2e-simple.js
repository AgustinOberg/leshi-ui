#!/usr/bin/env node

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, rmSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = dirname(__dirname);
const TEST_PROJECT_PATH = join(CLI_ROOT, 'test-cli-integration', 'react-native-stylesheet');
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
  log('🧹 Cleaning test project (keeping base structure)...', 'blue');
  
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
  
  log('  ✅ Test project cleaned (base Expo structure preserved)', 'green');
}

function initProject() {
  log('🚀 Initializing leshi-ui in test project...', 'blue');
  exec(`node "${CLI_BINARY}" init --yes`);
  log('  ✅ Project initialized successfully');
}

function installComponent(componentName) {
  log(`📦 Installing component: ${componentName}`, 'blue');
  try {
    exec(`node "${CLI_BINARY}" add component ${componentName} --yes`);
    log(`  ✅ Component ${componentName} installed successfully`);
    return true;
  } catch (error) {
    log(`  ❌ Component ${componentName} failed to install: ${error.message}`, 'red');
    return false;
  }
}

function runTypeScriptCheck() {
  log('🔍 Running TypeScript check...', 'blue');
  exec('npx tsc --noEmit');
  log('  ✅ TypeScript check passed - no type errors!', 'green');
}

function verifyInstallation(installedComponents) {
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
  
  // Check that each installed component file exists
  installedComponents.forEach(componentName => {
    const componentPath = join(componentsPath, `${componentName}.tsx`);
    if (!existsSync(componentPath)) {
      throw new Error(`Component file not found: ${componentName}.tsx`);
    }
  });
  
  log(`  ✅ All ${installedComponents.length} installed components verified`);
  log(`  ✅ Installation structure verified`);
}

async function main() {
  const startTime = Date.now();
  
  log('🧪 Starting Simple E2E Integration Test', 'cyan');
  log('=============================================', 'cyan');
  log(`📁 Test project: ${TEST_PROJECT_PATH}`, 'blue');
  
  try {
    // Step 1: Verify CLI is built
    if (!existsSync(CLI_BINARY)) {
      throw new Error(`CLI binary not found at ${CLI_BINARY}. Run 'npm run build' first.`);
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
    
    // Step 5: Test with core components that we know exist in GitHub
    const coreComponents = [
      'text',      // Base component, should always work
      'button',    // Common component  
      'surface',   // Simple component
      'icon'       // Basic component
    ];
    
    log(`\\n📦 Installing ${coreComponents.length} core components...`, 'blue');
    const installedComponents = [];
    
    for (const component of coreComponents) {
      if (installComponent(component)) {
        installedComponents.push(component);
      }
    }
    
    if (installedComponents.length === 0) {
      throw new Error('No components could be installed. Check GitHub connectivity or CLI configuration.');
    }
    
    log(`\\n✅ Successfully installed ${installedComponents.length}/${coreComponents.length} components`);
    
    // Step 6: Verify installation
    verifyInstallation(installedComponents);
    
    // Step 7: Run TypeScript check
    runTypeScriptCheck();
    
    // Success!
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('\\n=============================================', 'green');
    log('🎉 Simple E2E Integration Test PASSED!', 'green');
    log(`✅ Successfully installed ${installedComponents.length} components`, 'green');
    log(`✅ TypeScript compilation successful`, 'green');
    log(`⏱️  Total time: ${duration}s`, 'green');
    log('=============================================', 'green');
    
    log(`\\n📂 You can inspect the result at:`, 'cyan');
    log(`   ${TEST_PROJECT_PATH}`, 'cyan');
    
    log(`\\n🎯 Next steps to test more components:`, 'blue');
    log(`   1. Verify these core components work correctly`, 'blue');
    log(`   2. Test additional components individually`, 'blue');
    log(`   3. Check GitHub connectivity and component availability`, 'blue');
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('\\n=============================================', 'red');
    log('❌ Simple E2E Integration Test FAILED!', 'red');
    log(`Error: ${error.message}`, 'red');
    log(`⏱️  Failed after: ${duration}s`, 'red');
    log('=============================================', 'red');
    
    log(`\\n📂 You can debug the issue at:`, 'yellow');
    log(`   ${TEST_PROJECT_PATH}`, 'yellow');
    
    log(`\\n💡 Debugging tips:`, 'yellow');
    log(`   • Check if CLI can connect to GitHub`, 'yellow');
    log(`   • Verify component exists in GitHub repository`, 'yellow');
    log(`   • Test individual component installation manually`, 'yellow');
    
    process.exit(1);
  }
}

main();