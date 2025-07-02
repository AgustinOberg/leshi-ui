import { LeshiConfig } from '../types/index.js';
import { ConfigService } from './config-service.js';
import { FileUtils } from '../utils/file-utils.js';
import { Logger } from '../utils/logger.js';

export class ImportTransformer {
  /**
   * Extract quote character from import statement
   */
  private static getQuoteChar(match: string): string {
    if (match.includes('"')) return '"';
    if (match.includes('`')) return '`';
    return "'";
  }

  /**
   * Transform imports in a file to use the configured aliases
   */
  static async transformImports(
    sourceCode: string,
    targetFilePath: string,
    config: LeshiConfig
  ): Promise<string> {
    try {
      let transformedCode = sourceCode;

      // Transform common patterns to aliases first
      // NOTE: Order matters! More specific patterns first
      
      // Transform style imports: ../styles/* -> @/styles/* (from lib directory)
      // This handles all ../styles/ imports including theme
      transformedCode = transformedCode.replace(
        /from\s+(['"`])\.\.\/styles\/([^'"]+)\1/g,
        (match, quote, path) => `from ${quote}${config.aliases.styles}/${path}${quote}`
      );

      // Transform theme imports: ../../styles/theme -> @/styles/theme (from nested directories)
      transformedCode = transformedCode.replace(
        /from\s+(['"`])\.\.\/\.\.\/styles\/theme\1/g,
        (match, quote) => `from ${quote}${config.aliases.styles}/theme${quote}`
      );

      // Transform style imports: ../../styles/* -> @/styles/* (from nested directories)
      transformedCode = transformedCode.replace(
        /from\s+(['"`])\.\.\/\.\.\/styles\/([^'"]+)\1/g,
        (match, quote, path) => `from ${quote}${config.aliases.styles}/${path}${quote}`
      );

      // Transform utility imports: ../lib/* -> @/lib/*
      transformedCode = transformedCode.replace(
        /from\s+(['"`])\.\.\/lib\/([^'"]+)\1/g,
        (match, quote, path) => `from ${quote}${config.aliases.lib}/${path}${quote}`
      );

      // Transform utility imports: ../../lib/* -> @/lib/* (from nested directories)
      transformedCode = transformedCode.replace(
        /from\s+(['"`])\.\.\/\.\.\/lib\/([^'"]+)\1/g,
        (match, quote, path) => `from ${quote}${config.aliases.lib}/${path}${quote}`
      );

      // Transform component imports: ../components/* -> @/components/*
      transformedCode = transformedCode.replace(
        /from\s+(['"`])\.\.\/components\/([^'"]+)\1/g,
        (match, quote, path) => `from ${quote}${config.aliases.components}/${path}${quote}`
      );

      // Generic regex-based transformation for any remaining patterns
      // Skip this for alias-based systems - we want to keep aliases, not convert them back
      // const importRegex = /from\s+['"`]([^'"`]+)['"`]/g;
      // 
      // transformedCode = transformedCode.replace(importRegex, (match, importPath) => {
      //   const transformedPath = ImportTransformer.transformImportPath(importPath, targetFilePath, config);
      //   return match.replace(importPath, transformedPath);
      // });

      // Skip require and dynamic import transformations for alias-based systems
      // We want to keep aliases, not convert them to relative paths
      // 
      // // Regex to match require statements: require('path')
      // const requireRegex = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
      // 
      // transformedCode = transformedCode.replace(requireRegex, (match, importPath) => {
      //   const transformedPath = ImportTransformer.transformImportPath(importPath, targetFilePath, config);
      //   return match.replace(importPath, transformedPath);
      // });

      // // Regex to match dynamic imports: import('path')
      // const dynamicImportRegex = /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
      // 
      // transformedCode = transformedCode.replace(dynamicImportRegex, (match, importPath) => {
      //   const transformedPath = ImportTransformer.transformImportPath(importPath, targetFilePath, config);
      //   return match.replace(importPath, transformedPath);
      // });

      return transformedCode;
    } catch (error) {
      Logger.warning(`Failed to transform imports: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return sourceCode; // Return original code if transformation fails
    }
  }

  /**
   * Transform a single import path
   */
  private static transformImportPath(
    importPath: string,
    targetFilePath: string,
    config: LeshiConfig
  ): string {
    // Skip relative imports that are already correct
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      return importPath;
    }

    // Skip external modules (node_modules)
    if (!importPath.startsWith('@/') && !importPath.startsWith('~/') && !this.isConfiguredAlias(importPath, config)) {
      return importPath;
    }

    // Transform alias to relative path
    return this.aliasToRelativePath(importPath, targetFilePath, config);
  }

  /**
   * Check if the import path matches any configured alias
   */
  private static isConfiguredAlias(importPath: string, config: LeshiConfig): boolean {
    const aliases = Object.values(config.aliases);
    return aliases.some(alias => importPath === alias || importPath.startsWith(`${alias}/`));
  }

  /**
   * Convert alias import to relative path
   */
  private static aliasToRelativePath(
    aliasPath: string,
    targetFilePath: string,
    config: LeshiConfig
  ): string {
    // Handle @/ prefix
    if (aliasPath.startsWith('@/')) {
      const relativePath = aliasPath.replace('@/', './');
      return this.calculateRelativePath(relativePath, targetFilePath);
    }

    // Handle ~/ prefix  
    if (aliasPath.startsWith('~/')) {
      const relativePath = aliasPath.replace('~/', './');
      return this.calculateRelativePath(relativePath, targetFilePath);
    }

    // Handle configured aliases
    for (const [key, alias] of Object.entries(config.aliases)) {
      if (aliasPath === alias || aliasPath.startsWith(`${alias}/`)) {
        const remainder = aliasPath.replace(alias, '');
        const targetDir = config.dirs[key as keyof typeof config.dirs] || config.dirs.components;
        const fullPath = `${targetDir}${remainder}`;
        return this.calculateRelativePath(fullPath, targetFilePath);
      }
    }

    return aliasPath;
  }

  /**
   * Calculate relative path from target file to the import
   */
  private static calculateRelativePath(targetPath: string, fromFilePath: string): string {
    const fromDir = FileUtils.dirname(fromFilePath);
    let relativePath = FileUtils.relative(fromDir, targetPath);
    
    // Ensure relative path starts with ./ or ../
    if (!relativePath.startsWith('../') && !relativePath.startsWith('./')) {
      relativePath = `./${relativePath}`;
    }

    return relativePath;
  }

  /**
   * Transform imports in component templates during installation
   */
  static async transformComponentImports(
    sourceCode: string,
    componentName: string,
    targetComponentPath: string,
    config: LeshiConfig
  ): Promise<string> {
    // Apply specific component transformations and keep aliases (don't convert to relative)
    let transformedCode = sourceCode;

    // Transform theme imports: ../../styles/theme -> @/styles/theme
    transformedCode = transformedCode.replace(
      /from\s+(['"`])\.\.\/\.\.\/styles\/theme\1/g,
      (match, quote) => `from ${quote}${config.aliases.styles}/theme${quote}`
    );

    // Transform theme type imports: ../../styles/theme -> @/styles/theme  
    transformedCode = transformedCode.replace(
      /from\s+(['"`])\.\.\/\.\.\/styles\/([^'"]+)\1/g,
      (match, quote, path) => `from ${quote}${config.aliases.styles}/${path}${quote}`
    );

    // Transform component imports: ./text -> @/components/ui/text
    transformedCode = transformedCode.replace(
      /from\s+(['"`])\.\/([^'"]+)\1/g,
      (match, quote, componentPath) => `from ${quote}${config.aliases.ui}/${componentPath}${quote}`
    );

    // Transform utility imports: ../../lib/utils -> @/lib/utils
    transformedCode = transformedCode.replace(
      /from\s+(['"`])\.\.\/\.\.\/lib\/([^'"]+)\1/g,
      (match, quote, utilPath) => `from ${quote}${config.aliases.lib}/${utilPath}${quote}`
    );

    // Return the transformed code with aliases intact
    return transformedCode;
  }
}