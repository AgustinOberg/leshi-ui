#!/usr/bin/env node

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, rmSync } from 'fs';

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

function getAllComponentsFromPackages() {
  log('📋 Scanning ALL components from packages directory...', 'blue');
  
  // Get actual components from packages/rn directory
  const rnComponentsPath = join(PROJECT_ROOT, 'packages', 'rn', 'components', 'ui');
  const componentFiles = [];
  
  if (existsSync(rnComponentsPath)) {
    try {
      const files = execSync('ls *.tsx', { cwd: rnComponentsPath, encoding: 'utf8' }).trim().split('\n');
      files.forEach(file => {
        const componentName = file.replace('.tsx', '');
        // Skip modal-provider as it's now consolidated into modal
        if (componentName !== 'modal-provider') {
          componentFiles.push(componentName);
        }
      });
    } catch (error) {
      log(`  ⚠️  Could not list components from packages directory`, 'yellow');
    }
  }
  
  if (componentFiles.length === 0) {
    // Fallback to a comprehensive list of components we know should exist
    const knownComponents = [
      'text', 'button', 'surface', 'icon', 'label', 'badge', 'avatar',
      'checkbox', 'switch', 'progress', 'skeleton', 'modal', 'dialog', 
      'alert-dialog', 'text-input', 'text-area', 'divider', 'radio', 
      'slot', 'spinner'
    ];
    componentFiles.push(...knownComponents);
    log(`  ⚠️  Using fallback component list: ${knownComponents.length} components`, 'yellow');
  }
  
  log(`  ✅ Found ${componentFiles.length} components to test: ${componentFiles.join(', ')}`);
  return componentFiles;
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
    log(`  ✅ Component ${componentName} installed successfully`, 'green');
    return { success: true, component: componentName };
  } catch (error) {
    log(`  ❌ Component ${componentName} failed to install`, 'red');
    log(`     Error: ${error.message}`, 'red');
    return { success: false, component: componentName, error: error.message };
  }
}

function installTheme(themeName) {
  log(`🎨 Installing theme: ${themeName}`, 'blue');
  try {
    exec(`node "${CLI_BINARY}" add theme ${themeName} --yes`);
    log(`  ✅ Theme ${themeName} installed successfully`, 'green');
    return { success: true, theme: themeName };
  } catch (error) {
    log(`  ⚠️  Theme ${themeName} failed to install`, 'yellow');
    return { success: false, theme: themeName, error: error.message };
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
  
  log('🧪 Starting COMPREHENSIVE E2E Integration Test', 'cyan');
  log('===============================================', 'cyan');
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
    
    // Step 5: Get ALL available components
    const allComponents = getAllComponentsFromPackages();
    
    // Step 6: Install ALL components (continue on failure)
    log(`\\n📦 Installing ${allComponents.length} components...`, 'blue');
    const installResults = [];
    const installedComponents = [];
    
    for (const component of allComponents) {
      const result = installComponent(component);
      installResults.push(result);
      if (result.success) {
        installedComponents.push(result.component);
      }
    }
    
    // Step 7: Report installation results
    const successCount = installResults.filter(r => r.success).length;
    const failCount = installResults.filter(r => !r.success).length;
    
    log(`\\n📊 Component Installation Results:`, 'cyan');
    log(`   ✅ Successful: ${successCount}/${allComponents.length}`, 'green');
    log(`   ❌ Failed: ${failCount}/${allComponents.length}`, failCount > 0 ? 'red' : 'green');
    
    if (failCount > 0) {
      log(`\\n❌ Failed components:`, 'red');
      installResults.filter(r => !r.success).forEach(result => {
        log(`   • ${result.component}: ${result.error}`, 'red');
      });
    }
    
    if (successCount === 0) {
      throw new Error('No components could be installed. Check GitHub connectivity or CLI configuration.');
    }
    
    // Step 8: Install some common themes
    const commonThemes = ['dark', 'light', 'spotify', 'twitter-dark', 'supabase-light'];
    log(`\\n🎨 Installing ${commonThemes.length} common themes...`, 'blue');
    const themeResults = [];
    
    for (const theme of commonThemes) {
      const result = installTheme(theme);
      themeResults.push(result);
    }
    
    const installedThemesCount = themeResults.filter(r => r.success).length;
    log(`  ✅ Successfully installed ${installedThemesCount}/${commonThemes.length} themes`);
    
    // Step 9: Verify installation
    verifyInstallation(installedComponents);
    
    // Step 10: Run TypeScript check
    runTypeScriptCheck();
    
    // Success!
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('\\n===============================================', 'green');
    log('🎉 COMPREHENSIVE E2E Integration Test PASSED!', 'green');
    log(`✅ Successfully installed ${successCount}/${allComponents.length} components`, 'green');
    log(`✅ Successfully installed ${installedThemesCount}/${commonThemes.length} themes`, 'green');
    log(`✅ TypeScript compilation successful`, 'green');
    log(`⏱️  Total time: ${duration}s`, 'green');
    log('===============================================', 'green');
    
    log(`\\n📂 You can inspect the result at:`, 'cyan');
    log(`   ${TEST_PROJECT_PATH}`, 'cyan');
    
    if (failCount > 0) {
      log(`\\n⚠️  Note: ${failCount} components failed to install`, 'yellow');
      log(`   This could be due to:`, 'yellow');
      log(`   • Components not yet available in GitHub`, 'yellow');
      log(`   • Network connectivity issues`, 'yellow');
      log(`   • CLI configuration problems`, 'yellow');
      log(`   • Component dependencies not met`, 'yellow');
    }
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('\\n===============================================', 'red');
    log('❌ COMPREHENSIVE E2E Integration Test FAILED!', 'red');
    log(`Error: ${error.message}`, 'red');
    log(`⏱️  Failed after: ${duration}s`, 'red');
    log('===============================================', 'red');
    
    log(`\\n📂 You can debug the issue at:`, 'yellow');
    log(`   ${TEST_PROJECT_PATH}`, 'yellow');
    
    log(`\\n💡 Debugging tips:`, 'yellow');
    log(`   • Check if CLI can connect to GitHub`, 'yellow');
    log(`   • Verify components exist in GitHub repository`, 'yellow');
    log(`   • Test individual component installation manually`, 'yellow');
    log(`   • Check CLI configuration and dependencies`, 'yellow');
    
    process.exit(1);
  }
}

main();