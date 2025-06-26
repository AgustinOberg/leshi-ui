import { transform } from '@babel/core';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import path from 'path';
import { CLIError } from '../errors/index.js';
import { ProjectConfig } from '../schemas/index.js';

export interface TransformOptions {
  sourcePath: string;
  targetPath: string;
  projectConfig: ProjectConfig;
  packageType: 'rn' | 'unistyles';
}

export class ImportTransformer {
  /**
   * Transform imports in a file to match the target project structure
   */
  public static async transformImports(
    content: string,
    options: TransformOptions
  ): Promise<string> {
    try {
      // Parse the file content
      const ast = parse(content, {
        sourceType: 'module',
        plugins: [
          'typescript',
          'jsx',
          'decorators-legacy',
          'classProperties',
          'objectRestSpread',
          'asyncGenerators',
          'functionBind',
          'exportDefaultFrom',
          'exportNamespaceFrom',
          'dynamicImport'
        ]
      });

      // Transform imports
      traverse(ast, {
        ImportDeclaration(nodePath) {
          const importPath = nodePath.node.source.value;
          const transformedPath = ImportTransformer.transformImportPath(
            importPath,
            options
          );
          
          if (transformedPath !== importPath) {
            nodePath.node.source.value = transformedPath;
          }
        },
        
        // Handle dynamic imports
        CallExpression(nodePath) {
          if (
            t.isImport(nodePath.node.callee) &&
            nodePath.node.arguments.length === 1 &&
            t.isStringLiteral(nodePath.node.arguments[0])
          ) {
            const importPath = nodePath.node.arguments[0].value;
            const transformedPath = ImportTransformer.transformImportPath(
              importPath,
              options
            );
            
            if (transformedPath !== importPath) {
              nodePath.node.arguments[0] = t.stringLiteral(transformedPath);
            }
          }
        }
      });

      // Generate the transformed code
      const result = generate(ast, {
        retainLines: true,
        compact: false
      });

      return result.code;
    } catch (error) {
      throw new CLIError(
        'IMPORT_TRANSFORMATION_FAILED',
        `Failed to transform imports in ${options.sourcePath}`,
        { originalError: error, options }
      );
    }
  }

  /**
   * Transform a single import path
   */
  private static transformImportPath(
    importPath: string,
    options: TransformOptions
  ): string {
    // Don't transform absolute imports or node_modules
    if (importPath.startsWith('/') || !importPath.startsWith('.')) {
      return importPath;
    }

    // Handle specific package imports
    if (options.packageType === 'unistyles') {
      // Transform React Native StyleSheet to Unistyles
      if (importPath.includes('react-native') && 
          importPath.includes('StyleSheet')) {
        return importPath.replace(
          'react-native',
          'react-native-unistyles'
        );
      }
    }

    // Transform relative paths to use project aliases
    const transformedPath = ImportTransformer.transformRelativePath(
      importPath,
      options
    );

    return transformedPath;
  }

  /**
   * Transform relative paths based on project structure
   */
  private static transformRelativePath(
    importPath: string,
    options: TransformOptions
  ): string {
    const { sourcePath, targetPath, projectConfig } = options;
    
    // Calculate the relative path from source to target
    const sourceDir = path.dirname(sourcePath);
    const targetDir = path.dirname(targetPath);
    
    // Resolve the absolute path that the import is trying to reach
    const absoluteImportPath = path.resolve(sourceDir, importPath);
    
    // Calculate the new relative path from target to the import
    let newRelativePath = path.relative(targetDir, absoluteImportPath);
    
    // Ensure the path starts with './' or '../'
    if (!newRelativePath.startsWith('.')) {
      newRelativePath = './' + newRelativePath;
    }
    
    // Normalize path separators for cross-platform compatibility
    newRelativePath = newRelativePath.replace(/\\/g, '/');

    // Handle common patterns
    if (importPath.includes('../../styles/')) {
      // Transform styles imports based on project structure
      const stylesAlias = projectConfig.aliases.styles;
      if (stylesAlias.startsWith('./')) {
        const relativePath = path.relative(
          targetDir,
          path.resolve(stylesAlias.slice(2))
        );
        return newRelativePath.replace(
          /\.\.\/\.\.\//g,
          relativePath.endsWith('/') ? relativePath : relativePath + '/'
        );
      }
    }

    if (importPath.includes('../../lib/')) {
      // Transform lib imports
      const libAlias = projectConfig.aliases.lib;
      if (libAlias.startsWith('./')) {
        const relativePath = path.relative(
          targetDir,
          path.resolve(libAlias.slice(2))
        );
        return newRelativePath.replace(
          /\.\.\/\.\.\//g,
          relativePath.endsWith('/') ? relativePath : relativePath + '/'
        );
      }
    }

    return newRelativePath;
  }

