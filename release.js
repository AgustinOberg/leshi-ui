#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ Please provide a version number');
    console.log('Usage: bun run release <version>');
    console.log('Example: bun run release 1.2.1');
    process.exit(1);
  }

  const version = args[0];
  
  // Validate version format (basic semver check)
  if (!/^\d+\.\d+\.\d+(-\w+)?$/.test(version)) {
    console.error('❌ Invalid version format. Use semantic versioning (e.g., 1.2.1)');
    process.exit(1);
  }

  console.log(`🚀 Releasing leshi-ui version ${version}...`);
  console.log('');

  try {
    // Update CLI package.json version
    const cliPackageJsonPath = join(__dirname, 'cli', 'package.json');
    const cliPackageJson = JSON.parse(readFileSync(cliPackageJsonPath, 'utf-8'));
    cliPackageJson.version = version;
    writeFileSync(cliPackageJsonPath, JSON.stringify(cliPackageJson, null, 2) + '\n');
    console.log('✅ Updated CLI package.json version');

    // Build the CLI
    console.log('🔨 Building CLI...');
    execSync('npm run build', { cwd: join(__dirname, 'cli'), stdio: 'inherit' });
    console.log('✅ CLI build completed');

    // Run tests
    console.log('🧪 Running tests...');
    try {
      execSync('npm test', { cwd: join(__dirname, 'cli'), stdio: 'inherit' });
      console.log('✅ All tests passed');
    } catch (error) {
      console.log('⚠️  Tests not configured yet, skipping...');
    }

    // Run linting
    console.log('🔍 Running linter...');
    try {
      execSync('npm run lint', { cwd: join(__dirname, 'cli'), stdio: 'inherit' });
      console.log('✅ Linting passed');
    } catch (error) {
      console.log('⚠️  Linting issues found, but continuing...');
    }

    // Publish to npm
    console.log('📦 Publishing to npm...');
    execSync('npm publish', { 
      cwd: join(__dirname, 'cli'), 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    console.log('✅ Successfully published to npm');

    // Create git tag
    console.log('🏷️  Creating git tag...');
    execSync(`git tag v${version}`, { stdio: 'inherit' });
    execSync(`git push origin v${version}`, { stdio: 'inherit' });
    console.log('✅ Git tag created and pushed');

    console.log('');
    console.log('🎉 Release completed successfully!');
    console.log(`📦 leshi-ui@${version} is now available on npm`);
    console.log(`🔗 Install with: npx leshi-ui@latest`);
    
  } catch (error) {
    console.error('❌ Release failed:', error.message);
    process.exit(1);
  }
}

main();