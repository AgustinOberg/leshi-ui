import { Framework, ComponentInfo, ComponentRegistry } from '../types/index.js';
import { Logger } from '../utils/logger.js';
import { VersionUtils } from '../utils/version.js';

export interface GitHubFile {
  name: string;
  content: string;
  path: string;
}

export class GitHubService {
  private static readonly REPO_OWNER = 'AgustinOberg';
  private static readonly REPO_NAME = 'leshi-ui';
  private static readonly BASE_URL = `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}`;
  
  private static registryCache: ComponentRegistry | null = null;
  private static gitHubRef: string | null = null;

  /**
   * Get the GitHub reference (tag/branch) to use for downloads
   */
  private static async getGitHubRef(): Promise<string> {
    if (this.gitHubRef) {
      return this.gitHubRef;
    }

    this.gitHubRef = await VersionUtils.getGitHubRef();
    return this.gitHubRef;
  }

  /**
   * Get the raw GitHub URL for the current version
   */
  private static async getRawBaseUrl(): Promise<string> {
    const ref = await this.getGitHubRef();
    return `https://raw.githubusercontent.com/${this.REPO_OWNER}/${this.REPO_NAME}/${ref}`;
  }

  /**
   * Fetch the component registry from GitHub
   */
  static async getRegistry(): Promise<ComponentRegistry> {
    if (this.registryCache) {
      return this.registryCache;
    }

    try {
      const rawBaseUrl = await this.getRawBaseUrl();
      const registryUrl = `${rawBaseUrl}/cli/component-registry.json`;
      const response = await fetch(registryUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch registry: ${response.status} ${response.statusText}`);
      }

      const registryData = await response.json() as ComponentRegistry;
      this.registryCache = registryData;
      
      return registryData;
    } catch (error) {
      Logger.error('Failed to load component registry from GitHub');
      throw error;
    }
  }

  /**
   * Download a component file from GitHub
   */
  static async downloadComponent(framework: Framework, componentName: string): Promise<string> {
    try {
      const rawBaseUrl = await this.getRawBaseUrl();
      const componentPath = `packages/${framework}/components/ui/${componentName}.tsx`;
      const fileUrl = `${rawBaseUrl}/${componentPath}`;
      
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download component '${componentName}': ${response.status} ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      Logger.error(`Failed to download component '${componentName}' from GitHub`);
      throw error;
    }
  }

  /**
   * Download a utility file from GitHub
   */
  static async downloadUtility(framework: Framework, utilityPath: string): Promise<string> {
    try {
      const rawBaseUrl = await this.getRawBaseUrl();
      // Extract filename from path (e.g., 'lib/modal-utils.ts' -> 'modal-utils.ts')
      const filename = utilityPath.split('/').pop();
      const fileUrl = `${rawBaseUrl}/packages/${framework}/lib/${filename}`;
      
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download utility '${filename}': ${response.status} ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      Logger.error(`Failed to download utility '${utilityPath}' from GitHub`);
      throw error;
    }
  }

  /**
   * Download a theme file from GitHub
   */
  static async downloadTheme(framework: Framework, themeName: string): Promise<string> {
    try {
      const rawBaseUrl = await this.getRawBaseUrl();
      const themeUrl = `${rawBaseUrl}/packages/${framework}/styles/themes/${themeName}.ts`;
      
      const response = await fetch(themeUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download theme '${themeName}': ${response.status} ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      Logger.error(`Failed to download theme '${themeName}' from GitHub`);
      throw error;
    }
  }

  /**
   * Download multiple files from GitHub (style files, context, etc.)
   */
  static async downloadStyleFiles(framework: Framework): Promise<{ [filename: string]: string }> {
    const files: { [filename: string]: string } = {};
    
    try {
      const rawBaseUrl = await this.getRawBaseUrl();
      // Core style files to download
      const styleFiles = [
        'theme.ts',
        'context.tsx',
        ...(framework === 'rn' ? ['theme.d.ts'] : ['breakpoints.ts'])
      ];

      for (const filename of styleFiles) {
        const fileUrl = `${rawBaseUrl}/packages/${framework}/styles/${filename}`;
        const response = await fetch(fileUrl);
        
        if (response.ok) {
          files[filename] = await response.text();
        }
      }

      return files;
    } catch (error) {
      Logger.error(`Failed to download style files from GitHub`);
      throw error;
    }
  }

  /**
   * Get list of available themes from GitHub
   */
  static async getAvailableThemes(framework: Framework): Promise<string[]> {
    try {
      const ref = await this.getGitHubRef();
      const apiUrl = `${this.BASE_URL}/contents/packages/${framework}/styles/themes?ref=${ref}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch themes: ${response.status} ${response.statusText}`);
      }

      const files = await response.json() as Array<{ name: string; type: string }>;
      
      return files
        .filter(file => file.type === 'file' && file.name.endsWith('.ts') && 
                      file.name !== 'index.ts' && file.name !== 'common.ts')
        .map(file => file.name.replace('.ts', ''));
    } catch (error) {
      Logger.error('Failed to fetch available themes from GitHub');
      throw error;
    }
  }

  /**
   * Check if the GitHub repository is accessible
   */
  static async isRepositoryAccessible(): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}`, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Clear the registry cache (useful for development/testing)
   */
  static clearCache(): void {
    this.registryCache = null;
    this.gitHubRef = null;
  }

  /**
   * Get the current GitHub reference being used (for debugging)
   */
  static async getCurrentRef(): Promise<string> {
    return await this.getGitHubRef();
  }
}