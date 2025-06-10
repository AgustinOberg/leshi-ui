import React, { useEffect } from "react";
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  StyleSheet,
  useUnistyles,
  type UnistylesVariants,
} from "react-native-unistyles";

import { Text, type TextSize } from "./text";
export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxLabelPos = "left" | "right";

export interface CheckboxProps
  extends Omit<PressableProps, "style" | "onPress">,
    UnistylesVariants<typeof styles> {
  checked?: boolean;
  onCheckedChange?: (val: boolean) => void;

  size?: CheckboxSize;
  disabled?: boolean;
  label?: string | React.ReactNode;
  labelPos?: CheckboxLabelPos;
  indicator?: React.ReactNode;

  wrapperStyle?: StyleProp<ViewStyle>;
}

const SIZE_CFG: Record<
  CheckboxSize,
  { box: number; icon: number; textSize: TextSize }
> = {
  sm: { box: 18, icon: 10, textSize: "xs" },
  md: { box: 20, icon: 12, textSize: "sm" },
  lg: { box: 24, icon: 14, textSize: "sm" },
};

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onCheckedChange,
  size = "md",
  disabled = false,
  label,
  labelPos = "right",
  indicator,
  wrapperStyle,
  ...rest
}) => {
  const { theme } = useUnistyles();

  styles.useVariants({ disabled });

  const progress = useSharedValue(checked ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {
      duration: 160,
      easing: Easing.out(Easing.quad),
    });
  }, [checked]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));

  const boxDim = SIZE_CFG[size].box;

  const baseBoxStyle: ViewStyle = {
    width: boxDim,
    height: boxDim,
    borderRadius: theme.radii.sm,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: checked ? theme.colors.primary : theme.colors.border,
    backgroundColor: checked ? theme.colors.primary : "transparent",
  };

  const iconNode = indicator ?? (
    <Text
      size={SIZE_CFG[size].textSize}
      tone={checked ? "secondary" : "muted"}
      weight="bold"
    >
      ✓
    </Text>
  );

  const renderLabel = () =>
    typeof label === "string" ? (
      <Text
        size={SIZE_CFG[size].textSize}
        tone="primary"
        weight="regular"
        align="left"
      >
        {label}
      </Text>
    ) : (
      label
    );

  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <Pressable
      {...rest}
      accessibilityRole="checkbox"
      accessibilityState={{ disabled, checked }}
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrapper,
        wrapperStyle,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {label && labelPos === "left" && renderLabel()}

      <View style={baseBoxStyle}>
        <Animated.View style={[animatedStyle]}>{iconNode}</Animated.View>
      </View>

      {label && labelPos === "right" && renderLabel()}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap?.(0.5) ?? 4,
    variants: {
      disabled: {
        true: { opacity: 0.5 },
      },
    },
  },
  pressed: {
    opacity: 0.75,
  },
}));
