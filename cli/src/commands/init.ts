import { Command } from 'commander';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { initOptionsSchema, type InitOptions } from '../schemas/index.js';
import { ProjectDetector } from '../services/project-detector.js';
import { FileOperationsService } from '../services/file-operations.js';
import { ErrorHandler } from '../errors/index.js';

export const initCommand = new Command()
  .name('init')
  .description('Initialize leshi-ui in your project')
  .argument('[target]', 'target implementation (rn|unistyles)', 'rn')
  .option('-y, --yes', 'skip confirmation prompts', false)
  .option('-c, --cwd <cwd>', 'the working directory')
  .option('-s, --silent', 'mute output', false)
  .action(async (target: string, rawOptions: unknown) => {
    try {
      const options = initOptionsSchema.parse({ ...rawOptions, target }) as InitOptions & { target: string };
      await handleInitCommand(options);
    } catch (error) {
      ErrorHandler.handle(error instanceof Error ? error : new Error(String(error)), options?.silent);
    }
  });

async function handleInitCommand(options: InitOptions & { target: string }): Promise<void> {
  const spinner = ora();
  
  try {
    // Detect project
    if (!options.silent) {
      spinner.start('Detecting project...');
    }
    
    const projectInfo = await ProjectDetector.detectProject(options.cwd);
    
    if (!options.silent) {
      spinner.succeed(`Detected ${projectInfo.framework} project`);
      console.log('');
      console.log(chalk.cyan(`
 
░▒▓█▓▒░      ░▒▓████████▓▒░░▒▓███████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░ 
░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░ 
░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░ 
░▒▓█▓▒░      ░▒▓██████▓▒░  ░▒▓██████▓▒░░▒▓████████▓▒░▒▓█▓▒░ 
░▒▓█▓▒░      ░▒▓█▓▒░             ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░ 
░▒▓█▓▒░      ░▒▓█▓▒░             ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░ 
░▒▓████████▓▒░▒▓████████▓▒░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░ 
                                                            
      `));
    }

    // Create project configuration
    const projectConfig = ProjectDetector.createDefaultConfig(projectInfo);
    
    // Add target-specific configuration
    if (options.target === 'unistyles') {
      projectConfig.unistyles = {
        config: './unistyles.config.ts',
        themes: ['light', 'dark']
      };
    }

    // Create directory structure
    if (!options.silent) {
      spinner.start('Creating directory structure...');
    }

    const directories = ProjectDetector.getRecommendedStructure(projectInfo.framework);
    for (const dir of directories) {
      await FileOperationsService.ensureDir(path.join(projectInfo.projectRoot, dir));
    }

    // Copy theme files
    const packagesDir = findPackagesDirectory();
    const sourcePath = path.join(packagesDir, options.target === 'unistyles' ? 'unistyles' : 'rn');
    const stylesSource = path.join(sourcePath, 'styles');
    const stylesTarget = path.join(projectInfo.projectRoot, 'styles');

    await copyThemeFiles(stylesSource, stylesTarget, options);

    if (!options.silent) {
      spinner.succeed('Directory structure created');
    }

    // Save configuration
    const configPath = path.join(projectInfo.projectRoot, 'leshi-ui.json');
    await FileOperationsService.writeJsonFile(configPath, projectConfig);

    if (!options.silent) {
      spinner.succeed('Configuration saved');
      
      console.log('');
      console.log(chalk.green('✨ leshi-ui initialized successfully!'));
      console.log('');
      console.log(chalk.blue('Next steps:'));
      console.log(chalk.gray('  1. Add ThemeProvider to your app'));
      console.log(chalk.gray('  2. Start adding components: leshi-ui add component button'));
      console.log(chalk.gray('  3. View available components: leshi-ui guide components'));
      console.log('');
      console.log(chalk.gray('Built with ❤️  by Agustin Oberg'));
    }

  } catch (error) {
    if (spinner.isSpinning) {
      spinner.fail('Initialization failed');
    }
    throw error;
  }
}

async function copyThemeFiles(source: string, target: string, options: InitOptions): Promise<void> {
  // Implementation for copying theme files
  // This would copy the base theme structure
}

function findPackagesDirectory(): string {
  // Same implementation as in add.ts
  return path.join(__dirname, '../../../packages');
}