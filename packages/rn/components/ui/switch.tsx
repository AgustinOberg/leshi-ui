import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
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
import { StyleSheet } from "react-native";
import { useTheme } from "../../styles/theme";

export type SwitchSize = "sm" | "base" | "lg";
export type SwitchVariant = "default" | "destructive";

export interface SwitchProps extends Omit<PressableProps, "onPress" | "style"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: SwitchSize;
  variant?: SwitchVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  "aria-label"?: string;
  "aria-describedby"?: string;
  testID?: string;
}

export const Switch = React.memo<SwitchProps>(({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  size = "base",
  variant = "default",
  disabled = false,
  style,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  testID,
  ...rest
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : internalChecked;

  const theme = useTheme();
  const sizes = useMemo(() => ({
    sm: { trackW: 32, trackH: 18, thumbSize: 14, padding: 2 },
    base: { trackW: 44, trackH: 24, thumbSize: 20, padding: 2 },
    lg: { trackW: 52, trackH: 30, thumbSize: 26, padding: 2 },
  }), []);

  const currentSize = sizes[size];
  const translateDistance = currentSize.trackW - currentSize.thumbSize - currentSize.padding * 2;
  const tx = useSharedValue(checked ? translateDistance : 0);

  useEffect(() => {
    tx.value = withTiming(checked ? translateDistance : 0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  }, [checked, translateDistance]);

  const thumbAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }));

  const styles = useMemo(() => createStyles(theme), [theme]);
  const state = disabled ? "disabled" : checked ? "checked" : "unchecked";

  const handlePress = useCallback(() => {
    if (disabled) return;
    const newChecked = !checked;
    if (!isControlled) setInternalChecked(newChecked);
    onCheckedChange?.(newChecked);
  }, [checked, disabled, isControlled, onCheckedChange]);

  const trackStyle = useMemo(() => [
    styles.track,
    styles.size[size],
    styles.variant[variant],
    styles.state[state],
    style,
  ], [styles, size, variant, state, style]);

  const thumbStyle = useMemo(() => [
    styles.thumb,
    styles.thumbSize[size],
    styles.thumbVariant[variant],
    styles.thumbState[state],
    thumbAnim,
  ], [styles, size, variant, state, thumbAnim]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      accessibilityValue={{ text: checked ? "on" : "off" }}
      accessibilityLabel={ariaLabel}
      accessibilityHint={disabled ? "Switch is disabled" : "Double tap to toggle" }
      accessible
      disabled={disabled}
      onPress={handlePress}
      testID={testID}
      data-slot="switch"
      style={trackStyle}
      {...rest}
    >
      <Animated.View data-slot="switch-thumb" style={thumbStyle} />
    </Pressable>
  );
});

Switch.displayName = "Switch";

import type { Theme } from "../../styles/theme";

const createStyles = (theme: Theme) => {
  const track = StyleSheet.create({
    track: {
      flexDirection: "row",
      alignItems: "center", 
      justifyContent: "flex-start",
      borderRadius: theme.radii.full,
      borderWidth: 1,
      borderColor: "transparent",
      position: "relative",
      padding: 2, 
    },
  });

  const thumb = StyleSheet.create({
    thumb: {
      position: "relative", 
      borderRadius: theme.radii.full,
      ...theme.shadows.xs,
    },
  });

  const size = {
    sm: { width: 32, height: 18 },
    base: { width: 44, height: 24 },
    lg: { width: 52, height: 30 },
  } as const;

  const thumbSize = {
    sm: { width: 14, height: 14 },
    base: { width: 20, height: 20 },
    lg: { width: 26, height: 26 },
  } as const;

  const variant = {
    default: {},
    destructive: {},
  } as const;

  const thumbVariant = {
    default: {},
    destructive: {},
  } as const;

  const state = {
    unchecked: {
      backgroundColor: theme.colors.inputSurface,
      borderColor: theme.colors.border,
    },
    checked: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    disabled: {
      opacity: 0.5,
    },
  } as const;

  const thumbState = {
    unchecked: {
      backgroundColor: theme.colors.background,
    },
    checked: {
      backgroundColor: theme.colors.primaryForeground,
    },
    disabled: {
      backgroundColor: theme.colors.mutedForeground,
    },
  } as const;

  return {
    track: track.track,
    thumb: thumb.thumb,
    size,
    thumbSize,
    variant,
    thumbVariant,
    state,
    thumbState,
  };
};