  /**
   * Add platform-specific imports and modifications
   */
  public static async addPlatformSpecificCode(
    content: string,
    platform: 'ios' | 'android' | 'web',
    packageType: 'rn' | 'unistyles'
  ): Promise<string> {
    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx']
      });

      // Add platform-specific imports at the top
      const platformImports = ImportTransformer.getPlatformImports(platform, packageType);
      
      if (platformImports.length > 0) {
        // Add imports at the beginning
        for (const importDecl of platformImports.reverse()) {
          ast.body.unshift(importDecl);
        }
      }

      // Transform platform-specific code
      traverse(ast, {
        // Add Platform.OS checks where needed
        JSXElement(nodePath) {
          if (platform === 'web') {
            // Add web-specific modifications
            ImportTransformer.addWebSpecificProps(nodePath);
          }
        }
      });

      const result = generate(ast, {
        retainLines: true,
        compact: false
      });

      return result.code;
    } catch (error) {
      throw new CLIError(
        'IMPORT_TRANSFORMATION_FAILED',
        `Failed to add platform-specific code for ${platform}`,
        { originalError: error, platform, packageType }
      );
    }
  }

  /**
   * Get platform-specific imports
   */
  private static getPlatformImports(
    platform: 'ios' | 'android' | 'web',
    packageType: 'rn' | 'unistyles'
  ): t.ImportDeclaration[] {
    const imports: t.ImportDeclaration[] = [];

    if (platform === 'web') {
      // Add web-specific imports
      if (packageType === 'rn') {
        imports.push(
          t.importDeclaration(
            [t.importSpecifier(t.identifier('Platform'), t.identifier('Platform'))],
            t.stringLiteral('react-native')
          )
        );
      }
    }

    return imports;
  }

  /**
   * Add web-specific properties to JSX elements
   */
  private static addWebSpecificProps(nodePath: any): void {
    // This is a placeholder for web-specific transformations
    // In a real implementation, you might add accessibility props,
    // style transformations, etc.
  }

  /**
   * Transform theme imports for different package types
   */
  public static transformThemeImports(
    content: string,
    packageType: 'rn' | 'unistyles'
  ): string {
    if (packageType === 'unistyles') {
      // Transform useTheme imports for Unistyles
      content = content.replace(
        /from ['"](\.\.\/)*styles\/theme['"]/g,
        'from "$1styles/context"'
      );
      
      // Transform theme context imports
      content = content.replace(
        /from ['"](\.\.\/)*styles\/theme\.context['"]/g,
        'from "$1styles/context"'
      );
    }

    return content;
  }

  /**
   * Validate transformed content
   */
  public static async validateTransformedContent(
    content: string,
    options: TransformOptions
  ): Promise<boolean> {
    try {
      // Try to parse the transformed content to ensure it's valid
      parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx']
      });
      
      return true;
    } catch (error) {
      console.warn(`Warning: Transformed content may have syntax errors in ${options.targetPath}`, error);
      return false;
    }
  }
}