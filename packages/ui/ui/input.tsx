// ui/input.tsx
import React, { useCallback, useMemo, useState, forwardRef, memo } from "react";
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import {
  StyleSheet,
  useUnistyles,
  type UnistylesVariants,
} from "react-native-unistyles";

/* ───────────────– variantes públicas ───────────────– */
export type InputSize = "sm" | "md" | "lg";
export type InputTextSize = "xs" | "sm" | "md" | "lg" | "xl";

export type InputProps = {
  label?: string;
  error?: string;
  size?: InputSize;
  textSize?: InputTextSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputStyle?: StyleProp<TextStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
} & Omit<TextInputProps, "style"> &
  UnistylesVariants<typeof styles>;

/* Tabla de tamaños centralizada (fácil de ajustar) */
const SIZE_CFG: Record<InputSize, { height: number; padX: number }> = {
  sm: { height: 40, padX: 12 },
  md: { height: 48, padX: 14 },
  lg: { height: 56, padX: 16 },
};

/* ───────────────── componente ───────────────── */
export const Input = memo(
  forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
    (
      {
        label,
        error,
        size = "md",
        textSize = "md",
        leftIcon,
        rightIcon,
        inputStyle,
        wrapperStyle,
        editable = true,
        placeholderTextColor,
        onFocus,
        onBlur,
        ...rest
      },
      ref,
    ) => {
      const disabled = !editable;
      const [focused, setFocused] = useState(false);
      const { theme } = useUnistyles();

      /* Solo avisamos de variantes que realmente existen en el StyleSheet */
      styles.useVariants({ textSize, disabled });

      /* Handlers memorizados */
      const handleFocus = useCallback(
        (e: any) => {
          setFocused(true);
          onFocus?.(e);
        },
        [onFocus],
      );
      const handleBlur = useCallback(
        (e: any) => {
          setFocused(false);
          onBlur?.(e);
        },
        [onBlur],
      );

      /* Borde / fondo dinámico */
      const dynamicBorder = useMemo(() => {
        if (disabled) return { backgroundColor: theme.colors.disabledBg };
        if (error) return { borderColor: theme.colors.destructive };
        if (focused) return { borderColor: theme.colors.ring };
        return null;
      }, [disabled, error, focused, theme]);

      return (
        <View style={[styles.container, wrapperStyle]}>
          {label && <Text style={styles.label}>{label}</Text>}

          <View
            style={[
              styles.inputWrapper,
              {
                height: SIZE_CFG[size].height,
                paddingHorizontal: SIZE_CFG[size].padX,
              },
              dynamicBorder,
            ]}
            accessibilityState={{ disabled }}
          >
            {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

            <TextInput
              ref={ref}
              {...rest}
              editable={!disabled}
              placeholderTextColor={
                placeholderTextColor ?? theme.colors.onMuted
              }
              style={[styles.input, inputStyle]}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      );
    },
  ),
);

Input.displayName = "Input";

/* ───────────────── StyleSheet ───────────────── */
const styles = StyleSheet.create((theme) => ({
  container: { gap: theme.gap(0.5), width: "100%" },

  label: {
    color: theme.colors.foreground,
    fontWeight: "500",
    fontSize: 14,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radii.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: "transparent",
    variants: {
      disabled: { true: { opacity: 0.6 } },
    },
  },

  input: {
    flex: 1,
    color: theme.colors.foreground,
    fontWeight: "400",
    variants: {
      textSize: {
        xs: { fontSize: 12 },
        sm: { fontSize: 14 },
        md: { fontSize: 16 },
        lg: { fontSize: 18 },
        xl: { fontSize: 20 },
      },
    },
  },

  icon: { marginHorizontal: 4 },

  error: {
    color: theme.colors.destructive,
    fontSize: 13,
    fontWeight: "500",
  },
}));
