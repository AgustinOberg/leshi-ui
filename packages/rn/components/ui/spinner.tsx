import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../styles/theme';
import type { Theme } from '../../styles/theme';

export type SpinnerSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type SpinnerVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'muted';

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  style?: any;
}

const SIZE_MAP: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  base: 20,
  lg: 24,
  xl: 32,
};

const STROKE_WIDTH_MAP: Record<SpinnerSize, number> = {
  xs: 1,
  sm: 1.5,
  base: 2,
  lg: 2.5,
  xl: 3,
};

export const Spinner = ({
  size = 'base',
  variant = 'default',
  color,
  strokeWidth,
  duration = 800,
  style,
}: SpinnerProps) => {
  const theme = useTheme();
  const rotation = useSharedValue(0);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const spinnerSize = SIZE_MAP[size];
  const defaultStrokeWidth = strokeWidth ?? STROKE_WIDTH_MAP[size];
  
  const spinnerColor = useMemo(() => {
    if (color) return color;
    
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'destructive':
        return theme.colors.destructive;
      case 'muted':
        return theme.colors.mutedForeground;
      default:
        return theme.colors.foreground;
    }
  }, [color, variant, theme]);

  // Create transparent version of the color for inactive borders
  const transparentColor = useMemo(() => {
    // Default transparent colors that work well
    const transparentColors = {
      primary: 'rgba(59, 130, 246, 0.1)',
      secondary: 'rgba(156, 163, 175, 0.1)', 
      destructive: 'rgba(239, 68, 68, 0.1)',
      muted: 'rgba(107, 114, 128, 0.1)',
      default: 'rgba(0, 0, 0, 0.1)'
    };

    if (color) {
      // For custom colors, use a generic transparent approach
      return 'rgba(0, 0, 0, 0.1)';
    }
    
    return transparentColors[variant];
  }, [color, variant]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [rotation, duration]);
  
  return (
    <View style={[{ width: spinnerSize, height: spinnerSize }, style]}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View
          style={[
            styles.spinner,
            {
              width: spinnerSize,
              height: spinnerSize,
              borderRadius: spinnerSize / 2,
              borderWidth: defaultStrokeWidth,
              borderTopColor: spinnerColor,
              borderRightColor: transparentColor,
              borderBottomColor: transparentColor,
              borderLeftColor: transparentColor,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    borderStyle: 'solid',
  },
});
