/**
 * Modal Provider abstraction
 * 
 * This component provides an abstraction over @gorhom/portal to allow
 * easy replacement of the underlying portal library if needed in the future.
 * 
 * Architecture decision: Isolate external dependencies behind clean interfaces
 */

import React from 'react';
import { PortalProvider } from '@gorhom/portal';

export interface ModalProviderProps {
  children: React.ReactNode;
}

/**
 * ModalProvider - Abstraction over portal provider
 * 
 * Usage:
 * ```tsx
 * import { ModalProvider } from '@leshi/ui-rn';
 * 
 * function App() {
 *   return (
 *     <ModalProvider>
 *       <YourApp />
 *     </ModalProvider>
 *   );
 * }
 * ```
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  return <PortalProvider>{children}</PortalProvider>;
};

ModalProvider.displayName = 'ModalProvider';