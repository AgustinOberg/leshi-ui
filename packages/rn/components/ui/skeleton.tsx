import React, { useEffect } from 'react';
import { type ViewProps, type DimensionValue, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../styles/theme';
import type { Theme } from '../../styles/theme';

export interface SkeletonProps extends Omit<ViewProps, 'style'> {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewProps['style'];
  animated?: boolean;
}

export const Skeleton = ({
  width = '100%',
  height = 20,
  borderRadius,
  style,
  animated = true,
  ...rest
}: SkeletonProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      shimmerValue.value = withRepeat(
        withTiming(1, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        false,
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

  const defaultBorderRadius = typeof height === 'number' ? height / 4 : 4;

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

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    skeleton: {
      backgroundColor: theme.colors.muted,
    },
  });
