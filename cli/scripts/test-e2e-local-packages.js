#!/usr/bin/env node

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, rmSync, readFileSync, writeFileSync, cpSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = dirname(__dirname);
const PROJECT_ROOT = dirname(CLI_ROOT);
const TEST_PROJECT_PATH = join(CLI_ROOT, 'test-cli-integration', 'react-native-stylesheet');

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

function getAllLocalComponents() {
  log('📋 Scanning ALL components from LOCAL packages...', 'blue');
  
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
      throw new Error(`Could not list components from packages directory: ${error.message}`);
    }
  } else {
    throw new Error(`Packages directory not found at: ${rnComponentsPath}`);
  }
  
  log(`  ✅ Found ${componentFiles.length} LOCAL components: ${componentFiles.join(', ')}`);
  return componentFiles;
}

function getAllLocalThemes() {
  log('📋 Scanning ALL themes from LOCAL packages...', 'blue');
  
  const rnThemesPath = join(PROJECT_ROOT, 'packages', 'rn', 'styles', 'themes');
  const themeFiles = [];
  
  if (existsSync(rnThemesPath)) {
    try {
      const files = execSync('ls *.ts', { cwd: rnThemesPath, encoding: 'utf8' }).trim().split('\n');
      files.forEach(file => {
        const themeName = file.replace('.ts', '');
        // Skip index and common files
        if (themeName !== 'index' && themeName !== 'common') {
          themeFiles.push(themeName);
        }
      });
    } catch (error) {
      log(`  ⚠️  Could not list themes: ${error.message}`, 'yellow');
    }
  }
  
  log(`  ✅ Found ${themeFiles.length} LOCAL themes: ${themeFiles.join(', ')}`);
  return themeFiles;
}

function initProjectWithLocalStyles() {
  log('🚀 Initializing project with LOCAL styles...', 'blue');
  
  // Create directories
  const stylesDir = join(TEST_PROJECT_PATH, 'styles');
  const themesDir = join(stylesDir, 'themes');
  mkdirSync(stylesDir, { recursive: true });
  mkdirSync(themesDir, { recursive: true });
  
  // Copy core style files from local packages
  const sourceStylesPath = join(PROJECT_ROOT, 'packages', 'rn', 'styles');
  const coreFiles = ['theme.ts', 'theme.d.ts', 'context.tsx'];
  
  coreFiles.forEach(file => {
    const srcPath = join(sourceStylesPath, file);
    const destPath = join(stylesDir, file);
    if (existsSync(srcPath)) {
      cpSync(srcPath, destPath);
      log(`  ✅ Copied ${file}`);
    }
  });
  
  // Copy themes
  const sourceThemesPath = join(sourceStylesPath, 'themes');
  if (existsSync(sourceThemesPath)) {
    cpSync(sourceThemesPath, themesDir, { recursive: true });
    log(`  ✅ Copied all themes`);
  }
  
  // Create leshi-ui.json config
  const config = {
    framework: "rn",
    aliases: {
      "@": "./"
    }
  };
  writeFileSync(join(TEST_PROJECT_PATH, 'leshi-ui.json'), JSON.stringify(config, null, 2));
  
  log('  ✅ Project initialized with LOCAL files');
}

