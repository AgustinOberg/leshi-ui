import { DependencyResolver } from '../services/dependency-resolver.js';
import { ComponentNotFoundError, DependencyResolutionError } from '../errors/index.js';

describe('DependencyResolver', () => {
  let resolver: DependencyResolver;

  beforeEach(() => {
    resolver = new DependencyResolver();
  });

  describe('resolveAllDependencies', () => {
    it('should resolve simple component with no dependencies', async () => {
      const result = await resolver.resolveAllDependencies('text');
      expect(result).toEqual(['text']);
    });

    it('should resolve component with dependencies', async () => {
      const result = await resolver.resolveAllDependencies('button');
      expect(result).toContain('text');
      expect(result).toContain('button');
      expect(result.indexOf('text')).toBeLessThan(result.indexOf('button'));
    });

    it('should resolve complex dependency chain', async () => {
      const result = await resolver.resolveAllDependencies('dialog');
      expect(result).toContain('modal');
      expect(result).toContain('text');
      expect(result).toContain('icon');
      expect(result).toContain('slot');
      expect(result).toContain('dialog');
    });

    it('should throw error for non-existent component', async () => {
      await expect(resolver.resolveAllDependencies('non-existent'))
        .rejects
        .toThrow(ComponentNotFoundError);
    });

    it('should handle multiple components', async () => {
      const button = await resolver.resolveAllDependencies('button');
      const modal = await resolver.resolveAllDependencies('modal');
      
      expect(button).toContain('button');
      expect(modal).toContain('modal');
    });
  });

  describe('getComponent', () => {
    it('should return component metadata', () => {
      const component = resolver.getComponent('button');
      expect(component.name).toBe('button');
      expect(component.type).toBe('registry:ui');
      expect(component.registryDependencies).toContain('text');
    });

    it('should throw error for non-existent component', () => {
      expect(() => resolver.getComponent('non-existent'))
        .toThrow(ComponentNotFoundError);
    });
  });

  describe('getAvailableComponents', () => {
    it('should return all available components', () => {
      const components = resolver.getAvailableComponents();
      expect(components).toContain('button');
      expect(components).toContain('text');
      expect(components).toContain('modal');
      expect(components.length).toBeGreaterThan(10);
    });
  });

  describe('getExternalDependencies', () => {
    it('should get external dependencies for components', () => {
      const deps = resolver.getExternalDependencies(['modal', 'skeleton']);
      expect(deps).toContain('@gorhom/portal');
      expect(deps).toContain('react-native-reanimated');
    });

    it('should deduplicate dependencies', () => {
      const deps = resolver.getExternalDependencies(['modal', 'dialog']);
      expect(deps.filter(dep => dep === '@gorhom/portal')).toHaveLength(1);
    });
  });

  describe('getUtilityFiles', () => {
    it('should get utility files for components', () => {
      const utilities = resolver.getUtilityFiles(['modal']);
      expect(utilities).toContain('lib/modal-utils.ts');
    });
  });

  describe('sortByDependencyOrder', () => {
    it('should sort components in dependency order', async () => {
      const result = await resolver.resolveAllDependencies('dialog');
      
      // Dependencies should come before dependents
      const textIndex = result.indexOf('text');
      const buttonIndex = result.indexOf('button');
      const modalIndex = result.indexOf('modal');
      const dialogIndex = result.indexOf('dialog');
      
      expect(textIndex).toBeLessThan(buttonIndex);
      expect(modalIndex).toBeLessThan(dialogIndex);
    });
  });
});