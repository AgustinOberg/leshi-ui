import { ComponentRegistry, ComponentInfo } from '../types/index.js';
import { FileUtils } from '../utils/file-utils.js';
import { Logger } from '../utils/logger.js';
import { GitHubService } from './github-service.js';

export class ComponentRegistryService {
  private static registryCache: ComponentRegistry | null = null;

  static async getRegistry(): Promise<ComponentRegistry> {
    if (this.registryCache) {
      return this.registryCache;
    }

    try {
      // For development: Try local file first, then fallback to GitHub
      try {
        const localPath = new URL('../component-registry.json', import.meta.url).pathname;
        const localContent = await FileUtils.readFile(localPath);
        const registryData = JSON.parse(localContent) as ComponentRegistry;
        this.registryCache = registryData;
        return registryData;
      } catch (localError) {
        // Fallback to GitHub
        const registryData = await GitHubService.getRegistry();
        this.registryCache = registryData;
        return registryData;
      }
    } catch (error) {
      Logger.error('Failed to load component registry from GitHub');
      Logger.error('Please check your internet connection and try again.');
      throw error;
    }
  }

  static async getComponent(name: string): Promise<ComponentInfo | null> {
    const registry = await this.getRegistry();
    return registry[name] || null;
  }

  static async getAllComponents(): Promise<ComponentInfo[]> {
    const registry = await this.getRegistry();
    return Object.entries(registry).map(([name, info]) => ({
      ...info,
      name,
    }));
  }

  static async componentExists(name: string): Promise<boolean> {
    const component = await this.getComponent(name);
    return component !== null;
  }

  static async resolveDependencies(componentNames: string[]): Promise<string[]> {
    const registry = await this.getRegistry();
    const resolved = new Set<string>();
    const processing = new Set<string>();

    const resolveDependency = async (name: string): Promise<void> => {
      if (resolved.has(name) || processing.has(name)) {
        return;
      }

      const component = registry[name];
      if (!component) {
        throw new Error(`Component '${name}' not found`);
      }

      processing.add(name);

      // Resolve dependencies first
      for (const dep of component.dependencies) {
        await resolveDependency(dep);
      }

      processing.delete(name);
      resolved.add(name);
    };

    // Resolve all requested components
    for (const name of componentNames) {
      await resolveDependency(name);
    }

    return Array.from(resolved);
  }

  static async getComponentsWithDetails() {
    const registry = await this.getRegistry();
    
    return Object.entries(registry).map(([name, info]) => ({
      name,
      description: this.getComponentDescription(name),
      dependencies: info.dependencies.join(', ') || 'None',
      externalDeps: info.externalDeps.length > 0,
    }));
  }

  private static getComponentDescription(name: string): string {
    const descriptions: Record<string, string> = {
      'button': 'UI component with variants and sizes',
      'text': 'Typography component with semantic variants',
      'modal': 'Flexible modal with animations',
      'dialog': 'Dialog built on modal',
      'alert-dialog': 'Confirmation dialogs',
      'surface': 'Surface with elevation and variants',
      'text-input': 'Input with validation states',
      'text-area': 'Multi-line text input',
      'checkbox': 'Custom styled checkbox',
      'switch': 'Animated switch component',
      'progress': 'Progress bar with animations',
      'skeleton': 'Loading skeleton with animations',
      'avatar': 'Avatar with fallback support',
      'badge': 'Status and label badges',
      'divider': 'Visual separator component',
      'icon': 'Icon component with theming',
      'label': 'Form labels with styling',
      'radio': 'Radio group and items',
      'slot': 'Component composition utility',
      'spinner': 'Loading spinner with animations',
    };

    return descriptions[name] || 'UI component';
  }
}