#!/usr/bin/env node

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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

async function runPreCommitChecks() {
  const startTime = Date.now();
  
  log('🚀 Running Pre-Commit Checks', 'bold');
  log('=' .repeat(50), 'cyan');
  
  const checks = [
    {
      name: 'Build CLI',
      command: 'bun run build',
      critical: true
    },
    {
      name: 'TypeScript Validation',
      command: 'bun run test:typescript',
      critical: true
    },
    {
      name: 'ESLint',
      command: 'bun run lint',
      critical: true
    },
    {
      name: 'Unit Tests',
      command: 'bun test',
      critical: true
    },
    {
      name: 'E2E Tests (Local Packages)',
      command: 'bun run test:e2e',
      critical: true
    }
  ];
  
  let passedChecks = 0;
  
  for (const check of checks) {
    try {
      log(`\\n🔄 ${check.name}...`, 'blue');
      exec(check.command);
      log(`✅ ${check.name} PASSED`, 'green');
      passedChecks++;
    } catch (error) {
      log(`❌ ${check.name} FAILED`, 'red');
      
      if (check.critical) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        log('\\n' + '='.repeat(50), 'red');
        log('🚫 PRE-COMMIT CHECKS FAILED', 'red');
        log(`❌ Failed at: ${check.name}`, 'red');
        log(`⏱️  Time: ${duration}s`, 'red');
        log('='.repeat(50), 'red');
        
        log('\\n💡 Fix the issues and try again:', 'yellow');
        log(`   bun run ${check.command.split(' ')[2] || 'test:all'}`, 'yellow');
        log('\\n🚫 COMMIT BLOCKED', 'red');
        
        process.exit(1);
      }
    }
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  log('\\n' + '='.repeat(50), 'green');
  log('🎉 ALL PRE-COMMIT CHECKS PASSED!', 'green');
  log(`✅ ${passedChecks}/${checks.length} checks successful`, 'green');
  log(`⏱️  Total time: ${duration}s`, 'green');
  log('='.repeat(50), 'green');
  
  log('\\n🚀 Ready to commit!', 'cyan');
  log('\\n💡 Your changes are validated and ready for git:', 'blue');
  log('   • CLI builds successfully', 'blue');
  log('   • TypeScript compiles without errors', 'blue');
  log('   • Code style follows standards', 'blue');
  log('   • Unit tests pass', 'blue');
  log('   • E2E tests validate local packages', 'blue');
  
  log('\\n✨ Commit with confidence!', 'green');
}

runPreCommitChecks().catch(() => {
  process.exit(1);
});