import React, { memo, forwardRef, useCallback } from "react";
import {
  Pressable,
  View,
  ActivityIndicator,
  type PressableProps,
} from "react-native";
import {
  StyleSheet,
  type UnistylesVariants,
  useUnistyles,
} from "react-native-unistyles";
import { Text, type TextSize, type TextTone } from "./text";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

export type ButtonSize = "sm" | "md" | "lg";

const SIZE_CFG: Record<
  ButtonSize,
  { padY: number; padX: number; gap: number; textSize: TextSize }
> = {
  sm: { padY: 12, padX: 24, gap: 6, textSize: "sm" },
  md: { padY: 16, padX: 32, gap: 6, textSize: "md" },
  lg: { padY: 20, padX: 48, gap: 8, textSize: "lg" },
};

export interface ButtonProps
  extends Omit<PressableProps, "style">,
    UnistylesVariants<typeof styles> {
  text: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = memo(
  forwardRef<React.ComponentRef<typeof Pressable>, ButtonProps>(
    (
      {
        text,
        icon,
        loading = false,
        disabled = false,
        variant = "primary",
        size = "md",
        fullWidth = false,
        accessibilityLabel,
        ...rest
      },
      ref,
    ) => {
      const { theme } = useUnistyles();

      styles.useVariants({
        variant,
        size,
        disabled: disabled || loading,
      });

      const handlePress = useCallback(() => {
        if (!disabled && !loading) rest.onPress?.({} as any);
      }, [disabled, loading, rest]);

      const textToneMap: Record<ButtonVariant, TextTone> = {
        primary: "secondary",
        secondary: "primary",
        destructive: "accent",
        outline: "primary",
        ghost: "primary",
        link: "link",
      };

      const spinnerColorMap: Record<ButtonVariant, string> = {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        destructive: theme.colors.destructive,
        outline: theme.colors.foreground,
        ghost: theme.colors.foreground,
        link: theme.colors.foreground,
      };

      return (
        <Pressable
          ref={ref}
          {...rest}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? text}
          accessibilityState={{ disabled: disabled || loading, busy: loading }}
          disabled={disabled || loading}
          style={({ pressed }) => [
            styles.button,
            fullWidth && styles.fullWidth,
            pressed && !disabled && !loading && styles.pressed,
          ]}
        >
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color={spinnerColorMap[variant]} />
            </View>
          )}

          <View style={[styles.content, styles[`gap_${size}`]]}>
            {icon}
            <Text
              size={SIZE_CFG[size].textSize}
              tone={disabled ? "muted" : textToneMap[variant]}
              weight="semibold"
            >
              {text}
            </Text>
          </View>
        </Pressable>
      );
    },
  ),
);

Button.displayName = "Button";

const styles = StyleSheet.create((theme) => ({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radii.md,

    variants: {
      size: {
        sm: {
          paddingVertical: SIZE_CFG.sm.padY,
          paddingHorizontal: SIZE_CFG.sm.padX,
        },
        md: {
          paddingVertical: SIZE_CFG.md.padY,
          paddingHorizontal: SIZE_CFG.md.padX,
        },
        lg: {
          paddingVertical: SIZE_CFG.lg.padY,
          paddingHorizontal: SIZE_CFG.lg.padX,
        },
      },

      variant: {
        primary: { backgroundColor: theme.colors.primary },
        secondary: { backgroundColor: theme.colors.secondary },
        destructive: { backgroundColor: theme.colors.destructive },
        outline: {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: theme.colors.border,
        },
        ghost: { backgroundColor: "transparent" },
        link: { backgroundColor: "transparent" },
      },

      disabled: {
        true: {
          backgroundColor: theme.colors.disabledBg,
          opacity: 0.8,
        },
      },
    },
  },

  pressed: { opacity: 0.85 },

  fullWidth: {
    alignSelf: "stretch",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  gap_sm: { columnGap: SIZE_CFG.sm.gap },
  gap_md: { columnGap: SIZE_CFG.md.gap },
  gap_lg: { columnGap: SIZE_CFG.lg.gap },
}));
