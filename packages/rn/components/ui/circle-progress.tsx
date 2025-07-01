import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewProps, StyleProp, ViewStyle } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedProps,
  useAnimatedReaction,
  runOnJS,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';

interface DashConfig { width: number; gap: number; }

export interface CircleProgressProps extends Omit<ViewProps, 'children'> {
  size: number;
  width: number;
  backgroundWidth?: number;
  fill?: number;
  tintColor?: string;
  tintColorSecondary?: string;
  backgroundColor?: string;
  rotation?: number;
  lineCap?: 'butt' | 'round' | 'square';
  arcSweepAngle?: number;
  children?: (fill: number) => React.ReactNode;
  childrenContainerStyle?: StyleProp<ViewStyle>;
  padding?: number;
  dashedBackground?: DashConfig;
  dashedTint?: DashConfig;
  renderCap?: (payload: { center: { x: number; y: number } }) => React.ReactNode;
}

export interface AnimatedCircleProgressProps extends CircleProgressProps {
  prefill?: number;
  duration?: number;
  delay?: number;
  easing?: (value: number) => number;
  onAnimationComplete?: (finished: boolean) => void;
  onFillChange?: (value: number) => void;
}

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const circlePath = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(x, y, radius, endAngle * 0.9999999);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const CircleProgress = ({
  size,
  width,
  backgroundWidth,
  fill = 0,
  tintColor = 'black',
  tintColorSecondary,
  backgroundColor,
  rotation = 90,
  lineCap = 'butt',
  arcSweepAngle = 360,
  style,
  children,
  childrenContainerStyle,
  padding = 0,
  dashedBackground = { width: 0, gap: 0 },
  dashedTint = { width: 0, gap: 0 },
  renderCap,
  ...rest
}: CircleProgressProps) => {
  const clamped = Math.max(0, Math.min(fill, 100));
  const fillValue = useSharedValue(clamped);
  const [jsFill, setJsFill] = useState(clamped);
  const maxWidthCircle = backgroundWidth ? Math.max(width, backgroundWidth) : width;
  const radius = size / 2 - maxWidthCircle / 2 - padding / 2;
  const center = size / 2 + padding / 2;

  useEffect(() => {
    fillValue.value = clamped;
  }, [clamped, fillValue]);

  useAnimatedReaction(
    () => fillValue.value,
    (v) => runOnJS(setJsFill)(v),
  );

  const animatedProps = useAnimatedProps(() => {
    const current = (arcSweepAngle * fillValue.value) / 100;
    const stroke = tintColorSecondary
      ? (interpolateColor(
          fillValue.value,
          [0, 100],
          [tintColor, tintColorSecondary],
        ) as string)
      : tintColor;
    return {
      d: circlePath(center, center, radius, 0, current),
      stroke,
    };
  });

  const backgroundPath = circlePath(center, center, radius, 0, arcSweepAngle);

  const strokeDashTint =
    dashedTint.gap > 0 ? [dashedTint.width, dashedTint.gap] : undefined;
  const strokeDashBg =
    dashedBackground.gap > 0 ? [dashedBackground.width, dashedBackground.gap] : undefined;

  const childOffset = size - maxWidthCircle * 2;

  const childStyle = StyleSheet.compose(
    {
      position: 'absolute',
      left: maxWidthCircle + padding / 2,
      top: maxWidthCircle + padding / 2,
      width: childOffset,
      height: childOffset,
      borderRadius: childOffset / 2,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    childrenContainerStyle,
  );

  const capPosition = polarToCartesian(
    center,
    center,
    radius,
    (arcSweepAngle * jsFill) / 100,
  );

  return (
    <View style={style} {...rest}>
      <Svg width={size + padding} height={size + padding}>
        <G rotation={rotation} originX={(size + padding) / 2} originY={(size + padding) / 2}>
          {backgroundColor && (
            <Path
              d={backgroundPath}
              stroke={backgroundColor}
              strokeWidth={backgroundWidth ?? width}
              strokeLinecap={lineCap}
              strokeDasharray={strokeDashBg}
              fill="transparent"
            />
          )}
          <AnimatedPath
            animatedProps={animatedProps}
            strokeWidth={width}
            strokeLinecap={lineCap}
            strokeDasharray={strokeDashTint}
            fill="transparent"
          />
          {renderCap && renderCap({ center: capPosition })}
        </G>
      </Svg>
      {children && <View style={childStyle}>{children(jsFill)}</View>}
    </View>
  );
};

export const AnimatedCircleProgress = ({
  prefill = 0,
  duration = 500,
  delay = 0,
  easing = Easing.out(Easing.ease),
  onAnimationComplete,
  onFillChange,
  fill = 0,
  ...rest
}: AnimatedCircleProgressProps) => {
  const progress = useSharedValue(prefill);
  const [display, setDisplay] = useState(prefill);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(fill, { duration, easing }, (finished?: boolean) => {
        if (onAnimationComplete) {
          runOnJS(onAnimationComplete)(!!finished);
        }
      }),
    );
  }, [fill, duration, easing, delay, onAnimationComplete, progress]);

  useAnimatedReaction(
    () => progress.value,
    (v) => {
      runOnJS(setDisplay)(v);
      if (onFillChange) runOnJS(onFillChange)(v);
    },
  );

  return <CircleProgress {...rest} fill={display} />;
};
