import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ora from 'ora';
import prompts from 'prompts';
import chalk from 'chalk';
import { addOptionsSchema, type AddOptions } from '../schemas/index.js';
import { DependencyResolver } from '../services/dependency-resolver.js';
import { ProjectDetector } from '../services/project-detector.js';
import { FileOperationsService } from '../services/file-operations.js';
import { ImportTransformer } from '../services/import-transformer.js';
import { ErrorHandler, ComponentNotFoundError, InvalidProjectError } from '../errors/index.js';

export const addCommand = new Command()
  .name('add')
  .description('Add UI components to your project');

// Add the 'component' subcommand
addCommand
  .command('component [components...]')
  .description('Add UI components to your project')
  .option('-y, --yes', 'skip confirmation prompt', false)
  .option('-o, --overwrite', 'overwrite existing files', false)
  .option('-c, --cwd <cwd>', 'the working directory')
  .option('-a, --all', 'add all available components', false)
  .option('-p, --path <path>', 'the path to add the component to')
  .option('-s, --silent', 'mute output', false)
  .option('--unistyles', 'use Unistyles implementation', false)
  .option('--rn', 'use React Native implementation (default)', false)
  .action(async (components: string[], rawOptions: unknown) => {
    try {
      // Validate options with Zod
      const options = addOptionsSchema.parse(rawOptions) as AddOptions;
      
      await handleAddCommand(components, options);
    } catch (error) {
      ErrorHandler.handle(error instanceof Error ? error : new Error(String(error)), (rawOptions as any)?.silent);
    }
  });

