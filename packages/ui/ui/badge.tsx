import React from "react";
import {
  View,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { StyleSheet, type UnistylesVariants } from "react-native-unistyles";

import { Text, type TextSize, type TextTone } from "./text";

export type BadgeVariant = "primary" | "secondary" | "destructive" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps
  extends Omit<ViewProps, "style" | "children">,
    UnistylesVariants<typeof styles> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SIZE_MAP: Record<BadgeSize, TextSize> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

const TONE_MAP: Record<BadgeVariant, TextTone> = {
  primary: "secondary",
  secondary: "primary",
  destructive: "accent",
  outline: "primary",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  style,
  ...rest
}) => {
  styles.useVariants({ variant, size });

  return (
    <View {...rest} style={[styles.container, style]}>
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

      <Text
        size={SIZE_MAP[size]}
        tone={TONE_MAP[variant]}
        weight="semibold"
        align="center"
      >
        {children}
      </Text>

      {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
    </View>
  );
};

/* StyleSheet */
const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap?.(0.5) ?? 4,
    borderRadius: theme.radii.md,
    borderWidth: 1.5,
    alignSelf: "flex-start",

    variants: {
      size: {
        sm: { paddingHorizontal: 4, paddingVertical: 2 },
        md: { paddingHorizontal: 8, paddingVertical: 4 },
        lg: { paddingHorizontal: 10, paddingVertical: 4 },
      },

      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
          borderColor: "transparent",
        },
        secondary: {
          backgroundColor: theme.colors.secondary,
          borderColor: "transparent",
        },
        destructive: {
          backgroundColor: theme.colors.destructive,
          borderColor: "transparent",
        },
        outline: {
          backgroundColor: "transparent",
          borderColor: theme.colors.border,
        },
      },
    },
  },

  icon: {
    width: 14,
    height: 14,
  },
}));
