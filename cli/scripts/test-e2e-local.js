#!/usr/bin/env node

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, rmSync, readFileSync, writeFileSync, cpSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = dirname(__dirname);
const PROJECT_ROOT = dirname(CLI_ROOT);
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

function setupLocalTestingMode() {
  log('🔧 Setting up local testing mode...', 'blue');
  
  // Copy packages from project root to a temp location the CLI can access
  const tempPackagesPath = join(CLI_ROOT, 'temp-packages-for-testing');
  const sourcePackagesPath = join(PROJECT_ROOT, 'packages');
  
  // Clean and copy packages
  if (existsSync(tempPackagesPath)) {
    rmSync(tempPackagesPath, { recursive: true, force: true });
  }
  cpSync(sourcePackagesPath, tempPackagesPath, { recursive: true });
  
  // Create a temporary registry
  const tempRegistryPath = join(CLI_ROOT, 'temp-registry-for-testing.json');
  const sourceRegistryPath = join(CLI_ROOT, 'component-registry.json');
  cpSync(sourceRegistryPath, tempRegistryPath);
  
  log('  ✅ Local packages and registry prepared for testing', 'green');
  
  return { tempPackagesPath, tempRegistryPath };
}

function cleanupLocalTestingMode(tempPackagesPath, tempRegistryPath) {
  log('🧹 Cleaning up local testing mode...', 'blue');
  
  if (existsSync(tempPackagesPath)) {
    rmSync(tempPackagesPath, { recursive: true, force: true });
  }
  if (existsSync(tempRegistryPath)) {
    rmSync(tempRegistryPath, { force: true });
  }
  
  log('  ✅ Temporary testing files cleaned up', 'green');
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

function getAllAvailableComponents() {
  log('📋 Scanning available components from packages...', 'blue');
  
  // Get actual components from packages/rn directory
  const rnComponentsPath = join(PROJECT_ROOT, 'packages', 'rn', 'components', 'ui');
  const componentFiles = [];
  
  if (existsSync(rnComponentsPath)) {
    const files = execSync('ls *.tsx', { cwd: rnComponentsPath, encoding: 'utf8' }).trim().split('\n');
    files.forEach(file => {
      const componentName = file.replace('.tsx', '');
      // Skip modal-provider as it's now consolidated into modal
      if (componentName !== 'modal-provider') {
        componentFiles.push(componentName);
      }
    });
  }
  
  log(`  ✅ Found ${componentFiles.length} actual components: ${componentFiles.join(', ')}`);
  return componentFiles;
}

function initProject() {
  log('🚀 Initializing leshi-ui in test project...', 'blue');
  exec(`node "${CLI_BINARY}" init --yes`);
  log('  ✅ Project initialized successfully');
}

function installExternalDependencies() {
  log('📦 Installing external dependencies...', 'blue');
  
  // Install the most common external dependencies for all components
  const commonDeps = [
    '@gorhom/portal',
    'react-native-reanimated'
  ];
  
  log(`  📦 Installing: ${commonDeps.join(', ')}`);
  exec(`bun add ${commonDeps.join(' ')}`);
  log(`  ✅ External dependencies installed successfully`);
}

function installComponent(componentName) {
  log(`📦 Installing component: ${componentName}`, 'blue');
  try {
    exec(`node "${CLI_BINARY}" add component ${componentName} --yes`);
    log(`  ✅ Component ${componentName} installed successfully`);
    return true;
  } catch (error) {
    log(`  ❌ Component ${componentName} failed to install`, 'red');
    return false;
  }
}

function installTheme(themeName) {
  log(`🎨 Installing theme: ${themeName}`, 'blue');
  try {
    exec(`node "${CLI_BINARY}" add theme ${themeName} --yes`);
    log(`  ✅ Theme ${themeName} installed successfully`);
    return true;
  } catch (error) {
    log(`  ⚠️  Theme ${themeName} failed to install (might not exist)`, 'yellow');
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
  let tempPackagesPath, tempRegistryPath;
  
  log('🧪 Starting Local E2E Integration Test', 'cyan');
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
    
    // Step 3: Setup local testing mode
    ({ tempPackagesPath, tempRegistryPath } = setupLocalTestingMode());
    
    // Step 4: Clean previous test artifacts
    cleanProject();
    
    // Step 5: Initialize leshi-ui
    initProject();
    
    // Step 6: Get available components
    const availableComponents = getAllAvailableComponents();
    
    // Step 7: Install external dependencies first
    installExternalDependencies();
    
    // Step 8: Install all available components
    log(`\\n📦 Installing ${availableComponents.length} components...`, 'blue');
    const installedComponents = [];
    for (const component of availableComponents) {
      if (installComponent(component)) {
        installedComponents.push(component);
      }
    }
    
    log(`\\n✅ Successfully installed ${installedComponents.length}/${availableComponents.length} components`);
    
    // Step 9: Try to install some themes (optional)
    const commonThemes = ['dark', 'light', 'spotify'];
    log(`\\n🎨 Installing ${commonThemes.length} common themes...`, 'blue');
    let installedThemes = 0;
    for (const theme of commonThemes) {
      if (installTheme(theme)) {
        installedThemes++;
      }
    }
    log(`  ✅ Successfully installed ${installedThemes}/${commonThemes.length} themes`);
    
    // Step 10: Verify installation
    verifyInstallation(installedComponents);
    
    // Step 11: Run TypeScript check
    runTypeScriptCheck();
    
    // Success!
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('\\n=============================================', 'green');
    log('🎉 Local E2E Integration Test PASSED!', 'green');
    log(`✅ Successfully installed ${installedComponents.length} components`, 'green');
    log(`✅ Successfully installed ${installedThemes} themes`, 'green');
    log(`✅ TypeScript compilation successful`, 'green');
    log(`⏱️  Total time: ${duration}s`, 'green');
    log('=============================================', 'green');
    
    log(`\\n📂 You can inspect the result at:`, 'cyan');
    log(`   ${TEST_PROJECT_PATH}`, 'cyan');
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('\\n=============================================', 'red');
    log('❌ Local E2E Integration Test FAILED!', 'red');
    log(`Error: ${error.message}`, 'red');
    log(`⏱️  Failed after: ${duration}s`, 'red');
    log('=============================================', 'red');
    
    log(`\\n📂 You can debug the issue at:`, 'yellow');
    log(`   ${TEST_PROJECT_PATH}`, 'yellow');
    
    process.exit(1);
  } finally {
    // Cleanup temporary files
    if (tempPackagesPath || tempRegistryPath) {
      cleanupLocalTestingMode(tempPackagesPath, tempRegistryPath);
    }
  }
}

main();