import React, { useEffect, useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../styles/context';

export type SpinnerSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type SpinnerVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'muted';

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
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

  // Setup Unistyles variants
  styles.useVariants({ size });
  
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

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    variants: {
      size: {
        xs: {},
        sm: {},
        base: {},
        lg: {},
        xl: {},
      },
    },
  },
  spinner: {
    borderStyle: 'solid',
  },
}));
