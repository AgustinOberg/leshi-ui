import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  Pressable,
  View,
  type PressableProps,
  type ViewProps,
  type StyleProp,
  type TextStyle,
  type GestureResponderEvent,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Modal, type ModalProps, type ModalSize } from './modal';
import { Text, type TextProps } from './text';
import { Button, type ButtonProps } from './button';
import { Pressable as SlotPressable } from './slot';
import { useTheme } from '../../styles/context';

/*──────────────────── Types */
export type AlertDialogVariant = 'default' | 'destructive' | 'warning';

/*──────────────────── Context */
interface AlertDialogContextValue {
  readonly open: boolean;
  readonly setOpen: (value: boolean) => void;
  readonly size: ModalSize;
  readonly variant: AlertDialogVariant;
  readonly loading: boolean;
  readonly setLoading: (value: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

const useAlertDialog = () => {
  const ctx = useContext(AlertDialogContext);
  if (!ctx)
    throw new Error(
      'AlertDialog components must be used within <AlertDialog.Root>',
    );
  return ctx;
};

/*──────────────────── Root */
export interface AlertDialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  unmountOnClose?: boolean;
  size?: ModalSize;
  variant?: AlertDialogVariant;
}

function AlertDialogRoot({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  unmountOnClose = false,
  size = 'sm',
  variant = 'default',
}: AlertDialogRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);

  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen = useCallback(
    (v: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(v);
      }
      onOpenChange?.(v);
    },
    [controlledOpen, onOpenChange],
  );

  const value = useMemo(
    () => ({ open, setOpen, size, variant, loading, setLoading }),
    [open, setOpen, size, variant, loading, setLoading],
  );

  if (unmountOnClose && !open) {
    return null;
  }

  return (
    <AlertDialogContext.Provider value={value}>
      {children}
    </AlertDialogContext.Provider>
  );
}

