#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Import commands
import { addCommand } from './commands/add.js';
import { initCommand } from './commands/init.js';
import { ErrorHandler } from './errors/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
let version = '1.0.0';
try {
  const packageJsonPath = join(__dirname, '../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  version = packageJson.version;
} catch {
  // Use fallback version
}

const program = new Command();

program
  .name('leshi-ui')
  .description('A CLI for adding React Native UI components to your project')
  .version(version)
  .helpOption('-h, --help', 'display help for command');

// Add commands
program.addCommand(addCommand);
program.addCommand(initCommand);

// Add theme command
const themeCommand = new Command()
  .name('theme')
  .description('Manage themes')
  .command('add <name>')
  .option('--unistyles', 'use Unistyles themes')
  .action(async (name: string, options: any) => {
    console.log(`Adding theme: ${name}`);
    // Implementation would go here
  });

program.addCommand(themeCommand);

// Add guide command
const guideCommand = new Command()
  .name('guide')
  .description('Show component guides and examples');

guideCommand
  .command('components')
  .alias('list')
  .description('List all available components')
  .action(() => {
    console.log(chalk.blue('📖 Available Components:'));
    console.log('');
    
    const components = [
      'button', 'text', 'modal', 'dialog', 'alert-dialog',
      'text-input', 'text-area', 'surface', 'checkbox',
      'icon', 'avatar', 'badge', 'label', 'skeleton',
      'progress', 'switch', 'slot', 'divider', 'radio'
    ];
    
    components.forEach(name => {
      console.log(`   ${chalk.cyan(name.padEnd(15))} ${chalk.gray('UI component')}`);
    });
    
    console.log('');
    console.log(chalk.blue(`💡 View detailed guide: ${chalk.cyan('leshi-ui guide component <name>')}`));
  });

guideCommand
  .command('component <name>')
  .description('Show detailed guide for a component')
  .action((name: string) => {
    console.log(chalk.blue(`📖 ${name.toUpperCase()} COMPONENT GUIDE`));
    console.log('');
    console.log(chalk.gray('For detailed documentation, visit: https://leshi-ui.dev'));
  });

program.addCommand(guideCommand);

// Global error handling
process.on('uncaughtException', (error) => {
  ErrorHandler.handle(error);
});

process.on('unhandledRejection', (reason) => {
  ErrorHandler.handle(reason instanceof Error ? reason : new Error(String(reason)));
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 Goodbye!'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n👋 Goodbye!'));
  process.exit(0);
});

// Parse command line arguments
program.parse();