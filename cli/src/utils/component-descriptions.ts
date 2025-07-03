/**
 * Centralized component descriptions used across the CLI
 * This ensures consistency between component registry and guide command
 */

export const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  'button': 'A versatile button component with multiple variants (primary, secondary, outline, ghost, destructive) and sizes (sm, base, lg). Supports loading states and custom styling.',
  'text': 'A typography component with semantic variants (heading, body, caption) and font weights. Provides consistent text rendering across platforms.',
  'modal': 'A flexible modal component with smooth animations and backdrop support. Requires @gorhom/portal for proper rendering.',
  'dialog': 'A dialog component built on top of the modal system. Includes header, content, and footer sections with pre-styled layouts.',
  'alert-dialog': 'A confirmation dialog for destructive actions. Features clear action and cancel buttons with appropriate styling.',
  'surface': 'A container component with elevation, padding, and border radius options. Perfect for cards and elevated content.',
  'text-input': 'A text input component with label, validation states (error, success), and helper text support.',
  'text-area': 'A multi-line text input with configurable rows and the same features as text-input.',
  'checkbox': 'A custom-styled checkbox component with label support and smooth animations.',
  'switch': 'An animated toggle switch component with smooth transitions and customizable styling.',
  'progress': 'An animated progress bar component with different variants and smooth value transitions.',
  'skeleton': 'A loading skeleton component with pulse animations for placeholder content.',
  'avatar': 'An avatar component with image source, fallback text, and multiple size options.',
  'badge': 'A small status indicator with different variants (default, secondary, destructive) and sizes.',
  'divider': 'A visual separator component for organizing content sections.',
  'icon': 'A customizable icon component with theming support and size variants.',
  'label': 'A form label component with required indicator and consistent styling.',
  'radio': 'Radio button components for single-choice selections with group management.',
  'slot': 'A utility component for component composition and flexible layouts.',
  'spinner': 'A loading spinner component with different sizes and smooth animations.',
};

/**
 * Get component description with fallback
 */
export function getComponentDescription(componentName: string): string {
  return COMPONENT_DESCRIPTIONS[componentName] || 'A UI component for React Native applications.';
}

/**
 * Get short description for list views
 */
export function getComponentShortDescription(componentName: string): string {
  const shortDescriptions: Record<string, string> = {
    'button': 'UI component with variants and sizes',
    'text': 'Typography component with semantic variants',
    'modal': 'Flexible modal with animations',
    'dialog': 'Dialog built on modal',
    'alert-dialog': 'Confirmation dialogs',
    'surface': 'Surface with elevation and variants',
    'text-input': 'Input with validation states',
    'text-area': 'Multi-line text input',
    'checkbox': 'Custom styled checkbox',
    'switch': 'Animated switch component',
    'progress': 'Progress bar with animations',
    'skeleton': 'Loading skeleton with animations',
    'avatar': 'Avatar with fallback support',
    'badge': 'Status and label badges',
    'divider': 'Visual separator component',
    'icon': 'Icon component with theming',
    'label': 'Form labels with styling',
    'radio': 'Radio group and items',
    'slot': 'Component composition utility',
    'spinner': 'Loading spinner with animations',
  };

  return shortDescriptions[componentName] || 'UI component';
}