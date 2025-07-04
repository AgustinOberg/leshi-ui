import React, { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../../styles/theme";
import type { Theme } from "../../styles/theme";
import { Text } from "./text";

export type ToggleVariant = "default" | "outline";
export type ToggleSize = "default" | "sm" | "lg";

export interface ToggleProps extends Omit<PressableProps, "style"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const Toggle = React.memo<ToggleProps>(({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  variant = "default",
  size = "default",
  style,
  children,
  disabled,
  onPress,
  ...rest
}) => {
  const theme = useTheme();
  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const isControlled = pressedProp !== undefined;
  const pressed = isControlled ? pressedProp : internalPressed;

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handlePress = useCallback(
    (e: any) => {
      const newPressed = !pressed;
      if (!isControlled) setInternalPressed(newPressed);
      onPressedChange?.(newPressed);
      onPress?.(e);
    },
    [pressed, isControlled, onPressedChange, onPress]
  );

  const containerStyle = useMemo(() => {
    const arr: StyleProp<ViewStyle>[] = [
      styles.container,
      styles.variant[variant],
      styles.size[size],
      pressed ? styles.state.on : styles.state.off,
    ];
    if (disabled) arr.push(styles.disabled);
    if (style) arr.push(style);
    return arr;
  }, [styles, variant, size, pressed, disabled, style]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: pressed } as any}
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed: isPressed }) => [
        ...containerStyle,
        isPressed && !disabled && styles.pressed,
      ]}
      {...rest}
    >
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </Pressable>
  );
});

Toggle.displayName = "Toggle";

const createStyles = (theme: Theme) => {
  const base = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.sizes.gap(2),
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: "transparent",
    },
    pressed: { opacity: 0.8 },
    disabled: { opacity: 0.5 },
  });

  const variant = {
    default: {},
    outline: {
      borderColor: theme.colors.input,
    },
  } as const;

  const size = {
    default: {
      height: theme.sizes.height(9),
      minWidth: theme.sizes.width(9),
      paddingHorizontal: theme.sizes.padding(2),
    },
    sm: {
      height: theme.sizes.height(8),
      minWidth: theme.sizes.width(8),
      paddingHorizontal: theme.sizes.padding(1.5),
    },
    lg: {
      height: theme.sizes.height(10),
      minWidth: theme.sizes.width(10),
      paddingHorizontal: theme.sizes.padding(2.5),
    },
  } as const;

  const state = {
    off: { backgroundColor: "transparent" },
    on: { backgroundColor: theme.colors.accent },
  } as const;

  return { ...base, variant, size, state };
};
