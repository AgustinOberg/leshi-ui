// Core CLI types
export interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

export interface ComponentRegistry {
  name: string;
  type: 'registry:ui' | 'registry:hook' | 'registry:lib';
  dependencies: string[];
  registryDependencies: string[];
  utilities: string[];
  providers: string[];
  setup: string[];
  files: RegistryFile[];
  description?: string;
  example?: string;
}

export interface RegistryFile {
  path: string;
  content: string;
  type: 'registry:component' | 'registry:lib' | 'registry:hook' | 'registry:provider';
  target?: string;
}

export interface ProjectConfig {
  $schema?: string;
  framework: 'expo' | 'react-native' | 'expo-router';
  typescript: boolean;
  style: 'default' | 'new-york';
  aliases: {
    components: string;
    lib: string;
    styles: string;
    utils: string;
  };
  unistyles?: {
    config: string;
    themes: string[];
  };
}

export interface CLIOptions {
  cwd?: string;
  silent?: boolean;
  yes?: boolean;
  overwrite?: boolean;
}

export interface AddOptions extends CLIOptions {
  unistyles?: boolean;
  all?: boolean;
  path?: string;
}

export interface InitOptions extends CLIOptions {
  target?: 'rn' | 'unistyles';
}

export interface ThemeOptions extends CLIOptions {
  unistyles?: boolean;
}

export type Framework = 'expo' | 'react-native' | 'expo-router';

export interface FileOperation {
  type: 'copy' | 'create' | 'update';
  source?: string;
  target: string;
  content: string;
  backup?: string;
}

export interface OperationResult {
  success: boolean;
  operations: FileOperation[];
  error?: Error;
}