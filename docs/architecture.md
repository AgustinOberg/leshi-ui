# System Architecture

Deep dive into the Leshi UI system architecture, design decisions, and technical implementation details. This guide covers the enterprise-grade CLI, component distribution system, and development patterns.

## 🏗️ Architectural Overview

### **High-Level System Design**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LESHI UI ECOSYSTEM                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
    ┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
    │          CLI SYSTEM           │         COMPONENT SYSTEM         │
    │     (Enterprise Grade)       │       (Copy-Paste Based)       │
    │                               │                               │
    │  ┌─────────────────────┐  │  ┌─────────────────────┐  │
    │  │   Command Layer     │  │  │   RN StyleSheet   │  │
    │  │                     │  │  │    Components      │  │
    │  ├─────────────────────┤  │  ├─────────────────────┤  │
    │  │   Service Layer    │  │  │  Unistyles v3     │  │
    │  │                     │  │  │    Components      │  │
    │  ├─────────────────────┤  │  ├─────────────────────┤  │
    │  │   Utils & Types   │  │  │   Theme System    │  │
    │  └─────────────────────┘  │  └─────────────────────┘  │
    └───────────────────────────────────────────────┼───────────────────────────────────────────────┘
                                       │
    ┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
    │        GITHUB INTEGRATION       │           DEMO SYSTEM            │
    │     (Component Distribution)   │      (Development & Testing)     │
    │                               │                               │
    │  ┌─────────────────────┐  │  ┌─────────────────────┐  │
    │  │   Registry API     │  │  │   Demo Apps       │  │
    │  │                     │  │  │                     │  │
    │  ├─────────────────────┤  │  ├─────────────────────┤  │
    │  │   Raw Components  │  │  │   E2E Testing     │  │
    │  │                     │  │  │                     │  │
    │  ├─────────────────────┤  │  ├─────────────────────┤  │
    │  │   Version Control │  │  │   Documentation  │  │
    │  └─────────────────────┘  │  └─────────────────────┘  │
    └───────────────────────────────────────────────┼───────────────────────────────────────────────┘
                                       │
                           USER APPLICATIONS
                        (React Native Projects)
```

### **Core Design Principles**

1. **Copy, Don't Import**: Components are copied to user projects, not imported as dependencies
2. **Zero Runtime Overhead**: No library bundle, only the code you use
3. **Enterprise Reliability**: Atomic operations with rollback protection
4. **Framework Agnostic**: Works with Expo, React Native CLI, Expo Router
5. **TypeScript First**: Complete type safety throughout the system
6. **Performance Optimized**: StyleSheet.create patterns, minimal re-renders

## 💻 CLI System Architecture

### **CLI Layer Structure**

```typescript
// Command Layer (Thin)
cli/src/commands/
├── init.ts         // Project initialization
├── add.ts          // Component installation
├── list.ts         // Component discovery
└── guide.ts        // Documentation access

// Service Layer (Business Logic)
cli/src/services/
├── component-registry.ts     // Component metadata
├── github-service.ts         // GitHub API integration
├── github-project-service.ts // GitHub operations
└── project-service.ts        // Local project management

// Utility Layer (Shared)
cli/src/utils/
├── colors.ts       // CLI styling
├── file-utils.ts   // File operations
├── logger.ts       // Structured logging
└── version.ts      // Version management

// Type Layer (Contracts)
cli/src/types/
└── index.ts        // Type definitions
```

### **Enterprise CLI Features**

#### **1. Atomic File Operations**
```typescript
// All operations are atomic (all-or-nothing)
class AtomicFileOperation {
  private backup: Map<string, string> = new Map();
  private operations: FileOperation[] = [];
  
