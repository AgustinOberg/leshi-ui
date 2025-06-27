import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { vol } from 'memfs';

// Mock fs module to use memfs
jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

describe('Memory Filesystem Integration Tests', () => {
  beforeEach(() => {
    vol.reset();
  });

  afterEach(() => {
    vol.reset();
  });

  describe('Basic Filesystem Operations', () => {
    it('should create and read files in memory', async () => {
      const fs = require('memfs').fs;

      // Create file structure in memory
      vol.fromJSON({
        '/test/file.txt': 'Hello World',
        '/project/package.json': JSON.stringify({ name: 'test-app' })
      });

      // Test synchronous read
      const content = fs.readFileSync('/test/file.txt', 'utf8');
      expect(content).toBe('Hello World');

      // Test JSON parsing
      const pkg = JSON.parse(fs.readFileSync('/project/package.json', 'utf8'));
      expect(pkg.name).toBe('test-app');
    });

    it('should write files to memory filesystem', () => {
      const fs = require('memfs').fs;

      // Write file
      fs.writeFileSync('/output.txt', 'Test content');

      // Verify it exists and read it back
      const exists = fs.existsSync('/output.txt');
      expect(exists).toBe(true);

      const content = fs.readFileSync('/output.txt', 'utf8');
      expect(content).toBe('Test content');
    });

    it('should create directories in memory', () => {
      const fs = require('memfs').fs;

      // Create directory structure
      fs.mkdirSync('/deep/nested/path', { recursive: true });

      // Verify directory exists
      const exists = fs.existsSync('/deep/nested/path');
      expect(exists).toBe(true);

      // Verify it's a directory
      const stats = fs.statSync('/deep/nested/path');
      expect(stats.isDirectory()).toBe(true);
    });

    it('should list directory contents', () => {
      const fs = require('memfs').fs;

      // Create file structure
      vol.fromJSON({
        '/components/button.tsx': 'export const Button = () => {};',
        '/components/text.tsx': 'export const Text = () => {};',
        '/components/modal.tsx': 'export const Modal = () => {};'
      });

      // List components directory
      const files = fs.readdirSync('/components');
      expect(files).toContain('button.tsx');
      expect(files).toContain('text.tsx');
      expect(files).toContain('modal.tsx');
      expect(files).toHaveLength(3);
    });
  });

  describe('CLI Project Structure Simulation', () => {
    it('should simulate leshi-ui project initialization', () => {
      const fs = require('memfs').fs;

      // Create project directory
      fs.mkdirSync('/my-project', { recursive: true });

      // Create basic project structure
      const projectDirs = [
        '/my-project/components/ui',
        '/my-project/styles/themes',
        '/my-project/lib'
      ];

      projectDirs.forEach(dir => {
        fs.mkdirSync(dir, { recursive: true });
      });

      // Create leshi-ui config
      const config = {
        framework: 'rn',
        componentsDir: './components/ui',
        stylesDir: './styles',
        libDir: './lib',
        typescript: true
      };

      fs.writeFileSync('/my-project/leshi-ui.json', JSON.stringify(config, null, 2));

      // Verify structure
      expect(fs.existsSync('/my-project/components/ui')).toBe(true);
      expect(fs.existsSync('/my-project/styles/themes')).toBe(true);
      expect(fs.existsSync('/my-project/lib')).toBe(true);
      expect(fs.existsSync('/my-project/leshi-ui.json')).toBe(true);

      // Verify config content
      const configContent = fs.readFileSync('/my-project/leshi-ui.json', 'utf8');
      const parsedConfig = JSON.parse(configContent);
      expect(parsedConfig.framework).toBe('rn');
      expect(parsedConfig.typescript).toBe(true);
    });

    it('should simulate component installation with dependencies', () => {
      const fs = require('memfs').fs;

      // Setup CLI source components
      vol.fromJSON({
        '/cli/dist/packages/rn/components/text.tsx': `
import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

export const Text = ({ children, ...props }) => {
  return <RNText style={styles.text} {...props}>{children}</RNText>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#000'
  }
});
        `,
        '/cli/dist/packages/rn/components/button.tsx': `
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './text';

export const Button = ({ text, onPress, ...props }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} {...props}>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8
  }
});
        `
      });

      // Setup project structure
      fs.mkdirSync('/project/components/ui', { recursive: true });

      // Simulate dependency resolution: button requires text
      const resolvedComponents = ['text', 'button'];

      // Copy components
      resolvedComponents.forEach(component => {
        const sourcePath = `/cli/dist/packages/rn/components/${component}.tsx`;
        const targetPath = `/project/components/ui/${component}.tsx`;
        
        const content = fs.readFileSync(sourcePath, 'utf8');
        fs.writeFileSync(targetPath, content);
      });

      // Verify installation
      expect(fs.existsSync('/project/components/ui/text.tsx')).toBe(true);
      expect(fs.existsSync('/project/components/ui/button.tsx')).toBe(true);

      // Verify content
      const buttonContent = fs.readFileSync('/project/components/ui/button.tsx', 'utf8');
      expect(buttonContent).toContain('TouchableOpacity');
      expect(buttonContent).toContain('import { Text }');
    });

    it('should simulate theme installation', () => {
      const fs = require('memfs').fs;

      // Setup CLI themes
      vol.fromJSON({
        '/cli/dist/packages/rn/styles/themes/light.ts': `
export const lightTheme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    text: '#000000'
  }
};
        `,
        '/cli/dist/packages/rn/styles/themes/dark.ts': `
export const darkTheme = {
  colors: {
    primary: '#0A84FF',
    background: '#000000',
    text: '#FFFFFF'
  }
};
        `,
        '/cli/dist/packages/rn/styles/themes/spotify.ts': `
export const spotifyTheme = {
  colors: {
    primary: '#1DB954',
    background: '#191414',
    text: '#FFFFFF'
  }
};
        `
      });

      // Setup project themes directory
      fs.mkdirSync('/project/styles/themes', { recursive: true });

      // Install themes
      const themes = ['light', 'dark', 'spotify'];
      
      themes.forEach(theme => {
        const sourcePath = `/cli/dist/packages/rn/styles/themes/${theme}.ts`;
        const targetPath = `/project/styles/themes/${theme}.ts`;
        
        const content = fs.readFileSync(sourcePath, 'utf8');
        fs.writeFileSync(targetPath, content);
      });

      // Verify themes installed
      expect(fs.existsSync('/project/styles/themes/light.ts')).toBe(true);
      expect(fs.existsSync('/project/styles/themes/dark.ts')).toBe(true);
      expect(fs.existsSync('/project/styles/themes/spotify.ts')).toBe(true);

      // Verify Spotify theme content
      const spotifyContent = fs.readFileSync('/project/styles/themes/spotify.ts', 'utf8');
      expect(spotifyContent).toContain('#1DB954');
      expect(spotifyContent).toContain('#191414');
    });
  });

  describe('Component Registry Simulation', () => {
    it('should load and parse component registry', () => {
      const fs = require('memfs').fs;

      // Create component registry
      const registry = {
        button: {
          dependencies: ['text'],
          externalDeps: [],
          setup: [],
          example: 'import { Button } from "./components/ui/button";'
        },
        text: {
          dependencies: [],
          externalDeps: [],
          setup: [],
          example: 'import { Text } from "./components/ui/text";'
        },
        modal: {
          dependencies: [],
          externalDeps: ['@gorhom/portal'],
          setup: ['Install external dependency: npm install @gorhom/portal'],
          example: 'import { Modal } from "./components/ui/modal";'
        },
        dialog: {
          dependencies: ['modal', 'text', 'button'],
          externalDeps: ['@gorhom/portal'],
          setup: ['Install dependencies'],
          example: 'import { Dialog } from "./components/ui/dialog";'
        }
      };

      // Ensure directory exists first
      fs.mkdirSync('/cli', { recursive: true });
      fs.writeFileSync('/cli/component-registry.json', JSON.stringify(registry, null, 2));

      // Load and parse registry
      const registryContent = fs.readFileSync('/cli/component-registry.json', 'utf8');
      const parsedRegistry = JSON.parse(registryContent);

      expect(parsedRegistry.button).toBeDefined();
      expect(parsedRegistry.button.dependencies).toEqual(['text']);
      expect(parsedRegistry.modal.externalDeps).toEqual(['@gorhom/portal']);
      expect(parsedRegistry.dialog.dependencies).toEqual(['modal', 'text', 'button']);
    });

    it('should simulate dependency resolution', () => {
      const fs = require('memfs').fs;

      // Create registry
      const registry = {
        button: { dependencies: ['text'] },
        text: { dependencies: [] },
        dialog: { dependencies: ['modal', 'text', 'button'] },
        modal: { dependencies: [] }
      };

      fs.writeFileSync('/registry.json', JSON.stringify(registry));

      // Simulate dependency resolution for dialog
      const resolveDependencies = (componentName: string, registry: any, resolved = new Set(), visiting = new Set()): string[] => {
        if (visiting.has(componentName)) {
          throw new Error(`Circular dependency detected: ${componentName}`);
        }
        
        if (resolved.has(componentName)) {
          return Array.from(resolved) as string[];
        }

        visiting.add(componentName);
        
        const component = registry[componentName];
        if (!component) {
          throw new Error(`Component not found: ${componentName}`);
        }

        for (const dep of component.dependencies || []) {
          resolveDependencies(dep, registry, resolved, visiting);
        }

        visiting.delete(componentName);
        resolved.add(componentName);
        
        return Array.from(resolved) as string[];
      };

      const resolved = resolveDependencies('dialog', registry);
      
      // Should resolve in dependency order: text, button, modal, dialog
      expect(resolved).toContain('text');
      expect(resolved).toContain('button');
      expect(resolved).toContain('modal');
      expect(resolved).toContain('dialog');
      expect(resolved).toHaveLength(4);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle missing files gracefully', () => {
      const fs = require('memfs').fs;

      // Try to read non-existent file
      expect(() => {
        fs.readFileSync('/nonexistent.txt', 'utf8');
      }).toThrow();

      // Check if file exists
      const exists = fs.existsSync('/nonexistent.txt');
      expect(exists).toBe(false);
    });

    it('should handle file overwrite scenarios', () => {
      const fs = require('memfs').fs;

      // Create initial file
      fs.writeFileSync('/file.txt', 'original content');
      
      let content = fs.readFileSync('/file.txt', 'utf8');
      expect(content).toBe('original content');

      // Overwrite file
      fs.writeFileSync('/file.txt', 'new content');
      
      content = fs.readFileSync('/file.txt', 'utf8');
      expect(content).toBe('new content');
    });

    it('should detect circular dependencies', () => {
      const registry = {
        a: { dependencies: ['b'] },
        b: { dependencies: ['c'] },
        c: { dependencies: ['a'] } // Circular!
      };

      const resolveDependencies = (componentName: string, registry: any, resolved = new Set(), visiting = new Set()): string[] => {
        if (visiting.has(componentName)) {
          throw new Error(`Circular dependency detected: ${componentName}`);
        }
        
        visiting.add(componentName);
        
        const component = registry[componentName];
        for (const dep of component.dependencies || []) {
          resolveDependencies(dep, registry, resolved, visiting);
        }

        visiting.delete(componentName);
        resolved.add(componentName);
        
        return Array.from(resolved) as string[];
      };

      expect(() => {
        resolveDependencies('a', registry);
      }).toThrow('Circular dependency detected');
    });
  });

  describe('Performance Tests', () => {
    it('should handle large number of files efficiently', () => {
      const fs = require('memfs').fs;

      // Create many files
      const fileCount = 1000;
      const files: Record<string, string> = {};
      
      for (let i = 0; i < fileCount; i++) {
        files[`/components/component-${i}.tsx`] = `export const Component${i} = () => {};`;
      }

      vol.fromJSON(files);

      // Verify all files exist
      for (let i = 0; i < fileCount; i++) {
        const exists = fs.existsSync(`/components/component-${i}.tsx`);
        expect(exists).toBe(true);
      }

      // List all files
      const allFiles = fs.readdirSync('/components');
      expect(allFiles).toHaveLength(fileCount);
    });

    it('should handle concurrent file operations', () => {
      const fs = require('memfs').fs;

      // Setup source files
      vol.fromJSON({
        '/source/file1.txt': 'Content 1',
        '/source/file2.txt': 'Content 2',
        '/source/file3.txt': 'Content 3',
        '/source/file4.txt': 'Content 4',
        '/source/file5.txt': 'Content 5'
      });

      fs.mkdirSync('/dest', { recursive: true });

      // Simulate concurrent copies (in reality, memfs operations are synchronous)
      const files = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', 'file5.txt'];
      
      files.forEach(file => {
        const content = fs.readFileSync(`/source/${file}`, 'utf8');
        fs.writeFileSync(`/dest/${file}`, content);
      });

      // Verify all copies
      files.forEach((file, index) => {
        const exists = fs.existsSync(`/dest/${file}`);
        expect(exists).toBe(true);
        
        const content = fs.readFileSync(`/dest/${file}`, 'utf8');
        expect(content).toBe(`Content ${index + 1}`);
      });
    });
  });

  describe('Complete CLI Workflow Simulation', () => {
    it('should simulate full init → add components → add themes workflow', () => {
      const fs = require('memfs').fs;

      // Step 1: Create empty project
      fs.mkdirSync('/my-app', { recursive: true });
      fs.writeFileSync('/my-app/package.json', JSON.stringify({
        name: 'my-app',
        dependencies: {}
      }));

      // Step 2: Initialize leshi-ui
      const projectDirs = [
        '/my-app/components/ui',
        '/my-app/styles/themes',
        '/my-app/lib'
      ];

      projectDirs.forEach(dir => {
        fs.mkdirSync(dir, { recursive: true });
      });

      const config = {
        framework: 'rn',
        componentsDir: './components/ui',
        stylesDir: './styles',
        libDir: './lib',
        typescript: true
      };

      fs.writeFileSync('/my-app/leshi-ui.json', JSON.stringify(config, null, 2));

      // Step 3: Setup CLI assets
      vol.fromJSON({
        '/cli/component-registry.json': JSON.stringify({
          button: { dependencies: ['text'], externalDeps: [] },
          text: { dependencies: [], externalDeps: [] },
          modal: { dependencies: [], externalDeps: ['@gorhom/portal'] }
        }),
        '/cli/packages/rn/components/text.tsx': 'export const Text = () => {};',
        '/cli/packages/rn/components/button.tsx': 'export const Button = () => {};',
        '/cli/packages/rn/components/modal.tsx': 'export const Modal = () => {};',
        '/cli/packages/rn/styles/themes/spotify.ts': 'export const spotifyTheme = {};'
      });

      // Step 4: Add components (button with dependency)
      const requestedComponents = ['button'];
      const resolvedComponents = ['text', 'button']; // Dependencies resolved

      resolvedComponents.forEach(component => {
        const sourcePath = `/cli/packages/rn/components/${component}.tsx`;
        const targetPath = `/my-app/components/ui/${component}.tsx`;
        
        const content = fs.readFileSync(sourcePath, 'utf8');
        fs.writeFileSync(targetPath, content);
      });

      // Step 5: Add theme
      const themePath = '/cli/packages/rn/styles/themes/spotify.ts';
      const targetThemePath = '/my-app/styles/themes/spotify.ts';
      
      const themeContent = fs.readFileSync(themePath, 'utf8');
      fs.writeFileSync(targetThemePath, themeContent);

      // Step 6: Verify complete installation
      expect(fs.existsSync('/my-app/leshi-ui.json')).toBe(true);
      expect(fs.existsSync('/my-app/components/ui/text.tsx')).toBe(true);
      expect(fs.existsSync('/my-app/components/ui/button.tsx')).toBe(true);
      expect(fs.existsSync('/my-app/styles/themes/spotify.ts')).toBe(true);

      // Verify project structure
      const componentFiles = fs.readdirSync('/my-app/components/ui');
      expect(componentFiles).toContain('text.tsx');
      expect(componentFiles).toContain('button.tsx');

      const themeFiles = fs.readdirSync('/my-app/styles/themes');
      expect(themeFiles).toContain('spotify.ts');

      // Verify configuration
      const configContent = fs.readFileSync('/my-app/leshi-ui.json', 'utf8');
      const parsedConfig = JSON.parse(configContent);
      expect(parsedConfig.framework).toBe('rn');
      expect(parsedConfig.typescript).toBe(true);
    });
  });
});