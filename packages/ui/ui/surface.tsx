import { View, type ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export type SurfaceElevation = "xs" | "md" | "xl" | "2xl" | "3xl" | "none";
export type SurfaceVariant = "filled" | "outlined";
export interface SurfaceProps extends ViewProps {
  elevation?: SurfaceElevation;
  variant?: SurfaceVariant;
}
export const Surface = ({
  children,
  elevation,
  style,
  variant = "filled",
  ...rest
}: SurfaceProps) => {
  styles.useVariants({
    elevation: elevation ?? "md",
    variant,
  });
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    borderRadius: theme.radii.xl,
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
      },
      elevation: {
        xs: theme.shadow.xs,
        md: theme.shadow.md,
        xl: theme.shadow.xl,
        "2xl": theme.shadow["2xl"],
        "3xl": theme.shadow["3xl"],
        none: {},
      },
    },
  },
}));
