import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import { Framework } from '../types/index.js';
import { Logger } from '../utils/logger.js';
import { FileUtils } from '../utils/file-utils.js';
import { ProjectService } from '../services/project-service.js';
import { ComponentRegistryService } from '../services/component-registry.js';
import { colors, icons } from '../utils/colors.js';

interface AddOptions {
  rn?: boolean;
  unistyles?: boolean;
  overwrite?: boolean;
  yes?: boolean;
  cwd?: string;
}

export function createAddCommand(): Command {
  return new Command('add')
    .description('Add components or themes to your project');
}

export function createAddComponentCommand(): Command {
  return new Command('component')
    .description('Add UI components to your project')
    .argument('[components...]', 'Component names to add')
    .option('--rn', 'Use React Native StyleSheet implementation (default)')
    .option('--unistyles', 'Use Unistyles implementation')
    .option('-o, --overwrite', 'Overwrite existing files')
    .option('-y, --yes', 'Skip confirmation prompts')
    .option('-c, --cwd <path>', 'Working directory', process.cwd())
    .action(async (components: string[], options: AddOptions) => {
      try {
        await addComponents(components, options);
      } catch (error) {
        Logger.error(`Failed to add components: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
}

export function createAddThemeCommand(): Command {
  return new Command('theme')
    .description('Add themes to your project')
    .argument('[themes...]', 'Theme names to add')
    .option('--rn', 'Use React Native StyleSheet implementation (default)')
    .option('--unistyles', 'Use Unistyles implementation')
    .option('-o, --overwrite', 'Overwrite existing files')
    .option('-y, --yes', 'Skip confirmation prompts')
    .option('-c, --cwd <path>', 'Working directory', process.cwd())
    .action(async (themes: string[], options: AddOptions) => {
      try {
        await addThemes(themes, options);
      } catch (error) {
        Logger.error(`Failed to add themes: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
}

async function addComponents(componentNames: string[], options: AddOptions): Promise<void> {
  const cwd = options.cwd || process.cwd();
  
  // Determine framework
  let framework: Framework = 'rn';
  if (options.unistyles) {
    framework = 'unistyles';
  }

  // If no components specified, show interactive selection
  if (componentNames.length === 0) {
    const availableComponents = await ComponentRegistryService.getComponentsWithDetails();
    
    const { selectedComponents } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedComponents',
        message: 'Select components to add:',
        choices: availableComponents.map(comp => ({
          name: `${comp.name} - ${colors.dim(comp.description)}`,
          value: comp.name,
        })),
      },
    ]);

    if (selectedComponents.length === 0) {
      Logger.info('No components selected.');
      return;
    }

    componentNames = selectedComponents;
  }

  Logger.title(`${icons.package} Adding components`);
  Logger.subtitle(`Framework: ${framework === 'rn' ? 'React Native StyleSheet' : 'Unistyles'}`);
  Logger.break();

  // Validate components exist
  const invalidComponents: string[] = [];
  for (const name of componentNames) {
    if (!(await ComponentRegistryService.componentExists(name))) {
      invalidComponents.push(name);
    }
  }

  if (invalidComponents.length > 0) {
    Logger.error(`Components not found: ${invalidComponents.join(', ')}`);
    Logger.tip(`Run ${colors.primary('npx leshi-ui@latest list component')} to see available components`);
    return;
  }

  const spinner = ora('Resolving dependencies...').start();

  try {
    // Resolve dependencies
    const resolvedComponents = await ComponentRegistryService.resolveDependencies(componentNames);
    
    spinner.text = 'Checking for existing files...';
    
    // Check for existing files
    const config = await ProjectService.getProjectConfig(cwd);
    const existingFiles: string[] = [];
    
    for (const componentName of resolvedComponents) {
      const targetPath = FileUtils.join(config.componentsDir, `${componentName}.tsx`);
      if (await FileUtils.exists(targetPath)) {
        existingFiles.push(componentName);
      }
    }

    // Ask for overwrite confirmation if needed
    if (existingFiles.length > 0 && !options.overwrite && !options.yes) {
      spinner.stop();
      
      Logger.warning(`The following components already exist: ${existingFiles.join(', ')}`);
      
      const { shouldOverwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldOverwrite',
          message: 'Do you want to overwrite them?',
          default: false,
        },
      ]);

      if (!shouldOverwrite) {
        Logger.info('Operation cancelled.');
        return;
      }

      spinner.start('Installing components...');
    } else {
      spinner.text = 'Installing components...';
    }

    // Copy components
    await FileUtils.ensureDir(config.componentsDir);
    
    const installedComponents: string[] = [];
    const componentDetails: Array<{ name: string; dependencies: string[]; externalDeps: string[]; utilities?: string[] }> = [];

    for (const componentName of resolvedComponents) {
      const sourcePath = ProjectService.getComponentPath(framework, componentName);
      const targetPath = FileUtils.join(config.componentsDir, `${componentName}.tsx`);
      
      if (await FileUtils.exists(sourcePath)) {
        await FileUtils.copy(sourcePath, targetPath, options.overwrite || false);
        installedComponents.push(componentName);
        
        // Get component details for setup instructions
        const componentInfo = await ComponentRegistryService.getComponent(componentName);
        if (componentInfo) {
          componentDetails.push({
            name: componentName,
            dependencies: componentInfo.dependencies,
            externalDeps: componentInfo.externalDeps,
            utilities: componentInfo.utilities,
          });
        }
      }
    }

    // Copy utility files
    for (const detail of componentDetails) {
      if (detail.utilities) {
        for (const utilityFile of detail.utilities) {
          const sourcePath = FileUtils.join(ProjectService.getLibPath(framework), FileUtils.basename(utilityFile));
          const targetPath = FileUtils.join(config.libDir, FileUtils.basename(utilityFile));
          
          if (await FileUtils.exists(sourcePath)) {
            await FileUtils.copy(sourcePath, targetPath, options.overwrite || false);
          }
        }
      }
    }

    spinner.succeed(`Successfully added ${installedComponents.length} component${installedComponents.length === 1 ? '' : 's'}!`);
    
    Logger.break();
    Logger.success('Components installed successfully!');
    Logger.break();
    
    Logger.log(`${icons.package} Installed components:`);
    installedComponents.forEach(name => {
      Logger.log(`  • ${colors.primary(name)}`);
    });
    
    // Show setup instructions for external dependencies
    const externalDeps = new Set<string>();
    const setupInstructions: string[] = [];
    
    for (const detail of componentDetails) {
      if (detail.externalDeps.length > 0) {
        detail.externalDeps.forEach(dep => externalDeps.add(dep));
      }
    }

    if (externalDeps.size > 0) {
      Logger.break();
      Logger.warning('External dependencies required:');
      Array.from(externalDeps).forEach(dep => {
        Logger.log(`  • ${colors.primary(dep)}`);
      });
      Logger.tip(`Install with: ${colors.primary(`npm install ${Array.from(externalDeps).join(' ')}`)}`);
    }

    // Show special setup instructions
    for (const detail of componentDetails) {
      const componentInfo = await ComponentRegistryService.getComponent(detail.name);
      if (componentInfo?.setup && componentInfo.setup.length > 0) {
        if (componentInfo.setup.some(instruction => instruction.includes('ModalProvider'))) {
          Logger.break();
          Logger.info(`${icons.gear} Setup required for ${colors.primary(detail.name)}:`);
          Logger.log(`  Wrap your app with ${colors.primary('<ModalProvider>')}`);
          Logger.tip('Check the component guide for detailed setup instructions');
          break; // Only show this once even if multiple modal components
        }
      }
    }
    
  } catch (error) {
    spinner.fail('Failed to add components');
    throw error;
  }
}

