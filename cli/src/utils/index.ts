import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the packages directory relative to the CLI
 */
export function getPackagesDirectory(): string {
  // Assume CLI is installed in the same monorepo
  return path.resolve(__dirname, '../../../packages');
}

/**
 * Format component name for display
 */
export function formatComponentName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Check if string is a valid component name
 */
export function isValidComponentName(name: string): boolean {
  return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name);
}

/**
 * Get relative path between two absolute paths
 */
export function getRelativePath(from: string, to: string): string {
  const relativePath = path.relative(from, to);
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

/**
 * Normalize path for cross-platform compatibility
 */
export function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

/**
 * Create a debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}