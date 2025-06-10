import React, { forwardRef, memo } from "react";
import {
  View,
  type ViewProps,
  type ViewStyle,
  type StyleProp,
} from "react-native";
import { StyleSheet, type UnistylesVariants } from "react-native-unistyles";

export type SurfaceVariant = "flat" | "outline" | "elevated";
export type SurfaceAlign = "start" | "center" | "end";

export interface SurfaceProps
  extends Omit<ViewProps, "style" | "children">,
    UnistylesVariants<typeof styles> {
  variant?: SurfaceVariant;
  align?: SurfaceAlign;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const Surface = memo(
  forwardRef<React.ElementRef<typeof View>, SurfaceProps>(
    ({ variant = "flat", align = "start", style, children, ...rest }, ref) => {
      styles.useVariants({ variant, align });

      return (
        <View ref={ref} {...rest} style={[styles.surface, style]}>
          {children}
        </View>
      );
    },
  ),
);

Surface.displayName = "Surface";

const styles = StyleSheet.create((theme) => ({
  surface: {
    flexDirection: "column",
    borderRadius: theme.radii.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    padding: theme.gap(6),
    rowGap: theme.gap(6),
    variants: {
      variant: {
        flat: {},
        outline: { backgroundColor: "transparent" },
        elevated: {
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 1 },
          elevation: 3,
        },
      },
      align: {
        start: { alignItems: "flex-start" },
        center: { alignItems: "center" },
        end: { alignItems: "flex-end" },
      },
    },
  },
}));
