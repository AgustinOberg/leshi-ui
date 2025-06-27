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
    try {
      // Import DependencyResolver to get component info
      import('./services/dependency-resolver.js').then(({ DependencyResolver }) => {
        const resolver = new DependencyResolver();
        
        if (!resolver.hasComponent(name)) {
          console.log(chalk.red(`❌ Component "${name}" not found`));
          console.log('');
          console.log(chalk.blue('Available components:'));
          resolver.getAvailableComponents().forEach(component => {
            console.log(chalk.gray(`   • ${component}`));
          });
          return;
        }
        
        const component = resolver.getComponent(name);
        
        console.log(chalk.blue(`📖 ${name.toUpperCase()} COMPONENT GUIDE`));
        console.log('');
        console.log(chalk.cyan('Name:'), component.name);
        console.log(chalk.cyan('Description:'), component.description);
        console.log('');
        
        if (component.registryDependencies.length > 0) {
          console.log(chalk.cyan('Dependencies:'));
          component.registryDependencies.forEach(dep => {
            console.log(chalk.gray(`   • ${dep}`));
          });
          console.log('');
        }
        
        if (component.dependencies.length > 0) {
          console.log(chalk.cyan('External Dependencies:'));
          component.dependencies.forEach(dep => {
            console.log(chalk.gray(`   • ${dep}`));
          });
          console.log('');
        }
        
        if (component.setup.length > 0) {
          console.log(chalk.cyan('Setup Instructions:'));
          component.setup.forEach((instruction, index) => {
            console.log(chalk.gray(`   ${index + 1}. ${instruction}`));
          });
          console.log('');
        }
        
        console.log(chalk.cyan('Example Usage:'));
        console.log(chalk.gray(component.example));
        console.log('');
        
        console.log(chalk.blue(`💡 Install with: ${chalk.cyan(`leshi-ui add component ${name}`)}`));
      }).catch(() => {
        console.log(chalk.red('❌ Failed to load component information'));
      });
    } catch (error) {
      console.log(chalk.red('❌ Failed to load component information'));
    }
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