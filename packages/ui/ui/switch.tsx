import React, { useCallback, useMemo, forwardRef, memo } from "react";
import { Pressable, View, type PressableProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  StyleSheet,
  type UnistylesVariants,
  useUnistyles,
} from "react-native-unistyles";

export type SwitchSize = "sm" | "md" | "lg";

export type SwitchProps = {
  /** Current state */
  value: boolean;
  /** Callback when toggled */
  onValueChange: (val: boolean) => void;
  /** Predefined size */
  size?: SwitchSize;
  /** Disabled state */
  disabled?: boolean;
} & Omit<PressableProps, "style" | "onPress"> &
  UnistylesVariants<typeof styles>;

const SIZE_CONFIG: Record<
  SwitchSize,
  { trackW: number; trackH: number; pad: number; thumb: number }
> = {
  sm: { trackW: 34, trackH: 20, pad: 2, thumb: 16 },
  md: { trackW: 44, trackH: 26, pad: 3, thumb: 20 },
  lg: { trackW: 56, trackH: 32, pad: 4, thumb: 24 },
};

export const Switch = memo(
  forwardRef<React.ComponentRef<typeof Pressable>, SwitchProps>(
    (
      {
        value,
        onValueChange,
        size = "md",
        disabled = false,
        accessibilityLabel,
        ...rest
      },
      ref,
    ) => {
      const { theme } = useUnistyles();

      styles.useVariants({ size, disabled });

      const progress = useSharedValue(value ? 1 : 0);

      React.useEffect(() => {
        progress.value = withSpring(value ? 1 : 0, {
          damping: 20,
          stiffness: 200,
        });
      }, [value]);

      const cfg = SIZE_CONFIG[size];
      const maxTranslate = cfg.trackW - cfg.thumb - cfg.pad * 2;

      const thumbAnimated = useAnimatedStyle(() => ({
        transform: [{ translateX: progress.value * maxTranslate }],
      }));

      const trackBgStyle = useMemo(
        () =>
          StyleSheet.flatten([
            styles.trackBg,
            value && !disabled && { backgroundColor: theme.colors.primary },
            disabled && { backgroundColor: theme.colors.disabledBg },
          ]),
        [value, disabled, theme],
      );

      const thumbColor =
        disabled && !value
          ? theme.colors.disabledText // light gray
          : theme.colors.background; // default

      const handlePress = useCallback(() => {
        if (!disabled) onValueChange(!value);
      }, [disabled, onValueChange, value]);

      return (
        <Pressable
          ref={ref}
          {...rest}
          accessibilityRole="switch"
          accessibilityLabel={accessibilityLabel}
          accessibilityValue={{ min: 0, max: 1, now: value ? 1 : 0 }}
          accessibilityState={{ disabled, checked: value }}
          disabled={disabled}
          style={[styles.track]}
          onPress={handlePress}
        >
          <View style={trackBgStyle} />
          <Animated.View
            style={[
              styles.thumb,
              {
                width: cfg.thumb,
                height: cfg.thumb,
                backgroundColor: thumbColor,
              },
              thumbAnimated,
            ]}
          />
        </Pressable>
      );
    },
  ),
);

Switch.displayName = "Switch";

const styles = StyleSheet.create((theme) => ({
  track: {
    justifyContent: "center",
    variants: {
      size: {
        sm: { width: 34, height: 20, padding: 2 },
        md: { width: 44, height: 26, padding: 3 },
        lg: { width: 56, height: 32, padding: 4 },
      },
      disabled: {
        true: { opacity: 0.6 },
      },
    },
  },

  trackBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.border,
  },

  thumb: {
    borderRadius: theme.radii.full,
  },
}));
