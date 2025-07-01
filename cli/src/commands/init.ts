import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import { Framework } from '../types/index.js';
import { Logger } from '../utils/logger.js';
import { FileUtils } from '../utils/file-utils.js';
import { ProjectService } from '../services/project-service.js';
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

  const spinner = ora('Setting up project structure...').start();

  try {
    // Create directories
    const config = await ProjectService.getProjectConfig(cwd);
    await FileUtils.ensureDir(config.componentsDir);
    await FileUtils.ensureDir(config.stylesDir);
    await FileUtils.ensureDir(config.libDir);

    spinner.text = 'Downloading theme files from GitHub...';

    // Download core style files from GitHub
    const targetStylesPath = config.stylesDir;
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
    Logger.success('Styling system initialized successfully!');
    Logger.break();
    
    Logger.log(`${icons.folder} Created directories:`);
    Logger.log(`  • ${colors.dim('components/ui/')} - UI components`);
    Logger.log(`  • ${colors.dim('styles/')} - Theme system`);
    Logger.log(`  • ${colors.dim('lib/')} - Utility functions`);
    Logger.break();
    
    Logger.log(`${icons.theme} Themes included:`);
    Logger.log(`  • ${colors.dim('light.ts')} - Light theme`);
    Logger.log(`  • ${colors.dim('dark.ts')} - Dark theme`);
    Logger.break();
    
    Logger.tip('Next steps:');
    Logger.log(`  1. Wrap your app with ${colors.primary('<ThemeProvider>')}`);
    Logger.log(`  2. Add components: ${colors.primary('npx leshi-ui@latest add component button')}`);
    Logger.log(`  3. View available components: ${colors.primary('npx leshi-ui@latest list component')}`);
    
  } catch (error) {
    spinner.fail('Failed to initialize project');
    throw error;
  }
}