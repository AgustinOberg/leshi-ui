import { ProjectDetector } from '../services/project-detector.js';
import { InvalidProjectError } from '../errors/index.js';
import { vol } from 'memfs';

describe('ProjectDetector', () => {
  describe('detectProject', () => {
    it('should detect Expo project', async () => {
      vol.fromJSON({
        '/expo-project/package.json': JSON.stringify({
          name: 'expo-project',
          dependencies: { expo: '^50.0.0' }
        }),
        '/expo-project/app.json': JSON.stringify({ expo: {} })
      });

      const result = await ProjectDetector.detectProject('/expo-project');
      expect(result.framework).toBe('expo');
      expect(result.typescript).toBe(false);
    });

    it('should detect Expo Router project', async () => {
      vol.fromJSON({
        '/expo-router-project/package.json': JSON.stringify({
          name: 'expo-router-project',
          dependencies: { expo: '^50.0.0' }
        }),
        '/expo-router-project/app.json': JSON.stringify({ expo: {} }),
        '/expo-router-project/app/_layout.tsx': 'export default function Layout() {}'
      });

      const result = await ProjectDetector.detectProject('/expo-router-project');
      expect(result.framework).toBe('expo-router');
    });

    it('should detect React Native project', async () => {
      vol.fromJSON({
        '/rn-project/package.json': JSON.stringify({
          name: 'rn-project',
          dependencies: { 'react-native': '^0.73.0' }
        }),
        '/rn-project/metro.config.js': 'module.exports = {};',
        '/rn-project/android/build.gradle': '',
        '/rn-project/ios/Podfile': ''
      });

      const result = await ProjectDetector.detectProject('/rn-project');
      expect(result.framework).toBe('react-native');
    });

    it('should detect TypeScript', async () => {
      vol.fromJSON({
        '/ts-project/package.json': JSON.stringify({
          name: 'ts-project',
          dependencies: { expo: '^50.0.0' },
          devDependencies: { typescript: '^5.0.0' }
        }),
        '/ts-project/app.json': JSON.stringify({ expo: {} }),
        '/ts-project/tsconfig.json': JSON.stringify({ compilerOptions: {} })
      });

      const result = await ProjectDetector.detectProject('/ts-project');
      expect(result.typescript).toBe(true);
    });

    it('should throw error for invalid project', async () => {
      vol.fromJSON({
        '/invalid-project/README.md': 'Not a React Native project'
      });

      await expect(ProjectDetector.detectProject('/invalid-project'))
        .rejects
        .toThrow(InvalidProjectError);
    });
  });

  describe('validateProjectStructure', () => {
    it('should validate Expo project structure', async () => {
      vol.fromJSON({
        '/expo-project/package.json': JSON.stringify({ name: 'test' })
      });

      await expect(ProjectDetector.validateProjectStructure('expo', '/expo-project'))
        .resolves
        .not
        .toThrow();
    });

    it('should validate React Native project structure', async () => {
      vol.fromJSON({
        '/rn-project/package.json': JSON.stringify({ name: 'test' }),
        '/rn-project/metro.config.js': 'module.exports = {};',
        '/rn-project/android/build.gradle': '',
        '/rn-project/ios/Podfile': ''
      });

      await expect(ProjectDetector.validateProjectStructure('react-native', '/rn-project'))
        .resolves
        .not
        .toThrow();
    });

    it('should throw error for invalid React Native structure', async () => {
      vol.fromJSON({
        '/invalid-rn/package.json': JSON.stringify({ name: 'test' })
        // Missing metro.config.js, android/, ios/
      });

      await expect(ProjectDetector.validateProjectStructure('react-native', '/invalid-rn'))
        .rejects
        .toThrow(InvalidProjectError);
    });
  });

  describe('getRecommendedAliases', () => {
    it('should return correct aliases for different frameworks', () => {
      const expoAliases = ProjectDetector.getRecommendedAliases('expo');
      const rnAliases = ProjectDetector.getRecommendedAliases('react-native');

      expect(expoAliases.components).toBe('./components');
      expect(rnAliases.components).toBe('./src/components');
    });
  });

  describe('createDefaultConfig', () => {
    it('should create default config with project info', () => {
      const projectInfo = {
        framework: 'expo' as const,
        typescript: true,
        projectRoot: '/test',
        packageJson: { name: 'test', version: '1.0.0' },
        hasConfig: false
      };

      const config = ProjectDetector.createDefaultConfig(projectInfo);
      
      expect(config.framework).toBe('expo');
      expect(config.typescript).toBe(true);
      expect(config.style).toBe('default');
      expect(config.aliases).toBeDefined();
    });
  });
});