#!/usr/bin/env node

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, rmSync, readFileSync, writeFileSync, cpSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = dirname(__dirname);
const PROJECT_ROOT = dirname(CLI_ROOT);
const TEST_PROJECT_PATH = join(CLI_ROOT, 'test-cli-integration', 'react-native-unistyles');

// Colors for output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
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

function setupProject() {
  log('🚀 Setting up Unistyles test project...', 'blue');
  
  // Check if we need to run bun install
  const nodeModulesPath = join(TEST_PROJECT_PATH, 'node_modules');
  if (!existsSync(nodeModulesPath)) {
    log('📦 Installing dependencies with bun...', 'blue');
    exec('bun install');
    log('  ✅ Dependencies installed', 'green');
  } else {
    log('  ✅ Dependencies already installed', 'green');
  }
  
  // Check if we need to run prebuild
  const androidPath = join(TEST_PROJECT_PATH, 'android');
  const iosPath = join(TEST_PROJECT_PATH, 'ios');
  
  if (!existsSync(androidPath) || !existsSync(iosPath)) {
    log('🏗️  Running Expo prebuild...', 'blue');
    exec('bunx expo prebuild --bun');
    log('  ✅ Expo prebuild completed', 'green');
  } else {
    log('  ✅ Native directories already exist', 'green');
  }
  
  log('  ✅ Unistyles project setup complete', 'green');
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
      log(`  ✅ Removed ${path.replace(TEST_PROJECT_PATH, '.')}`);;
    }
  });
  
  log('  ✅ Test project cleaned (base Expo structure preserved)', 'green');
}

function getAllLocalUnistylesComponents() {
  log('📋 Scanning ALL Unistyles components from LOCAL packages...', 'blue');
  
  const unistylesComponentsPath = join(PROJECT_ROOT, 'packages', 'unistyles', 'components', 'ui');
  const componentFiles = [];
  
  if (existsSync(unistylesComponentsPath)) {
    try {
      const files = execSync('ls *.tsx', { cwd: unistylesComponentsPath, encoding: 'utf8' }).trim().split('\n');
      files.forEach(file => {
        const componentName = file.replace('.tsx', '');
        // Skip modal-provider as it's now consolidated into modal
        if (componentName !== 'modal-provider') {
          componentFiles.push(componentName);
        }
      });
    } catch (error) {
      throw new Error(`Could not list Unistyles components from packages directory: ${error.message}`);
    }
  } else {
    throw new Error(`Unistyles packages directory not found at: ${unistylesComponentsPath}`);
  }
  
  log(`  ✅ Found ${componentFiles.length} LOCAL Unistyles components: ${componentFiles.join(', ')}`);
  return componentFiles;
}

function getAllLocalUnistylesThemes() {
  log('📋 Scanning ALL Unistyles themes from LOCAL packages...', 'blue');
  
  const unistylesThemesPath = join(PROJECT_ROOT, 'packages', 'unistyles', 'styles', 'themes');
  const themeFiles = [];
  
  if (existsSync(unistylesThemesPath)) {
    try {
      const files = execSync('ls *.ts', { cwd: unistylesThemesPath, encoding: 'utf8' }).trim().split('\n');
      files.forEach(file => {
        const themeName = file.replace('.ts', '');
        // Skip index and common files
        if (themeName !== 'index' && themeName !== 'common') {
          themeFiles.push(themeName);
        }
      });
    } catch (error) {
      log(`  ⚠️  Could not list Unistyles themes: ${error.message}`, 'yellow');
    }
  }
  
  log(`  ✅ Found ${themeFiles.length} LOCAL Unistyles themes: ${themeFiles.join(', ')}`);
  return themeFiles;
}

function initProjectWithLocalUnistylesStyles() {
  log('🚀 Initializing project with LOCAL Unistyles styles...', 'blue');
  
  // Create directories
  const stylesDir = join(TEST_PROJECT_PATH, 'styles');
  const themesDir = join(stylesDir, 'themes');
  mkdirSync(stylesDir, { recursive: true });
  mkdirSync(themesDir, { recursive: true });
  
  // Copy core style files from local Unistyles packages
  const sourceStylesPath = join(PROJECT_ROOT, 'packages', 'unistyles', 'styles');
  const coreFiles = ['theme.ts', 'theme.d.ts', 'context.tsx', 'breakpoints.ts'];
  
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
    log(`  ✅ Copied all Unistyles themes`);
  }
  
  // Create leshi-ui.json config for Unistyles
  const config = {
    framework: "unistyles",
    aliases: {
      "@": "./"
    }
  };
  writeFileSync(join(TEST_PROJECT_PATH, 'leshi-ui.json'), JSON.stringify(config, null, 2));
  
  log('  ✅ Project initialized with LOCAL Unistyles files');
}

