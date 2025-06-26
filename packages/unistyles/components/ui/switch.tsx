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
import { StyleSheet } from "react-native-unistyles";

export type SwitchSize = "sm" | "base" | "lg";
export type SwitchVariant = "default" | "destructive";

export interface SwitchProps extends Omit<PressableProps, "onPress" | "style"> {
  /** Controlled state - if provided, component is controlled */
  checked?: boolean;
  /** Default state for uncontrolled component */
  defaultChecked?: boolean;
  /** Callback when state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Visual size variant */
  size?: SwitchSize;
  /** Visual style variant */
  variant?: SwitchVariant;
  /** Disabled state */
  disabled?: boolean;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label */
  "aria-label"?: string;
  /** Accessibility description */
  "aria-describedby"?: string;
  /** Test ID for testing */
  testID?: string;
}

export const Switch = React.memo<SwitchProps>((
  {
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
  }: SwitchProps
) => {
  // Controlled vs uncontrolled state management
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : internalChecked;

  // Sizes for animation calculations (based on shadcn/ui proportions)
  const sizes = useMemo(() => ({
    sm: { trackW: 32, trackH: 18, thumbSize: 14, padding: 2 },
    base: { trackW: 44, trackH: 24, thumbSize: 20, padding: 2 },
    lg: { trackW: 52, trackH: 30, thumbSize: 26, padding: 2 },
  }), []);
  
  const currentSize = sizes[size];
  const translateDistance = currentSize.trackW - currentSize.thumbSize - (currentSize.padding * 2);

  // Animation setup
  const tx = useSharedValue(checked ? translateDistance : 0);

  useEffect(() => {
    tx.value = withTiming(checked ? translateDistance : 0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  }, [checked, translateDistance, tx]);

  const thumbAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }));

  // Handle press with controlled/uncontrolled logic
  const handlePress = useCallback(() => {
    if (disabled) return;
    
    const newChecked = !checked;
    
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    onCheckedChange?.(newChecked);
  }, [checked, disabled, isControlled, onCheckedChange]);

  // Compute current state for styling
  const state = disabled ? 'disabled' : checked ? 'checked' : 'unchecked';

  // Use Unistyles variants
  styles.useVariants({ 
    size: size as any, 
    variant: variant as any, 
    state: state as any 
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      accessibilityValue={{ text: checked ? "on" : "off" }}
      accessibilityLabel={ariaLabel}
      accessibilityHint={disabled ? "Switch is disabled" : "Double tap to toggle"}
      accessible
      disabled={disabled}
      onPress={handlePress}
      testID={testID}
      data-slot="switch"
      style={[styles.track, style]}
      {...rest}
    >
      <Animated.View
        data-slot="switch-thumb"
        style={[styles.thumb, thumbAnim]}
      />
    </Pressable>
  );
});

Switch.displayName = "Switch";

const styles = StyleSheet.create((theme) => ({
  track: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: theme.radii.full,
    borderWidth: 1,
    borderColor: "transparent",
    position: "relative",
    cursor: "pointer",
    ...theme.shadows.xs,
    variants: {
      size: {
        sm: {
          width: 32,
          height: 18,
          padding: 2,
        },
        base: {
          width: 44,
          height: 24,
          padding: 2,
        },
        lg: {
          width: 52,
          height: 30,
          padding: 2,
        },
      },
      variant: {
        default: {},
        destructive: {},
      },
      state: {
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
          cursor: "not-allowed",
        },
      },
    },
    compoundVariants: [
      {
        variant: "destructive",
        state: "checked",
        styles: {
          backgroundColor: theme.colors.destructive,
          borderColor: theme.colors.destructive,
        },
      },
    ],
  },

  thumb: {
    borderRadius: theme.radii.full,
    position: "absolute",
    left: 2,
    ...theme.shadows.xs,
    variants: {
      size: {
        sm: { 
          width: 14, 
          height: 14,
          top: 2, // (18 - 14) / 2
        },
        base: { 
          width: 20, 
          height: 20,
          top: 2, // (24 - 20) / 2
        },
        lg: { 
          width: 26, 
          height: 26,
          top: 2, // (30 - 26) / 2
        },
      },
      variant: {
        default: {},
        destructive: {},
      },
      state: {
        unchecked: {
          backgroundColor: theme.colors.background,
        },
        checked: {
          backgroundColor: theme.colors.primaryForeground,
        },
        disabled: {
          backgroundColor: theme.colors.mutedForeground,
        },
      },
    },
    compoundVariants: [
      {
        variant: "destructive",
        state: "checked",
        styles: {
          backgroundColor: theme.colors.destructiveForeground,
        },
      },
    ],
  },
}));
