import { Command } from 'commander';
import { ComponentRegistryService } from '../services/component-registry.js';
import { Logger } from '../utils/logger.js';
import { colors, icons } from '../utils/colors.js';
import { getComponentDescription } from '../utils/component-descriptions.js';

export function createGuideCommand(): Command {
  return new Command('guide')
    .description('View component documentation and usage examples');
}

export function createGuideComponentCommand(): Command {
  return new Command('component')
    .description('Show detailed guide for a specific component')
    .argument('<name>', 'Component name')
    .action(async (name: string) => {
      try {
        await showComponentGuide(name);
      } catch (error) {
        Logger.error(`Failed to show component guide: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
}

export function createGuideThemeCommand(): Command {
  return new Command('theme')
    .description('Show guide for using themes')
    .action(async () => {
      try {
        await showThemeGuide();
      } catch (error) {
        Logger.error(`Failed to show theme guide: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
}

async function showComponentGuide(componentName: string): Promise<void> {
  Logger.title(`${icons.books} Component Guide: ${colors.primary(componentName)}`);
  Logger.break();

  try {
    const component = await ComponentRegistryService.getComponent(componentName);
    
    if (!component) {
      Logger.error(`Component '${componentName}' not found`);
      Logger.tip(`Run ${colors.primary('npx leshi-ui@latest list component')} to see available components`);
      return;
    }

    // Description
    const description = getComponentDescription(componentName);
    Logger.log(`${colors.bold('Description:')}`);
    Logger.log(`  ${description}`);
    Logger.break();

    // Dependencies
    if (component.dependencies.length > 0) {
      Logger.log(`${colors.bold('leshi-ui Dependencies:')}`);
      component.dependencies.forEach(dep => {
        Logger.log(`  • ${colors.primary(dep)}`);
      });
      Logger.break();
    }

    // External dependencies
    if (component.externalDeps.length > 0) {
      Logger.log(`${colors.bold('External Dependencies:')}`);
      component.externalDeps.forEach(dep => {
        Logger.log(`  • ${colors.primary(dep)}`);
      });
      Logger.break();
    }

    // Setup instructions
    if (component.setup.length > 0) {
      Logger.log(`${colors.bold('Setup Instructions:')}`);
      component.setup.forEach((instruction, index) => {
        Logger.log(`  ${index + 1}. ${instruction}`);
      });
      Logger.break();
    }

    // Setup code
    if (component.setupCode) {
      Logger.log(`${colors.bold('Setup Code:')}`);
      Logger.log('');
      Logger.log(colors.dim(component.setupCode));
      Logger.break();
    }

    // Usage example
    Logger.log(`${colors.bold('Usage Example:')}`);
    Logger.log('');
    Logger.log(colors.dim(component.example));
    Logger.break();

    // Installation command
    Logger.tip(`Install this component: ${colors.primary(`npx leshi-ui@latest add component ${componentName}`)}`);
    
  } catch (error) {
    Logger.error('Failed to load component information');
    throw error;
  }
}

async function showThemeGuide(): Promise<void> {
  Logger.title(`${icons.theme} Theme System Guide`);
  Logger.break();

  Logger.log(`${colors.bold('Overview:')}`);
  Logger.log('  The leshi-ui theme system provides a flexible way to manage');
  Logger.log('  colors, typography, and styling across your React Native app.');
  Logger.break();

  Logger.log(`${colors.bold('Setup:')}`);
  Logger.log('  1. Wrap your app with ThemeProvider:');
  Logger.break();
  
  const setupCode = `import { ThemeProvider } from './styles/context';

export const App = () => {
  return (
    <ThemeProvider defaultTheme="light" defaultMode="system">
      <YourApp />
    </ThemeProvider>
  );
}`;

  Logger.log(colors.dim(setupCode));
  Logger.break();

  Logger.log(`${colors.bold('Default Modes:')}`);
  Logger.log(`  • ${colors.primary('system')} - Automatically switches based on device settings`);
  Logger.log(`  • ${colors.primary('manual')} - Manual theme switching only`);
  Logger.break();

  Logger.log(`${colors.bold('Using Themes in Components:')}`);
  Logger.break();
  
  const usageCode = `import { useTheme } from './styles/theme';

export const MyComponent = () => {
  const { theme, setTheme, defaultMode } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>
        Current theme: {theme.name}
      </Text>
      <Button
        title="Toggle Theme"
        onPress={() => setTheme(theme.name === 'light' ? 'dark' : 'light')}
      />
    </View>
  );
}`;

  Logger.log(colors.dim(usageCode));
  Logger.break();

  Logger.log(`${colors.bold('Available Theme Properties:')}`);
  Logger.log(`  • ${colors.primary('colors')} - Background, text, primary, secondary, etc.`);
  Logger.log(`  • ${colors.primary('fonts')} - Typography definitions`);
  Logger.log(`  • ${colors.primary('spacing')} - Consistent spacing values`);
  Logger.log(`  • ${colors.primary('borderRadius')} - Border radius values`);
  Logger.log(`  • ${colors.primary('shadows')} - Shadow definitions`);
  Logger.break();

  Logger.tip(`Add more themes: ${colors.primary('npx leshi-ui@latest add theme ocean-dark')}`);
  Logger.tip(`List available themes: ${colors.primary('npx leshi-ui@latest list theme')}`);
}

