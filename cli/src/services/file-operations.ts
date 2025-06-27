import fs from 'fs-extra';
import path from 'path';
import { FileOperation, OperationResult } from '../schemas/index.js';
import { FileOperationError, CLIError } from '../errors/index.js';

export class FileOperationsService {
  private operations: FileOperation[] = [];
  private backups: Map<string, string> = new Map();

  /**
   * Plan a file operation without executing it
   */
  public planOperation(operation: FileOperation): void {
    this.operations.push(operation);
  }

  /**
   * Execute all planned operations atomically
   * If any operation fails, all changes are rolled back
   */
  public async executeOperations(silent = false): Promise<OperationResult> {
    const executedOperations: FileOperation[] = [];
    
    try {
      // Validate all operations first
      await this.validateOperations();
      
      // Create backups for existing files that will be modified
      await this.createBackups();
      
      // Execute all operations
      for (const operation of this.operations) {
        await this.executeOperation(operation, silent);
        executedOperations.push(operation);
      }
      
      // Clean up backups on success
      await this.cleanupBackups();
      
      return {
        success: true,
        operations: executedOperations
      };
      
    } catch (error) {
      // Rollback all executed operations
      await this.rollbackOperations(executedOperations, silent);
      
      return {
        success: false,
        operations: executedOperations,
        error: error instanceof Error ? error : new Error(String(error))
      };
    } finally {
      // Reset state
      this.operations = [];
      this.backups.clear();
    }
  }

  /**
   * Validate that all planned operations can be executed
   */
  private async validateOperations(): Promise<void> {
    for (const operation of this.operations) {
      // Check if target directory exists or can be created
      const targetDir = path.dirname(operation.target);
      try {
        await fs.ensureDir(targetDir);
      } catch (error) {
        throw new FileOperationError(
          'create directory',
          targetDir,
          error instanceof Error ? error : new Error(String(error))
        );
      }

      // Check if source file exists for copy operations
      if (operation.type === 'copy' && operation.source) {
        if (!await fs.pathExists(operation.source)) {
          throw new FileOperationError('read', operation.source);
        }
      }

      // Check if target file exists and we don't have overwrite permission
      if (await fs.pathExists(operation.target)) {
        // For now, we'll handle overwrite in the CLI layer
        // This validation ensures we know about conflicts ahead of time
      }
    }
  }

  /**
   * Create backups for files that will be overwritten
   */
  private async createBackups(): Promise<void> {
    for (const operation of this.operations) {
      if (await fs.pathExists(operation.target)) {
        const backupPath = `${operation.target}.backup.${Date.now()}`;
        await fs.copy(operation.target, backupPath);
        this.backups.set(operation.target, backupPath);
      }
    }
  }

  /**
   * Execute a single file operation
   */
  private async executeOperation(operation: FileOperation, silent: boolean): Promise<void> {
    try {
      switch (operation.type) {
        case 'copy':
          if (!operation.source) {
            throw new Error('Source path required for copy operation');
          }
          await fs.copy(operation.source, operation.target);
          if (!silent) {
            console.log(`✅ Copied: ${path.basename(operation.target)}`);
          }
          break;

        case 'create':
          await fs.outputFile(operation.target, operation.content);
          if (!silent) {
            console.log(`✅ Created: ${path.basename(operation.target)}`);
          }
          break;

        case 'update':
          await fs.outputFile(operation.target, operation.content);
          if (!silent) {
            console.log(`✅ Updated: ${path.basename(operation.target)}`);
          }
          break;

        default:
          throw new Error(`Unknown operation type: ${operation.type}`);
      }
    } catch (error) {
      throw new FileOperationError(
        operation.type,
        operation.target,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Rollback executed operations using backups
   */
  private async rollbackOperations(executedOperations: FileOperation[], silent: boolean): Promise<void> {
    if (!silent) {
      console.log('🔄 Rolling back changes...');
    }

    for (const operation of executedOperations.reverse()) {
      try {
        const backupPath = this.backups.get(operation.target);
        
        if (backupPath && await fs.pathExists(backupPath)) {
          // Restore from backup
          await fs.copy(backupPath, operation.target);
          if (!silent) {
            console.log(`↩️  Restored: ${path.basename(operation.target)}`);
          }
        } else {
          // Remove newly created file
          if (await fs.pathExists(operation.target)) {
            await fs.remove(operation.target);
            if (!silent) {
              console.log(`🗑️  Removed: ${path.basename(operation.target)}`);
            }
          }
        }
      } catch (error) {
        // Log rollback errors but don't throw (we're already in error state)
        if (!silent) {
          console.error(`⚠️  Failed to rollback ${operation.target}:`, error);
        }
      }
    }

    await this.cleanupBackups();
  }

  /**
   * Clean up backup files
   */
  private async cleanupBackups(): Promise<void> {
    for (const backupPath of this.backups.values()) {
      try {
        if (await fs.pathExists(backupPath)) {
          await fs.remove(backupPath);
        }
      } catch (error) {
        // Silently ignore backup cleanup errors
        console.warn(`Warning: Failed to cleanup backup ${backupPath}`);
      }
    }
  }

  /**
   * Utility method to copy file with content transformation
   */
  public static async copyWithTransform(
    sourcePath: string,
    targetPath: string,
    transform: (content: string) => Promise<string> | string
  ): Promise<void> {
    try {
      const content = await fs.readFile(sourcePath, 'utf8');
      const transformedContent = await transform(content);
      await fs.outputFile(targetPath, transformedContent);
    } catch (error) {
      throw new FileOperationError(
        'copy with transform',
        targetPath,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Utility method to safely read text files
   */
  public static async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      throw new FileOperationError(
        'read file',
        filePath,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Utility method to safely read JSON files
   */
  public static async readJsonFile<T>(filePath: string): Promise<T> {
    try {
      return await fs.readJson(filePath) as T;
    } catch (error) {
      throw new FileOperationError(
        'read JSON',
        filePath,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Utility method to safely write JSON files
   */
  public static async writeJsonFile(filePath: string, data: unknown): Promise<void> {
    try {
      await fs.outputJson(filePath, data, { spaces: 2 });
    } catch (error) {
      throw new FileOperationError(
        'write JSON',
        filePath,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Check if a path exists and is accessible
   */
  public static async pathExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ensure directory exists
   */
  public static async ensureDir(dirPath: string): Promise<void> {
    try {
      await fs.ensureDir(dirPath);
    } catch (error) {
      throw new FileOperationError(
        'create directory',
        dirPath,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
}