async function addThemes(themeNames: string[], options: AddOptions): Promise<void> {
  const cwd = options.cwd || process.cwd();
  
  // Determine framework
  let framework: Framework = 'rn';
  if (options.unistyles) {
    framework = 'unistyles';
  }

  // If no themes specified, show interactive selection
  if (themeNames.length === 0) {
    const availableThemes = await ProjectService.getAvailableThemes(framework);
    
    if (availableThemes.length === 0) {
      Logger.error('No themes available');
      return;
    }

    const { selectedThemes } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedThemes',
        message: 'Select themes to add:',
        choices: availableThemes.map(theme => ({
          name: theme,
          value: theme,
        })),
      },
    ]);

    if (selectedThemes.length === 0) {
      Logger.info('No themes selected.');
      return;
    }

    themeNames = selectedThemes;
  }

  Logger.title(`${icons.theme} Adding themes`);
  Logger.subtitle(`Framework: ${framework === 'rn' ? 'React Native StyleSheet' : 'Unistyles'}`);
  Logger.break();

  const spinner = ora('Installing themes...').start();

  try {
    const config = await ProjectService.getProjectConfig(cwd);
    const themesDir = FileUtils.join(config.stylesDir, 'themes');
    await FileUtils.ensureDir(themesDir);

    const installedThemes: string[] = [];
    const skippedThemes: string[] = [];

    for (const themeName of themeNames) {
      const sourcePath = FileUtils.join(ProjectService.getThemesPath(framework), `${themeName}.ts`);
      const targetPath = FileUtils.join(themesDir, `${themeName}.ts`);

      if (!(await FileUtils.exists(sourcePath))) {
        skippedThemes.push(themeName);
        continue;
      }

      // Check if file exists
      if (await FileUtils.exists(targetPath) && !options.overwrite && !options.yes) {
        const { shouldOverwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'shouldOverwrite',
            message: `Theme '${themeName}' already exists. Overwrite?`,
            default: false,
          },
        ]);

        if (!shouldOverwrite) {
          skippedThemes.push(themeName);
          continue;
        }
      }

      await FileUtils.copy(sourcePath, targetPath, options.overwrite || false);
      installedThemes.push(themeName);
    }

    spinner.succeed(`Successfully added ${installedThemes.length} theme${installedThemes.length === 1 ? '' : 's'}!`);
    
    Logger.break();
    Logger.success('Themes installed successfully!');
    Logger.break();
    
    if (installedThemes.length > 0) {
      Logger.log(`${icons.theme} Installed themes:`);
      installedThemes.forEach(name => {
        Logger.log(`  • ${colors.primary(name)}`);
      });
    }

    if (skippedThemes.length > 0) {
      Logger.break();
      Logger.warning(`Skipped themes: ${skippedThemes.join(', ')}`);
    }

    Logger.break();
    Logger.tip('Next steps:');
    Logger.log(`  1. Update ${colors.primary('styles/themes/index.ts')} to include the new theme${installedThemes.length === 1 ? '' : 's'}`);
    Logger.log(`  2. Run ${colors.primary('npx leshi-ui@latest guide theme')} to learn how to use themes`);
    
  } catch (error) {
    spinner.fail('Failed to add themes');
    throw error;
  }
}