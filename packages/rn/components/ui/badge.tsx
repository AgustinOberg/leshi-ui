import { View, StyleSheet, type ViewProps } from "react-native";
import { useTheme } from "../../theme/native";
import { Text, type TextProps, type TextSize, type TextVariant } from "./text";
import type { Theme } from "../../theme/theme";

export type BadgeVariant = "primary" | "secondary" | "destructive" | "outline";
const TEXT_VARIANT: Record<BadgeVariant, TextVariant> = {
  primary: "primaryForeground",
  secondary: "secondaryForeground",
  destructive: "destructiveForeground",
  outline: "foreground",
};
export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  textOptions?: TextProps;
  size?: TextSize;
  prefix?: React.JSX.Element;
  suffix?: React.JSX.Element;
}
export const Badge = ({
  children,
  size = "xs",
  style,
  textOptions,
  prefix,
  suffix,
  variant = "primary",
}: BadgeProps) => {
  const theme = useTheme();
  const variantStyle = styles(theme).variant[variant];
  return (
    <View style={[styles(theme).container, variantStyle, style]}>
      {prefix && <View>{prefix}</View>}
      <Text
        variant={textOptions?.variant ?? TEXT_VARIANT[variant]}
        {...textOptions}
        size={size}
        weight={textOptions?.weight ?? "medium"}
      >
        {children}
      </Text>
      {suffix && <View>{suffix}</View>}
    </View>
  );
};

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radii.md,
      borderWidth: 1,
      gap: theme.sizes.gap(0.5),
      flexDirection: "row",
      paddingHorizontal: theme.sizes.padding(2),
      paddingVertical: theme.sizes.padding(0.5),
      alignSelf: "flex-start",
      flexShrink: 0,
    },
  });

  const variant = {
    primary: {
      borderColor: "transparent",
      backgroundColor: theme.colors.primary,
    },
    secondary: {
      borderColor: "transparent",
      backgroundColor: theme.colors.secondary,
    },
    destructive: {
      borderColor: "transparent",
      backgroundColor: theme.colors.destructive,
    },
    outline: {
      borderColor: theme.colors.border,
      backgroundColor: "transparent",
    },
  } as const;

  return { ...base, variant };
};
