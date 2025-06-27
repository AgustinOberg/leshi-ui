export type Framework = 'rn' | 'unistyles';

export interface ComponentInfo {
  name: string;
  dependencies: string[];
  externalDeps: string[];
  utilities?: string[];
  setup: string[];
  setupCode?: string;
  example: string;
  description?: string;
}

export interface ProjectConfig {
  framework: Framework;
  componentsDir: string;
  stylesDir: string;
  libDir: string;
}

export interface ComponentRegistry {
  [key: string]: ComponentInfo;
}

export interface ListItem {
  name: string;
  description: string;
  dependencies: string;
  externalDeps: boolean;
}