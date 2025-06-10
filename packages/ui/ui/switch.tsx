// packages/ui/ui/switch.tsx
import React, { useCallback, useMemo } from "react";
import { Pressable, View, type PressableProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  StyleSheet,
  type UnistylesVariants,
  useUnistyles,
} from "react-native-unistyles";

/* ───────────────────────────────
 *  Variantes & tipos públicos
 * ────────────────────────────── */
export type SwitchSize = "sm" | "md" | "lg";

export type SwitchProps = {
  /** Estado actual */
  value: boolean;
  /** Callback al alternar */
  onValueChange: (val: boolean) => void;
  /** Tamaño predefinido */
  size?: SwitchSize;
  /** Deshabilitado */
  disabled?: boolean;
} & Omit<PressableProps, "style" | "onPress"> &
  UnistylesVariants<typeof styles>;

/* Tabla de tamaños centralizada (no se recrea por render) */
const SIZE_CONFIG: Record<
  SwitchSize,
  { trackW: number; trackH: number; pad: number; thumb: number }
> = {
  sm: { trackW: 34, trackH: 20, pad: 2, thumb: 16 },
  md: { trackW: 44, trackH: 26, pad: 3, thumb: 20 },
  lg: { trackW: 56, trackH: 32, pad: 4, thumb: 24 },
};

/* ───────────────────────────────
 *  Componente
 * ────────────────────────────── */
export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  size = "md",
  disabled = false,
  accessibilityLabel,
  ...rest
}) => {
  /* Theme (para colores runtime) */
  const { theme } = useUnistyles();

  /* Vinculamos variantes */
  styles.useVariants({ size, disabled });

  /* SharedValue para animar el thumb */
  const progress = useSharedValue(value ? 1 : 0);

  /* Actualizamos animación cuando cambia `value` */
  React.useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: 20,
      stiffness: 200,
    });
  }, [value]);

  /* Datos de tamaño */
  const cfg = SIZE_CONFIG[size];
  const maxTranslate = cfg.trackW - cfg.thumb - cfg.pad * 2;

  /* Estilo animado del thumb */
  const thumbAnimated = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * maxTranslate }],
  }));

  /* Estilo del track (memo para evitar flatten continuo) */
  const trackBgStyle = useMemo(
    () =>
      StyleSheet.flatten([
        styles.trackBg,
        value && !disabled && { backgroundColor: theme.colors.primary },
        disabled && { backgroundColor: theme.colors.disabledBg },
      ]),
    [value, disabled, theme]
  );

  /* Color del thumb */
  const thumbColor =
    disabled && !value
      ? theme.colors.disabledText // gris claro
      : theme.colors.background; // normal

  /* onPress callback memorizado */
  const handlePress = useCallback(() => {
    if (!disabled) onValueChange(!value);
  }, [disabled, onValueChange, value]);

  return (
    <Pressable
      {...rest}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      /* Para lectores de pantalla: 0 = off, 1 = on */
      accessibilityValue={{ min: 0, max: 1, now: value ? 1 : 0 }}
      accessibilityState={{ disabled, checked: value }}
      disabled={disabled}
      /* Track wrapper */
      style={[styles.track]}
      onPress={handlePress}
    >
      <View style={trackBgStyle} />
      <Animated.View
        style={[
          styles.thumb,
          {
            width: cfg.thumb,
            height: cfg.thumb,
            backgroundColor: thumbColor,
          },
          thumbAnimated,
        ]}
      />
    </Pressable>
  );
};

/* ───────────────────────────────
 *  StyleSheet (variants inside)
 * ────────────────────────────── */
const styles = StyleSheet.create((theme) => ({
  track: {
    justifyContent: "center",
    variants: {
      size: {
        sm: { width: 34, height: 20, padding: 2 },
        md: { width: 44, height: 26, padding: 3 },
        lg: { width: 56, height: 32, padding: 4 },
      },
      disabled: {
        true: { opacity: 0.6 },
      },
    },
  },

  trackBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.border,
  },

  thumb: {
    borderRadius: theme.radii.full,
    /* El color se sobre-escribe dinámicamente */
  },
}));
