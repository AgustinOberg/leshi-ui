import { Command } from 'commander';
import { ComponentRegistryService } from '../services/component-registry.js';
import { ProjectService } from '../services/project-service.js';
import { Logger } from '../utils/logger.js';
import { colors, icons } from '../utils/colors.js';
import { Framework } from '../types/index.js';

interface ListOptions {
  rn?: boolean;
  unistyles?: boolean;
}

export function createListCommand(): Command {
  return new Command('list')
    .alias('ls')
    .description('List available components and themes');
}

export function createListComponentCommand(): Command {
  return new Command('component')
    .description('List all available components')
    .option('--rn', 'Show React Native StyleSheet components (default)')
    .option('--unistyles', 'Show Unistyles components')
    .action(async (options: ListOptions) => {
      try {
        await listComponents(options);
      } catch (error) {
        Logger.error(`Failed to list components: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
}

export function createListThemeCommand(): Command {
  return new Command('theme')
    .description('List all available themes')
    .option('--rn', 'Show React Native StyleSheet themes (default)')
    .option('--unistyles', 'Show Unistyles themes')
    .action(async (options: ListOptions) => {
      try {
        await listThemes(options);
      } catch (error) {
        Logger.error(`Failed to list themes: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
}

async function listComponents(options: ListOptions): Promise<void> {
  // Determine framework
  let framework: Framework = 'rn';
  if (options.unistyles) {
    framework = 'unistyles';
  }

  Logger.title(`${icons.list} Available Components`);
  Logger.subtitle(`Framework: ${framework === 'rn' ? 'React Native StyleSheet' : 'Unistyles'}`);
  Logger.break();

  try {
    const components = await ComponentRegistryService.getComponentsWithDetails();
    
    if (components.length === 0) {
      Logger.warning('No components found');
      return;
    }

    // Create table-like output
    Logger.log(`${colors.bold('Component'.padEnd(20))} ${colors.bold('Dependencies'.padEnd(25))} ${colors.bold('External Deps')}`);
    Logger.log('─'.repeat(70));

    components.forEach(comp => {
      const name = comp.name.padEnd(20);
      const deps = (comp.dependencies || 'None').padEnd(25);
      const hasExternalDeps = comp.externalDeps ? icons.success : '─';
      
      Logger.log(`${colors.primary(name)} ${colors.dim(deps)} ${hasExternalDeps}`);
    });

    Logger.break();
    Logger.tip(`Add a component: ${colors.primary('npx leshi-ui@latest add component button')}`);
    Logger.tip(`View component guide: ${colors.primary('npx leshi-ui@latest guide component button')}`);
    
  } catch (error) {
    Logger.error('Failed to load components');
    throw error;
  }
}

async function listThemes(options: ListOptions): Promise<void> {
  // Determine framework
  let framework: Framework = 'rn';
  if (options.unistyles) {
    framework = 'unistyles';
  }

  Logger.title(`${icons.theme} Available Themes`);
  Logger.subtitle(`Framework: ${framework === 'rn' ? 'React Native StyleSheet' : 'Unistyles'}`);
  Logger.break();

  try {
    const themes = await ProjectService.getAvailableThemes(framework);
    
    if (themes.length === 0) {
      Logger.warning('No themes found');
      return;
    }

    // Group themes by category
    const lightThemes = themes.filter(theme => theme.includes('light') || (!theme.includes('dark') && !theme.includes('spotify')));
    const darkThemes = themes.filter(theme => theme.includes('dark'));
    const specialThemes = themes.filter(theme => theme.includes('spotify') || (!theme.includes('light') && !theme.includes('dark') && !lightThemes.includes(theme)));

    if (lightThemes.length > 0) {
      Logger.log(`${colors.bold('Light Themes:')}`);
      lightThemes.forEach(theme => {
        Logger.log(`  • ${colors.primary(theme)}`);
      });
      Logger.break();
    }

    if (darkThemes.length > 0) {
      Logger.log(`${colors.bold('Dark Themes:')}`);
      darkThemes.forEach(theme => {
        Logger.log(`  • ${colors.primary(theme)}`);
      });
      Logger.break();
    }

    if (specialThemes.length > 0) {
      Logger.log(`${colors.bold('Special Themes:')}`);
      specialThemes.forEach(theme => {
        Logger.log(`  • ${colors.primary(theme)}`);
      });
      Logger.break();
    }

    Logger.tip(`Add a theme: ${colors.primary('npx leshi-ui@latest add theme ocean-dark')}`);
    Logger.tip(`Learn about themes: ${colors.primary('npx leshi-ui@latest guide theme')}`);
    
  } catch (error) {
    Logger.error('Failed to load themes');
    throw error;
  }
}