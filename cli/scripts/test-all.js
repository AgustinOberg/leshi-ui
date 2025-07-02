#!/usr/bin/env node

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = dirname(__dirname);

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

function exec(command, cwd = CLI_ROOT) {
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

async function runStep(stepName, stepFunction) {
  log(`\\n🔄 ${stepName}...`, 'blue');
  log('='.repeat(50), 'blue');
  
  try {
    await stepFunction();
    log(`✅ ${stepName} PASSED`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${stepName} FAILED`, 'red');
    log(`Error: ${error.message}`, 'red');
    return false;
  }
}

function buildCLI() {
  log('Building CLI...', 'blue');
  exec('bun run build');
  
  // Verify build output
  const distPath = join(CLI_ROOT, 'dist', 'index.js');
  if (!existsSync(distPath)) {
    throw new Error('CLI build failed - dist/index.js not found');
  }
  
  log('  ✅ CLI built successfully', 'green');
}

function runUnitTests() {
  log('Running unit tests...', 'blue');
  exec('bun test');
  log('  ✅ Unit tests passed', 'green');
}

function validateTypeScript() {
  log('Validating TypeScript...', 'blue');
  exec('bun run test:typescript');
  log('  ✅ TypeScript validation passed', 'green');
}

function runLinting() {
  log('Running ESLint...', 'blue');
  exec('bun run lint');
  log('  ✅ Linting passed', 'green');
}

function runE2ETests() {
  log('Running E2E tests (local packages)...', 'blue');
  exec('bun run test:e2e');
  log('  ✅ E2E tests passed', 'green');
}

function runE2EUnistylesTests() {
  log('Running E2E tests (Unistyles packages)...', 'blue');
  exec('bun run test:e2e-unistyles');
  log('  ✅ E2E Unistyles tests passed', 'green');
}

async function main() {
  const startTime = Date.now();
  
  log('🧪 Running Complete Test Suite for Leshi UI CLI', 'cyan');
  log('='.repeat(60), 'cyan');
  log(`📁 CLI Root: ${CLI_ROOT}`, 'blue');
  
  const steps = [
    { name: 'Building CLI', fn: buildCLI },
    { name: 'Running Unit Tests', fn: runUnitTests },
    { name: 'Validating TypeScript', fn: validateTypeScript },
    { name: 'Running ESLint', fn: runLinting },
    { name: 'Running E2E Tests (StyleSheet)', fn: runE2ETests },
    { name: 'Running E2E Tests (Unistyles)', fn: runE2EUnistylesTests }
  ];
  
  let passedSteps = 0;
  const results = [];
  
  for (const step of steps) {
    const success = await runStep(step.name, step.fn);
    results.push({ name: step.name, success });
    
    if (success) {
      passedSteps++;
    } else {
      // Stop on first failure for faster feedback
      break;
    }
  }
  
  // Final summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const allPassed = passedSteps === steps.length;
  
  log('\\n' + '='.repeat(60), allPassed ? 'green' : 'red');
  log('📊 TEST SUITE SUMMARY', allPassed ? 'green' : 'red');
  log('='.repeat(60), allPassed ? 'green' : 'red');
  
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    const color = result.success ? 'green' : 'red';
    log(`${icon} ${result.name}`, color);
  });
  
  if (allPassed) {
    log('\\n🎉 ALL TESTS PASSED! CLI is ready for production.', 'green');
    log(`⏱️  Total time: ${duration}s`, 'green');
    log('\\n📦 Ready to commit and deploy!', 'green');
  } else {
    log(`\\n❌ TEST SUITE FAILED! ${passedSteps}/${steps.length} steps passed.`, 'red');
    log(`⏱️  Failed after: ${duration}s`, 'red');
    log('\\n🔧 Please fix the failing tests before proceeding.', 'yellow');
    process.exit(1);
  }
}

main();