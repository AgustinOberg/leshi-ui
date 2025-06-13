import { useEffect } from "react";
import {
  View,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useTheme } from "../theme/native";
import type { Theme } from "../theme/theme";

export type SliderSize = "sm" | "md" | "lg";
export type SliderVariant = "primary" | "secondary" | "destructive";

export interface SliderProps extends ViewProps {
  value?: number;
  onValueChange?: (value: number) => void;
  size?: SliderSize;
  variant?: SliderVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Slider = ({
  value = 0,
  onValueChange,
  size = "md",
  variant = "primary",
  disabled = false,
  style,
  ...rest
}: SliderProps) => {
  const theme = useTheme();
  const clamped = Math.max(0, Math.min(value, 100));
  const stylesObj = styles(theme);

  const progress = useSharedValue(clamped);
  const width = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(clamped, { duration: 150 });
  }, [clamped]);

  const emitChange = (val: number) => onValueChange?.(val);

  const gesture = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.start = progress.value;
    },
    onActive: (event, ctx: any) => {
      if (width.value === 0) return;
      const delta = (event.translationX / width.value) * 100;
      let val = ctx.start + delta;
      val = Math.max(0, Math.min(100, val));
      progress.value = val;
      runOnJS(emitChange)(val);
    },
  });

  const indicatorStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const thumbSize =
    {
      sm: theme.sizes.width(3),
      md: theme.sizes.width(4),
      lg: theme.sizes.width(5),
    }[size] ?? theme.sizes.width(4);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (progress.value / 100) * width.value - thumbSize / 2 }],
  }));

  const indicatorColor = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    destructive: theme.colors.destructive,
  }[variant];

  return (
    <PanGestureHandler onGestureEvent={gesture} enabled={!disabled}>
      <Animated.View
        accessibilityRole="adjustable"
        accessibilityState={{ disabled }}
        accessibilityValue={{ min: 0, max: 100, now: clamped }}
        onLayout={(e) => {
          width.value = e.nativeEvent.layout.width;
        }}
        style={[
          stylesObj.track,
          stylesObj.size[size],
          disabled && stylesObj.disabled.true,
          style,
        ]}
        {...rest}
      >
        <Animated.View
          style={[
            stylesObj.indicator,
            { backgroundColor: indicatorColor },
            indicatorStyle,
          ]}
        />
        <Animated.View
          style={[
            stylesObj.thumb,
            { width: thumbSize, height: thumbSize, borderRadius: thumbSize / 2 },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
    track: {
      width: "100%",
      justifyContent: "center",
      backgroundColor: theme.colors.muted,
      borderRadius: theme.radii.full,
    },
    indicator: {
      height: theme.sizes.height(1),
      borderRadius: theme.radii.full,
    },
    thumb: {
      position: "absolute",
      top: "50%",
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
  });

  const size = {
    sm: { height: theme.sizes.height(4) },
    md: { height: theme.sizes.height(5) },
    lg: { height: theme.sizes.height(6) },
  } as const;

  const disabled = {
    true: { opacity: 0.5 },
  } as const;

  return { ...base, size, disabled };
};

export default Slider;
