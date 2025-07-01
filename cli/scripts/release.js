#!/usr/bin/env node

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = dirname(__dirname);

// Colors for output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, cwd = CLI_ROOT) {
  try {
    log(`📝 ${command}`, 'cyan');
    const output = execSync(command, { 
      cwd, 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    return output;
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red');
    log(`Error: ${error.message}`, 'red');
    throw error;
  }
}

function getCurrentVersion() {
  const packagePath = join(CLI_ROOT, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  return packageJson.version;
}

function updateVersion(newVersion) {
  const packagePath = join(CLI_ROOT, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  packageJson.version = newVersion;
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\\n');
  log(`✅ Updated version to ${newVersion}`, 'green');
}

function validateVersion(version) {
  const versionRegex = /^\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9]+(\\.\\d+)?)?$/;
  if (!versionRegex.test(version)) {
    throw new Error(`Invalid version format: ${version}. Use semver format (e.g., 1.0.0, 1.0.0-beta.1)`);
  }
}

function checkGitStatus() {
  try {
    const status = exec('git status --porcelain');
    if (status.trim() !== '') {
      throw new Error('Git working directory is not clean. Commit or stash changes first.');
    }
    log('✅ Git working directory is clean', 'green');
  } catch (error) {
    throw new Error('Failed to check git status. Make sure you are in a git repository.');
  }
}

function getCurrentBranch() {
  try {
    const branch = exec('git rev-parse --abbrev-ref HEAD').trim();
    return branch;
  } catch (error) {
    throw new Error('Failed to get current git branch');
  }
}

async function runRelease() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    log('❌ Version argument required', 'red');
    log('\\nUsage:', 'yellow');
    log('  npm run release 1.0.0', 'yellow');
    log('  npm run release 1.0.0-beta.1', 'yellow');
    log('  npm run release patch  # auto-increment patch', 'yellow');
    log('  npm run release minor  # auto-increment minor', 'yellow');
    log('  npm run release major  # auto-increment major', 'yellow');
    process.exit(1);
  }
  
  const versionArg = args[0];
  const startTime = Date.now();
  
  log('🚀 Starting Release Process', 'bold');
  log('='.repeat(50), 'cyan');
  
  try {
    // Step 1: Validate git status
    log('\\n🔍 Checking git status...', 'blue');
    checkGitStatus();
    
    const currentBranch = getCurrentBranch();
    log(`📍 Current branch: ${currentBranch}`, 'blue');
    
    if (currentBranch !== 'main') {
      log('⚠️  Warning: Not on main branch', 'yellow');
      log('   Consider releasing from main branch for production releases', 'yellow');
    }
    
    // Step 2: Determine version
    log('\\n📊 Processing version...', 'blue');
    const currentVersion = getCurrentVersion();
    log(`📦 Current version: ${currentVersion}`, 'blue');
    
    let newVersion = versionArg;
    
    if (['patch', 'minor', 'major'].includes(versionArg)) {
      // Auto-increment version
      newVersion = exec(`npm version ${versionArg} --no-git-tag-version`).trim().substring(1);
      log(`🔄 Auto-incremented ${versionArg} version: ${newVersion}`, 'green');
    } else {
      // Manual version
      validateVersion(newVersion);
      updateVersion(newVersion);
    }
    
    // Step 3: Run complete test suite
    log('\\n🧪 Running complete test suite...', 'blue');
    exec('bun run test:all');
    log('✅ All tests passed', 'green');
    
    // Step 4: Build for production
    log('\\n🏗️  Building for production...', 'blue');
    exec('bun run build');
    log('✅ Production build complete', 'green');
    
    // Step 5: Verify package
    log('\\n📦 Verifying package...', 'blue');
    const packOutput = exec('npm pack --dry-run');
    log('✅ Package verification complete', 'green');
    
    // Step 6: Create git commit and tag
    log('\\n📝 Creating git commit and tag...', 'blue');
    exec('git add package.json');
    exec(`git commit -m "chore: release v${newVersion}"`);
    exec(`git tag v${newVersion}`);
    log(`✅ Created git tag v${newVersion}`, 'green');
    
    // Step 7: Success summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('\\n' + '='.repeat(50), 'green');
    log('🎉 RELEASE READY!', 'green');
    log(`📦 Version: ${newVersion}`, 'green');
    log(`🏷️  Git tag: v${newVersion}`, 'green');
    log(`⏱️  Time: ${duration}s`, 'green');
    log('='.repeat(50), 'green');
    
    log('\\n🚀 Next steps:', 'cyan');
    log('\\n1. Push to GitHub:', 'blue');
    log(`   git push origin ${currentBranch}`, 'yellow');
    log(`   git push origin v${newVersion}`, 'yellow');
    
    log('\\n2. Publish to npm (if ready):', 'blue');
    log('   npm publish', 'yellow');
    
    log('\\n3. Create GitHub release:', 'blue');
    log(`   https://github.com/AgustinOberg/leshi-ui/releases/new?tag=v${newVersion}`, 'yellow');
    
    log('\\n✨ Release preparation complete!', 'green');
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log('\\n' + '='.repeat(50), 'red');
    log('❌ RELEASE FAILED!', 'red');
    log(`Error: ${error.message}`, 'red');
    log(`⏱️  Failed after: ${duration}s`, 'red');
    log('='.repeat(50), 'red');
    
    log('\\n🔧 Troubleshooting:', 'yellow');
    log('   • Run bun run test:all to check for issues', 'yellow');
    log('   • Ensure git working directory is clean', 'yellow');
    log('   • Verify version format is correct', 'yellow');
    
    process.exit(1);
  }
}

runRelease();