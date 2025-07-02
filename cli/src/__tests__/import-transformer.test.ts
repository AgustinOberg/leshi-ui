import { describe, test, expect } from 'bun:test';
import { ImportTransformer } from '../services/import-transformer.js';
import type { LeshiConfig } from '../types/index.js';

// Mock config for testing
const mockConfig: LeshiConfig = {
  framework: 'rn',
  aliases: {
    utils: '@/lib/utils',
    components: '@/components',
    lib: '@/lib',
    styles: '@/styles',
    ui: '@/components/ui',
  },
  tsx: true,
  dirs: {
    components: 'components',
    lib: 'lib',
    styles: 'styles',
    ui: 'components/ui',
  },
};

describe('ImportTransformer', () => {
  describe('transformImports - Basic Patterns', () => {
    test('should transform ../styles/* imports with single quotes', async () => {
      const sourceCode = `import { theme } from '../styles/theme';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { theme } from '@/styles/theme';`);
    });

    test('should transform ../styles/* imports with double quotes', async () => {
      const sourceCode = `import { theme } from "../styles/theme";`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { theme } from "@/styles/theme";`);
    });

    test('should transform ../styles/* imports with template literals', async () => {
      const sourceCode = `import { theme } from \`../styles/theme\`;`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { theme } from \`@/styles/theme\`;`);
    });

    test('should transform ../../styles/* imports', async () => {
      const sourceCode = `import { theme } from '../../styles/theme';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { theme } from '@/styles/theme';`);
    });

    test('should transform ../lib/* imports', async () => {
      const sourceCode = `import { utils } from '../lib/utils';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { utils } from '@/lib/utils';`);
    });

    test('should transform ../../lib/* imports (NEW PATTERN)', async () => {
      const sourceCode = `import { getBackdropConfig } from '../../lib/modal-utils';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/modal.tsx', mockConfig);
      expect(result).toBe(`import { getBackdropConfig } from '@/lib/modal-utils';`);
    });

    test('should transform ../components/* imports', async () => {
      const sourceCode = `import { Button } from '../components/button';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'pages/home.tsx', mockConfig);
      expect(result).toBe(`import { Button } from '@/components/button';`);
    });
  });

  describe('transformImports - Quote Style Preservation', () => {
    test('should preserve single quotes', async () => {
      const sourceCode = `import { theme } from '../styles/theme';\nimport { utils } from '../../lib/utils';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { theme } from '@/styles/theme';\nimport { utils } from '@/lib/utils';`);
    });

    test('should preserve double quotes', async () => {
      const sourceCode = `import { theme } from "../styles/theme";\nimport { utils } from "../../lib/utils";`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { theme } from "@/styles/theme";\nimport { utils } from "@/lib/utils";`);
    });

    test('should preserve template literals', async () => {
      const sourceCode = `import { theme } from \`../styles/theme\`;\nimport { utils } from \`../../lib/utils\`;`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { theme } from \`@/styles/theme\`;\nimport { utils } from \`@/lib/utils\`;`);
    });

    test('should handle mixed quote styles', async () => {
      const sourceCode = `import { theme } from '../styles/theme';\nimport { utils } from "../../lib/utils";\nimport { colors } from \`../styles/colors\`;`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { theme } from '@/styles/theme';\nimport { utils } from "@/lib/utils";\nimport { colors } from \`@/styles/colors\`;`);
    });
  });

  describe('transformImports - External Modules', () => {
    test('should preserve external module imports', async () => {
      const sourceCode = `import React from 'react';\nimport { View } from 'react-native';\nimport { theme } from '../styles/theme';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import React from 'react';\nimport { View } from 'react-native';\nimport { theme } from '@/styles/theme';`);
    });

    test('should preserve already transformed aliases', async () => {
      const sourceCode = `import { theme } from '@/styles/theme';\nimport { utils } from '@/lib/utils';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { theme } from '@/styles/theme';\nimport { utils } from '@/lib/utils';`);
    });
  });

  describe('transformComponentImports - Component-Specific Patterns', () => {
    test('should transform ../../styles/theme imports', async () => {
      const sourceCode = `import { useTheme } from '../../styles/theme';`;
      const result = await ImportTransformer.transformComponentImports(sourceCode, 'button', 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { useTheme } from '@/styles/theme';`);
    });

    test('should transform ../../styles/* imports', async () => {
      const sourceCode = `import { colors } from '../../styles/colors';`;
      const result = await ImportTransformer.transformComponentImports(sourceCode, 'button', 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { colors } from '@/styles/colors';`);
    });

    test('should transform ./component imports to @/components/ui/', async () => {
      const sourceCode = `import { Text } from './text';`;
      const result = await ImportTransformer.transformComponentImports(sourceCode, 'button', 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { Text } from '@/components/ui/text';`);
    });

    test('should transform ../../lib/* imports', async () => {
      const sourceCode = `import { getBackdropConfig } from '../../lib/modal-utils';`;
      const result = await ImportTransformer.transformComponentImports(sourceCode, 'modal', 'components/ui/modal.tsx', mockConfig);
      expect(result).toBe(`import { getBackdropConfig } from '@/lib/modal-utils';`);
    });

    test('should preserve quote styles in component imports', async () => {
      const sourceCode = `import { useTheme } from "../../styles/theme";\nimport { Text } from './text';\nimport { utils } from \`../../lib/utils\`;`;
      const result = await ImportTransformer.transformComponentImports(sourceCode, 'button', 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { useTheme } from "@/styles/theme";\nimport { Text } from '@/components/ui/text';\nimport { utils } from \`@/lib/utils\`;`);
    });
  });

  describe('transformImports - Complex Scenarios', () => {
    test('should handle multiple imports in one statement', async () => {
      const sourceCode = `import { theme, colors, spacing } from '../styles/theme';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { theme, colors, spacing } from '@/styles/theme';`);
    });

    test('should handle type imports', async () => {
      const sourceCode = `import type { Theme } from '../styles/theme';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import type { Theme } from '@/styles/theme';`);
    });

    test('should handle default imports', async () => {
      const sourceCode = `import theme from '../styles/theme';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import theme from '@/styles/theme';`);
    });

    test('should handle mixed import types', async () => {
      const sourceCode = `import theme, { colors, type Theme } from '../styles/theme';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import theme, { colors, type Theme } from '@/styles/theme';`);
    });
  });

  describe('transformImports - Edge Cases', () => {
    test('should handle imports with spaces', async () => {
      const sourceCode = `import { theme } from   '../styles/theme'  ;`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { theme } from '@/styles/theme'  ;`);
    });

    test('should handle multiline imports', async () => {
      const sourceCode = `import {\n  theme,\n  colors\n} from '../styles/theme';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import {\n  theme,\n  colors\n} from '@/styles/theme';`);
    });

    test('should handle comments near imports', async () => {
      const sourceCode = `// Import theme\nimport { theme } from '../styles/theme'; // Main theme`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`// Import theme\nimport { theme } from '@/styles/theme'; // Main theme`);
    });

    test('should not transform relative imports that are already correct', async () => {
      const sourceCode = `import { helper } from './helper';\nimport { utils } from '../utils';`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(`import { helper } from './helper';\nimport { utils } from '../utils';`);
    });
  });

  describe('transformImports - Error Handling', () => {
    test('should handle malformed imports gracefully', async () => {
      const sourceCode = `import { theme from '../styles/theme';`; // Missing closing brace
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      // Should not crash and may still transform valid parts
      expect(result).toBe(`import { theme from '@/styles/theme';`);
    });

    test('should handle empty source code', async () => {
      const sourceCode = ``;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(``);
    });

    test('should handle source code without imports', async () => {
      const sourceCode = `const message = 'Hello World';\nconsole.log(message);`;
      const result = await ImportTransformer.transformImports(sourceCode, 'components/ui/button.tsx', mockConfig);
      expect(result).toBe(sourceCode);
    });
  });
});