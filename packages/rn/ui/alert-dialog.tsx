import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Modal,
  Pressable,
  View,
  StyleSheet,
  type PressableProps,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { useTheme } from "../theme/native";
import { Text, type TextProps } from "./text";
import { Button, type ButtonProps } from "./button";

/*──────── context ────────*/
type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const DialogCtx = createContext<Ctx | null>(null);
const useDialog = () => {
  const ctx = useContext(DialogCtx);
  if (!ctx)
    throw new Error("AlertDialog primitives must be inside <AlertDialog.Root>");
  return ctx;
};

/*──────── Root ────────*/
export interface RootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (o: boolean) => void;
  children: ReactNode;
}
function Root({ open: cOpen, defaultOpen, onOpenChange, children }: RootProps) {
  const [uOpen, setUOpen] = useState(defaultOpen ?? false);
  const open = cOpen ?? uOpen;
  const setOpen = useCallback(
    (v: boolean) => {
      if (cOpen === undefined) setUOpen(v);
      onOpenChange?.(v);
    },
    [cOpen, onOpenChange]
  );

  const ctx = useMemo(() => ({ open, setOpen }), [open, setOpen]);
  return <DialogCtx.Provider value={ctx}>{children}</DialogCtx.Provider>;
}

/*──────── Trigger  */
interface TriggerProps extends PressableProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function Trigger({ children, onPress, asChild, ...rest }: TriggerProps) {
  const { setOpen } = useDialog();

  const handlePress = (e: any) => {
    onPress?.(e);
    if (!e.defaultPrevented) setOpen(true);
  };
  if (asChild) {
    if (!React.isValidElement(children))
      throw new Error(
        "AlertDialog.Trigger with asChild needs a single React element child"
      );
    return React.cloneElement(
      children as React.ReactElement<any>,
      {
        ...(rest as any),
        onPress: (e: any) => {
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

/*──────── Overlay */
interface OverlayProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}
function Overlay({ style, ...rest }: OverlayProps) {
  const s = useStyles();
  return <View style={[s.overlay, style]} {...rest} />;
}

/*──────── Center wrapper */
function Center({ style, ...rest }: ViewProps) {
  const s = useStyles();
  return <View style={[s.center, style]} {...rest} />;
}

/*──────── Content = Modal + card */
interface ContentProps extends ViewProps {
  overlayStyle?: StyleProp<ViewStyle>;
  centerStyle?: StyleProp<ViewStyle>;
}
function Content({
  children,
  style,
  overlayStyle,
  centerStyle,
  ...rest
}: ContentProps) {
  const { open, setOpen } = useDialog();
  const s = useStyles();

  if (!open) return null;

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible
      onRequestClose={() => setOpen(false)}
      animationType="fade"
    >
      <Overlay style={overlayStyle} />
      <Center style={centerStyle}>
        <View style={[s.card, style]} {...rest}>
          {children}
        </View>
      </Center>
    </Modal>
  );
}

/*──────── Header / Footer */
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

/*──────── CTA Buttons */
type CTAProps = ButtonProps & { text?: string };
function Action({ text = "Confirm", onPress, ...btn }: CTAProps) {
  const { setOpen } = useDialog();
  return (
    <Button
      text={text}
      onPress={(e) => {
        onPress?.(e);
        if (!e.defaultPrevented) setOpen(false);
      }}
      {...btn}
    />
  );
}
function Cancel({ text = "Cancel", variant, onPress, ...btn }: CTAProps) {
  const { setOpen } = useDialog();
  return (
    <Button
      variant={variant ?? "outline"}
      text={text}
      onPress={(e) => {
        onPress?.(e);
        if (!e.defaultPrevented) setOpen(false);
      }}
      {...btn}
    />
  );
}

function useStyles() {
  const t = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.5)",
        },
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

export const AlertDialog = {
  Root,
  Trigger,
  Content,
  Header,
  Footer,
  Overlay,
  Title,
  Description,
  Action,
  Cancel,
};
