import { View, type ViewProps, StyleSheet } from "react-native";
import { useTheme } from "../theme/native";

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
  const theme = useTheme();
  const styleObj = styles(theme);
  const elevationStyle = styleObj.elevation[elevation ?? "md"];
  const variantStyle = styleObj.variant[variant];
  return (
    <View style={[styleObj.container, elevationStyle, variantStyle, style]} {...rest}>
      {children}
    </View>
  );
};

import type { Theme } from "../theme/native";

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
    container: {
      borderRadius: theme.radii.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

  const variant = {
    filled: { backgroundColor: theme.colors.card },
    outlined: { backgroundColor: "transparent" },
  } as const;

  const elevation = {
    xs: theme.shadow.xs,
    md: theme.shadow.md,
    xl: theme.shadow.xl,
    "2xl": theme.shadow["2xl"],
    "3xl": theme.shadow["3xl"],
    none: {},
  } as const;

  return { ...base, variant, elevation };
};
