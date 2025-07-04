import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import { Framework, LeshiConfig } from '../types/index.js';
import { Logger } from '../utils/logger.js';
import { FileUtils } from '../utils/file-utils.js';
import { ProjectService } from '../services/project-service.js';
import { ConfigService } from '../services/config-service.js';
import { ImportTransformer } from '../services/import-transformer.js';
import { ComponentRegistryService } from '../services/component-registry.js';
import { GitHubProjectService } from '../services/github-project-service.js';
import { GitHubService } from '../services/github-service.js';
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

// Helper functions for component management
async function validateComponentsExist(componentNames: string[]): Promise<string[]> {
  const invalidComponents: string[] = [];
  for (const name of componentNames) {
    if (!(await ComponentRegistryService.componentExists(name))) {
      invalidComponents.push(name);
    }
  }
  return invalidComponents;
}

async function promptForComponents(): Promise<string[]> {
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

  return selectedComponents;
}

async function resolveDependenciesWithPrompt(
  componentNames: string[], 
  options: AddOptions
): Promise<string[]> {
  const allResolvedComponents = await ComponentRegistryService.resolveDependencies(componentNames);
  const requestedComponents = componentNames;
  const potentialDependencies = allResolvedComponents.filter(comp => !requestedComponents.includes(comp));
  
  let componentsToInstall = [...requestedComponents];
  
  // Ask about dependencies if there are any and not in silent mode
  if (potentialDependencies.length > 0 && !options.yes) {
    Logger.break();
    Logger.info(`${icons.package} Components to install:`);
    
    // Show requested components
    requestedComponents.forEach(name => {
      Logger.log(`  ${colors.primary('✓')} ${colors.primary(name)} ${colors.dim('(requested)')}`);
    });
    
    // Show potential dependencies
    Logger.log('');
    Logger.info(`${icons.info} The following dependencies are available but not required:`);
    potentialDependencies.forEach(name => {
      Logger.log(`  ${colors.dim('•')} ${colors.dim(name)}`);
    });
    
    Logger.break();
    Logger.log(`${colors.dim('Note:')} Dependencies will be automatically imported if they exist in your project.`);
    Logger.break();
    
    // Ask if user wants to install dependencies too
    const { installDependencies } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'installDependencies',
        message: `${icons.question} Do you also want to install the dependencies?`,
        default: false,
      },
    ]);

    if (installDependencies) {
      componentsToInstall = allResolvedComponents;
    }
    
    Logger.break();
  } else if (options.yes && potentialDependencies.length > 0) {
    // In silent mode, automatically install all dependencies
    componentsToInstall = allResolvedComponents;
    Logger.info(`${icons.info} Installing components with dependencies automatically.`);
    Logger.break();
  }
  
  return componentsToInstall;
}

async function checkExistingFiles(
  componentsToInstall: string[], 
  config: any, 
  options: AddOptions
): Promise<{ newComponents: string[], componentsToOverwrite: string[] }> {
  const existingComponents: string[] = [];
  const newComponents: string[] = [];
  
  for (const componentName of componentsToInstall) {
    const targetPath = FileUtils.join(config.componentsDir, `${componentName}.tsx`);
    if (await FileUtils.exists(targetPath)) {
      existingComponents.push(componentName);
    } else {
      newComponents.push(componentName);
    }
  }

  // Handle existing components
  let componentsToOverwrite: string[] = [];
  if (existingComponents.length > 0) {
    if (options.overwrite) {
      // Force overwrite mode
      componentsToOverwrite = existingComponents;
      Logger.info(`${icons.info} Overwriting ${existingComponents.length} existing component${existingComponents.length === 1 ? '' : 's'}.`);
    } else if (!options.yes) {
      // Interactive mode - ask about each existing component
      Logger.break();
      Logger.info(`${icons.info} The following components already exist and will be skipped:`);
      existingComponents.forEach(name => {
        Logger.log(`  • ${colors.dim(name)} ${colors.dim('(exists)')}`);
      });
      
      if (newComponents.length > 0) {
        Logger.log('');
        Logger.info(`${icons.package} New components to install:`);
        newComponents.forEach(name => {
          Logger.log(`  • ${colors.primary(name)} ${colors.dim('(new)')}`);
        });
      }
      
      Logger.break();
      const { shouldOverwriteExisting } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldOverwriteExisting',
          message: `${icons.question} Do you want to overwrite the existing components?`,
          default: false,
        },
      ]);

      if (shouldOverwriteExisting) {
        componentsToOverwrite = existingComponents;
      }
      
      Logger.break();
    } else {
      // Silent mode - skip existing components
      Logger.info(`${icons.info} Skipping ${existingComponents.length} existing component${existingComponents.length === 1 ? '' : 's'}.`);
    }
  }

  return { newComponents, componentsToOverwrite };
}

