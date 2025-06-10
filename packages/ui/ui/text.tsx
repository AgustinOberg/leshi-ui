import React, { memo, forwardRef } from "react";
import {
  Text as RNText,
  type TextProps as RNTextProps,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { StyleSheet, type UnistylesVariants } from "react-native-unistyles";

/* ────────── variantes públicas ────────── */
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type TextWeight = "regular" | "medium" | "semibold" | "bold";
export type TextTone =
  | "muted"
  | "primary"
  | "secondary"
  | "destructive"
  | "link"
  | "accent";

export interface TypoProps
  extends Omit<RNTextProps, "style" | "children">,
    UnistylesVariants<typeof textStyles> {
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  align?: "auto" | "left" | "right" | "center" | "justify";
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  italic?: boolean;
}

/* ────────── mapa estático de tamaños ────────── */

/* ────────── StyleSheet ────────── */
const textStyles = StyleSheet.create((theme) => ({
  base: {
    variants: {
      size: {
        xs: {
          fontSize: theme.fonts.size.xs,
          lineHeight: theme.fonts.size.xs * 1.3,
        },
        sm: {
          fontSize: theme.fonts.size.sm,
          lineHeight: theme.fonts.size.sm * 1.3,
        },
        md: {
          fontSize: theme.fonts.size.md,
          lineHeight: theme.fonts.size.md * 1.3,
        },
        lg: {
          fontSize: theme.fonts.size.lg,
          lineHeight: theme.fonts.size.lg * 1.3,
        },
        xl: {
          fontSize: theme.fonts.size.xl,
          lineHeight: theme.fonts.size.xl * 1.3,
        },
        "2xl": {
          fontSize: theme.fonts.size["2xl"],
          lineHeight: theme.fonts.size["2xl"] * 1.3,
        },
        "3xl": {
          fontSize: theme.fonts.size["3xl"],
          lineHeight: theme.fonts.size["3xl"] * 1.3,
        },
      },

      weight: {
        regular: { fontFamily: theme.fonts.family.regular, fontWeight: "400" },
        medium: { fontFamily: theme.fonts.family.medium, fontWeight: "500" },
        semibold: {
          fontFamily: theme.fonts.family.semibold,
          fontWeight: "600",
        },
        bold: { fontFamily: theme.fonts.family.bold, fontWeight: "700" },
      },

      tone: {
        muted: { color: theme.colors.onMuted },
        primary: { color: theme.colors.primary },
        secondary: { color: theme.colors.secondary },
        destructive: { color: theme.colors.destructive },
        link: { color: theme.colors.link, textDecorationLine: "underline" },
        accent: { color: theme.colors.accent },
      },
    },
  },
}));
type VariantKeys = UnistylesVariants<typeof textStyles>;

/* ────────── Componente ────────── */
export const Text = memo(
  forwardRef<React.ElementRef<typeof RNText>, TypoProps>(
    (
      {
        size = "md",
        weight = "regular",
        tone = "primary",
        align = "auto",
        style,
        children,
        ...rest
      },
      ref,
    ) => {
      // sólo pasamos 'tone' si existe para no romper tipado
      const variantObj = { size, weight } as VariantKeys;
      if (tone) variantObj.tone = tone;
      textStyles.useVariants(variantObj);

      return (
        <RNText
          ref={ref}
          {...rest}
          allowFontScaling={false}
          style={[textStyles.base, { textAlign: align }, style]}
        >
          {children}
        </RNText>
      );
    },
  ),
);
Text.displayName = "Text";
