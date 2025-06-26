import fs from 'fs-extra';
import path from 'path';
import { PackageJson, ProjectConfig } from '../schemas/index.js';
import { InvalidProjectError, ValidationError } from '../errors/index.js';
import { FileOperationsService } from './file-operations.js';

export type Framework = 'expo' | 'react-native' | 'expo-router';

export interface ProjectInfo {
  framework: Framework;
  typescript: boolean;
  projectRoot: string;
  packageJson: PackageJson;
  hasConfig: boolean;
  configPath?: string;
}

export class ProjectDetector {
  /**
   * Detect project type and configuration
   */
  public static async detectProject(cwd?: string): Promise<ProjectInfo> {
    const projectRoot = cwd ?? process.cwd();
    
    // Validate it's a valid Node.js project
    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (!await FileOperationsService.pathExists(packageJsonPath)) {
      throw new InvalidProjectError('package.json not found', projectRoot);
    }

    const packageJson = await FileOperationsService.readJsonFile<PackageJson>(packageJsonPath);
    
    // Detect framework
    const framework = await this.detectFramework(projectRoot, packageJson);
    
    // Detect TypeScript
    const typescript = await this.detectTypeScript(projectRoot, packageJson);
    
    // Check for existing config
    const { hasConfig, configPath } = await this.detectConfig(projectRoot);
    
    return {
      framework,
      typescript,
      projectRoot,
      packageJson,
      hasConfig,
      configPath
    };
  }

  /**
   * Detect React Native framework type
   */
  private static async detectFramework(projectRoot: string, packageJson: PackageJson): Promise<Framework> {
    // Check for Expo
    const expoConfigPaths = [
      'expo.json',
      'app.json',
      'app.config.js',
      'app.config.ts'
    ];

    for (const configPath of expoConfigPaths) {
      if (await FileOperationsService.pathExists(path.join(projectRoot, configPath))) {
        // Check for Expo Router
        const appLayoutPaths = [
          'app/_layout.tsx',
          'app/_layout.js',
          'src/app/_layout.tsx',
          'src/app/_layout.js'
        ];

        for (const layoutPath of appLayoutPaths) {
          if (await FileOperationsService.pathExists(path.join(projectRoot, layoutPath))) {
            return 'expo-router';
          }
        }

        return 'expo';
      }
    }

    // Check for React Native
    const rnFiles = [
      'metro.config.js',
      'metro.config.ts',
      'react-native.config.js',
      'android',
      'ios'
    ];

    const hasRNFiles = await Promise.all(
      rnFiles.map(file => FileOperationsService.pathExists(path.join(projectRoot, file)))
    );

    if (hasRNFiles.some(Boolean)) {
      return 'react-native';
    }

    // Check package.json dependencies
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (dependencies.expo) {
      return 'expo';
    }
    
    if (dependencies['react-native']) {
      return 'react-native';
    }

    throw new InvalidProjectError(
      'Could not detect React Native framework. Make sure you\'re in a React Native, Expo, or Expo Router project.',
      projectRoot
    );
  }