interface ComponentDownloadResult {
  name: string;
  success: boolean;
  details: { 
    name: string; 
    dependencies: string[]; 
    externalDeps: string[]; 
    utilities?: string[] 
  } | null;
}

async function downloadComponentsInParallel(
  finalComponentsToInstall: string[],
  framework: Framework,
  config: any,
  leshiConfig: any,
  options: AddOptions
): Promise<{ installedComponents: string[], componentDetails: any[] }> {
  await FileUtils.ensureDir(config.componentsDir);
  
  // Download all components in parallel
  const componentDownloads = finalComponentsToInstall.map(async (componentName): Promise<ComponentDownloadResult> => {
    const targetPath = FileUtils.join(config.componentsDir, `${componentName}.tsx`);
    
    let success: boolean;
    
    if (leshiConfig) {
      // Use enhanced download with alias transformation
      success = await GitHubProjectService.downloadComponentWithAliases(
        framework, 
        componentName, 
        targetPath, 
        leshiConfig,
        options.overwrite || false
      );
    } else {
      // Fallback to regular download
      success = await GitHubProjectService.downloadComponent(
        framework, 
        componentName, 
        targetPath, 
        options.overwrite || false
      );
    }
    
    if (success) {
      // Get component details for setup instructions
      const componentInfo = await ComponentRegistryService.getComponent(componentName);
      return {
        name: componentName,
        success: true,
        details: componentInfo ? {
          name: componentName,
          dependencies: componentInfo.dependencies,
          externalDeps: componentInfo.externalDeps,
          utilities: componentInfo.utilities,
        } : null
      };
    }
    
    return { name: componentName, success: false, details: null };
  });

  // Wait for all component downloads to complete
  const downloadResults = await Promise.all(componentDownloads);
  
  // Process results
  const installedComponents: string[] = [];
  const componentDetails: any[] = [];
  
  for (const result of downloadResults) {
    if (result.success) {
      installedComponents.push(result.name);
      if (result.details) {
        componentDetails.push(result.details);
      }
    }
  }

  return { installedComponents, componentDetails };
}

async function downloadUtilitiesInParallel(
  componentDetails: any[], 
  framework: Framework, 
  config: any, 
  leshiConfig: any, 
  options: AddOptions
): Promise<void> {
  // Download utility files from GitHub in parallel
  const utilityDownloads: Promise<void>[] = [];
  
  for (const detail of componentDetails) {
    if (detail.utilities) {
      for (const utilityFile of detail.utilities) {
        const targetPath = FileUtils.join(config.libDir, FileUtils.basename(utilityFile));
        
        const downloadPromise = (async () => {
          if (leshiConfig) {
            // Use enhanced download with alias transformation
            await GitHubProjectService.downloadUtilityWithAliases(
              framework, 
              utilityFile, 
              targetPath, 
              leshiConfig,
              options.overwrite || false
            );
          } else {
            // Fallback to regular download
            await GitHubProjectService.downloadUtility(
              framework, 
              utilityFile, 
              targetPath, 
              options.overwrite || false
            );
          }
        })();
        
        utilityDownloads.push(downloadPromise);
      }
    }
  }

  // Wait for all utility downloads to complete
  if (utilityDownloads.length > 0) {
    await Promise.all(utilityDownloads);
  }
}

