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
  type ViewStyle,
  type TextStyle,
  type GestureResponderEvent,
} from "react-native";
import { Modal, type ModalProps } from "./modal";
import { StyleSheet } from "react-native-unistyles";
import { Text, type TextProps } from "./text";
import { Icon } from "./icon";
import { Pressable as SlotPressable } from "./slot";
import { useTheme } from "../theme/unistyles";

/*──────── context */
type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const DialogCtx = createContext<Ctx | null>(null);
const useDialog = () => {
  const ctx = useContext(DialogCtx);
  if (!ctx) throw new Error("Dialog primitives must be inside <Dialog.Root>");
  return ctx;
};

/*──────── Root */
export interface RootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (o: boolean) => void;
  children: ReactNode;
  unmountOnClose?: boolean;
}
function Root({
  open: cOpen,
  defaultOpen,
  onOpenChange,
  unmountOnClose,
  children,
}: RootProps) {
  const [uOpen, setUOpen] = useState(defaultOpen ?? false);
  const open = cOpen ?? uOpen;
  const setOpen = useCallback(
    (v: boolean) => {
      if (cOpen === undefined) setUOpen(v);
      onOpenChange?.(v);
    },
    [cOpen, onOpenChange]
  );
  const value = useMemo(() => ({ open, setOpen }), [open, setOpen]);
  if (unmountOnClose && !open) return null;
  return <DialogCtx.Provider value={value}>{children}</DialogCtx.Provider>;
}

/*──────── Trigger */
interface TriggerProps extends PressableProps {
  children: ReactNode;
  asChild?: boolean;
}
function Trigger({ children, onPress, asChild, ...rest }: TriggerProps) {
  const { setOpen } = useDialog();
  const handlePress = (e: GestureResponderEvent) => {
    onPress?.(e);
    if (!e.defaultPrevented) setOpen(true);
  };

  if (asChild) {
    if (!React.isValidElement(children))
      throw new Error(
        "Dialog.Trigger with asChild needs a single element child"
      );
    return React.cloneElement(
      children as React.ReactElement<any>,
      {
        ...(rest as any),
        onPress: (e: GestureResponderEvent) => {
          (children as any).props?.onPress?.(e);
          handlePress(e);
        },
      } as any
    );
  }

  return (
    <Pressable onPress={handlePress} {...rest}>
      {children}
    </Pressable>
  );
}

/*──────── Content */
interface ContentProps extends ViewProps, ModalProps {
  centerStyle?: StyleProp<ViewStyle>;
  showCloseButton?: boolean;
}
function Content({
  children,
  style,
  centerStyle,
  showCloseButton = true,
  statusBarTranslucent = true,
  ...rest
}: ContentProps) {
  const { open, setOpen } = useDialog();
  const theme = useTheme();

  if (!open) return null;

  return (
    <Modal
      transparent
      visible
      onRequestClose={() => setOpen(false)}
      animationType="fade"
      statusBarTranslucent={statusBarTranslucent}
      {...rest}
    >
      <View style={[styles.center, centerStyle]}>
        <View style={[styles.card, style]}>
          {children}
          {showCloseButton && (
            <Close
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            >
              <Icon name="x" size={18} color={theme.colors.mutedForeground} />
            </Close>
          )}
        </View>
      </View>
    </Modal>
  );
}

/*──────── Close */
interface CloseProps extends PressableProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function Close({ children, onPress, asChild, ...rest }: CloseProps) {
  const { setOpen } = useDialog();

  const handlePress = (e: GestureResponderEvent) => {
    onPress?.(e);
    if (!e.defaultPrevented) setOpen(false);
  };

  if (asChild) {
    return (
      <SlotPressable {...rest} onPress={handlePress}>
        {children as React.ReactElement}
      </SlotPressable>
    );
  }

  return (
    <Pressable onPress={handlePress} {...rest}>
      {children}
    </Pressable>
  );
}

/*──────── Header / Footer */
function Header({ style, ...r }: ViewProps) {
  return <View style={[styles.header, style]} {...r} />;
}
interface FooterProps extends ViewProps {
  orientation?: "row" | "column";
}
function Footer({ orientation = "row", style, ...r }: FooterProps) {
  return (
    <View
      style={[
        styles.footer,
        orientation === "column" && styles.footerColumn,
        style,
      ]}
      {...r}
    />
  );
}

/*──────── Title / Description */
type TitleProps = TextProps & { style?: StyleProp<TextStyle> };
const Title: React.FC<TitleProps> = ({
  children,
  size = "lg",
  weight = "semibold",
  style,
  ...tp
}) => (
  <Text size={size} weight={weight} style={style} {...tp}>
    {children}
  </Text>
);
type DescriptionProps = TextProps & { style?: StyleProp<TextStyle> };
const Description: React.FC<DescriptionProps> = ({
  children,
  variant = "mutedForeground",
  size = "base",
  style,
  ...tp
}) => (
  <Text variant={variant} size={size} style={style} {...tp}>
    {children}
  </Text>
);

/*──────── styles */
const styles = StyleSheet.create((t) => ({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: t.sizes.padding(4),
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: t.colors.card,
    borderRadius: t.radii.xl,
    padding: t.sizes.padding(6),
    gap: t.sizes.gap(6),
    ...t.shadows.xl,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
  },
  header: { gap: t.sizes.gap(2) },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: t.sizes.gap(2),
  },
  footerColumn: {
    flexDirection: "column-reverse",
    justifyContent: "flex-start",
  },
}));

/*──────── export */
export const Dialog = {
  Root,
  Trigger,
  Content,
  Header,
  Footer,
  Title,
  Description,
  Close,
};
