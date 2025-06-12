import { View, Text, type PressableProps, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../theme/native";
import { Icon } from "./icon";

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps extends PressableProps {
  checked?: boolean;
  size?: CheckboxSize;
}
export const Checkbox = ({ checked, size, ...rest }: CheckboxProps) => {
  const theme = useTheme();
  const styleObj = styles(theme);
  const sizeStyle = styleObj.size[size ?? "md"];
  const checkedStyle = styleObj.checked[checked ? "true" : "false"];

  return (
    <Pressable style={[styleObj.container, sizeStyle, checkedStyle]} {...rest}>
      {checked && (
        <Icon color={theme.colors.primaryForeground} name="checkbox" />
      )}
    </Pressable>
  );
};

import type { Theme } from "../theme/native";

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
    container: {
      aspectRatio: 1,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.xs,
    },
  });

  const size = {
    sm: { width: theme.sizes.width(4) },
    md: { width: theme.sizes.width(5) },
    lg: { width: theme.sizes.width(6) },
  } as const;

  const checked = {
    true: { backgroundColor: theme.colors.primary },
    false: { backgroundColor: theme.colors.card },
  } as const;

  return { ...base, size, checked };
};