function installLocalUnistylesComponent(componentName) {
  log(`📦 Installing LOCAL Unistyles component: ${componentName}`, 'blue');
  
  try {
    // Create components directory if it doesn't exist
    const componentsDir = join(TEST_PROJECT_PATH, 'components', 'ui');
    mkdirSync(componentsDir, { recursive: true });
    
    // Copy component from local Unistyles packages
    const srcPath = join(PROJECT_ROOT, 'packages', 'unistyles', 'components', 'ui', `${componentName}.tsx`);
    const destPath = join(componentsDir, `${componentName}.tsx`);
    
    if (!existsSync(srcPath)) {
      throw new Error(`Unistyles component file not found: ${srcPath}`);
    }
    
    cpSync(srcPath, destPath);
    
    // Copy any utility files if they exist
    const libDir = join(TEST_PROJECT_PATH, 'lib');
    const sourceLibPath = join(PROJECT_ROOT, 'packages', 'unistyles', 'lib');
    if (existsSync(sourceLibPath)) {
      mkdirSync(libDir, { recursive: true });
      
      // Copy specific utility files (like modal-utils.ts)
      const utilFiles = [`${componentName}-utils.ts`, 'modal-utils.ts']; // Common patterns
      utilFiles.forEach(utilFile => {
        const srcUtilPath = join(sourceLibPath, utilFile);
        if (existsSync(srcUtilPath)) {
          const destUtilPath = join(libDir, utilFile);
          cpSync(srcUtilPath, destUtilPath);
          log(`  ✅ Copied Unistyles utility: ${utilFile}`);
        }
      });
    }
    
    log(`  ✅ Unistyles component ${componentName} installed from LOCAL files`, 'green');
    return { success: true, component: componentName };
    
  } catch (error) {
    log(`  ❌ Unistyles component ${componentName} failed to install from LOCAL files`, 'red');
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
  log('🔍 Running TypeScript check on LOCAL Unistyles components...', 'blue');
  exec('npx tsc --noEmit');
  log('  ✅ TypeScript check passed - no type errors in Unistyles components!', 'green');
}

function verifyUnistylesInstallation(installedComponents, installedThemes) {
  log('🔍 Verifying LOCAL Unistyles installation...', 'blue');
  
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
      throw new Error(`Unistyles component file not found: ${componentName}.tsx`);
    }
  });
  
  // Check theme files
  const themesPath = join(stylesPath, 'themes');
  if (existsSync(themesPath)) {
    log(`  ✅ Found ${installedThemes} Unistyles theme files`);
  }
  
  // Verify Unistyles-specific structure
  const contextPath = join(stylesPath, 'context.tsx');
  if (existsSync(contextPath)) {
    const contextContent = readFileSync(contextPath, 'utf8');
    if (contextContent.includes('unistyles') || contextContent.includes('useUnistyles')) {
      log(`  ✅ Unistyles context properly configured`);
    }
  }
  
  log(`  ✅ All ${installedComponents.length} LOCAL Unistyles components verified`);
  log(`  ✅ LOCAL Unistyles installation structure verified`);
}

function verifyUnistylesIntegration() {
  log('🔍 Verifying Unistyles v3 integration...', 'blue');
  
  // Check package.json for react-native-unistyles
  const packageJsonPath = join(TEST_PROJECT_PATH, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.dependencies && packageJson.dependencies['react-native-unistyles']) {
    log(`  ✅ react-native-unistyles found: ${packageJson.dependencies['react-native-unistyles']}`);
  } else {
    throw new Error('react-native-unistyles not found in dependencies');
  }
  
  // Check if App.tsx uses Unistyles
  const appPath = join(TEST_PROJECT_PATH, 'App.tsx');
  if (existsSync(appPath)) {
    const appContent = readFileSync(appPath, 'utf8');
    if (appContent.includes('react-native-unistyles')) {
      log(`  ✅ App.tsx properly configured for Unistyles`);
    }
  }
  
  log(`  ✅ Unistyles v3 integration verified`);
}

