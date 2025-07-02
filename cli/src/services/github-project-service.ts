import { Framework, ProjectConfig, LeshiConfig } from '../types/index.js';
import { FileUtils } from '../utils/file-utils.js';
import { GitHubService } from './github-service.js';
import { ImportTransformer } from './import-transformer.js';
import { Logger } from '../utils/logger.js';

export class GitHubProjectService {
  static async getProjectConfig(cwd: string): Promise<ProjectConfig> {
    return {
      framework: 'rn', // Default framework
      componentsDir: FileUtils.join(cwd, 'components', 'ui'),
      stylesDir: FileUtils.join(cwd, 'styles'),
      libDir: FileUtils.join(cwd, 'lib'),
    };
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

  /**
   * Download and save a component from GitHub
   */
  static async downloadComponent(
    framework: Framework, 
    componentName: string, 
    targetPath: string, 
    overwrite: boolean = false
  ): Promise<boolean> {
    try {
      // Check if file exists and handle overwrite
      if (await FileUtils.exists(targetPath) && !overwrite) {
        Logger.warning(`Component '${componentName}' already exists. Use --overwrite to replace it.`);
        return false;
      }

      // Download component content from GitHub
      const componentContent = await GitHubService.downloadComponent(framework, componentName);
      
      // Ensure directory exists
      await FileUtils.ensureDir(FileUtils.dirname(targetPath));
      
      // Write component file
      await FileUtils.writeFile(targetPath, componentContent);
      
      return true;
    } catch (error) {
      Logger.error(`Failed to download component '${componentName}': ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Download and save a component from GitHub with import transformation
   */
  static async downloadComponentWithAliases(
    framework: Framework, 
    componentName: string, 
    targetPath: string, 
    config: LeshiConfig,
    overwrite: boolean = false
  ): Promise<boolean> {
    try {
      // Check if file exists and handle overwrite
      if (await FileUtils.exists(targetPath) && !overwrite) {
        Logger.warning(`Component '${componentName}' already exists. Use --overwrite to replace it.`);
        return false;
      }

      // Download component content from GitHub
      let componentContent = await GitHubService.downloadComponent(framework, componentName);
      
      // Transform imports to use configured aliases
      componentContent = await ImportTransformer.transformComponentImports(
        componentContent,
        componentName,
        targetPath,
        config
      );
      
      // Ensure directory exists
      await FileUtils.ensureDir(FileUtils.dirname(targetPath));
      
      // Write component file
      await FileUtils.writeFile(targetPath, componentContent);
      
      return true;
    } catch (error) {
      Logger.error(`Failed to download component '${componentName}': ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Download and save a utility file from GitHub
   */
  static async downloadUtility(
    framework: Framework, 
    utilityPath: string, 
    targetPath: string, 
    overwrite: boolean = false
  ): Promise<boolean> {
    try {
      // Check if file exists and handle overwrite
      if (await FileUtils.exists(targetPath) && !overwrite) {
        return false;
      }

      // Download utility content from GitHub
      const utilityContent = await GitHubService.downloadUtility(framework, utilityPath);
      
      // Ensure directory exists
      await FileUtils.ensureDir(FileUtils.dirname(targetPath));
      
      // Write utility file
      await FileUtils.writeFile(targetPath, utilityContent);
      
      return true;
    } catch (error) {
      Logger.error(`Failed to download utility '${utilityPath}': ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Download and save a utility file from GitHub with import transformation
   */
  static async downloadUtilityWithAliases(
    framework: Framework, 
    utilityPath: string, 
    targetPath: string, 
    config: LeshiConfig,
    overwrite: boolean = false
  ): Promise<boolean> {
    try {
      // Check if file exists and handle overwrite
      if (await FileUtils.exists(targetPath) && !overwrite) {
        return false;
      }

      // Download utility content from GitHub
      let utilityContent = await GitHubService.downloadUtility(framework, utilityPath);
      
      // Transform imports to use configured aliases
      utilityContent = await ImportTransformer.transformImports(
        utilityContent,
        targetPath,
        config
      );
      
      // Ensure directory exists
      await FileUtils.ensureDir(FileUtils.dirname(targetPath));
      
      // Write utility file
      await FileUtils.writeFile(targetPath, utilityContent);
      
      return true;
    } catch (error) {
      Logger.error(`Failed to download utility '${utilityPath}': ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Download and save a theme from GitHub
   */
  static async downloadTheme(
    framework: Framework, 
    themeName: string, 
    targetPath: string, 
    overwrite: boolean = false
  ): Promise<boolean> {
    try {
      // Check if file exists and handle overwrite
      if (await FileUtils.exists(targetPath) && !overwrite) {
        Logger.warning(`Theme '${themeName}' already exists. Use --overwrite to replace it.`);
        return false;
      }

      // Download theme content from GitHub
      const themeContent = await GitHubService.downloadTheme(framework, themeName);
      
      // Ensure directory exists
      await FileUtils.ensureDir(FileUtils.dirname(targetPath));
      
      // Write theme file
      await FileUtils.writeFile(targetPath, themeContent);
      
      return true;
    } catch (error) {
      Logger.error(`Failed to download theme '${themeName}': ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Download core style files for project initialization
   */
  static async downloadStyleFiles(
    framework: Framework, 
    stylesDir: string, 
    overwrite: boolean = false
  ): Promise<{ success: boolean; files: string[] }> {
    const downloadedFiles: string[] = [];
    
    try {
      const styleFiles = await GitHubService.downloadStyleFiles(framework);
      
      for (const [filename, content] of Object.entries(styleFiles)) {
        const targetPath = FileUtils.join(stylesDir, filename);
        
        // Check if file exists and handle overwrite
        if (await FileUtils.exists(targetPath) && !overwrite) {
          continue;
        }

        // Ensure directory exists
        await FileUtils.ensureDir(FileUtils.dirname(targetPath));
        
        // Write file
        await FileUtils.writeFile(targetPath, content);
        downloadedFiles.push(filename);
      }

      return { success: true, files: downloadedFiles };
    } catch (error) {
      Logger.error(`Failed to download style files: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, files: downloadedFiles };
    }
  }

  /**
   * Get available themes from GitHub
   */
  static async getAvailableThemes(framework: Framework): Promise<string[]> {
    try {
      return await GitHubService.getAvailableThemes(framework);
    } catch (error) {
      Logger.error('Failed to fetch available themes from GitHub');
      return [];
    }
  }

  /**
   * Check if GitHub repository is accessible
   */
  static async checkGitHubConnection(): Promise<boolean> {
    return await GitHubService.isRepositoryAccessible();
  }
}