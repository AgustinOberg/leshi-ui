#!/usr/bin/env node

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = dirname(__dirname);
const PROJECT_ROOT = dirname(CLI_ROOT);

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

function exec(command, cwd) {
  try {
    log(`📝 Executing: ${command}`, 'cyan');
    const output = execSync(command, { 
      cwd, 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    return output;
  } catch (error) {
    log(`❌ TypeScript check failed in ${cwd}`, 'red');
    log(`Error: ${error.message}`, 'red');
    if (error.stdout) log(`STDOUT: ${error.stdout}`, 'yellow');
    if (error.stderr) log(`STDERR: ${error.stderr}`, 'yellow');
    throw error;
  }
}

function validateTypeScript(projectPath, projectName) {
  log(`🔍 Validating TypeScript in ${projectName}...`, 'blue');
  
  const tsconfigPath = join(projectPath, 'tsconfig.json');
  if (!existsSync(tsconfigPath)) {
    log(`  ⚠️  No tsconfig.json found in ${projectName}, skipping`, 'yellow');
    return;
  }
  
  exec('npx tsc --noEmit', projectPath);
  log(`  ✅ ${projectName} TypeScript validation passed`, 'green');
}

async function main() {
  const startTime = Date.now();
  
  log('🔍 TypeScript Validation for All Projects', 'cyan');
  log('==========================================', 'cyan');
  
  const validationTargets = [
    { path: CLI_ROOT, name: 'CLI' }
    // Note: packages/rn and packages/unistyles are copy-paste components
    // They are validated when copied to user projects via E2E tests
  ];
  
  let failedCount = 0;
  const results = [];
  
  for (const target of validationTargets) {
    try {
      validateTypeScript(target.path, target.name);
      results.push({ name: target.name, status: 'PASSED' });
    } catch (error) {
      results.push({ name: target.name, status: 'FAILED', error: error.message });
      failedCount++;
    }
  }
  
  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  log('==========================================', failedCount > 0 ? 'red' : 'green');
  
  results.forEach(result => {
    const color = result.status === 'PASSED' ? 'green' : 'red';
    const icon = result.status === 'PASSED' ? '✅' : '❌';
    log(`${icon} ${result.name}: ${result.status}`, color);
  });
  
  if (failedCount === 0) {
    log('🎉 All TypeScript validations PASSED!', 'green');
    log(`⏱️  Total time: ${duration}s`, 'green');
  } else {
    log(`❌ ${failedCount} TypeScript validation(s) FAILED!`, 'red');
    log(`⏱️  Failed after: ${duration}s`, 'red');
    process.exit(1);
  }
}

main();