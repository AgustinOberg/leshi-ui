import { useEffect } from "react";
import {
  type ViewProps,
  type StyleProp,
  type ViewStyle,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../theme/native";
import type { Theme } from "../theme/theme";

export interface SkeletonProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export const Skeleton = ({ style, ...rest }: SkeletonProps) => {
  const opacity = useSharedValue(1);
  const theme = useTheme();
  const styleObj = styles(theme);

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
      style={[styleObj.container, animatedStyle, style]}
      {...rest}
    />
  );
};

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.radii.md,
    },
  });

  return { ...base };
};
