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
  StyleSheet,
  type PressableProps,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  type GestureResponderEvent,
} from "react-native";
import { Modal, type ModalProps } from "./modal";
import { useTheme } from "../theme/native";
import { Text, type TextProps } from "./text";
import { Pressable as SlotPressable } from "./slot";
import { Icon } from "./icon";

/*──────────────────── Context */
type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const DialogCtx = createContext<Ctx | null>(null);
const useDialog = () => {
  const ctx = useContext(DialogCtx);
  if (!ctx) throw new Error("Dialog primitives must be inside <Dialog.Root>");
  return ctx;
};

/*──────────────────── Root */
export interface RootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  unmountOnClose?: boolean;
}
function Root({
  open: cOpen,
  defaultOpen,
  onOpenChange,
  children,
  unmountOnClose,
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

/*──────────────────── Trigger */
interface TriggerProps extends PressableProps {
  children: React.ReactNode;
  asChild?: boolean;
}
function Trigger({ children, onPress, asChild, ...rest }: TriggerProps) {
  const { setOpen } = useDialog();
  const handlePress = (e: GestureResponderEvent) => {
    onPress?.(e);
    if (!e.defaultPrevented) setOpen(true);
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

/*──────────────────── Close */
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
    if (!React.isValidElement(children))
      throw new Error("Dialog.Close with asChild needs a single element child");

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

/*──────────────────── Content (Modal + card) */
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
  const s = useStyles();
  const t = useTheme();

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
      <View style={[s.center, centerStyle]}>
        <View style={[s.card, style]}>
          {children}
          {showCloseButton && (
            <Close
              style={s.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            >
              <Icon name="x" size={18} color={t.colors.mutedForeground} />
            </Close>
          )}
        </View>
      </View>
    </Modal>
  );
}

/*──────────────────── Header / Footer */
function Header({ style, ...rest }: ViewProps) {
  const s = useStyles();
  return <View style={[s.header, style]} {...rest} />;
}
interface FooterProps extends ViewProps {
  orientation?: "row" | "column";
}
function Footer({ orientation = "row", style, ...rest }: FooterProps) {
  const s = useStyles();
  return (
    <View
      style={[s.footer, orientation === "column" && s.footerColumn, style]}
      {...rest}
    />
  );
}

/*──────────────────── Title / Description */
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

/*──────────────────── styles hook */
function useStyles() {
  const t = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
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
      }),
    [t]
  );
}

/*──────────────────── Public API */
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
