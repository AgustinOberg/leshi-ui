import { useEffect } from "react";
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
import { useTheme } from "../theme/native";

export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps extends Omit<PressableProps, "onPress" | "style"> {
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
  style?: StyleProp<ViewStyle>;
}

// TODO: change it to use the theme.size and not hardcoded values
const SIZE = {
  sm: { trackW: 24, trackH: 12, thumb: 10, pad: 2 },
  md: { trackW: 32, trackH: 20, thumb: 16, pad: 2 },
  lg: { trackW: 40, trackH: 24, thumb: 20, pad: 3 },
} as const;

export const Switch = ({
  checked,
  onCheckedChange,
  disabled = false,
  size = "md",
  style,
  ...rest
}: SwitchProps) => {
  const dims = SIZE[size];

  const OFFSET = dims.trackW - dims.thumb - dims.pad * 2;

  const tx = useSharedValue(checked ? OFFSET : 0);

  useEffect(() => {
    tx.value = withTiming(checked ? OFFSET : 0, {
      duration: 180,
      easing: Easing.out(Easing.quad),
    });
  }, [checked, OFFSET]);

  const thumbAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }));

  const theme = useTheme();
  const styleObj = styles(theme);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      accessibilityValue={{ text: checked ? "on" : "off" }}
      disabled={disabled}
      onPress={() => !disabled && onCheckedChange(!checked)}
      data-slot="switch"
      style={[
        styleObj.track,
        styleObj.size[size],
        styleObj.checked[checked ? "true" : "false"],
        disabled && styleObj.disabled.true,
        style,
      ]}
      {...rest}
    >
      <Animated.View
        data-slot="switch-thumb"
        style={[
          styleObj.thumb,
          styleObj.thumbSize[size],
          styleObj.thumbChecked[checked ? "true" : "false"],
          thumbAnim,
        ]}
      />
    </Pressable>
  );
};

import type { Theme } from "../theme/native";

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
    track: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: theme.radii.full,
      borderWidth: 1,
      borderColor: "transparent",
      ...theme.shadow.xs,
    },
    thumb: {
      borderRadius: theme.radii.full,
    },
  });

  const size = {
    sm: { width: theme.sizes.w(6), height: theme.sizes.h(3), padding: theme.sizes.p(0.5) },
    md: { width: theme.sizes.w(8), height: theme.sizes.h(5), padding: theme.sizes.p(0.5) },
    lg: { width: theme.sizes.w(10), height: theme.sizes.h(6), padding: theme.sizes.p(0.75) },
  } as const;

  const checked = {
    true: { backgroundColor: theme.colors.primary },
    false: { backgroundColor: theme.colors.inputSurface },
  } as const;

  const disabledStyle = {
    true: { opacity: 0.5 },
  } as const;

  const thumbSize = {
    sm: { width: theme.sizes.w(2.5), height: theme.sizes.h(2.5) },
    md: { width: theme.sizes.w(4), height: theme.sizes.h(4) },
    lg: { width: theme.sizes.w(5), height: theme.sizes.h(5) },
  } as const;

  const thumbChecked = {
    true: { backgroundColor: theme.colors.primaryForeground },
    false: { backgroundColor: theme.colors.background },
  } as const;

  return { ...base, size, checked, disabled: disabledStyle, thumbSize, thumbChecked };
};
