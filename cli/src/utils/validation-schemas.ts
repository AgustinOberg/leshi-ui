import { z } from 'zod';

/**
 * Zod schemas for runtime validation of JSON data
 * These schemas ensure type safety when parsing JSON from files or network responses
 */

// Framework schema
export const frameworkSchema = z.enum(['rn', 'unistyles']);

// Component schemas
export const componentPropSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  default: z.string().optional(),
  required: z.boolean().optional(),
});

export const componentExtendsSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const componentApiSchema = z.object({
  description: z.string(),
  extends: componentExtendsSchema.optional(),
  props: z.array(componentPropSchema),
  variants: z.record(z.array(z.string())),
});

export const componentInfoSchema = z.object({
  name: z.string(),
  dependencies: z.array(z.string()),
  externalDeps: z.array(z.string()),
  utilities: z.array(z.string()).optional(),
  setup: z.array(z.string()),
  setupCode: z.string().optional(),
  example: z.string(),
  description: z.string().optional(),
  api: componentApiSchema.optional(),
});

// Component registry schema
export const componentRegistrySchema = z.record(componentInfoSchema);

// Config schemas
export const aliasConfigSchema = z.object({
  utils: z.string(),
  components: z.string(),
  lib: z.string(),
  styles: z.string(),
  ui: z.string(),
});

export const leshiConfigSchema = z.object({
  $schema: z.string().optional(),
  framework: frameworkSchema,
  aliases: aliasConfigSchema,
  tsx: z.boolean(),
  dirs: z.object({
    components: z.string(),
    lib: z.string(),
    styles: z.string(),
    ui: z.string(),
  }),
});

// Generic package.json schema (partial)
export const packageJsonSchema = z.object({
  name: z.string(),
  version: z.string(),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
  peerDependencies: z.record(z.string()).optional(),
  scripts: z.record(z.string()).optional(),
  main: z.string().optional(),
  types: z.string().optional(),
}).passthrough(); // Allow additional properties

// TypeScript config schema (partial)
export const tsConfigSchema = z.object({
  compilerOptions: z.object({
    baseUrl: z.string().optional(),
    paths: z.record(z.array(z.string())).optional(),
  }).passthrough().optional(),
}).passthrough(); // Allow additional properties

/**
 * Safe JSON parser that validates against a Zod schema
 */
export function parseJsonWithSchema<T>(jsonString: string, schema: z.ZodSchema<T>): T {
  try {
    const parsed = JSON.parse(jsonString);
    return schema.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new Error(`JSON validation failed: ${errorMessages}`);
    }
    throw error;
  }
}

/**
 * Safe JSON parser that validates against a Zod schema with fallback
 */
export function parseJsonWithSchemaOrFallback<T>(
  jsonString: string, 
  schema: z.ZodSchema<T>, 
  fallback: T
): T {
  try {
    return parseJsonWithSchema(jsonString, schema);
  } catch {
    return fallback;
  }
}