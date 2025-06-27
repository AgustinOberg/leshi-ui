#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Import commands
import { addCommand } from './commands/add.js';
import { initCommand } from './commands/init.js';
import { ErrorHandler } from './errors/index.js';
import { ThemeResolver } from './services/theme-resolver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
let version = '1.0.0';
try {
  const packageJsonPath = join(__dirname, '../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  version = packageJson.version;
} catch {
  // Use fallback version
}

const program = new Command();

program
  .name('leshi-ui')
  .description('A CLI for adding React Native UI components to your project')
  .version(version)
  .helpOption('-h, --help', 'display help for command');

// Add commands
program.addCommand(addCommand);
program.addCommand(initCommand);

// Add theme add command to the main add command
addCommand
  .command('theme <name>')
  .description('Add a theme to your project')
  .option('--unistyles', 'use Unistyles implementation', false)
  .option('--rn', 'use React Native implementation (default)', false)
  .option('-c, --cwd <cwd>', 'the working directory')
  .option('-s, --silent', 'mute output', false)
  .action(async (name: string, options: any) => {
    try {
      await handleThemeAddCommand(name, options);
    } catch (error) {
      ErrorHandler.handle(error instanceof Error ? error : new Error(String(error)), options?.silent);
    }
  });

// Add list/ls commands
const listCommand = new Command()
  .name('list')
  .alias('ls')
  .description('List available components and themes');

// List components
listCommand
  .command('component')
  .alias('components')
  .description('List all available components')
  .action(() => {
    import('./services/dependency-resolver.js').then(({ DependencyResolver }) => {
      const resolver = new DependencyResolver();
      const components = resolver.getAvailableComponents();
      
      console.log(chalk.blue('📦 Available Components:'));
      console.log('');
      components.forEach(name => {
        const component = resolver.getComponent(name);
        console.log(`   ${chalk.cyan(name.padEnd(15))} ${chalk.gray(component.description)}`);
      });
      console.log('');
      console.log(chalk.blue(`💡 Add component: ${chalk.cyan('leshi-ui add component <name>')}`));
      console.log(chalk.blue(`💡 View guide: ${chalk.cyan('leshi-ui guide component <name>')}`));
    }).catch(() => {
      console.log(chalk.red('❌ Failed to load components'));
    });
  });

// List themes
listCommand
  .command('theme')
  .alias('themes')
  .description('List all available themes')
  .action(() => {
    const themeResolver = new ThemeResolver();
    const themes = themeResolver.getAvailableThemes();
    const lightThemes = themeResolver.getThemesByType('light');
    const darkThemes = themeResolver.getThemesByType('dark');
    
    console.log(chalk.blue('🎨 Available Themes:'));
    console.log('');
    
    console.log(chalk.yellow('Light Themes:'));
    lightThemes.forEach(name => {
      const theme = themeResolver.getTheme(name);
      console.log(`   ${chalk.cyan(name.padEnd(20))} ${chalk.gray(theme.description)}`);
    });
    
    console.log('');
    console.log(chalk.yellow('Dark Themes:'));
    darkThemes.forEach(name => {
      const theme = themeResolver.getTheme(name);
      console.log(`   ${chalk.cyan(name.padEnd(20))} ${chalk.gray(theme.description)}`);
    });
    
    console.log('');
    console.log(chalk.blue(`💡 Add theme: ${chalk.cyan('leshi-ui add theme <name>')}`));
    console.log(chalk.blue(`💡 Theme guide: ${chalk.cyan('leshi-ui guide theme')}`));
  });

program.addCommand(listCommand);

// Add guide command
const guideCommand = new Command()
  .name('guide')
  .description('Show component guides and examples');

guideCommand
  .command('components')
  .alias('list')
  .description('List all available components')
  .action(() => {
    console.log(chalk.blue('📖 Available Components:'));
    console.log('');
    
    const components = [
      'button', 'text', 'modal', 'dialog', 'alert-dialog',
      'text-input', 'text-area', 'surface', 'checkbox',
      'icon', 'avatar', 'badge', 'label', 'skeleton',
      'progress', 'switch', 'slot', 'divider', 'radio'
    ];
    
    components.forEach(name => {
      console.log(`   ${chalk.cyan(name.padEnd(15))} ${chalk.gray('UI component')}`);
    });
    
    console.log('');
    console.log(chalk.blue(`💡 View detailed guide: ${chalk.cyan('leshi-ui guide component <name>')}`));
  });

guideCommand
  .command('component <name>')
  .description('Show detailed guide for a component')
  .action((name: string) => {
    try {
      // Import DependencyResolver to get component info
      import('./services/dependency-resolver.js').then(({ DependencyResolver }) => {
        const resolver = new DependencyResolver();
        
        if (!resolver.hasComponent(name)) {
          console.log(chalk.red(`❌ Component "${name}" not found`));
          console.log('');
          console.log(chalk.blue('Available components:'));
          resolver.getAvailableComponents().forEach(component => {
            console.log(chalk.gray(`   • ${component}`));
          });
          return;
        }
        
        const component = resolver.getComponent(name);
        
        console.log(chalk.blue(`📖 ${name.toUpperCase()} COMPONENT GUIDE`));
        console.log('');
        console.log(chalk.cyan('Name:'), component.name);
        console.log(chalk.cyan('Description:'), component.description);
        console.log('');
        
        if (component.registryDependencies.length > 0) {
          console.log(chalk.cyan('Dependencies:'));
          component.registryDependencies.forEach(dep => {
            console.log(chalk.gray(`   • ${dep}`));
          });
          console.log('');
        }
        
        if (component.dependencies.length > 0) {
          console.log(chalk.cyan('External Dependencies:'));
          component.dependencies.forEach(dep => {
            console.log(chalk.gray(`   • ${dep}`));
          });
          console.log('');
        }
        
        if (component.setup.length > 0) {
          console.log(chalk.cyan('Setup Instructions:'));
          component.setup.forEach((instruction, index) => {
            console.log(chalk.gray(`   ${index + 1}. ${instruction}`));
          });
          console.log('');
        }
        
        console.log(chalk.cyan('Example Usage:'));
        console.log(chalk.gray(component.example));
        console.log('');
        
        console.log(chalk.blue(`💡 Install with: ${chalk.cyan(`leshi-ui add component ${name}`)}`));
      }).catch(() => {
        console.log(chalk.red('❌ Failed to load component information'));
      });
    } catch (error) {
      console.log(chalk.red('❌ Failed to load component information'));
    }
  });

// Add theme guide
guideCommand
  .command('theme')
  .description('Show theme usage guide')
  .action(() => {
    console.log(chalk.blue('🎨 THEME SYSTEM GUIDE'));
    console.log('');
    
    console.log(chalk.cyan('What are themes?'));
    console.log(chalk.gray('Themes define the visual appearance of your app including colors, spacing, typography, and more.'));
    console.log('');
    
    console.log(chalk.cyan('Setting up the ThemeProvider:'));
    console.log(chalk.gray('1. Wrap your app with ThemeProvider in your root component (_layout.tsx or App.tsx):'));
    console.log('');
    console.log(chalk.gray(`import { ThemeProvider } from './styles/context';
import { themes } from './styles/themes';

export default function App() {
  return (
    <ThemeProvider theme={themes.light}>
      {/* Your app content */}
    </ThemeProvider>
  );
}`));
    console.log('');
    
    console.log(chalk.cyan('Using themes in components:'));
    console.log(chalk.gray('Use the useTheme hook to access theme values:'));
    console.log('');
    console.log(chalk.gray(`import { useTheme } from './styles/context';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md
    }}>
      <Text style={{ color: theme.colors.text }}>
        Hello World
      </Text>
    </View>
  );
}`));
    console.log('');
    
    console.log(chalk.cyan('Switching themes dynamically:'));
    console.log(chalk.gray(`import { useThemeContext } from './styles/context';
import { themes } from './styles/themes';

function ThemeSwitcher() {
  const { setTheme } = useThemeContext();
  
  return (
    <Button 
      text="Switch to Dark"
      onPress={() => setTheme(themes.dark)}
    />
  );
}`));
    console.log('');
    
    console.log(chalk.cyan('Available commands:'));
    console.log(chalk.gray(`   • ${chalk.cyan('leshi-ui list theme')} - List all available themes`));
    console.log(chalk.gray(`   • ${chalk.cyan('leshi-ui add theme <name>')} - Add a new theme`));
    console.log('');
    
    console.log(chalk.blue('💡 After adding a theme, remember to export it in styles/themes/index.ts'));
  });

program.addCommand(guideCommand);

// Add info command
const infoCommand = new Command()
  .name('info')
  .description('Show developer information')
  .action(() => {
    console.log(chalk.blue('👨‍💻 Developer Information'));
    console.log('');
    console.log(chalk.cyan('Created by:'), 'Agustin Oberg');
    console.log(chalk.cyan('Made with:'), chalk.red('❤️'));
    console.log(chalk.cyan('LinkedIn:'), chalk.blue('https://linkedin.com/in/agustin-oberg'));
    console.log(chalk.cyan('GitHub:'), chalk.blue('https://github.com/agustin-oberg'));
    console.log('');
    console.log(chalk.gray('leshi-ui - A shadcn alternative for React Native'));
  });

program.addCommand(infoCommand);

// Theme add command handler
async function handleThemeAddCommand(name: string, options: any): Promise<void> {
  const ora = (await import('ora')).default;
  const spinner = ora();
  
  try {
    // Determine package type
    const packageType = options.unistyles ? 'unistyles' : 'rn';
    
    if (!options.silent) {
      spinner.start('Checking theme availability...');
    }

    const themeResolver = new ThemeResolver();
    
    if (!themeResolver.hasTheme(name)) {
      if (!options.silent) {
        spinner.fail(`Theme "${name}" not found`);
        console.log('');
        console.log(chalk.blue('Available themes:'));
        themeResolver.getAvailableThemes().forEach(theme => {
          console.log(chalk.gray(`   • ${theme}`));
        });
      }
      return;
    }

    const theme = themeResolver.getTheme(name);

    // Find packages directory
    const packagesDir = await findPackagesDirectory();
    const sourcePath = path.join(packagesDir, packageType, 'styles', 'themes', theme.filename);
    
    // Determine target path
    const currentDir = options.cwd || process.cwd();
    const targetPath = path.join(currentDir, 'styles', 'themes', theme.filename);

    if (!options.silent) {
      spinner.text = 'Installing theme...';
    }

    // Check if file exists
    const fs = await import('fs-extra');
    if (!await fs.pathExists(sourcePath)) {
      throw new Error(`Theme file not found: ${sourcePath}`);
    }

    // Copy theme file
    await fs.ensureDir(path.dirname(targetPath));
    await fs.copy(sourcePath, targetPath);

    if (!options.silent) {
      spinner.succeed(`Theme "${name}" installed successfully!`);
      console.log('');
      console.log(chalk.yellow('📝 Next steps:'));
      console.log(chalk.gray(`   1. Export the theme in styles/themes/index.ts:`));
      console.log(chalk.cyan(`      import { ${getCamelCase(name)} } from "./${name}";`));
      console.log(chalk.cyan(`      export const themes = { ...themes, ${getCamelCase(name)} };`));
      console.log('');
      console.log(chalk.blue(`💡 Need help? Run: ${chalk.cyan('leshi-ui guide theme')}`));
    }

  } catch (error) {
    if (spinner.isSpinning) {
      spinner.fail('Theme installation failed');
    }
    throw error;
  }
}

// Helper function to convert kebab-case to camelCase
function getCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Find packages directory helper
async function findPackagesDirectory(): Promise<string> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const currentDir = process.cwd();
  const possiblePaths = [
    path.join(__dirname, '../packages'),
    path.join(__dirname, '../../packages'),
    path.join(currentDir, 'node_modules/leshi-ui/packages'),
    path.join(__dirname, '../../../packages'),
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

// Global error handling
process.on('uncaughtException', (error) => {
  ErrorHandler.handle(error);
});

process.on('unhandledRejection', (reason) => {
  ErrorHandler.handle(reason instanceof Error ? reason : new Error(String(reason)));
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 Goodbye!'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n👋 Goodbye!'));
  process.exit(0);
});

// Parse command line arguments
program.parse();