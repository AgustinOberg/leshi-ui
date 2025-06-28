import React, { useMemo } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  ActivityIndicator,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Text, type TextVariant } from "./text";

export type ButtonVariant =
  | "primary"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export type ButtonSize = "base" | "sm" | "lg" | "icon";

export interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  text?: string;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  prefix?: React.JSX.Element;
  suffix?: React.JSX.Element;
  style?: StyleProp<ViewStyle>;
}

const TEXT_VARIANT: Record<ButtonVariant, TextVariant> = {
  primary: "primaryForeground",
  destructive: "destructiveForeground",
  ghost: "primary",
  outline: "primary",
  secondary: "secondaryForeground",
  link: "primary",
};

export const Button = ({
  variant = "primary",
  size = "base",
  fullWidth,
  text,
  loading,
  prefix,
  suffix,
  disabled,
  style,
  ...rest
}: ButtonProps) => {
  styles.useVariants({
    variant: variant,
    size: size,
    fullWidth: fullWidth,
  });

  const isDisabled = disabled || loading;

  const spinnerColor = useMemo(() => {
    if (variant === 'ghost' || variant === 'outline' || variant === 'link') {
      return 'primary'; // This will be resolved by the theme
    }
    return 'primaryForeground';
  }, [variant]);

  const textVariant = useMemo(() => TEXT_VARIANT[variant], [variant]);

  return (
    <Pressable
      accessibilityRole={rest.accessibilityRole ?? "button"}
      accessibilityState={{ disabled: isDisabled }}
      style={(state) => [
        styles.container,
        isDisabled && styles.disabled,
        state.pressed && !isDisabled && styles.pressed,
        style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      <>
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={spinnerColor}
          />
        )}
        {!loading && prefix && <>{prefix}</>}
        {text && !loading && (
          <Text weight="medium" variant={textVariant}>
            {text}
          </Text>
        )}
        {!loading && suffix && <>{suffix}</>}
      </>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.6,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.sizes.gap(2),
    borderRadius: theme.radii.md,
    variants: {
      fullWidth: {
        true: {
          width: "100%",
        },
        false: {
          width: "auto",
        },
      },
      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
          ...theme.shadows.xs,
        },
        secondary: {
          backgroundColor: theme.colors.secondary,
          ...theme.shadows.xs,
        },
        outline: {
          borderColor: theme.colors.border,
          borderWidth: 1,
          backgroundColor: theme.colors.background,
          ...theme.shadows.xs,
        },
        ghost: {
          backgroundColor: 'transparent',
        },
        destructive: {
          backgroundColor: theme.colors.destructive,
          ...theme.shadows.xs,
        },
        link: {
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
          paddingVertical: 0,
          minHeight: 'auto',
        },
      },
      size: {
        sm: {
          height: 32,
          paddingHorizontal: theme.sizes.padding(3),
          paddingVertical: theme.sizes.padding(1),
        },
        base: {
          height: 40,
          paddingHorizontal: theme.sizes.padding(4),
          paddingVertical: theme.sizes.padding(2),
        },
        lg: {
          height: 48,
          paddingHorizontal: theme.sizes.padding(6),
          paddingVertical: theme.sizes.padding(3),
        },
        icon: {
          width: 40,
          height: 40,
          borderRadius: 20,
          paddingHorizontal: 0,
          paddingVertical: 0,
          minHeight: 40,
          maxHeight: 40,
          minWidth: 40,
          maxWidth: 40,
        },
      },
    },
  },
}));
