import { Framework, LeshiConfig, AliasConfig } from '../types/index.js';
import { FileUtils } from '../utils/file-utils.js';
import { Logger } from '../utils/logger.js';

export class ConfigService {
  private static readonly CONFIG_FILE = 'leshi-ui.json';
  private static readonly SCHEMA_URL = 'https://leshi-ui.com/schema.json';

  static getConfigPath(cwd: string): string {
    return FileUtils.join(cwd, this.CONFIG_FILE);
  }

  static async configExists(cwd: string): Promise<boolean> {
    const configPath = this.getConfigPath(cwd);
    return FileUtils.exists(configPath);
  }

  static async readConfig(cwd: string): Promise<LeshiConfig | null> {
    const configPath = this.getConfigPath(cwd);
    
    if (!(await FileUtils.exists(configPath))) {
      return null;
    }

    try {
      return await FileUtils.readJson<LeshiConfig>(configPath);
    } catch (error) {
      Logger.error(`Failed to read config file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  static async writeConfig(cwd: string, config: LeshiConfig): Promise<void> {
    const configPath = this.getConfigPath(cwd);
    
    const configWithSchema = {
      $schema: this.SCHEMA_URL,
      ...config,
    };

    try {
      await FileUtils.writeJson(configPath, configWithSchema, { spaces: 2 });
    } catch (error) {
      throw new Error(`Failed to write config file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static getDefaultAliases(): AliasConfig {
    return {
      utils: '@/lib/utils',
      components: '@/components',
      lib: '@/lib',
      styles: '@/styles',
      ui: '@/components/ui',
    };
  }

  static getDefaultConfig(framework: Framework, aliases?: AliasConfig, tsx = true): LeshiConfig {
    const defaultAliases = aliases || this.getDefaultAliases();
    
    return {
      framework,
      aliases: defaultAliases,
      tsx,
      dirs: {
        components: 'components',
        lib: 'lib',
        styles: 'styles',
        ui: 'components/ui',
      },
    };
  }

  static resolveAlias(alias: string, config: LeshiConfig): string {
    // Handle @ prefix aliases
    if (alias.startsWith('@/')) {
      return alias.replace('@/', './');
    }
    
    // Handle ~ prefix aliases  
    if (alias.startsWith('~/')) {
      return alias.replace('~/', './');
    }
    
    // Handle configured aliases
    if (alias === config.aliases.utils) return config.aliases.utils;
    if (alias === config.aliases.components) return config.aliases.components;
    if (alias === config.aliases.lib) return config.aliases.lib;
    if (alias === config.aliases.styles) return config.aliases.styles;
    if (alias === config.aliases.ui) return config.aliases.ui;
    
    return alias;
  }

  static getRelativeImportPath(alias: string, config: LeshiConfig, fromPath: string): string {
    const aliasMap: Record<string, string> = {
      [config.aliases.utils]: config.dirs.lib,
      [config.aliases.components]: config.dirs.components,
      [config.aliases.lib]: config.dirs.lib,
      [config.aliases.styles]: config.dirs.styles,
      [config.aliases.ui]: config.dirs.ui,
    };

    // Find matching alias
    const matchingAlias = Object.keys(aliasMap).find(key => alias.startsWith(key));
    if (!matchingAlias) {
      return alias;
    }

    // Replace alias with relative path
    const targetDir = aliasMap[matchingAlias];
    const remainingPath = alias.replace(matchingAlias, '');
    const targetPath = targetDir + remainingPath;

    // Calculate relative path from fromPath to targetPath
    const fromDir = FileUtils.dirname(fromPath);
    const relativePath = FileUtils.relative(fromDir, targetPath);
    
    return relativePath.startsWith('../') ? relativePath : `./${relativePath}`;
  }

  static generateTypeScriptPaths(config: LeshiConfig): Record<string, string[]> {
    const paths: Record<string, string[]> = {};
    
    Object.entries(config.aliases).forEach(([key, alias]) => {
      if (alias.startsWith('@/')) {
        const path = alias.replace('@/', './');
        paths[`${alias}/*`] = [`${path}/*`];
        paths[alias] = [path];
      } else if (alias.startsWith('~/')) {
        const path = alias.replace('~/', './');
        paths[`${alias}/*`] = [`${path}/*`];
        paths[alias] = [path];
      }
    });

    return paths;
  }

  static async updateTSConfig(cwd: string, config: LeshiConfig): Promise<void> {
    const tsConfigPath = FileUtils.join(cwd, 'tsconfig.json');
    const jsConfigPath = FileUtils.join(cwd, 'jsconfig.json');
    
    const configPath = (await FileUtils.exists(tsConfigPath)) ? tsConfigPath : 
                     (await FileUtils.exists(jsConfigPath)) ? jsConfigPath : null;

    if (!configPath) {
      Logger.warning('No tsconfig.json or jsconfig.json found. TypeScript path mapping will not be configured.');
      return;
    }

    try {
      const tsConfig = await FileUtils.readJson<any>(configPath);
      
      if (!tsConfig.compilerOptions) {
        tsConfig.compilerOptions = {};
      }

      // Set baseUrl if not already set
      if (!tsConfig.compilerOptions.baseUrl) {
        tsConfig.compilerOptions.baseUrl = '.';
      }

      // Generate and merge paths
      const newPaths = this.generateTypeScriptPaths(config);
      tsConfig.compilerOptions.paths = {
        ...tsConfig.compilerOptions.paths,
        ...newPaths,
      };

      await FileUtils.writeJson(configPath, tsConfig, { spaces: 2 });
      Logger.success(`Updated ${FileUtils.basename(configPath)} with path mappings`);
    } catch (error) {
      Logger.warning(`Failed to update TypeScript config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}