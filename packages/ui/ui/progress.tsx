// ui/progress.tsx
import React, { useCallback } from "react";
import {
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  StyleSheet,
  type UnistylesVariants,
  useUnistyles,
} from "react-native-unistyles";

export type ProgressSize = "sm" | "md" | "lg";

export interface ProgressProps extends UnistylesVariants<typeof styles> {
  value?: number; // 0-100
  size?: ProgressSize;
  trackStyle?: StyleProp<ViewStyle>;
}

const SIZE_CFG: Record<ProgressSize, number> = { sm: 4, md: 6, lg: 8 };

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  size = "md",
  trackStyle,
}) => {
  styles.useVariants({ size });

  const progress = useSharedValue(Math.max(0, Math.min(value, 100)));
  const trackW = useSharedValue(0);

  /* animamos cuando cambia value */
  React.useEffect(() => {
    progress.value = withTiming(Math.max(0, Math.min(value, 100)), {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
  }, [value]);

  /* guardamos ancho real */
  const onLayoutTrack = useCallback((e: LayoutChangeEvent) => {
    trackW.value = e.nativeEvent.layout.width;
  }, []);

  /* estilo animado: width proporcional */
  const indicatorAnim = useAnimatedStyle(() => ({
    width: (trackW.value * progress.value) / 100,
  }));

  const { theme } = useUnistyles();

  return (
    <View onLayout={onLayoutTrack} style={[styles.track, trackStyle]}>
      <Animated.View style={[styles.indicator, indicatorAnim]} />
    </View>
  );
};

/* ───── StyleSheet ───── */
const styles = StyleSheet.create((theme) => ({
  track: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: theme.colors.primary + "33", // 20 % opacity
    borderRadius: theme.radii.full,
    variants: {
      size: {
        sm: { height: SIZE_CFG.sm },
        md: { height: SIZE_CFG.md },
        lg: { height: SIZE_CFG.lg },
      },
    },
  },

  indicator: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.full,
  },
}));
