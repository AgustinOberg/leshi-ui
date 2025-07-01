import React, { useCallback, useState } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "./text";

export type ToggleVariant = "default" | "outline";
export type ToggleSize = "default" | "sm" | "lg";
export type ToggleState = "on" | "off";

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
  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const isControlled = pressedProp !== undefined;
  const pressed = isControlled ? pressedProp : internalPressed;

  const handlePress = useCallback(
    (e: any) => {
      const newPressed = !pressed;
      if (!isControlled) setInternalPressed(newPressed);
      onPressedChange?.(newPressed);
      onPress?.(e);
    },
    [pressed, isControlled, onPressedChange, onPress]
  );

  styles.useVariants({
    variant: variant as any,
    size: size as any,
    state: (pressed ? "on" : "off") as any,
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: pressed } as any }
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled, style]}
      {...rest}
    >
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </Pressable>
  );
});

Toggle.displayName = "Toggle";

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.sizes.gap(2),
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: "transparent",
    variants: {
      variant: {
        default: {},
        outline: { borderColor: theme.colors.input },
      },
      size: {
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
      },
      state: {
        off: { backgroundColor: "transparent" },
        on: { backgroundColor: theme.colors.accent },
      },
    },
  },
  disabled: {
    opacity: 0.5,
  },
}));
