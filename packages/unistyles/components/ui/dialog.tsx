import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Pressable,
  View,
  type PressableProps,
  type ViewProps,
  type StyleProp,
  type TextStyle,
  type GestureResponderEvent,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Modal, type ModalProps, type ModalSize } from "./modal";
import { Text, type TextProps } from "./text";
import { Pressable as SlotPressable } from "./slot";
import { Icon } from "./icon";
import { useTheme } from "../../styles/context";

/*──────────────────── Context */
interface DialogContextValue {
  readonly open: boolean;
  readonly setOpen: (value: boolean) => void;
  readonly size: ModalSize;
  readonly loading: boolean;
  readonly setLoading: (value: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog.Root>");
  return ctx;
};

/*──────────────────── Root */
export interface DialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  unmountOnClose?: boolean;
  size?: ModalSize;
}

function DialogRoot({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  unmountOnClose = false,
  size = "base",
}: DialogRootProps) {
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
    [controlledOpen, onOpenChange]
  );

  const value = useMemo(
    () => ({ open, setOpen, size, loading, setLoading }),
    [open, setOpen, size, loading, setLoading]
  );

  if (unmountOnClose && !open) {
    return null;
  }

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
}

/*──────────────────── Trigger */
interface DialogTriggerProps extends PressableProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function DialogTrigger({ children, onPress, asChild, ...rest }: DialogTriggerProps) {
  const { setOpen, loading } = useDialog();
  
  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (loading) return;
      onPress?.(e);
      if (!e.defaultPrevented) {
        setOpen(true);
      }
    },
    [onPress, setOpen, loading]
  );

  if (asChild && React.isValidElement(children)) {
    return (
      <SlotPressable {...rest} onPress={handlePress} disabled={loading}>
        {children}
      </SlotPressable>
    );
  }

  return (
    <Pressable onPress={handlePress} disabled={loading} {...rest}>
      {children}
    </Pressable>
  );
}

/*──────────────────── Close */
interface DialogCloseProps extends PressableProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function DialogClose({ children, onPress, asChild, ...rest }: DialogCloseProps) {
  const { setOpen, loading } = useDialog();
  
  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (loading) return;
      onPress?.(e);
      if (!e.defaultPrevented) {
        setOpen(false);
      }
    },
    [onPress, setOpen, loading]
  );

  if (asChild) {
    if (!React.isValidElement(children)) {
      throw new Error("Dialog.Close with asChild requires a single React element as child");
    }

    const childElement = children as React.ReactElement<PressableProps>;
    return React.cloneElement(
      childElement,
      {
        ...rest,
        disabled: loading || childElement.props?.disabled,
        onPress: (e: GestureResponderEvent) => {
          childElement.props?.onPress?.(e);
          handlePress(e);
        },
      }
    );
  }

  return (
    <Pressable onPress={handlePress} disabled={loading} {...rest}>
      {children}
    </Pressable>
  );
}

/*──────────────────── Content */
interface DialogContentProps extends Omit<ViewProps, 'children'>, Omit<ModalProps, 'visible' | 'size' | 'children'> {
  children?: React.ReactNode;
  showCloseButton?: boolean;
}

function DialogContent({
  children,
  style,
  showCloseButton = true,
  statusBarTranslucent = true,
  animationType = "scale",
  closeOnBackdrop = true,
  closeOnBackButton = true,
  ...rest
}: DialogContentProps) {
  const { open, setOpen, size, loading, setLoading } = useDialog();
  const theme = useTheme();

  const handleRequestClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

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
      style={[stylesheet.content, style]}
      {...rest}
    >
      <DialogContext.Provider value={{ open, setOpen, size, loading, setLoading }}>
        {children}
        {showCloseButton && (
          <DialogClose
            style={stylesheet.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Close dialog"
            accessibilityHint="Closes the dialog"
          >
            <Icon name="x" size={20} color={theme.colors.mutedForeground} />
          </DialogClose>
        )}
      </DialogContext.Provider>
    </Modal>
  );
}

/*──────────────────── Header */
function DialogHeader({ style, ...rest }: ViewProps) {
  return <View style={[stylesheet.header, style]} {...rest} />;
}

/*──────────────────── Footer */
interface DialogFooterProps extends ViewProps {
  orientation?: "horizontal" | "vertical";
}

function DialogFooter({ 
  orientation = "horizontal", 
  style, 
  ...rest 
}: DialogFooterProps) {
  return (
    <View
      style={[
        stylesheet.footer,
        orientation === "vertical" && stylesheet.footerVertical,
        style,
      ]}
      {...rest}
    />
  );
}

/*──────────────────── Title */
interface DialogTitleProps extends TextProps {
  style?: StyleProp<TextStyle>;
}

const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  size = "lg",
  weight = "semibold",
  variant = "foreground",
  style,
  ...textProps
}) => (
  <Text 
    size={size} 
    weight={weight} 
    variant={variant}
    style={style}
    accessibilityRole="header"
    {...textProps}
  >
    {children}
  </Text>
);

/*──────────────────── Description */
interface DialogDescriptionProps extends TextProps {
  style?: StyleProp<TextStyle>;
}

const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  variant = "mutedForeground",
  size = "base",
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

/*──────────────────── Styles */
const stylesheet = StyleSheet.create((theme) => ({
  content: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.xl,
    padding: theme.sizes.padding(6),
    gap: theme.sizes.gap(4),
    ...theme.shadows.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  closeButton: {
    position: "absolute",
    top: theme.sizes.padding(4),
    right: theme.sizes.padding(4),
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  header: {
    gap: theme.sizes.gap(2),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: theme.sizes.gap(2),
    marginTop: theme.sizes.gap(2),
  },
  footerVertical: {
    flexDirection: "column-reverse",
    alignItems: "stretch",
  },
}));

/*──────────────────── Public API */
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};

export type { 
  DialogTriggerProps,
  DialogCloseProps,
  DialogContentProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
};