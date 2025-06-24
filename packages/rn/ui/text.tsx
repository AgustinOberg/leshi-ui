import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "@/theme/native";
export type TextVariant =
  | "primaryForeground"
  | "primary"
  | "secondaryForeground"
  | "secondary"
  | "destructiveForeground"
  | "destructive"
  | "mutedForeground"
  | "foreground";

export type TextSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

export type Weight =
  | "thin"
  | "extralight"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

export interface TextProps extends RNTextProps {
  children?: React.ReactNode;
  variant?: TextVariant;
  size?: TextSize;
  weight?: Weight;
  style?: RNTextProps["style"];
}
export const Text = ({
  children,
  variant,
  size,
  weight,
  style,
  ...rest
}: TextProps) => {
  const theme = useTheme();
  const stylesObj = styles(theme);
  const colorStyle = stylesObj.color[variant ?? "foreground"];
  const sizeStyle = stylesObj.size[size ?? "base"];
  const weightStyle = stylesObj.weight[weight ?? "regular"];
  return (
    <RNText
      style={[stylesObj.text, colorStyle, sizeStyle, weightStyle, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default Text;

import type { Theme } from "@/theme/theme";

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
    text: {
      includeFontPadding: false,
      lineHeight: theme.sizes.fonts.base * 1.2,
      textAlignVertical: "center",
    },
  });

  const weight = {
    thin: { fontFamily: theme.fonts.thin },
    extralight: { fontFamily: theme.fonts.extralight },
    light: { fontFamily: theme.fonts.light },
    regular: { fontFamily: theme.fonts.regular },
    medium: { fontFamily: theme.fonts.medium },
    semibold: { fontFamily: theme.fonts.semibold },
    bold: { fontFamily: theme.fonts.bold },
    extrabold: { fontFamily: theme.fonts.extrabold },
    black: { fontFamily: theme.fonts.black },
  } as const;

  const color = {
    primaryForeground: { color: theme.colors.primaryForeground },
    primary: { color: theme.colors.primary },
    secondaryForeground: { color: theme.colors.secondaryForeground },
    secondary: { color: theme.colors.secondary },
    destructiveForeground: { color: theme.colors.destructiveForeground },
    mutedForeground: { color: theme.colors.mutedForeground },
    destructive: { color: theme.colors.destructive },
    foreground: { color: theme.colors.foreground },
  } as const;

  const size = {
    xs: { fontSize: theme.sizes.fonts.xs },
    sm: { fontSize: theme.sizes.fonts.sm },
    base: { fontSize: theme.sizes.fonts.base },
    lg: { fontSize: theme.sizes.fonts.lg },
    xl: { fontSize: theme.sizes.fonts.xl },
    "2xl": { fontSize: theme.sizes.fonts["2xl"] },
    "3xl": { fontSize: theme.sizes.fonts["3xl"] },
    "4xl": { fontSize: theme.sizes.fonts["4xl"] },
    "5xl": { fontSize: theme.sizes.fonts["5xl"] },
    "6xl": { fontSize: theme.sizes.fonts["6xl"] },
    "7xl": { fontSize: theme.sizes.fonts["7xl"] },
    "8xl": { fontSize: theme.sizes.fonts["8xl"] },
    "9xl": { fontSize: theme.sizes.fonts["9xl"] },
  } as const;

  return { ...base, weight, color, size };
};
