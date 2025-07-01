#!/usr/bin/env node

import { Command } from 'commander';
import { createInitCommand } from './commands/init.js';
import { 
  createAddCommand, 
  createAddComponentCommand, 
  createAddThemeCommand 
} from './commands/add.js';
import { 
  createListCommand, 
  createListComponentCommand, 
  createListThemeCommand 
} from './commands/list.js';
import { 
  createGuideCommand, 
  createGuideComponentCommand, 
  createGuideThemeCommand 
} from './commands/guide.js';
import { Logger } from './utils/logger.js';
import { colors, icons } from './utils/colors.js';

const program = new Command();

program
  .name('leshi-ui')
  .description('Professional CLI for React Native UI components')
  .version('1.0.0');

// ASCII Art Banner with cute cat
const banner = `
${colors.primary('██╗     ███████╗███████╗██╗  ██╗██╗')}      ${colors.dim('/\\_/\\')}
${colors.primary('██║     ██╔════╝██╔════╝██║  ██║██║')}     ${colors.dim('( o.o )')}
${colors.primary('██║     █████╗  ███████╗███████║██║')}      ${colors.dim('> ^ <')}
${colors.primary('██║     ██╔══╝  ╚════██║██╔══██║██║')}   
${colors.primary('███████╗███████╗███████║██║  ██║██║')}        🐱
${colors.primary('╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝')}

${colors.dim('Professional CLI for React Native UI components')}
`;

// Show banner for help command
const originalHelp = program.outputHelp;
program.outputHelp = function(context?: any) {
  Logger.log(banner);
  Logger.break();
  return originalHelp.call(this, context);
};

// Add commands
program.addCommand(createInitCommand());

// Add command with subcommands
const addCommand = createAddCommand();
addCommand.addCommand(createAddComponentCommand());
addCommand.addCommand(createAddThemeCommand());
program.addCommand(addCommand);

// List command with subcommands
const listCommand = createListCommand();
listCommand.addCommand(createListComponentCommand());
listCommand.addCommand(createListThemeCommand());
program.addCommand(listCommand);

// Guide command with subcommands
const guideCommand = createGuideCommand();
guideCommand.addCommand(createGuideComponentCommand());
guideCommand.addCommand(createGuideThemeCommand());
program.addCommand(guideCommand);

// Handle unknown commands
program.on('command:*', (operands) => {
  Logger.error(`Unknown command: ${operands[0]}`);
  Logger.tip('Run `leshi-ui --help` to see available commands');
  process.exit(1);
});

// Handle no command provided
if (process.argv.length === 2) {
  Logger.log(banner);
  Logger.break();
  Logger.title(`Welcome to leshi-ui! ${icons.sparkles}`);
  Logger.break();
  Logger.log(`${colors.dim('A friendly CLI to help you build beautiful React Native apps')}`);
  Logger.break();
  Logger.log(`${icons.rocket} ${colors.bold('Quick Start:')} `);
  Logger.break();
  Logger.log(`  ${colors.primary('npx leshi-ui@latest init')}                    ${colors.dim('Initialize your project')}`);
  Logger.log(`  ${colors.primary('npx leshi-ui@latest add component button')}    ${colors.dim('Add a component')}`);
  Logger.log(`  ${colors.primary('npx leshi-ui@latest list component')}          ${colors.dim('Explore components')}`);
  Logger.log(`  ${colors.primary('npx leshi-ui@latest guide component button')}  ${colors.dim('Learn about components')}`);
  Logger.break();
  Logger.log(`${icons.lightbulb} ${colors.dim('Need help?')} Run ${colors.primary('leshi-ui --help')} to see all commands`);
  Logger.break();
  process.exit(0);
}

// Parse arguments
program.parse();