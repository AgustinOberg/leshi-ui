import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import { Framework, AliasConfig, LeshiConfig } from '../types/index.js';
import { Logger } from '../utils/logger.js';
import { FileUtils } from '../utils/file-utils.js';
import { ProjectService } from '../services/project-service.js';
import { ConfigService } from '../services/config-service.js';
import { GitHubProjectService } from '../services/github-project-service.js';
import { colors, icons } from '../utils/colors.js';

interface InitOptions {
  rn?: boolean;
  unistyles?: boolean;
  yes?: boolean;
  cwd?: string;
}

export function createInitCommand(): Command {
  return new Command('init')
    .description('Initialize leshi-ui in your React Native project')
    .option('--rn', 'Use React Native StyleSheet implementation (default)')
    .option('--unistyles', 'Use Unistyles implementation')
    .option('-y, --yes', 'Skip confirmation prompts')
    .option('-c, --cwd <path>', 'Working directory', process.cwd())
    .action(async (options: InitOptions) => {
      try {
        await initProject(options);
      } catch (error) {
        Logger.error(`Failed to initialize project: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
}

async function initProject(options: InitOptions): Promise<void> {
  const cwd = options.cwd || process.cwd();
  
  // Check if config already exists
  const configExists = await ConfigService.configExists(cwd);
  if (configExists && !options.yes) {
    Logger.warning('leshi-ui.json already exists in this directory.');
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Would you like to overwrite the existing configuration?',
        default: false,
      },
    ]);

    if (!overwrite) {
      Logger.info('Initialization cancelled.');
      return;
    }
  }
  
  // Determine framework
  let framework: Framework = 'rn';
  if (options.unistyles) {
    framework = 'unistyles';
  } else if (options.rn) {
    framework = 'rn';
  }

  Logger.title(`${icons.rocket} Initializing leshi-ui`);
  Logger.subtitle(`Framework: ${framework === 'rn' ? 'React Native StyleSheet' : 'Unistyles'}`);
  Logger.break();

  // Check if it's a React Native project
  const isRNProject = await ProjectService.isReactNativeProject(cwd);
  if (!isRNProject) {
    Logger.warning('This doesn\'t appear to be a React Native project.');
    
    if (!options.yes) {
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Continue anyway?',
          default: false,
        },
      ]);

      if (!proceed) {
        Logger.info('Initialization cancelled.');
        return;
      }
    }
  }

  // Configure aliases if not in silent mode
  let aliases: AliasConfig;
  if (!options.yes) {
    Logger.break();
    Logger.info(`${icons.gear} Configure import aliases`);
    Logger.subtitle('Set up import aliases for your project (e.g., @/components, ~/lib)');
    Logger.break();

    const aliasQuestions = [
      {
        type: 'input',
        name: 'utils',
        message: 'Configure alias for utilities:',
        default: '@/lib/utils',
        validate: (input: string) => input.trim() !== '' || 'Alias cannot be empty',
      },
      {
        type: 'input',
        name: 'components',
        message: 'Configure alias for components:',
        default: '@/components',
        validate: (input: string) => input.trim() !== '' || 'Alias cannot be empty',
      },
      {
        type: 'input',
        name: 'lib',
        message: 'Configure alias for lib directory:',
        default: '@/lib',
        validate: (input: string) => input.trim() !== '' || 'Alias cannot be empty',
      },
      {
        type: 'input',
        name: 'styles',
        message: 'Configure alias for styles:',
        default: '@/styles',
        validate: (input: string) => input.trim() !== '' || 'Alias cannot be empty',
      },
      {
        type: 'input',
        name: 'ui',
        message: 'Configure alias for UI components:',
        default: '@/components/ui',
        validate: (input: string) => input.trim() !== '' || 'Alias cannot be empty',
      },
    ];

    aliases = await inquirer.prompt(aliasQuestions);
  } else {
    aliases = ConfigService.getDefaultAliases();
  }

  // Create configuration
  const config: LeshiConfig = ConfigService.getDefaultConfig(framework, aliases);
  
  Logger.break();
  Logger.info(`${icons.package} Configuration preview:`);
  Logger.log(`  Framework: ${colors.primary(framework)}`);
  Logger.log(`  Aliases:`);
  Object.entries(aliases).forEach(([key, value]) => {
    Logger.log(`    ${colors.dim(key)}: ${colors.primary(value)}`);
  });
  Logger.break();

  const spinner = ora('Setting up project structure...').start();

  try {
    // Save configuration first
    spinner.text = 'Creating configuration file...';
    await ConfigService.writeConfig(cwd, config);

    // Create directories
    const projectConfig = await ProjectService.getProjectConfig(cwd);
    await FileUtils.ensureDir(projectConfig.componentsDir);
    await FileUtils.ensureDir(projectConfig.stylesDir);
    await FileUtils.ensureDir(projectConfig.libDir);

    spinner.text = 'Updating TypeScript configuration...';
    await ConfigService.updateTSConfig(cwd, config);

    spinner.text = 'Downloading theme files from GitHub...';

    // Download core style files from GitHub
    const targetStylesPath = projectConfig.stylesDir;
    const { success: styleSuccess, files: downloadedStyleFiles } = await GitHubProjectService.downloadStyleFiles(
      framework, 
      targetStylesPath, 
      true
    );

    if (!styleSuccess) {
      spinner.fail('Failed to download style files from GitHub');
      throw new Error('Failed to download style files');
    }

    // Download basic themes (light and dark only)
    spinner.text = 'Downloading basic themes...';
    const themesTargetPath = FileUtils.join(targetStylesPath, 'themes');
    await FileUtils.ensureDir(themesTargetPath);
    
    const basicThemes = ['light', 'dark', 'common', 'index'];
    
    for (const themeName of basicThemes) {
      const targetPath = FileUtils.join(themesTargetPath, `${themeName}.ts`);
      await GitHubProjectService.downloadTheme(framework, themeName, targetPath, true);
    }

    spinner.succeed('Project initialized successfully!');
    
    Logger.break();
    Logger.success('Project configured with import aliases!');
    Logger.break();
    
    Logger.log(`${icons.gear} Configuration:`);
    Logger.log(`  • ${colors.dim('leshi-ui.json')} - Project configuration`);
    Logger.log(`  • ${colors.dim('tsconfig.json')} - Updated with path mappings`);
    Logger.break();
    
    Logger.log(`${icons.folder} Created directories:`);
    Logger.log(`  • ${colors.dim(config.dirs.ui)} - UI components`);
    Logger.log(`  • ${colors.dim(config.dirs.styles)} - Theme system`);
    Logger.log(`  • ${colors.dim(config.dirs.lib)} - Utility functions`);
    Logger.break();
    
    Logger.log(`${icons.package} Import aliases configured:`);
    Object.entries(aliases).forEach(([key, value]) => {
      Logger.log(`  • ${colors.primary(value)} - ${colors.dim(key)}`);
    });
    Logger.break();
    
    Logger.log(`${icons.theme} Themes included:`);
    Logger.log(`  • ${colors.dim('light.ts')} - Light theme`);
    Logger.log(`  • ${colors.dim('dark.ts')} - Dark theme`);
    Logger.break();
    
    Logger.tip('Next steps:');
    Logger.log(`  1. Wrap your app with ${colors.primary('<ThemeProvider>')}`);
    Logger.log(`  2. Add components: ${colors.primary('npx leshi-ui@latest add component button')}`);
    Logger.log(`  3. View available components: ${colors.primary('npx leshi-ui@latest list component')}`);
    Logger.break();
    Logger.log(`${colors.dim('Your components will automatically use the configured aliases!')}`);
    
  } catch (error) {
    spinner.fail('Failed to initialize project');
    throw error;
  }
}