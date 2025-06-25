import { View, type ViewProps, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { useTheme } from "../theme/native";

export type SurfaceElevation = "xs" | "md" | "lg" | "xl" | "2xl" | "3xl" | "none";
export type SurfaceVariant = "filled" | "outlined" | "default" | "secondary" | "muted" | "accent";
export type SurfacePadding = "none" | "sm" | "base" | "lg" | "xl";
export type SurfaceRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface SurfaceProps extends ViewProps {
  elevation?: SurfaceElevation;
  variant?: SurfaceVariant;
  padding?: SurfacePadding;
  radius?: SurfaceRadius;
}
export const Surface = ({
  children,
  elevation = "md",
  style,
  variant = "filled",
  padding,
  radius = "xl",
  ...rest
}: SurfaceProps) => {
  const theme = useTheme();
  const styleObj = useMemo(() => createStyles(theme), [theme]);
  
  const combinedStyle = useMemo(() => [
    styleObj.container,
    styleObj.elevation[elevation],
    styleObj.variant[variant],
    styleObj.radius[radius],
    padding && styleObj.padding[padding],
    style,
  ], [styleObj, elevation, variant, radius, padding, style]);

  return (
    <View style={combinedStyle} {...rest}>
      {children}
    </View>
  );
};

import type { Theme } from "../theme/theme";

const createStyles = (theme: Theme) => {
  const base = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

  const variant = {
    filled: { backgroundColor: theme.colors.card },
    outlined: { backgroundColor: "transparent" },
    default: { 
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
    },
    secondary: { 
      backgroundColor: theme.colors.secondary,
      borderColor: theme.colors.secondary,
    },
    muted: { 
      backgroundColor: theme.colors.muted,
      borderColor: theme.colors.border,
    },
    accent: { 
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
  } as const;

  const elevation = {
    xs: theme.shadows.xs,
    md: theme.shadows.md,
    lg: theme.shadows.lg,
    xl: theme.shadows.xl,
    "2xl": theme.shadows["2xl"],
    "3xl": theme.shadows["3xl"],
    none: {},
  } as const;

  const padding = {
    none: { padding: 0 },
    sm: { padding: theme.sizes.padding(2) },
    base: { padding: theme.sizes.padding(4) },
    lg: { padding: theme.sizes.padding(6) },
    xl: { padding: theme.sizes.padding(8) },
  } as const;

  const radius = {
    none: { borderRadius: 0 },
    sm: { borderRadius: theme.radii.sm },
    md: { borderRadius: theme.radii.md },
    lg: { borderRadius: theme.radii.lg },
    xl: { borderRadius: theme.radii.xl },
    "2xl": { borderRadius: theme.radii["2xl"] },
  } as const;

  return { ...base, variant, elevation, padding, radius };
};
