import { View, type ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export type SurfaceElevation = "xs" | "md" | "lg" | "xl" | "2xl" | "3xl" | "none";
export type SurfaceVariant = "filled" | "outlined" | "secondary" | "muted" | "accent" | "default";

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
  styles.useVariants({
    elevation,
    variant: variant as any,
    ...(padding && { padding }),
    radius,
  });

  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    
    variants: {
      variant: {
        filled: {
          backgroundColor: theme.colors.card,
        },
        outlined: {
          backgroundColor: "transparent",
        },
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
      },
      elevation: {
        xs: theme.shadows.xs,
        md: theme.shadows.md,
        lg: theme.shadows.lg,
        xl: theme.shadows.xl,
        "2xl": theme.shadows["2xl"],
        "3xl": theme.shadows["3xl"],
        none: {},
      },
      padding: {
        none: {
          padding: 0,
        },
        sm: {
          padding: theme.sizes.padding(2),
        },
        base: {
          padding: theme.sizes.padding(4),
        },
        lg: {
          padding: theme.sizes.padding(6),
        },
        xl: {
          padding: theme.sizes.padding(8),
        },
      },
      radius: {
        none: {
          borderRadius: 0,
        },
        sm: {
          borderRadius: theme.radii.sm,
        },
        md: {
          borderRadius: theme.radii.md,
        },
        lg: {
          borderRadius: theme.radii.lg,
        },
        xl: {
          borderRadius: theme.radii.xl,
        },
        "2xl": {
          borderRadius: theme.radii["2xl"],
        },
      },
    },
  },
}));
