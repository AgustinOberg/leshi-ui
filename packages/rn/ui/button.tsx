import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native";
import { useTheme } from "@/theme/native";
import Text, { type TextVariant } from "./text";
import type { Theme } from "@/theme/theme";

export type ButtonVariant =
  | "primary"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost";

export type ButtonSize = "base" | "sm" | "lg" | "icon";

export interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  text?: string;
  size?: ButtonSize;
  fullWidth?: boolean;
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
};

export const Button = ({
  variant,
  size,
  fullWidth,
  text,
  prefix,
  suffix,
  disabled,
  style,
  ...rest
}: ButtonProps) => {
  const theme = useTheme();
  const stylesObj = styles(theme);
  const containerVariant = stylesObj.variant[variant ?? "primary"];
  const sizeStyle = stylesObj.size[size ?? "base"];
  const fullWidthStyle = fullWidth
    ? stylesObj.fullWidth.true
    : stylesObj.fullWidth.false;

  return (
    <Pressable
      accessibilityRole={rest.accessibilityRole ?? "button"}
      accessibilityState={{ disabled: disabled ?? false }}
      style={(state) => [
        stylesObj.container,
        containerVariant,
        sizeStyle,
        fullWidthStyle,
        disabled && stylesObj.disabled,
        state.pressed && stylesObj.pressed,
        style,
      ]}
      disabled={disabled}
      {...rest}
    >
      <>
        {prefix && <>{prefix}</>}
        {text && (
          <Text weight="medium" variant={TEXT_VARIANT[variant ?? "primary"]}>
            {text}
          </Text>
        )}
        {suffix && <>{suffix}</>}
      </>
    </Pressable>
  );
};

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
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
    true: { width: "100%" },
    false: { width: "auto" },
  } as const;

  const variant = {
    primary: { backgroundColor: theme.colors.primary, ...theme.shadows.xs },
    secondary: { backgroundColor: theme.colors.secondary, ...theme.shadows.xs },
    outline: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      backgroundColor: theme.colors.background,
      ...theme.shadows.xs,
    },
    ghost: { backgroundColor: theme.colors.background },
    destructive: {
      backgroundColor: theme.colors.destructive,
      ...theme.shadows.xs,
    },
  } as const;

  const size = {
    base: {
      height: theme.sizes.height(9),
      paddingHorizontal: theme.sizes.padding(4),
      paddingVertical: theme.sizes.padding(2),
    },
    sm: {
      height: theme.sizes.height(8),
      paddingHorizontal: theme.sizes.padding(3),
    },
    lg: {
      height: theme.sizes.height(10),
      paddingHorizontal: theme.sizes.padding(5),
    },
    icon: {
      aspectRatio: 1,
      height: theme.sizes.height(9),
      borderRadius: theme.radii.full,
    },
  } as const;

  return { ...base, variant, size, fullWidth };
};
