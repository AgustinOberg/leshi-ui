import { Framework, ProjectConfig, LeshiConfig } from '../types/index.js';
import { FileUtils } from '../utils/file-utils.js';
import { ConfigService } from './config-service.js';

export class ProjectService {
  static async getProjectConfig(cwd: string): Promise<ProjectConfig> {
    // Try to read existing config first
    const config = await ConfigService.readConfig(cwd);
    
    if (config) {
      return {
        framework: config.framework,
        componentsDir: FileUtils.join(cwd, config.dirs.ui),
        stylesDir: FileUtils.join(cwd, config.dirs.styles),
        libDir: FileUtils.join(cwd, config.dirs.lib),
        aliases: config.aliases,
      };
    }

    // Fallback to defaults
    return {
      framework: 'rn', // Default framework
      componentsDir: FileUtils.join(cwd, 'components', 'ui'),
      stylesDir: FileUtils.join(cwd, 'styles'),
      libDir: FileUtils.join(cwd, 'lib'),
    };
  }

  static async getOrCreateConfig(cwd: string, framework?: Framework): Promise<LeshiConfig> {
    const existingConfig = await ConfigService.readConfig(cwd);
    
    if (existingConfig) {
      return existingConfig;
    }

    // Create default config if none exists
    const defaultConfig = ConfigService.getDefaultConfig(framework || 'rn');
    return defaultConfig;
  }

  static async isReactNativeProject(cwd: string): Promise<boolean> {
    const packageJsonPath = FileUtils.join(cwd, 'package.json');
    
    if (!(await FileUtils.exists(packageJsonPath))) {
      return false;
    }

    try {
      const packageJson = await FileUtils.readJson<any>(packageJsonPath);
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      return !!(
        dependencies['react-native'] ||
        dependencies['expo'] ||
        dependencies['@expo/cli']
      );
    } catch {
      return false;
    }
  }

  static getPackagesPath(framework: Framework): string {
    // Get the CLI package directory and use the bundled packages
    const cliDir = FileUtils.dirname(FileUtils.dirname(new URL(import.meta.url).pathname));
    return FileUtils.join(cliDir, 'packages', framework);
  }

  static getComponentPath(framework: Framework, componentName: string): string {
    return FileUtils.join(
      this.getPackagesPath(framework),
      'components',
      'ui',
      `${componentName}.tsx`
    );
  }

  static getStylesPath(framework: Framework): string {
    return FileUtils.join(this.getPackagesPath(framework), 'styles');
  }

  static getLibPath(framework: Framework): string {
    return FileUtils.join(this.getPackagesPath(framework), 'lib');
  }

  static getThemesPath(framework: Framework): string {
    return FileUtils.join(this.getStylesPath(framework), 'themes');
  }

  static async getAvailableThemes(framework: Framework): Promise<string[]> {
    const themesPath = this.getThemesPath(framework);
    
    if (!(await FileUtils.exists(themesPath))) {
      return [];
    }

    const files = await FileUtils.listFiles(themesPath);
    return files
      .filter(file => file.endsWith('.ts') && file !== 'index.ts' && file !== 'common.ts')
      .map(file => FileUtils.basename(file, '.ts'));
  }
}