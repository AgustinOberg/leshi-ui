import * as fs from 'fs/promises';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { Logger } from './logger.js';

export class FileUtils {
  static async exists(filePath: string): Promise<boolean> {
    return fsExtra.pathExists(filePath);
  }

  static async ensureDir(dirPath: string): Promise<void> {
    await fsExtra.ensureDir(dirPath);
  }

  static async copy(src: string, dest: string, overwrite = false): Promise<void> {
    if (!overwrite && await this.exists(dest)) {
      throw new Error(`File already exists: ${dest}`);
    }
    
    await this.ensureDir(path.dirname(dest));
    await fsExtra.copy(src, dest, { overwrite });
  }

  static async readFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
  }

  static async writeFile(filePath: string, content: string): Promise<void> {
    await this.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
  }

  static async readJson<T>(filePath: string): Promise<T> {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }

  static async writeJson(filePath: string, data: unknown, options?: { spaces?: number }): Promise<void> {
    await this.ensureDir(path.dirname(filePath));
    const spaces = options?.spaces ?? 2;
    await fs.writeFile(filePath, JSON.stringify(data, null, spaces), 'utf-8');
  }

  static async isDirectory(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  static async listFiles(dirPath: string): Promise<string[]> {
    try {
      return await fs.readdir(dirPath);
    } catch {
      return [];
    }
  }

  static getRelativePath(from: string, to: string): string {
    return path.relative(from, to);
  }

  static join(...paths: string[]): string {
    return path.join(...paths);
  }

  static dirname(filePath: string): string {
    return path.dirname(filePath);
  }

  static basename(filePath: string, ext?: string): string {
    return path.basename(filePath, ext);
  }

  static resolve(...paths: string[]): string {
    return path.resolve(...paths);
  }

  static relative(from: string, to: string): string {
    return path.relative(from, to);
  }
}