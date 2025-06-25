import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  ActivityIndicator,
} from "react-native";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../theme/native";
import Text, { type TextVariant } from "./text";
import type { Theme } from "../../theme/theme";

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
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  const combinedStyle = useMemo(() => {
    const containerVariant = styles.variant[variant];
    const sizeStyle = styles.size[size];
    const fullWidthStyle = fullWidth ? styles.fullWidth.true : styles.fullWidth.false;
    
    return (state: { pressed: boolean }) => {
      const styleArray: StyleProp<ViewStyle>[] = [
        styles.container,
        containerVariant,
        fullWidthStyle,
        sizeStyle, // Size style should come last to override container borderRadius
      ];

      if (disabled || loading) {
        styleArray.push(styles.disabled);
      }

      if (state.pressed && !disabled && !loading) {
        styleArray.push(styles.pressed);
      }

      if (style) {
        styleArray.push(style);
      }

      return styleArray;
    };
  }, [styles, variant, size, fullWidth, disabled, loading, style]);

  const isDisabled = disabled || loading;

  const spinnerColor = useMemo(() => {
    if (variant === 'ghost' || variant === 'outline' || variant === 'link') {
      return theme.colors.primary;
    }
    return theme.colors.primaryForeground;
  }, [variant, theme.colors.primary, theme.colors.primaryForeground]);

  const textVariant = useMemo(() => TEXT_VARIANT[variant], [variant]);

  return (
    <Pressable
      accessibilityRole={rest.accessibilityRole ?? "button"}
      accessibilityState={{ disabled: isDisabled }}
      style={combinedStyle}
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

const createStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    pressed: { opacity: 0.8 },
    disabled: { opacity: 0.6 },
    container: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: theme.sizes.gap(2),
      borderRadius: theme.radii.md,
    },
  });

  const fullWidth = {
    true: { width: "100%" } as const,
    false: { width: "auto" } as const,
  };

  const variant = StyleSheet.create({
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
      backgroundColor: 'transparent'
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
  });

  const size = StyleSheet.create({
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
  });

  return { 
    ...baseStyles, 
    variant, 
    size, 
    fullWidth 
  };
};