  async execute(): Promise<void> {
    try {
      // Create backups
      await this.createBackups();
      
      // Execute all operations
      await this.executeOperations();
      
      // Validate results
      await this.validateResults();
      
    } catch (error) {
      // Rollback on any failure
      await this.rollback();
      throw error;
    }
  }
}
```

#### **2. Multi-Pass Dependency Resolution**
```typescript
// Recursive dependency resolution with circular detection
class DependencyResolver {
  async resolveDependencies(components: string[]): Promise<string[]> {
    const resolved = new Set<string>();
    const processing = new Set<string>();
    
    const resolve = async (name: string): Promise<void> => {
      if (resolved.has(name) || processing.has(name)) return;
      
      processing.add(name);
      
      // Resolve dependencies first (depth-first)
      const component = await this.getComponent(name);
      for (const dep of component.dependencies) {
        await resolve(dep);
      }
      
      processing.delete(name);
      resolved.add(name);
    };
    
    // Resolve all requested components
    for (const name of components) {
      await resolve(name);
    }
    
    return Array.from(resolved);
  }
}
```

#### **3. Import Transformation Engine**
```typescript
// Babel AST-based import path transformation
class ImportTransformer {
  transformImports(sourceCode: string, config: ProjectConfig): string {
    const ast = babel.parse(sourceCode, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });
    
    babel.traverse(ast, {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        
        // Transform relative imports
        if (source.startsWith('./') || source.startsWith('../')) {
          path.node.source.value = this.resolveRelativePath(source, config);
        }
        
        // Handle alias imports
        if (source.startsWith('@/')) {
          path.node.source.value = this.resolveAlias(source, config);
        }
      }
    });
    
    return babel.generate(ast).code;
  }
}
```

### **CLI Error Handling Strategy**

```typescript
// Structured error hierarchy
abstract class CLIError extends Error {
  abstract code: string;
  abstract suggestion?: string;
}

class ComponentNotFoundError extends CLIError {
  code = 'COMPONENT_NOT_FOUND';
  suggestion = 'Run `leshi-ui list component` to see available components';
}

class TypeScriptCompilationError extends CLIError {
  code = 'TYPESCRIPT_ERROR';
  suggestion = 'Fix TypeScript errors and try again';
}

class NetworkError extends CLIError {
  code = 'NETWORK_ERROR';
  suggestion = 'Check internet connection and try again';
}

// Error handler with recovery suggestions
class ErrorHandler {
  static handle(error: Error): never {
    if (error instanceof CLIError) {
      Logger.error(error.message);
      if (error.suggestion) {
        Logger.info(error.suggestion);
      }
    } else {
      Logger.error('Unexpected error:', error.message);
      Logger.info('Please report this issue on GitHub');
    }
    
    process.exit(1);
  }
}
```

## 📦 Component System Architecture

### **Component Package Structure**

```
packages/
├── rn/                       # React Native StyleSheet variant
│   ├── components/ui/
│   │   ├── button.tsx        # Individual components
│   │   ├── text.tsx
│   │   └── modal.tsx
│   ├── styles/
│   │   ├── theme.ts          # Theme definitions
│   │   ├── context.tsx       # Theme context
│   │   └── themes/           # Pre-built themes
│   └── lib/
│       └── utils.ts          # Utility functions
└── unistyles/                # Unistyles v3 variant
    ├── components/ui/
    ├── styles/
    └── lib/
```

### **Component Design Patterns**

#### **1. Theme-First Architecture**
```typescript
// All components consume theme via context
export const Button = ({ variant = 'primary', ...props }: ButtonProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);  // Theme-aware styles
  
  return (
    <Pressable style={[styles.base, styles[variant]]} {...props} />
  );
};

// Styles created with theme tokens
const createStyles = (theme: Theme) => StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing.base,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
});
```

#### **2. Variant System**
```typescript
// Component variant patterns
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'base' | 'lg';
  children: React.ReactNode;
}

// Consistent variant implementation
const variantStyles = {
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.secondary },
  outline: { 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    backgroundColor: 'transparent'
  },
  ghost: { backgroundColor: 'transparent' },
  destructive: { backgroundColor: theme.colors.destructive },
};
```

#### **3. Performance Optimization**
```typescript
// Always use StyleSheet.create for performance
const styles = StyleSheet.create({
  container: {
    // Static styles
  }
});

// Memoize theme-dependent styles
const themedStyles = useMemo(() => StyleSheet.create({
  dynamic: {
    backgroundColor: theme.colors.background
  }
}), [theme]);