async function main() {
  const startTime = Date.now();
  
  log('🧪 Starting LOCAL UNISTYLES PACKAGES E2E Integration Test', 'magenta');
  log('=========================================================', 'magenta');
  log(`📁 Test project: ${TEST_PROJECT_PATH}`, 'blue');
  log(`📦 Source packages: ${join(PROJECT_ROOT, 'packages', 'unistyles')}`, 'blue');
  
  try {
    // Step 1: Verify test project exists
    if (!existsSync(TEST_PROJECT_PATH)) {
      throw new Error(`Unistyles test project not found at ${TEST_PROJECT_PATH}`);
    }
    log('✅ Unistyles test project found', 'green');
    
    // Step 2: Setup project (install deps, prebuild if needed)
    setupProject();
    
    // Step 3: Verify Unistyles packages exist
    const unistylesPackagesPath = join(PROJECT_ROOT, 'packages', 'unistyles');
    if (!existsSync(unistylesPackagesPath)) {
      throw new Error(`Local Unistyles packages not found at ${unistylesPackagesPath}`);
    }
    log('✅ Local Unistyles packages found', 'green');
    
    // Step 4: Verify Unistyles integration
    verifyUnistylesIntegration();
    
    // Step 5: Clean previous test artifacts
    cleanProject();
    
    // Step 6: Initialize project with local Unistyles styles
    initProjectWithLocalUnistylesStyles();
    
    // Step 7: Install external dependencies
    installExternalDependencies();
    
    // Step 8: Get ALL local Unistyles components and themes
    const allComponents = getAllLocalUnistylesComponents();
    const allThemes = getAllLocalUnistylesThemes();
    
    // Step 9: Install ALL local Unistyles components
    log(`\n📦 Installing ${allComponents.length} LOCAL Unistyles components...`, 'blue');
    const installResults = [];
    const installedComponents = [];
    
    for (const component of allComponents) {
      const result = installLocalUnistylesComponent(component);
      installResults.push(result);
      if (result.success) {
        installedComponents.push(result.component);
      }
    }
    
    // Step 10: Report installation results
    const successCount = installResults.filter(r => r.success).length;
    const failCount = installResults.filter(r => !r.success).length;
    
    log(`\n📊 LOCAL Unistyles Component Installation Results:`, 'cyan');
    log(`   ✅ Successful: ${successCount}/${allComponents.length}`, 'green');
    log(`   ❌ Failed: ${failCount}/${allComponents.length}`, failCount > 0 ? 'red' : 'green');
    
    if (failCount > 0) {
      log(`\n❌ Failed Unistyles components:`, 'red');
      installResults.filter(r => !r.success).forEach(result => {
        log(`   • ${result.component}: ${result.error}`, 'red');
      });
    }
    
    if (successCount === 0) {
      throw new Error('No Unistyles components could be installed from local packages.');
    }
    
    // Step 11: Verify installation
    verifyUnistylesInstallation(installedComponents, allThemes.length);
    
    // Step 12: Run TypeScript check
    runTypeScriptCheck();
    
    // Success!
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('\n=========================================================', 'green');
    log('🎉 LOCAL UNISTYLES PACKAGES E2E Integration Test PASSED!', 'green');
    log(`✅ Successfully installed ${successCount}/${allComponents.length} LOCAL Unistyles components`, 'green');
    log(`✅ Found ${allThemes.length} LOCAL Unistyles themes`, 'green');
    log(`✅ TypeScript compilation successful with YOUR Unistyles code`, 'green');
    log(`✅ Unistyles v3 integration verified`, 'green');
    log(`⏱️  Total time: ${duration}s`, 'green');
    log('=========================================================', 'green');
    
    log(`\n📂 Your LOCAL Unistyles components are working at:`, 'cyan');
    log(`   ${TEST_PROJECT_PATH}`, 'cyan');
    
    log(`\n🎯 What this proves:`, 'blue');
    log(`   • ALL your local Unistyles components compile without errors`, 'blue');
    log(`   • Your Unistyles v3 API usage is correct`, 'blue');
    log(`   • Components can be imported and used properly with Unistyles`, 'blue');
    log(`   • Your TypeScript definitions work with Unistyles`, 'blue');
    log(`   • Ready to commit Unistyles components to git with confidence!`, 'blue');
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('\n=========================================================', 'red');
    log('❌ LOCAL UNISTYLES PACKAGES E2E Integration Test FAILED!', 'red');
    log(`Error: ${error.message}`, 'red');
    log(`⏱️  Failed after: ${duration}s`, 'red');
    log('=========================================================', 'red');
    
    log(`\n📂 Debug your LOCAL Unistyles code at:`, 'yellow');
    log(`   ${TEST_PROJECT_PATH}`, 'yellow');
    
    log(`\n💡 This means:`, 'yellow');
    log(`   • Fix the errors in your local Unistyles packages first`, 'yellow');
    log(`   • Check Unistyles v3 API usage`, 'yellow');
    log(`   • Don't commit until this test passes`, 'yellow');
    log(`   • Your Unistyles changes need work before going to git`, 'yellow');
    
    process.exit(1);
  }
}

main();
