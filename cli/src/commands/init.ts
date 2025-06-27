import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
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
      const options = initOptionsSchema.parse({ ...(rawOptions as object), target }) as InitOptions & { target: string };
      await handleInitCommand(options);
    } catch (error) {
      ErrorHandler.handle(error instanceof Error ? error : new Error(String(error)), (rawOptions as any)?.silent);
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
    const packagesDir = await findPackagesDirectory();
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
  const fs = await import('fs-extra');
  
  if (!await fs.pathExists(source)) {
    throw new Error(`Source theme folder not found: ${source}`);
  }

  // Ensure target directory exists
  await fs.ensureDir(target);

  // Copy base theme files (non-theme specific)
  const baseFiles = ['context.tsx', 'theme.d.ts', 'theme.ts'];
  for (const file of baseFiles) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, targetPath, { overwrite: false });
    }
  }

  // Ensure themes directory exists
  const themesDir = path.join(target, 'themes');
  await fs.ensureDir(themesDir);

  // Copy only basic themes (dark, light, common, index)
  const basicThemeFiles = [
    'dark.ts',
    'light.ts', 
    'common.ts',
    'index.ts'
  ];

  for (const file of basicThemeFiles) {
    const sourcePath = path.join(source, 'themes', file);
    const targetPath = path.join(themesDir, file);
    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, targetPath, { overwrite: false });
    }
  }

  if (!options.silent) {
    console.log('✅ Basic theme files copied (dark, light)');
  }
}

async function findPackagesDirectory(): Promise<string> {
  // Try to find packages directory relative to current CLI location
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const currentDir = process.cwd();
  const possiblePaths = [
    path.join(__dirname, '../packages'),           // When installed via npm (dist/../packages)
    path.join(__dirname, '../../packages'),        // When installed via npm (node_modules/leshi-ui/packages)
    path.join(currentDir, 'node_modules/leshi-ui/packages'), // User's node_modules
    path.join(__dirname, '../../../packages'),     // Development
    path.join(currentDir, '../packages'),
    path.join(currentDir, '../../packages'),
    path.join(currentDir, 'packages')
  ];

  const fs = await import('fs-extra');
  for (const possiblePath of possiblePaths) {
    try {
      if (await fs.pathExists(possiblePath)) {
        return possiblePath;
      }
    } catch {
      // Continue searching
    }
  }

  throw new Error('Packages directory not found. Please ensure leshi-ui is properly installed.');
}