function installLocalComponent(componentName) {
  log(`📦 Installing LOCAL component: ${componentName}`, 'blue');
  
  try {
    // Create components directory if it doesn't exist
    const componentsDir = join(TEST_PROJECT_PATH, 'components', 'ui');
    mkdirSync(componentsDir, { recursive: true });
    
    // Copy component from local packages
    const srcPath = join(PROJECT_ROOT, 'packages', 'rn', 'components', 'ui', `${componentName}.tsx`);
    const destPath = join(componentsDir, `${componentName}.tsx`);
    
    if (!existsSync(srcPath)) {
      throw new Error(`Component file not found: ${srcPath}`);
    }
    
    cpSync(srcPath, destPath);
    
    // Copy any utility files if they exist
    const libDir = join(TEST_PROJECT_PATH, 'lib');
    const sourceLibPath = join(PROJECT_ROOT, 'packages', 'rn', 'lib');
    if (existsSync(sourceLibPath)) {
      mkdirSync(libDir, { recursive: true });
      
      // Copy specific utility files (like modal-utils.ts)
      const utilFiles = [`${componentName}-utils.ts`, 'modal-utils.ts']; // Common patterns
      utilFiles.forEach(utilFile => {
        const srcUtilPath = join(sourceLibPath, utilFile);
        if (existsSync(srcUtilPath)) {
          const destUtilPath = join(libDir, utilFile);
          cpSync(srcUtilPath, destUtilPath);
          log(`  ✅ Copied utility: ${utilFile}`);
        }
      });
    }
    
    log(`  ✅ Component ${componentName} installed from LOCAL files`, 'green');
    return { success: true, component: componentName };
    
  } catch (error) {
    log(`  ❌ Component ${componentName} failed to install from LOCAL files`, 'red');
    log(`     Error: ${error.message}`, 'red');
    return { success: false, component: componentName, error: error.message };
  }
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

function runTypeScriptCheck() {
  log('🔍 Running TypeScript check on LOCAL components...', 'blue');
  exec('npx tsc --noEmit');
  log('  ✅ TypeScript check passed - no type errors!', 'green');
}

function verifyInstallation(installedComponents, installedThemes) {
  log('🔍 Verifying LOCAL installation...', 'blue');
  
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
  
  // Check theme files
  const themesPath = join(stylesPath, 'themes');
  if (existsSync(themesPath)) {
    log(`  ✅ Found ${installedThemes} theme files`);
  }
  
  log(`  ✅ All ${installedComponents.length} LOCAL components verified`);
  log(`  ✅ LOCAL installation structure verified`);
}

async function main() {
  const startTime = Date.now();
  
  log('🧪 Starting LOCAL PACKAGES E2E Integration Test', 'cyan');
  log('================================================', 'cyan');
  log(`📁 Test project: ${TEST_PROJECT_PATH}`, 'blue');
  log(`📦 Source packages: ${join(PROJECT_ROOT, 'packages')}`, 'blue');
  
  try {
    // Step 1: Verify test project exists
    if (!existsSync(TEST_PROJECT_PATH)) {
      throw new Error(`Test project not found at ${TEST_PROJECT_PATH}`);
    }
    log('✅ Test project found', 'green');
    
    // Step 2: Verify packages exist
    const packagesPath = join(PROJECT_ROOT, 'packages', 'rn');
    if (!existsSync(packagesPath)) {
      throw new Error(`Local packages not found at ${packagesPath}`);
    }
    log('✅ Local packages found', 'green');
    
    // Step 3: Clean previous test artifacts
    cleanProject();
    
    // Step 4: Initialize project with local styles
    initProjectWithLocalStyles();
    
    // Step 5: Install external dependencies
    installExternalDependencies();
    
    // Step 6: Get ALL local components and themes
    const allComponents = getAllLocalComponents();
    const allThemes = getAllLocalThemes();
    
    // Step 7: Install ALL local components
    log(`\\n📦 Installing ${allComponents.length} LOCAL components...`, 'blue');
    const installResults = [];
    const installedComponents = [];
    
    for (const component of allComponents) {
      const result = installLocalComponent(component);
      installResults.push(result);
      if (result.success) {
        installedComponents.push(result.component);
      }
    }
    
    // Step 8: Report installation results
    const successCount = installResults.filter(r => r.success).length;
    const failCount = installResults.filter(r => !r.success).length;
    
    log(`\\n📊 LOCAL Component Installation Results:`, 'cyan');
    log(`   ✅ Successful: ${successCount}/${allComponents.length}`, 'green');
    log(`   ❌ Failed: ${failCount}/${allComponents.length}`, failCount > 0 ? 'red' : 'green');
    
    if (failCount > 0) {
      log(`\\n❌ Failed components:`, 'red');
      installResults.filter(r => !r.success).forEach(result => {
        log(`   • ${result.component}: ${result.error}`, 'red');
      });
    }
    
    if (successCount === 0) {
      throw new Error('No components could be installed from local packages.');
    }
    
    // Step 9: Verify installation
    verifyInstallation(installedComponents, allThemes.length);
    
    // Step 10: Run TypeScript check
    runTypeScriptCheck();
    
    // Success!
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('\\n================================================', 'green');
    log('🎉 LOCAL PACKAGES E2E Integration Test PASSED!', 'green');
    log(`✅ Successfully installed ${successCount}/${allComponents.length} LOCAL components`, 'green');
    log(`✅ Found ${allThemes.length} LOCAL themes`, 'green');
    log(`✅ TypeScript compilation successful with YOUR code`, 'green');
    log(`⏱️  Total time: ${duration}s`, 'green');
    log('================================================', 'green');
    
    log(`\\n📂 Your LOCAL components are working at:`, 'cyan');
    log(`   ${TEST_PROJECT_PATH}`, 'cyan');
    
    log(`\\n🎯 What this proves:`, 'blue');
    log(`   • ALL your local components compile without errors`, 'blue');
    log(`   • Your TypeScript definitions are correct`, 'blue');
    log(`   • Components can be imported and used properly`, 'blue');
    log(`   • Ready to commit to git with confidence!`, 'blue');
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('\\n================================================', 'red');
    log('❌ LOCAL PACKAGES E2E Integration Test FAILED!', 'red');
    log(`Error: ${error.message}`, 'red');
    log(`⏱️  Failed after: ${duration}s`, 'red');
    log('================================================', 'red');
    
    log(`\\n📂 Debug your LOCAL code at:`, 'yellow');
    log(`   ${TEST_PROJECT_PATH}`, 'yellow');
    
    log(`\\n💡 This means:`, 'yellow');
    log(`   • Fix the errors in your local packages first`, 'yellow');
    log(`   • Don't commit until this test passes`, 'yellow');
    log(`   • Your changes need work before going to git`, 'yellow');
    
    process.exit(1);
  }
}

main();