async function showInstallationResults(
  installedComponents: string[], 
  componentDetails: any[], 
  leshiConfig: any
): Promise<void> {
  Logger.break();
  if (leshiConfig) {
    Logger.success('Components installed with configured aliases!');
  } else {
    Logger.success('Components installed successfully!');
  }
  Logger.break();
  
  Logger.log(`${icons.package} Installed components:`);
  installedComponents.forEach(name => {
    Logger.log(`  • ${colors.primary(name)}`);
  });
  
  if (leshiConfig) {
    Logger.break();
    Logger.log(`${icons.gear} Import aliases applied:`);
    Object.entries(leshiConfig.aliases).forEach(([key, value]) => {
      Logger.log(`  • ${colors.primary(value)} - ${colors.dim(key)}`);
    });
  }
  
  // Show setup instructions for external dependencies
  const externalDeps = new Set<string>();
  
  for (const detail of componentDetails) {
    if (detail.externalDeps.length > 0) {
      detail.externalDeps.forEach((dep: string) => externalDeps.add(dep));
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
      if (componentInfo.setup.some((instruction: string) => instruction.includes('ModalProvider'))) {
        Logger.break();
        Logger.info(`${icons.gear} Setup required for ${colors.primary(detail.name)}:`);
        Logger.log(`  Wrap your app with ${colors.primary('<ModalProvider>')}`);
        Logger.tip('Check the component guide for detailed setup instructions');
        break; // Only show this once even if multiple modal components
      }
    }
  }
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
    const selectedComponents = await promptForComponents();
    if (selectedComponents.length === 0) {
      Logger.info('No components selected.');
      return;
    }
    componentNames = selectedComponents;
  }

  Logger.title(`${icons.package} Adding components`);
  Logger.subtitle(`Framework: ${framework === 'rn' ? 'React Native StyleSheet' : 'Unistyles'}`);
  
  // Show which GitHub ref we're using for debugging
  const githubRef = await GitHubService.getCurrentRef();
  Logger.subtitle(`Source: GitHub @ ${githubRef}`);
  Logger.break();

  // Validate components exist
  const invalidComponents = await validateComponentsExist(componentNames);
  if (invalidComponents.length > 0) {
    Logger.error(`Components not found: ${invalidComponents.join(', ')}`);
    Logger.tip(`Run ${colors.primary('npx leshi-ui@latest list component')} to see available components`);
    return;
  }

  let spinner = ora('Resolving dependencies...').start();

  try {
    // Resolve dependencies with user prompt
    spinner.stop();
    const componentsToInstall = await resolveDependenciesWithPrompt(componentNames, options);
    
    spinner = ora('Checking for existing files...').start();
    
    // Check for existing files and handle overwrite logic
    const config = await ProjectService.getProjectConfig(cwd);
    const { newComponents, componentsToOverwrite } = await checkExistingFiles(componentsToInstall, config, options);
    
    spinner.stop();

    // Final list of components to install (new + overwrite)
    const finalComponentsToInstall = [...newComponents, ...componentsToOverwrite];
    
    if (finalComponentsToInstall.length === 0) {
      Logger.info(`${icons.success} All requested components already exist. Nothing to install.`);
      return;
    }

    const installSpinner = ora(`Installing ${finalComponentsToInstall.length} component${finalComponentsToInstall.length === 1 ? '' : 's'}...`).start();
    spinner = installSpinner;

    // Check if we have a config for alias transformation
    const leshiConfig = await ConfigService.readConfig(cwd);
    
    // Download components and utilities in parallel
    const { installedComponents, componentDetails } = await downloadComponentsInParallel(
      finalComponentsToInstall, 
      framework, 
      config, 
      leshiConfig, 
      options
    );

    await downloadUtilitiesInParallel(componentDetails, framework, config, leshiConfig, options);

    spinner.succeed(`Successfully added ${installedComponents.length} component${installedComponents.length === 1 ? '' : 's'}!`);
    
    // Show installation results and setup instructions
    await showInstallationResults(installedComponents, componentDetails, leshiConfig);
    
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
    const availableThemes = await GitHubProjectService.getAvailableThemes(framework);
    
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
      const targetPath = FileUtils.join(themesDir, `${themeName}.ts`);

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

      const success = await GitHubProjectService.downloadTheme(
        framework, 
        themeName, 
        targetPath, 
        options.overwrite || false
      );
      
      if (success) {
        installedThemes.push(themeName);
      } else {
        skippedThemes.push(themeName);
      }
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