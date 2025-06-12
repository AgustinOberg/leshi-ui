import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import React from "react";
import { StyleSheet } from "react-native-unistyles";
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
  styles.useVariants({
    color: variant ?? "primary",
    size: size ?? "base",
    weight: weight ?? "regular",
  });
  return (
    <RNText style={[styles.text, style]} {...rest}>
      {children}
    </RNText>
  );
};

export default Text;

const styles = StyleSheet.create((theme) => ({
  text: {
    variants: {
      weight: {
        thin: {
          fontFamily: theme.fonts.thin,
          fontWeight: "100",
        },
        extralight: {
          fontFamily: theme.fonts.extralight,
          fontWeight: "200",
        },
        light: {
          fontFamily: theme.fonts.light,
          fontWeight: "300",
        },
        regular: {
          fontFamily: theme.fonts.regular,
          fontWeight: "400",
        },
        medium: {
          fontFamily: theme.fonts.medium,
          fontWeight: "500",
        },
        semibold: {
          fontFamily: theme.fonts.semibold,
          fontWeight: "600",
        },
        bold: {
          fontFamily: theme.fonts.bold,
          fontWeight: "700",
        },
        extrabold: {
          fontFamily: theme.fonts.extrabold,
          fontWeight: "800",
        },
        black: {
          fontFamily: theme.fonts.black,
          fontWeight: "900",
        },
      },
      color: {
        primaryForeground: {
          color: theme.colors.primaryForeground,
        },
        primary: {
          color: theme.colors.primary,
        },
        secondaryForeground: {
          color: theme.colors.secondaryForeground,
        },
        secondary: {
          color: theme.colors.secondary,
        },
        destructiveForeground: {
          color: theme.colors.destructiveForeground,
        },
        mutedForeground: {
          color: theme.colors.mutedForeground,
        },
        destructive: {
          color: theme.colors.destructive,
        },
        foreground: {
          color: theme.colors.foreground,
        },
      },
      size: {
        xs: {
          fontSize: theme.sizes.fonts.xs,
        },
        sm: {
          fontSize: theme.sizes.fonts.sm,
        },
        base: {
          fontSize: theme.sizes.fonts.base,
        },

        lg: {
          fontSize: theme.sizes.fonts.lg,
        },
        xl: {
          fontSize: theme.sizes.fonts.xl,
        },
        "2xl": {
          fontSize: theme.sizes.fonts["2xl"],
        },
        "3xl": {
          fontSize: theme.sizes.fonts["3xl"],
        },
        "4xl": {
          fontSize: theme.sizes.fonts["4xl"],
        },
        "5xl": {
          fontSize: theme.sizes.fonts["5xl"],
        },
        "6xl": {
          fontSize: theme.sizes.fonts["6xl"],
        },
        "7xl": {
          fontSize: theme.sizes.fonts["7xl"],
        },
        "8xl": {
          fontSize: theme.sizes.fonts["8xl"],
        },
        "9xl": {
          fontSize: theme.sizes.fonts["9xl"],
        },
      },
    },
  },
}));
