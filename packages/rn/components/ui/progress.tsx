import { useEffect } from 'react';
import {
  View,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../styles/theme';
import type { Theme } from '../../styles/theme';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'primary' | 'secondary' | 'destructive';

export interface ProgressProps extends ViewProps {
  value?: number;
  size?: ProgressSize;
  variant?: ProgressVariant;
  style?: StyleProp<ViewStyle>;
}

export const Progress = ({
  value = 0,
  size = 'md',
  variant = 'primary',
  style,
  ...rest
}: ProgressProps) => {
  const clamped = Math.max(0, Math.min(value, 100));
  const theme = useTheme();
  const styleObj = styles(theme);

  const progress = useSharedValue(clamped);

  useEffect(() => {
    progress.value = withTiming(clamped, { duration: 300 });
  }, [clamped, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const backgroundColor = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    destructive: theme.colors.destructive,
  }[variant];

  return (
    <View
      accessibilityRole='progressbar'
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      data-slot='progress'
      style={[styleObj.track, styleObj.size[size], style]}
      {...rest}
    >
      <Animated.View
        data-slot='progress-indicator'
        style={[styleObj.indicator, animatedStyle, { backgroundColor }]}
      />
    </View>
  );
};

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
    track: {
      width: '100%',
      overflow: 'hidden',
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.muted,
    },
    indicator: { height: '100%' },
  });

  const size = {
    sm: { height: theme.sizes.height(1) },
    md: { height: theme.sizes.height(2) },
    lg: { height: theme.sizes.height(3) },
  } as const;

  return { ...base, size };
};
