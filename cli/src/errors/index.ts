// Error constants for better error handling
export const CLI_ERRORS = {
  COMPONENT_NOT_FOUND: 'COMPONENT_NOT_FOUND',
  INVALID_PROJECT: 'INVALID_PROJECT',
  MISSING_CONFIG: 'MISSING_CONFIG',
  DEPENDENCY_RESOLUTION_FAILED: 'DEPENDENCY_RESOLUTION_FAILED',
  FILE_OPERATION_FAILED: 'FILE_OPERATION_FAILED',
  THEME_VALIDATION_FAILED: 'THEME_VALIDATION_FAILED',
  INVALID_FRAMEWORK: 'INVALID_FRAMEWORK',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  ROLLBACK_FAILED: 'ROLLBACK_FAILED',
  IMPORT_TRANSFORMATION_FAILED: 'IMPORT_TRANSFORMATION_FAILED'
} as const;

export type CLIErrorCode = keyof typeof CLI_ERRORS;

export class CLIError extends Error {
  public readonly code: CLIErrorCode;
  public readonly details?: unknown;

  constructor(code: CLIErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'CLIError';
    this.code = code;
    this.details = details;
    
    // Maintain proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CLIError);
    }
  }
}

export class ComponentNotFoundError extends CLIError {
  constructor(componentName: string, availableComponents?: string[]) {
    super(
      'COMPONENT_NOT_FOUND',
      `Component '${componentName}' not found`,
      { componentName, availableComponents }
    );
  }
}

export class InvalidProjectError extends CLIError {
  constructor(reason: string, projectPath?: string) {
    super(
      'INVALID_PROJECT',
      `Invalid React Native project: ${reason}`,
      { reason, projectPath }
    );
  }
}

export class DependencyResolutionError extends CLIError {
  constructor(componentName: string, missingDependencies: string[]) {
    super(
      'DEPENDENCY_RESOLUTION_FAILED',
      `Failed to resolve dependencies for '${componentName}'`,
      { componentName, missingDependencies }
    );
  }
}

export class FileOperationError extends CLIError {
  constructor(operation: string, filePath: string, originalError?: Error) {
    super(
      'FILE_OPERATION_FAILED',
      `Failed to ${operation} file: ${filePath}`,
      { operation, filePath, originalError }
    );
  }
}

export class ValidationError extends CLIError {
  constructor(field: string, value: unknown, expectedType: string) {
    super(
      'VALIDATION_ERROR',
      `Validation failed for '${field}': expected ${expectedType}`,
      { field, value, expectedType }
    );
  }
}

// Error handler utility
export class ErrorHandler {
  public static handle(error: Error, silent = false): never {
    if (!silent) {
      if (error instanceof CLIError) {
        ErrorHandler.handleCLIError(error);
      } else {
        ErrorHandler.handleUnknownError(error);
      }
    }
    
    process.exit(1);
  }

  private static handleCLIError(error: CLIError): void {
    console.error(`❌ ${error.message}`);
    
    switch (error.code) {
      case 'COMPONENT_NOT_FOUND':
        console.error('💡 Run `leshi-ui guide components` to see available components');
        if (error.details && typeof error.details === 'object' && 'availableComponents' in error.details) {
          const available = error.details.availableComponents as string[];
          if (available.length > 0) {
            console.error('Available components:', available.join(', '));
          }
        }
        break;
        
      case 'INVALID_PROJECT':
        console.error('💡 Make sure you\'re in a React Native project directory');
        console.error('💡 Run `leshi-ui init` to set up the project');
        break;
        
      case 'MISSING_CONFIG':
        console.error('💡 Run `leshi-ui init` to create a configuration file');
        break;
        
      case 'DEPENDENCY_RESOLUTION_FAILED':
        console.error('💡 Try installing dependencies manually');
        if (error.details && typeof error.details === 'object' && 'missingDependencies' in error.details) {
          const missing = error.details.missingDependencies as string[];
          console.error('Missing dependencies:', missing.join(', '));
        }
        break;
        
      case 'FILE_OPERATION_FAILED':
        console.error('💡 Check file permissions and try again');
        break;
        
      case 'VALIDATION_ERROR':
        console.error('💡 Check your input parameters and try again');
        break;
        
      default:
        console.error('💡 Please check the error details above and try again');
    }
    
    if (error.details) {
      console.error('\nDetails:', JSON.stringify(error.details, null, 2));
    }
  }

  private static handleUnknownError(error: Error): void {
    console.error('❌ An unexpected error occurred:', error.message);
    console.error('💡 Please report this issue at: https://github.com/your-repo/issues');
    
    if (process.env.DEBUG) {
      console.error('\nStack trace:', error.stack);
    }
  }
}

// Utility function for error handling
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof Error) {
        ErrorHandler.handle(error);
      } else {
        ErrorHandler.handle(new Error(String(error)));
      }
    }
  };
}