  /**
   * Detect TypeScript usage
   */
  private static async detectTypeScript(projectRoot: string, packageJson: PackageJson): Promise<boolean> {
    // Check for tsconfig.json
    if (await FileOperationsService.pathExists(path.join(projectRoot, 'tsconfig.json'))) {
      return true;
    }

    // Check for TypeScript in dependencies
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    if (dependencies.typescript || dependencies['@types/react-native']) {
      return true;
    }

    // Check for .ts/.tsx files in common locations
    const commonTSPaths = [
      'App.tsx',
      'App.ts',
      'src/App.tsx',
      'src/App.ts',
      'app/_layout.tsx',
      'app/index.tsx'
    ];

    for (const tsPath of commonTSPaths) {
      if (await FileOperationsService.pathExists(path.join(projectRoot, tsPath))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Detect existing leshi-ui configuration
   */
  private static async detectConfig(projectRoot: string): Promise<{ hasConfig: boolean; configPath?: string }> {
    const configPaths = [
      'leshi-ui.json',
      'components.json', // For compatibility
      '.leshi-ui/config.json'
    ];

    for (const configPath of configPaths) {
      const fullPath = path.join(projectRoot, configPath);
      if (await FileOperationsService.pathExists(fullPath)) {
        return { hasConfig: true, configPath: fullPath };
      }
    }

    return { hasConfig: false };
  }

  /**
   * Validate project structure for framework
   */
  public static async validateProjectStructure(framework: Framework, projectRoot: string): Promise<void> {
    switch (framework) {
      case 'expo':
        await this.validateExpoProject(projectRoot);
        break;
      case 'expo-router':
        await this.validateExpoRouterProject(projectRoot);
        break;
      case 'react-native':
        await this.validateRNProject(projectRoot);
        break;
    }
  }

  private static async validateExpoProject(projectRoot: string): Promise<void> {
    const requiredFiles = ['package.json'];
    const requiredDirs: string[] = [];

    for (const file of requiredFiles) {
      if (!await FileOperationsService.pathExists(path.join(projectRoot, file))) {
        throw new InvalidProjectError(`Missing required file: ${file}`, projectRoot);
      }
    }

    for (const dir of requiredDirs) {
      if (!await FileOperationsService.pathExists(path.join(projectRoot, dir))) {
        throw new InvalidProjectError(`Missing required directory: ${dir}`, projectRoot);
      }
    }
  }

  private static async validateExpoRouterProject(projectRoot: string): Promise<void> {
    await this.validateExpoProject(projectRoot);
    
    // Check for app directory structure
    const appDir = path.join(projectRoot, 'app');
    if (!await FileOperationsService.pathExists(appDir)) {
      throw new InvalidProjectError('Expo Router requires an "app" directory', projectRoot);
    }
  }

  private static async validateRNProject(projectRoot: string): Promise<void> {
    const requiredFiles = ['package.json', 'metro.config.js'];
    const requiredDirs = ['android', 'ios'];

    for (const file of requiredFiles) {
      if (!await FileOperationsService.pathExists(path.join(projectRoot, file))) {
        // metro.config.js might be .ts
        if (file === 'metro.config.js') {
          if (!await FileOperationsService.pathExists(path.join(projectRoot, 'metro.config.ts'))) {
            throw new InvalidProjectError(`Missing required file: ${file} or metro.config.ts`, projectRoot);
          }
        } else {
          throw new InvalidProjectError(`Missing required file: ${file}`, projectRoot);
        }
      }
    }

    for (const dir of requiredDirs) {
      if (!await FileOperationsService.pathExists(path.join(projectRoot, dir))) {
        throw new InvalidProjectError(`Missing required directory: ${dir}`, projectRoot);
      }
    }
  }

  /**
   * Get recommended aliases for framework
   */
  public static getRecommendedAliases(framework: Framework): ProjectConfig['aliases'] {
    const baseAliases = {
      components: './components',
      lib: './lib',
      styles: './styles',
      utils: './utils'
    };

    switch (framework) {
      case 'expo-router':
        return {
          ...baseAliases,
          components: './components',
          lib: './lib'
        };
      case 'expo':
        return {
          ...baseAliases,
          components: './components',
          lib: './lib'
        };
      case 'react-native':
        return {
          ...baseAliases,
          components: './src/components',
          lib: './src/lib',
          styles: './src/styles',
          utils: './src/utils'
        };
      default:
        return baseAliases;
    }
  }

  /**
   * Get recommended directory structure for framework
   */
  public static getRecommendedStructure(framework: Framework): string[] {
    const baseStructure = [
      'components/ui',
      'lib',
      'styles/themes',
      'utils'
    ];

    switch (framework) {
      case 'expo-router':
        return [
          ...baseStructure,
          'hooks',
          'constants'
        ];
      case 'expo':
        return [
          ...baseStructure,
          'hooks',
          'constants',
          'screens'
        ];
      case 'react-native':
        return [
          'src/components/ui',
          'src/lib',
          'src/styles/themes',
          'src/utils',
          'src/hooks',
          'src/screens',
          'src/navigation'
        ];
      default:
        return baseStructure;
    }
  }

  /**
   * Create default project configuration
   */
  public static createDefaultConfig(projectInfo: ProjectInfo): ProjectConfig {
    return {
      $schema: 'https://leshi-ui.dev/schema.json',
      framework: projectInfo.framework,
      typescript: projectInfo.typescript,
      style: 'default',
      aliases: this.getRecommendedAliases(projectInfo.framework)
    };
  }
}