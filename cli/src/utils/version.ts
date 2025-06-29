import { FileUtils } from './file-utils.js';

export class VersionUtils {
  private static version: string | null = null;

  /**
   * Get the current CLI version from package.json
   */
  static async getCliVersion(): Promise<string> {
    if (this.version) {
      return this.version;
    }

    try {
      // Get the CLI package directory - need to go up from dist/ to the actual CLI root
      const cliDir = FileUtils.dirname(FileUtils.dirname(new URL(import.meta.url).pathname));
      
      // First try current directory (dist/), then parent directory (actual CLI root)
      let packageJsonPath = FileUtils.join(cliDir, 'package.json');
      
      if (!(await FileUtils.exists(packageJsonPath))) {
        // Try parent directory (when running from dist, we need to go up one level)
        packageJsonPath = FileUtils.join(FileUtils.dirname(cliDir), 'package.json');
      }
      
      if (await FileUtils.exists(packageJsonPath)) {
        const packageJson = await FileUtils.readJson<{ version: string }>(packageJsonPath);
        this.version = packageJson.version;
        return this.version;
      }
    } catch (error) {
      // Fallback to a default version if we can't read package.json
      // Silent fallback for production use
    }

    // Fallback version
    this.version = '0.0.15';
    return this.version;
  }

  /**
   * Convert CLI version to GitHub tag format
   * Examples:
   * - "0.0.15" → "v0.0.15"
   * - "1.0.0-beta.1" → "v1.0.0-beta.1"
   */
  static versionToTag(version: string): string {
    return version.startsWith('v') ? version : `v${version}`;
  }

  /**
   * Get the GitHub reference (tag or branch) to use for downloads
   * Returns tag if version is stable, falls back to main for development
   */
  static async getGitHubRef(): Promise<string> {
    const version = await this.getCliVersion();
    
    // For development versions or if we can't determine version, use main
    if (version.includes('dev') || version.includes('local')) {
      return 'main';
    }
    
    // For released versions, use the corresponding tag
    return this.versionToTag(version);
  }

  /**
   * Check if a version is a pre-release (contains alpha, beta, rc, etc.)
   */
  static isPreRelease(version: string): boolean {
    return /-(alpha|beta|rc|dev|pre)/.test(version);
  }

  /**
   * Clear version cache (useful for testing)
   */
  static clearCache(): void {
    this.version = null;
  }
}