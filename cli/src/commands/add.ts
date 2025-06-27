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
  .description('Add UI components to your project')
  .argument('[components...]', 'names of components to add')
  .option('-y, --yes', 'skip confirmation prompt', false)
  .option('-o, --overwrite', 'overwrite existing files', false)
  .option('-c, --cwd <cwd>', 'the working directory')
  .option('-a, --all', 'add all available components', false)
  .option('-p, --path <path>', 'the path to add the component to')
  .option('-s, --silent', 'mute output', false)
  .option('--unistyles', 'use Unistyles implementation', false)
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

    // Load project config
    let projectConfig = ProjectDetector.createDefaultConfig(projectInfo);
    if (projectInfo.hasConfig && projectInfo.configPath) {
      try {
        projectConfig = await FileOperationsService.readJsonFile(projectInfo.configPath);
      } catch (error) {
        if (!options.silent) {
          console.warn(chalk.yellow('Warning: Could not load project config, using defaults'));
        }
      }
    }

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
    for (const componentName of componentNames) {
      const dependencies = await resolver.resolveAllDependencies(componentName);
      dependencies.forEach(dep => allComponents.add(dep));
    }

    const finalComponents = Array.from(allComponents);
    
    if (!options.silent) {
      spinner.succeed(`Resolved ${finalComponents.length} components (including dependencies)`);
      
      if (finalComponents.length > componentNames.length) {
        console.log(chalk.blue('Dependencies that will be installed:'));
        finalComponents
          .filter(name => !componentNames.includes(name))
          .forEach(name => console.log(chalk.gray(`  • ${name}`)));
      }
    }

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

  for (const possiblePath of possiblePaths) {
    try {
      if (await FileOperationsService.pathExists(possiblePath)) {
        return possiblePath;
      }
    } catch {
      // Continue searching
    }
  }

  throw new InvalidProjectError('Could not find packages directory');
}