async function handleAddCommand(componentNames: string[], options: AddOptions): Promise<void> {
  const spinner = ora();
  
  try {
    // Detect project
    if (!options.silent) {
      spinner.start('Detecting project...');
    }
    
    const projectInfo = await ProjectDetector.detectProject(options.cwd);
    
    if (!options.silent) {
      spinner.succeed(`Detected ${projectInfo.framework} project${projectInfo.typescript ? ' with TypeScript' : ''}`);
    }

    // Validate project structure
    await ProjectDetector.validateProjectStructure(projectInfo.framework, projectInfo.projectRoot);

    // Use default project config (no more leshi-ui.json)
    const projectConfig = ProjectDetector.createDefaultConfig(projectInfo);

    // Initialize dependency resolver
    const resolver = new DependencyResolver();

    // Handle --all flag
    if (options.all) {
      componentNames = resolver.getAvailableComponents();
    }

    // Validate component names
    if (componentNames.length === 0) {
      if (!options.yes) {
        const { selectedComponents } = await prompts({
          type: 'multiselect',
          name: 'selectedComponents',
          message: 'Select components to add:',
          choices: resolver.getAvailableComponents().map(name => ({
            title: name,
            value: name,
            description: resolver.getComponent(name).description
          }))
        });
        
        if (!selectedComponents || selectedComponents.length === 0) {
          if (!options.silent) {
            console.log(chalk.blue('No components selected. Exiting.'));
          }
          return;
        }
        
        componentNames = selectedComponents;
      } else {
        throw new ComponentNotFoundError('No components specified', resolver.getAvailableComponents());
      }
    }

    // Validate that all components exist
    for (const name of componentNames) {
      if (!resolver.hasComponent(name)) {
        throw new ComponentNotFoundError(name, resolver.getAvailableComponents());
      }
    }

    // Resolve dependencies
    if (!options.silent) {
      spinner.start('Resolving dependencies...');
    }

    const allComponents = new Set<string>();
    const dependenciesToAdd = new Set<string>();
    
    // Add explicitly requested components
    componentNames.forEach(name => allComponents.add(name));
    
    // Check for dependencies that need to be resolved
    for (const componentName of componentNames) {
      const component = resolver.getComponent(componentName);
      for (const dependency of component.registryDependencies) {
        if (!componentNames.includes(dependency)) {
          dependenciesToAdd.add(dependency);
        }
      }
    }

    const dependenciesArray = Array.from(dependenciesToAdd);
    
    if (!options.silent) {
      spinner.succeed('Dependencies analyzed');
    }

    // Ask user permission for dependencies if any exist
    if (dependenciesArray.length > 0 && !options.yes) {
      console.log('');
      console.log(chalk.yellow('⚠️  These components have dependencies:'));
      
      for (const componentName of componentNames) {
        const component = resolver.getComponent(componentName);
        const componentDeps = component.registryDependencies.filter(dep => !componentNames.includes(dep));
        if (componentDeps.length > 0) {
          console.log(chalk.blue(`   ${componentName}:`));
          componentDeps.forEach(dep => console.log(chalk.gray(`     • ${dep}`)));
        }
      }
      
      console.log('');
      const { shouldAddDependencies } = await prompts({
        type: 'confirm',
        name: 'shouldAddDependencies',
        message: `Do you want to install the ${dependenciesArray.length} required dependencies?`,
        initial: true
      });
      
      if (!shouldAddDependencies) {
        if (!options.silent) {
          console.log(chalk.yellow('⚠️  Components may not work correctly without their dependencies.'));
          console.log(chalk.blue('You can install them later manually.'));
        }
      } else {
        // Add dependencies to installation list
        dependenciesArray.forEach(dep => allComponents.add(dep));
      }
    } else if (dependenciesArray.length > 0 && options.yes) {
      // Auto-add dependencies when --yes flag is used
      dependenciesArray.forEach(dep => allComponents.add(dep));
    }

    const finalComponents = Array.from(allComponents);

    // Check for existing files if not overwriting
    if (!options.overwrite) {
      const existingFiles = await checkExistingFiles(finalComponents, projectConfig, options);
      
      if (existingFiles.length > 0 && !options.yes) {
        const { shouldOverwrite } = await prompts({
          type: 'confirm',
          name: 'shouldOverwrite',
          message: `${existingFiles.length} files already exist. Overwrite them?`,
          initial: false
        });
        
        if (!shouldOverwrite) {
          if (!options.silent) {
            console.log(chalk.blue('Operation cancelled.'));
          }
          return;
        }
        
        options.overwrite = true;
      }
    }

    // Get package paths
    const packagesDir = await findPackagesDirectory();
    const packageType = options.unistyles ? 'unistyles' : 'rn';
    const sourcePath = path.join(packagesDir, packageType);

    // Plan all file operations
    if (!options.silent) {
      spinner.start('Planning file operations...');
    }

    const fileOps = new FileOperationsService();
    await planComponentOperations(
      fileOps,
      finalComponents,
      sourcePath,
      projectConfig,
      options
    );

    if (!options.silent) {
      spinner.succeed('File operations planned');
    }

    // Execute operations
    if (!options.silent) {
      spinner.start('Installing components...');
    }

    const result = await fileOps.executeOperations(options.silent);
    
    if (!result.success) {
      throw result.error || new Error('File operations failed');
    }

    if (!options.silent) {
      spinner.succeed(`Successfully installed ${finalComponents.length} components!`);
    }

    // Show setup instructions
    await showSetupInstructions(resolver, finalComponents, options);

    // Show external dependencies
    await showExternalDependencies(resolver, finalComponents, options);

  } catch (error) {
    if (spinner.isSpinning) {
      spinner.fail('Operation failed');
    }
    throw error;
  }
}

async function checkExistingFiles(
  components: string[],
  projectConfig: any,
  options: AddOptions
): Promise<string[]> {
  const existingFiles: string[] = [];
  const basePath = options.cwd || process.cwd();

  for (const componentName of components) {
    const componentPath = path.join(
      basePath,
      projectConfig.aliases?.components || 'components',
      'ui',
      `${componentName}.tsx`
    );

    if (await FileOperationsService.pathExists(componentPath)) {
      existingFiles.push(componentPath);
    }
  }

  return existingFiles;
}

