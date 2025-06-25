/**
 * Modal utility functions for consistent behavior across all modal components
 */

import type { Theme } from '../theme/theme';

/**
 * Get standardized backdrop configuration for all modal components
 * Ensures consistent appearance across Modal, Dialog, and AlertDialog
 */
export function getBackdropConfig(theme: Theme) {
  return {
    color: theme.backdrop.color,
    opacity: theme.backdrop.opacity,
  };
}

/**
 * Default modal configuration that all modal components should use
 */
export const DEFAULT_MODAL_CONFIG = {
  statusBarTranslucent: true,
  closeOnBackdrop: true,
  closeOnBackButton: true,
} as const;

/**
 * AlertDialog specific defaults (more restrictive than regular modals)
 */
export const ALERT_DIALOG_CONFIG = {
  statusBarTranslucent: true,
  closeOnBackdrop: false, // AlertDialog should not close on backdrop by default
  closeOnBackButton: false, // AlertDialog should not close on back button by default
} as const;