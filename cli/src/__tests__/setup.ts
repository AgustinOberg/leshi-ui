import { vol } from 'memfs';

// Mock fs-extra to use memfs for testing
jest.mock('fs-extra', () => {
  const memfs = require('memfs');
  return memfs.fs;
});

// Setup mock filesystem before each test
beforeEach(() => {
  vol.reset();
  
  // Create a mock project structure
  vol.fromJSON({
    '/test-project/package.json': JSON.stringify({
      name: 'test-project',
      version: '1.0.0',
      dependencies: {
        'react-native': '^0.73.0',
        'expo': '^50.0.0'
      }
    }),
    '/test-project/app.json': JSON.stringify({
      expo: {
        name: 'Test Project'
      }
    }),
    '/test-project/metro.config.js': 'module.exports = {};',
    '/packages/rn/components/ui/button.tsx': `
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const Button = ({ text, ...props }) => (
  <TouchableOpacity {...props}>
    <Text>{text}</Text>
  </TouchableOpacity>
);`,
    '/packages/rn/lib/modal-utils.ts': `
export const DEFAULT_MODAL_CONFIG = {
  statusBarTranslucent: true,
  closeOnBackdrop: true,
};`,
    '/packages/rn/styles/theme.ts': `
export const useTheme = () => ({
  colors: { primary: '#000' }
});`
  });
});

// Global test timeout
jest.setTimeout(30000);

// Suppress console.log in tests unless DEBUG is set
if (!process.env.DEBUG) {
  global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}