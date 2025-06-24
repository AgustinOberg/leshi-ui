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
} from "react-native";
import { Modal, type ModalProps } from "./modal";
import { useTheme } from "@/theme/native";
import { Text, type TextProps } from "./text";
import { Button, type ButtonProps } from "./button";
import { Pressable as SlotPressable } from "./slot";

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

  const ctx = useMemo(() => ({ open, setOpen }), [open, setOpen]);
  if (unmountOnClose && !open) {
    return null;
  }
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

/*──────── Content = Modal + card */
interface ContentProps extends ViewProps, ModalProps {
  centerStyle?: StyleProp<ViewStyle>;
}
function Content({
  children,
  style,
  centerStyle,
  statusBarTranslucent = true,
  ...rest
}: ContentProps) {
  const { open, setOpen } = useDialog();
  const s = useStyles();

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
        </View>
      </View>
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
  Title,
  Description,
  Action,
  Cancel,
};