async function planComponentOperations(
  fileOps: FileOperationsService,
  components: string[],
  sourcePath: string,
  projectConfig: any,
  options: AddOptions
): Promise<void> {
  const basePath = options.cwd || process.cwd();
  const resolver = new DependencyResolver();

  // Get all utility and provider files needed
  const utilityFiles = resolver.getUtilityFiles(components);
  const providerFiles = resolver.getProviderFiles(components);

  // Plan component file operations
  for (const componentName of components) {
    const sourceFile = path.join(sourcePath, 'components', 'ui', `${componentName}.tsx`);
    const targetFile = path.join(
      basePath,
      projectConfig.aliases?.components || 'components',
      'ui',
      `${componentName}.tsx`
    );

    if (await FileOperationsService.pathExists(sourceFile)) {
      // Read and transform content (temporarily disabled for testing)
      const content = await FileOperationsService.readFile(sourceFile);
      // const transformedContent = await ImportTransformer.transformImports(content, {
      //   sourcePath: sourceFile,
      //   targetPath: targetFile,
      //   projectConfig,
      //   packageType: options.unistyles ? 'unistyles' : 'rn'
      // });
      const transformedContent = content; // Skip transformation for now

      fileOps.planOperation({
        type: 'copy',
        source: sourceFile,
        target: targetFile,
        content: transformedContent
      });
    }
  }

  // Plan utility file operations
  for (const utilityFile of utilityFiles) {
    const sourceFile = path.join(sourcePath, utilityFile);
    const targetFile = path.join(basePath, utilityFile);

    if (await FileOperationsService.pathExists(sourceFile)) {
      const content = await FileOperationsService.readFile(sourceFile);
      // const transformedContent = await ImportTransformer.transformImports(content, {
      //   sourcePath: sourceFile,
      //   targetPath: targetFile,
      //   projectConfig,
      //   packageType: options.unistyles ? 'unistyles' : 'rn'
      // });
      const transformedContent = content; // Skip transformation for now

      fileOps.planOperation({
        type: 'copy',
        source: sourceFile,
        target: targetFile,
        content: transformedContent
      });
    }
  }

  // Plan provider file operations
  for (const providerFile of providerFiles) {
    const sourceFile = path.join(sourcePath, providerFile);
    const targetFile = path.join(
      basePath,
      projectConfig.aliases?.components || 'components',
      'ui',
      path.basename(providerFile)
    );

    if (await FileOperationsService.pathExists(sourceFile)) {
      const content = await FileOperationsService.readFile(sourceFile);
      // const transformedContent = await ImportTransformer.transformImports(content, {
      //   sourcePath: sourceFile,
      //   targetPath: targetFile,
      //   projectConfig,
      //   packageType: options.unistyles ? 'unistyles' : 'rn'
      // });
      const transformedContent = content; // Skip transformation for now

      fileOps.planOperation({
        type: 'copy',
        source: sourceFile,
        target: targetFile,
        content: transformedContent
      });
    }
  }
}

async function showSetupInstructions(
  resolver: DependencyResolver,
  components: string[],
  options: AddOptions
): Promise<void> {
  if (options.silent) return;

  const instructions = resolver.getSetupInstructions(components);
  
  if (instructions.length > 0) {
    console.log('');
    console.log(chalk.blue('📋 Setup Instructions:'));
    instructions.forEach((instruction, index) => {
      console.log(chalk.gray(`   ${index + 1}. ${instruction}`));
    });
  }

  console.log('');
  console.log(chalk.blue(`💡 For usage examples: ${chalk.cyan('leshi-ui guide components')}`));
}

async function showExternalDependencies(
  resolver: DependencyResolver,
  components: string[],
  options: AddOptions
): Promise<void> {
  if (options.silent) return;

  const externalDeps = resolver.getExternalDependencies(components);
  
  if (externalDeps.length > 0) {
    console.log('');
    console.log(chalk.yellow('📦 External Dependencies Required:'));
    externalDeps.forEach(dep => {
      console.log(chalk.gray(`   • ${dep}`));
    });
    console.log('');
    console.log(chalk.blue(`Install with: ${chalk.cyan(`bun add ${externalDeps.join(' ')}`)}`));
  }
}

async function findPackagesDirectory(): Promise<string> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const currentDir = process.cwd();
  
  // Try paths in order of most likely to work
  const possiblePaths = [
    // NPM package: from node_modules/leshi-ui/dist/commands/ to node_modules/leshi-ui/packages/
    path.join(__dirname, '../../packages'),
    // Development: from cli/dist/commands/ to root packages/
    path.join(__dirname, '../../../packages'),
    // Development: alternative path
    path.join(__dirname, '../../../../packages'),
    // When npm global: try in node_modules
    path.join(process.cwd(), 'node_modules/leshi-ui/packages'),
    // Last resort attempts
    path.join(currentDir, 'packages'),
    path.join(currentDir, '../packages'),
    path.join(currentDir, '../../packages')
  ];

  for (const possiblePath of possiblePaths) {
    try {
      if (await FileOperationsService.pathExists(possiblePath)) {
        return possiblePath;
      }
    } catch {
      // Continue searching
    }
  }

  throw new InvalidProjectError('Packages directory not found. Make sure you are in a leshi-ui project or packages directory exists.');
}