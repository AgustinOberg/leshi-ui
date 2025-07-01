export type Framework = 'rn' | 'unistyles';

export interface ComponentProp {
  name: string;
  type: string;
  description: string;
  default?: string;
  required?: boolean;
}

export interface ComponentExtends {
  name: string;
  description: string;
}

export interface ComponentApi {
  description: string;
  extends?: ComponentExtends;
  props: ComponentProp[];
  variants: Record<string, string[]>;
}

export interface ComponentInfo {
  name: string;
  dependencies: string[];
  externalDeps: string[];
  utilities?: string[];
  setup: string[];
  setupCode?: string;
  example: string;
  description?: string;
  api?: ComponentApi;
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