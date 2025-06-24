import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Text, { type TextVariant } from "./text";

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
  styles.useVariants({
    variant: variant ?? "primary",
    size: size ?? "base",
    fullWidth: fullWidth,
  });
  return (
    <Pressable
      accessibilityRole={rest.accessibilityRole ?? "button"}
      accessibilityState={{ disabled: disabled ?? false }}
      style={(state) => [
        styles.container,
        disabled && styles.disabled,
        state.pressed && styles.pressed,
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
          backgroundColor: theme.colors.background,
        },
        destructive: {
          backgroundColor: theme.colors.destructive,
          ...theme.shadows.xs,
        },
      },
      size: {
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
      },
    },
  },
}));
