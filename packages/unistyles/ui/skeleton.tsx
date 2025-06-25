import { useEffect } from "react";
import {
  type ViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

export interface SkeletonProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export const Skeleton = ({ style, ...rest }: SkeletonProps) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 800 }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      data-slot="skeleton"
      style={[styles.container, animatedStyle, style]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
  },
}));
