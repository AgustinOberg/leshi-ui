// ui/textarea.tsx
import React, { useCallback, useMemo, useState, forwardRef, memo } from "react";
import {
  TextInput,
  View,
  Text,
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
export type TextareaSize = "sm" | "md" | "lg";
export type TextareaTextSize = "xs" | "sm" | "md" | "lg" | "xl";

export type TextareaProps = {
  label?: string;
  error?: string;
  size?: TextareaSize;
  textSize?: TextareaTextSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputStyle?: StyleProp<TextStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
} & Omit<TextInputProps, "style" | "multiline"> &
  UnistylesVariants<typeof styles>;

/* Tabla de tamaños (alto mínimo + padding lateral)  */
const SIZE_CFG: Record<TextareaSize, { minH: number; padX: number }> = {
  sm: { minH: 72, padX: 12 },
  md: { minH: 96, padX: 14 },
  lg: { minH: 120, padX: 16 },
};

/* ───────────────── componente ───────────────── */
export const Textarea = memo(
  forwardRef<React.ElementRef<typeof TextInput>, TextareaProps>(
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
      const { theme } = useUnistyles();
      const [focused, setFocused] = useState(false);

      /* Sólo las variantes presentes en StyleSheet */
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

      /* Color/estado de borde y fondo */
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
                minHeight: SIZE_CFG[size].minH,
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
              multiline
              editable={!disabled}
              style={[styles.input, inputStyle]}
              placeholderTextColor={
                placeholderTextColor ?? theme.colors.onMuted
              }
              onFocus={handleFocus}
              onBlur={handleBlur}
              textAlignVertical="top"
            />

            {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      );
    },
  ),
);

Textarea.displayName = "Textarea";

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
    alignItems: "flex-start",
    borderRadius: theme.radii.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: "transparent",
    paddingTop: 12,
    paddingBottom: 12,
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

  icon: { marginHorizontal: 4, marginTop: 4 },

  error: {
    color: theme.colors.destructive,
    fontSize: 13,
    fontWeight: "500",
  },
}));