// Avoid inline styles
// ❌ Bad
<View style={{ backgroundColor: theme.colors.background }} />

// ✅ Good
const styles = createStyles(theme);
<View style={styles.container} />
```

### **Component Dependency Graph**

```
Component Dependencies:

text (base component)
 │
 ├── button
 │   ├── modal
 │   │   ├── dialog
 │   │   └── alert-dialog
 │   └── text-input
 ├── label
 │   ├── text-input
 │   └── text-area
 ├── avatar
 ├── badge
 └── progress

icon (utility component)
 ├── button (optional icons)
 ├── checkbox
 ├── alert-dialog
 └── spinner

modal-utils (utility)
 └── modal
```

## 🎨 Theme System Architecture

### **Theme Context Design**

```typescript
// Performance-optimized theme context
interface ThemeContextValue {
  theme: Theme;
  colorScheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Context with minimal re-renders
const ThemeContext = createContext<ThemeContextValue>({} as ThemeContextValue);

// Provider with memoization
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);
  
  // Memoize theme to prevent unnecessary re-renders
  const theme = useMemo(() => {
    return customTheme || (colorScheme === 'light' ? lightTheme : darkTheme);
  }, [colorScheme, customTheme]);
  
  // Memoize context value
  const value = useMemo(() => ({
    theme,
    colorScheme,
    toggleTheme: () => setColorScheme(prev => prev === 'light' ? 'dark' : 'light'),
    setTheme: setCustomTheme,
  }), [theme, colorScheme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### **Theme Token System**

```typescript
// Type-safe theme interface
export interface Theme {
  colors: {
    // Semantic colors
    primary: string;
    secondary: string;
    destructive: string;
    
    // Surface colors
    background: string;
    card: string;
    popover: string;
    
    // Text colors
    text: string;
    textMuted: string;
    
    // Interactive colors
    border: string;
    input: string;
    ring: string;
  };
  
  spacing: {
    xs: number; sm: number; base: number;
    lg: number; xl: number; xxl: number;
  };
  
  borderRadius: {
    sm: number; base: number; lg: number; full: number;
  };
  
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
}

// Theme inheritance and composition
export const createTheme = (overrides: Partial<Theme>): Theme => {
  return {
    ...baseTheme,
    ...overrides,
    colors: {
      ...baseTheme.colors,
      ...overrides.colors,
    },
  };
};
```

## 🔗 GitHub Integration Architecture

### **Component Distribution System**

```typescript
// GitHub service for component distribution
class GitHubService {
  private static readonly BASE_URL = 'https://api.github.com/repos/AgustinOberg/leshi-ui';
  private static readonly RAW_URL = 'https://raw.githubusercontent.com/AgustinOberg/leshi-ui/main';
  private static cache = new Map<string, any>();
  
  // Get component registry with caching
  static async getRegistry(): Promise<ComponentRegistry> {
    const cacheKey = 'component-registry';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const response = await fetch(`${this.RAW_URL}/component-registry.json`);
    const registry = await response.json();
    
    // Cache for 15 minutes
    this.cache.set(cacheKey, registry);
    setTimeout(() => this.cache.delete(cacheKey), 15 * 60 * 1000);
    
    return registry;
  }
  
  // Get component source code
  static async getComponentSource(path: string, variant: 'rn' | 'unistyles'): Promise<string> {
    const fullPath = `packages/${variant}/${path}`;
    const response = await fetch(`${this.RAW_URL}/${fullPath}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch component: ${path}`);
    }
    
    return response.text();
  }
}
```

### **Version Control Strategy**

```
GitHub Repository Structure:

┌── main branch (stable)
│   │
│   ├── packages/         # Source components
│   ├── component-registry.json  # Component metadata
│   └── cli/              # CLI source code
│
├── develop branch (integration)
│   └── Feature development
│
└── feature branches
    └── Individual features

Release Tags:
• v0.0.16-beta.3 (current)
• v0.0.16-beta.2
• v0.0.16-beta.1
```

## 🧪 Testing Architecture

### **Multi-Layer Testing Strategy**

```
Testing Pyramid:

    ┌───────────────────────┐
    │      E2E Tests        │  ← GitHub Integration
    │   (Slow, High Value)  │     Real CLI Execution
    └───────────────────────┘
           │
    ┌───────────────────────────────────────────────┐
    │            Integration Tests            │  ← Service Layer
    │         (Medium Speed, Medium Value)      │     Mocked Dependencies
    └───────────────────────────────────────────────┘
                               │
    ┌──────────────────────────────────────────────────────────────────────────┐
    │                          Unit Tests                           │  ← Individual Functions
    │                   (Fast, Foundational)                     │     Pure Logic Testing
    └──────────────────────────────────────────────────────────────────────────┘
```

#### **E2E Testing Implementation**
```typescript
// E2E test creates real projects and tests CLI
class E2ETestRunner {
  async runE2ETest(variant: 'rn' | 'unistyles'): Promise<void> {
    const testDir = await this.createTestProject(variant);
    
    try {
      // Test CLI initialization
      await this.runCLI(['init', '--yes'], testDir);
      
      // Test component installation
      await this.runCLI(['add', 'component', 'button', 'text'], testDir);
      
      // Validate TypeScript compilation
      await this.validateTypeScript(testDir);
      
      // Validate file structure
      await this.validateFileStructure(testDir);
      
    } finally {
      await this.cleanupTestProject(testDir);
    }
  }
}
```

## 📊 Performance Architecture

### **CLI Performance Optimizations**

1. **Parallel Operations**:
```typescript
// Dependency resolution runs in parallel
const resolveDependencies = async (components: string[]): Promise<string[]> => {
  const promises = components.map(async (name) => {
    const component = await ComponentRegistry.getComponent(name);
    return component.dependencies;
  });
  
  const allDependencies = await Promise.all(promises);
  return [...new Set(allDependencies.flat())];
};
```

2. **Caching Strategy**:
```typescript
// Multi-level caching
class CacheManager {
  private memoryCache = new Map();
  private diskCache = new Map();
  
  async get(key: string): Promise<any> {
    // 1. Check memory cache (fastest)
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    
    // 2. Check disk cache
    const diskValue = await this.getDiskCache(key);
    if (diskValue) {
      this.memoryCache.set(key, diskValue);
      return diskValue;
    }
    
    // 3. Fetch from network
    return null;
  }
}
```

3. **Incremental Operations**:
```typescript
// Only process changed files
class IncrementalProcessor {
  private lastModified = new Map<string, number>();
  
  async processIfChanged(filePath: string, processor: Function): Promise<void> {
    const stats = await fs.stat(filePath);
    const lastMod = this.lastModified.get(filePath);
    
    if (!lastMod || stats.mtimeMs > lastMod) {
      await processor(filePath);
      this.lastModified.set(filePath, stats.mtimeMs);
    }
  }
}
```

### **Component Performance Patterns**

1. **StyleSheet Optimization**:
```typescript
// Always use StyleSheet.create for performance
const styles = StyleSheet.create({
  // Pre-compiled styles
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
  }
});

// Avoid inline styles (creates new objects on each render)
// ❌ Bad
<View style={{ backgroundColor: '#ffffff', padding: 16 }} />

// ✅ Good  
<View style={styles.container} />
```

2. **Theme Context Optimization**:
```typescript
// Memoize theme-dependent styles
const useThemedStyles = (theme: Theme) => {
  return useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
    }
  }), [theme.colors.background, theme.colors.border]); // Only re-create when colors change
};
```

## 🔒 Security Architecture

### **CLI Security Measures**

1. **Input Validation**:
```typescript
// Zod validation for all CLI inputs
const addCommandSchema = z.object({
  component: z.string().min(1).max(50),
  unistyles: z.boolean().default(false),
  overwrite: z.boolean().default(false),
});

// Validate all user inputs
const validatedOptions = addCommandSchema.parse(options);
```

2. **Path Sanitization**:
```typescript
// Prevent path traversal attacks
class PathValidator {
  static sanitizePath(userPath: string): string {
    const normalizedPath = path.normalize(userPath);
    
    // Prevent directory traversal
    if (normalizedPath.includes('..')) {
      throw new Error('Invalid path: directory traversal not allowed');
    }
    
    // Ensure path is within project directory
    const resolvedPath = path.resolve(normalizedPath);
    const projectRoot = path.resolve(process.cwd());
    
    if (!resolvedPath.startsWith(projectRoot)) {
      throw new Error('Invalid path: outside project directory');
    }
    
    return resolvedPath;
  }
}
```

3. **GitHub Content Verification**:
```typescript
// Verify component source integrity
class ComponentVerifier {
  static async verifyComponent(source: string): Promise<boolean> {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /eval\(/,
      /Function\(/,
      /require\(/,
      /process\./,
      /fs\./,
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(source)) {
        throw new Error('Component contains suspicious code patterns');
      }
    }
    
    return true;
  }
}
```

## 📊 Scalability Considerations

### **Component Registry Scaling**

```typescript
// Paginated component registry for large catalogs
interface PaginatedRegistry {
  components: ComponentInfo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

// Lazy loading for large component sets
class LazyComponentLoader {
  private loadedComponents = new Set<string>();
  
  async loadComponent(name: string): Promise<ComponentInfo> {
    if (this.loadedComponents.has(name)) {
      return this.getFromCache(name);
    }
    
    const component = await this.fetchComponent(name);
    this.loadedComponents.add(name);
    
    return component;
  }
}
```

### **Extensible Architecture Patterns**

1. **Plugin System**:
```typescript
// Plugin architecture foundation
interface LeshiPlugin {
  name: string;
  version: string;
  commands?: Command[];
  transformers?: Transformer[];
  validators?: Validator[];
}

class PluginManager {
  private plugins: Map<string, LeshiPlugin> = new Map();
  
  register(plugin: LeshiPlugin): void {
    this.plugins.set(plugin.name, plugin);
  }
  
  async executeHook(hookName: string, context: any): Promise<any> {
    for (const plugin of this.plugins.values()) {
      if (plugin[hookName]) {
        context = await plugin[hookName](context);
      }
    }
    return context;
  }
}
```

2. **Multi-Framework Support**:
```typescript
// Framework adapter design pattern
interface FrameworkAdapter {
  name: string;
  detectProject(projectPath: string): Promise<boolean>;
  transformComponent(source: string): Promise<string>;
  validateSetup(projectPath: string): Promise<boolean>;
}

class FrameworkManager {
  private adapters: FrameworkAdapter[] = [];
  
  register(adapter: FrameworkAdapter): void {
    this.adapters.push(adapter);
  }
  
  async detectFramework(projectPath: string): Promise<FrameworkAdapter | null> {
    for (const adapter of this.adapters) {
      if (await adapter.detectProject(projectPath)) {
        return adapter;
      }
    }
    return null;
  }
}
```

---

## 🔗 Architecture Decision Records (ADRs)

### **ADR-001: Copy vs Import Strategy**
**Decision**: Use copy-paste approach instead of npm dependencies
**Reasoning**: 
- Full ownership and customization
- Zero runtime overhead
- No version lock-in
- Easier debugging and modification

### **ADR-002: Enterprise CLI Architecture**
**Decision**: Service-oriented architecture with atomic operations
**Reasoning**:
- Separation of concerns
- Testability
- Reliability through atomic operations
- Error recovery capabilities

### **ADR-003: GitHub-based Distribution**
**Decision**: Use GitHub as component registry and distribution
**Reasoning**:
- Version control built-in
- No infrastructure costs
- Community contribution friendly
- Transparent and auditable

### **ADR-004: TypeScript-First Development**
**Decision**: Full TypeScript coverage for CLI and components
**Reasoning**:
- Developer experience
- Compile-time error detection
- Better IDE support
- Self-documenting code

This architecture enables Leshi UI to deliver enterprise-grade reliability while maintaining the simplicity and flexibility that makes it accessible to developers of all skill levels.
