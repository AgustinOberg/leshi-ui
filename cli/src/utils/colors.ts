import chalk from 'chalk';

export const colors = {
  primary: chalk.cyan,
  secondary: chalk.magenta,
  accent: chalk.blue,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  info: chalk.blue,
  dim: chalk.dim,
  bold: chalk.bold,
  underline: chalk.underline,
} as const;

export const icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  rocket: '🚀',
  sparkles: '✨',
  package: '📦',
  folder: '📁',
  file: '📄',
  gear: '⚙️',
  lightbulb: '💡',
  books: '📚',
  list: '📋',
  theme: '🎨',
  question: '❓',
  cancel: '❌',
  api: '🔧',
  table: '📊',
} as const;