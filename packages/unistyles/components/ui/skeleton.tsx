import React, { useEffect } from "react";
import { View, type ViewProps, type DimensionValue } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";

export interface SkeletonProps extends Omit<ViewProps, "style"> {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewProps["style"];
  animated?: boolean;
}

export const Skeleton = ({
  width = "100%",
  height = 20,
  borderRadius,
  style,
  animated = true,
  ...rest
}: SkeletonProps) => {
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      shimmerValue.value = withRepeat(
        withTiming(1, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        false
      );
    }
  }, [animated, shimmerValue]);

  const animatedStyle = useAnimatedStyle(() => {
    if (!animated) {
      return {
        opacity: 1,
      };
    }

    return {
      opacity: interpolate(shimmerValue.value, [0, 0.5, 1], [0.6, 1, 0.6]),
    };
  }, [animated]);

  const defaultBorderRadius = typeof height === "number" ? height / 4 : 4;

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: borderRadius ?? defaultBorderRadius,
        },
        animatedStyle,
        style,
      ]}
      {...rest}
    />
  );
};


const styles = StyleSheet.create((theme) => ({
  skeleton: {
    backgroundColor: theme.colors.muted,
  },
}));