/*──────────────────── Trigger */
interface AlertDialogTriggerProps extends PressableProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function AlertDialogTrigger({
  children,
  onPress,
  asChild,
  ...rest
}: AlertDialogTriggerProps) {
  const { setOpen, loading } = useAlertDialog();

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (loading) return;
      onPress?.(e);
      if (!e.defaultPrevented) {
        setOpen(true);
      }
    },
    [onPress, setOpen, loading],
  );

  if (asChild && React.isValidElement(children)) {
    return (
      <SlotPressable
        {...rest}
        onPress={handlePress}
        disabled={loading}
      >
        {children}
      </SlotPressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

/*──────────────────── Content */
interface AlertDialogContentProps
  extends Omit<ViewProps, 'children'>,
    Omit<ModalProps, 'visible' | 'size' | 'children'> {
  children?: React.ReactNode;
}

function AlertDialogContent({
  children,
  style,
  statusBarTranslucent = true,
  animationType = 'scale',
  closeOnBackdrop = false, // AlertDialog should not close on backdrop by default
  closeOnBackButton = false, // AlertDialog should not close on back button by default
  ...rest
}: AlertDialogContentProps) {
  const { open, setOpen, size, variant, loading, setLoading } =
    useAlertDialog();
  const theme = useTheme();

  styles.useVariants({ variant: variant as any });

  const handleRequestClose = useCallback(() => {
    // AlertDialog typically doesn't auto-close, but we respect the prop
    if (closeOnBackdrop || closeOnBackButton) {
      setOpen(false);
    }
  }, [setOpen, closeOnBackdrop, closeOnBackButton]);

  if (!open) return null;

  return (
    <Modal
      visible={open}
      onRequestClose={handleRequestClose}
      animationType={animationType}
      size={size}
      closeOnBackdrop={closeOnBackdrop}
      closeOnBackButton={closeOnBackButton}
      statusBarTranslucent={statusBarTranslucent}
      backdropColor={theme.backdrop.color}
      style={[styles.content, style]}
      {...rest}
    >
      <AlertDialogContext.Provider
        value={{ open, setOpen, size, variant, loading, setLoading }}
      >
        {children}
      </AlertDialogContext.Provider>
    </Modal>
  );
}

/*──────────────────── Header */
function AlertDialogHeader({ style, ...rest }: ViewProps) {
  return (
    <View
      style={[styles.header, style]}
      {...rest}
    />
  );
}

/*──────────────────── Footer */
interface AlertDialogFooterProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
}

function AlertDialogFooter({
  orientation = 'horizontal',
  style,
  ...rest
}: AlertDialogFooterProps) {
  return (
    <View
      style={[
        styles.footer,
        orientation === 'vertical' && styles.footerVertical,
        style,
      ]}
      {...rest}
    />
  );
}

/*──────────────────── Title */
interface AlertDialogTitleProps extends TextProps {
  style?: StyleProp<TextStyle>;
}

const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({
  children,
  size = 'lg',
  weight = 'semibold',
  variant = 'foreground',
  style,
  ...textProps
}) => (
  <Text
    size={size}
    weight={weight}
    variant={variant}
    style={style}
    accessibilityRole='header'
    {...textProps}
  >
    {children}
  </Text>
);

/*──────────────────── Description */
interface AlertDialogDescriptionProps extends TextProps {
  style?: StyleProp<TextStyle>;
}

const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({
  children,
  variant = 'mutedForeground',
  size = 'base',
  style,
  ...textProps
}) => (
  <Text
    variant={variant}
    size={size}
    style={style}
    {...textProps}
  >
    {children}
  </Text>
);

/*──────────────────── Action Button */
interface AlertDialogActionProps extends Omit<ButtonProps, 'onPress'> {
  readonly onPress?: (event: GestureResponderEvent) => void | Promise<void>;
  readonly asChild?: boolean;
  readonly children?: React.ReactNode;
  readonly closeOnPress?: boolean;
}

function AlertDialogAction({
  onPress,
  asChild,
  children,
  closeOnPress = true,
  text = 'Continue',
  variant: buttonVariant,
  loading: buttonLoading,
  disabled,
  ...buttonProps
}: AlertDialogActionProps) {
  const {
    setOpen,
    variant: dialogVariant,
    loading: dialogLoading,
    setLoading,
  } = useAlertDialog();

  // Determine button variant based on alert dialog variant
  const defaultVariant = useMemo(() => {
    switch (dialogVariant) {
      case 'destructive':
        return 'destructive';
      case 'warning':
        return 'primary';
      default:
        return 'primary';
    }
  }, [dialogVariant]);

  const finalVariant = buttonVariant ?? defaultVariant;
  const isLoading = buttonLoading ?? dialogLoading;
  const isDisabled = disabled || isLoading;

  const handlePress = useCallback(
    async (e: GestureResponderEvent) => {
      if (isDisabled) return;

      try {
        if (onPress) {
          setLoading(true);
          const result = onPress(e);

          // Handle async functions
          if (result instanceof Promise) {
            await result;
          }
        }

        if (closeOnPress && !e.defaultPrevented) {
          setOpen(false);
        }
      } catch (error) {
        // Handle errors silently in production - errors are caught and UI remains functional
      } finally {
        setLoading(false);
      }
    },
    [onPress, closeOnPress, setOpen, setLoading, isDisabled],
  );

  if (asChild) {
    if (!React.isValidElement(children)) {
      throw new Error(
        'AlertDialog.Action with asChild requires a single React element as child',
      );
    }

    const childElement = children as React.ReactElement<ButtonProps>;
    return React.cloneElement(childElement, {
      ...buttonProps,
      disabled: isDisabled,
      loading: isLoading,
      onPress: handlePress,
    });
  }

  return (
    <Button
      text={text}
      variant={finalVariant}
      loading={isLoading}
      disabled={isDisabled}
      onPress={handlePress}
      {...buttonProps}
    />
  );
}

/*──────────────────── Cancel Button */
interface AlertDialogCancelProps extends Omit<ButtonProps, 'onPress'> {
  readonly onPress?: (event: GestureResponderEvent) => void | Promise<void>;
  readonly asChild?: boolean;
  readonly children?: React.ReactNode;
  readonly closeOnPress?: boolean;
}

function AlertDialogCancel({
  onPress,
  asChild,
  children,
  closeOnPress = true,
  text = 'Cancel',
  variant = 'outline',
  loading: buttonLoading,
  disabled,
  ...buttonProps
}: AlertDialogCancelProps) {
  const { setOpen, loading: dialogLoading } = useAlertDialog();

  const isLoading = buttonLoading ?? dialogLoading;
  const isDisabled = disabled || isLoading;

  const handlePress = useCallback(
    async (e: GestureResponderEvent) => {
      if (isDisabled) return;

      try {
        if (onPress) {
          const result = onPress(e);

          // Handle async functions
          if (result instanceof Promise) {
            await result;
          }
        }

        if (closeOnPress && !e.defaultPrevented) {
          setOpen(false);
        }
      } catch (error) {
        // Handle errors silently in production - errors are caught and UI remains functional
      }
    },
    [onPress, closeOnPress, setOpen, isDisabled],
  );

  if (asChild) {
    if (!React.isValidElement(children)) {
      throw new Error(
        'AlertDialog.Cancel with asChild requires a single React element as child',
      );
    }

    const childElement = children as React.ReactElement<ButtonProps>;
    return React.cloneElement(childElement, {
      ...buttonProps,
      disabled: isDisabled,
      loading: isLoading,
      onPress: handlePress,
    });
  }

  return (
    <Button
      text={text}
      variant={variant}
      loading={isLoading}
      disabled={isDisabled}
      onPress={handlePress}
      {...buttonProps}
    />
  );
}

/*──────────────────── Styles */
const styles = StyleSheet.create((theme) => ({
  content: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.xl,
    padding: theme.sizes.padding(6),
    gap: theme.sizes.gap(4),
    ...theme.shadows.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,

    variants: {
      variant: {
        default: {
          borderColor: theme.colors.border,
        },
        destructive: {
          borderColor: theme.colors.destructive,
          borderWidth: 2,
        },
        warning: {
          borderColor: theme.colors.primary,
          borderWidth: 2,
        },
      },
    },
  },
  header: {
    gap: theme.sizes.gap(2),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.sizes.gap(2),
    marginTop: theme.sizes.gap(2),
  },
  footerVertical: {
    flexDirection: 'column-reverse',
    alignItems: 'stretch',
  },
}));

/*──────────────────── Public API */
export const AlertDialog = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
};

export type {
  AlertDialogTriggerProps,
  AlertDialogContentProps,
  AlertDialogFooterProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
};
