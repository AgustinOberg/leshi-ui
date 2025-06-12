import { View, Text, type PressableProps, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Icon } from "./icon";

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps extends PressableProps {
  checked?: boolean;
  size?: CheckboxSize;
}
export const Checkbox = ({ checked, size, ...rest }: CheckboxProps) => {
  styles.useVariants({
    checked: checked ?? false,
    size: size ?? "md",
  });
  const { theme } = useUnistyles();

  return (
    <Pressable style={styles.container} {...rest}>
      {checked && (
        <Icon color={theme.colors.primaryForeground} name="checkbox" />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    aspectRatio: 1,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.xs,
    variants: {
      size: {
        sm: {
          width: theme.sizes.w(4),
        },
        md: {
          width: theme.sizes.w(5),
        },
        lg: {
          width: theme.sizes.w(6),
        },
      },
      checked: {
        true: {
          backgroundColor: theme.colors.primary,
        },
        false: {
          backgroundColor: theme.colors.card,
        },
      },
    },
  },
}));
