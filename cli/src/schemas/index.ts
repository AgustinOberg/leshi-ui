import { z } from 'zod';

// CLI command schemas
export const addOptionsSchema = z.object({
  unistyles: z.boolean().default(false),
  cwd: z.string().optional(),
  silent: z.boolean().default(false),
  yes: z.boolean().default(false),
  overwrite: z.boolean().default(false),
  all: z.boolean().default(false),
  path: z.string().optional()
});

export const initOptionsSchema = z.object({
  target: z.enum(['rn', 'unistyles']).optional(),
  cwd: z.string().optional(),
  silent: z.boolean().default(false),
  yes: z.boolean().default(false)
});

export const themeOptionsSchema = z.object({
  unistyles: z.boolean().default(false),
  cwd: z.string().optional(),
  silent: z.boolean().default(false)
});

// Project configuration schema
export const projectConfigSchema = z.object({
  $schema: z.string().url().optional(),
  framework: z.enum(['expo', 'react-native', 'expo-router']),
  typescript: z.boolean(),
  style: z.enum(['default', 'new-york']).default('default'),
  aliases: z.object({
    components: z.string().default('./components'),
    lib: z.string().default('./lib'),
    styles: z.string().default('./styles'),
    utils: z.string().default('./utils')
  }),
  unistyles: z.object({
    config: z.string(),
    themes: z.array(z.string())
  }).optional()
});

// Component registry schema
export const componentRegistrySchema = z.object({
  name: z.string(),
  type: z.enum(['registry:ui', 'registry:hook', 'registry:lib']),
  dependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).default([]),
  utilities: z.array(z.string()).default([]),
  providers: z.array(z.string()).default([]),
  setup: z.array(z.string()).default([]),
  description: z.string().optional(),
  example: z.string().optional()
});

// Registry file schema
export const registryFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  type: z.enum(['registry:component', 'registry:lib', 'registry:hook', 'registry:provider']),
  target: z.string().optional()
});

// Package.json schema
export const packageJsonSchema = z.object({
  name: z.string(),
  version: z.string(),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional()
}).passthrough();

// File operation schema
export const fileOperationSchema = z.object({
  type: z.enum(['copy', 'create', 'update']),
  source: z.string().optional(),
  target: z.string(),
  content: z.string(),
  backup: z.string().optional()
});

// Validation functions
export type AddOptions = z.infer<typeof addOptionsSchema>;
export type InitOptions = z.infer<typeof initOptionsSchema>;
export type ThemeOptions = z.infer<typeof themeOptionsSchema>;
export type ProjectConfig = z.infer<typeof projectConfigSchema>;
export type ComponentRegistry = z.infer<typeof componentRegistrySchema>;
export type RegistryFile = z.infer<typeof registryFileSchema>;
export type PackageJson = z.infer<typeof packageJsonSchema>;
export type FileOperation = z.infer<typeof fileOperationSchema>;

// Operation result types
export interface OperationResult {
  success: boolean;
  operations: FileOperation[];
  error?: Error;
}