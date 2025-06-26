import { View, StyleSheet, type ViewProps, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../../styles/theme";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps extends ViewProps {
  orientation?: DividerOrientation;
  style?: StyleProp<ViewStyle>;
}

export const Divider = ({ orientation = "horizontal", style, ...rest }: DividerProps) => {
  const theme = useTheme();
  const stylesObj = styles(theme);
  const orientStyle = stylesObj.orientation[orientation];
  return <View style={[stylesObj.container, orientStyle, style]} {...rest} />;
};

import type { Theme } from "../../styles/theme";

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.border,
      alignSelf: "stretch",
    },
  });

  const orientation = {
    horizontal: { height: StyleSheet.hairlineWidth, width: "100%" },
    vertical: { width: StyleSheet.hairlineWidth, height: "100%" },
  } as const;

  return { ...base, orientation };
};
