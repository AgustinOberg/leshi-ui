import React, { useMemo } from 'react';
import {
  Text as RNText,
  type TextProps as RNTextProps,
  Platform,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../styles/theme';
import type { Theme } from '../../styles/theme';

export type TextVariant =
  | 'heading'
  | 'subheading'
  | 'body'
  | 'caption'
  | 'overline'
  | 'primaryForeground'
  | 'primary'
  | 'secondaryForeground'
  | 'secondary'
  | 'destructiveForeground'
  | 'destructive'
  | 'mutedForeground'
  | 'foreground';

export type TextSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl';

export type Weight =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

export interface TextProps extends RNTextProps {
  children?: React.ReactNode;
  variant?: TextVariant;
  size?: TextSize;
  weight?: Weight;
  style?: RNTextProps['style'];
}

export const Text = ({
  children,
  variant = 'foreground',
  size = 'base',
  weight = 'regular',
  style,
  ...rest
}: TextProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const combinedStyle = useMemo(() => {
    const colorStyle = styles.color[variant];
    const sizeStyle = styles.size[size];
    const weightStyle = styles.weight[weight];

    return [styles.text, colorStyle, sizeStyle, weightStyle, style];
  }, [styles, variant, size, weight, style]);

  return (
    <RNText
      style={combinedStyle}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const createStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    text: {
      includeFontPadding: false,
      lineHeight: theme.sizes.fonts.base * 1.2,
      textAlignVertical: 'center',
    },
  });

  const weight = StyleSheet.create({
    thin: {
      fontFamily: theme.fonts.thin,
      ...(Platform.OS === 'web' && { fontWeight: '100' as const }),
    },
    extralight: {
      fontFamily: theme.fonts.extralight,
      ...(Platform.OS === 'web' && { fontWeight: '200' as const }),
    },
    light: {
      fontFamily: theme.fonts.light,
      ...(Platform.OS === 'web' && { fontWeight: '300' as const }),
    },
    regular: {
      fontFamily: theme.fonts.regular,
      ...(Platform.OS === 'web' && { fontWeight: '400' as const }),
    },
    medium: {
      fontFamily: theme.fonts.medium,
      ...(Platform.OS === 'web' && { fontWeight: '500' as const }),
    },
    semibold: {
      fontFamily: theme.fonts.semibold,
      ...(Platform.OS === 'web' && { fontWeight: '600' as const }),
    },
    bold: {
      fontFamily: theme.fonts.bold,
      ...(Platform.OS === 'web' && { fontWeight: '700' as const }),
    },
    extrabold: {
      fontFamily: theme.fonts.extrabold,
      ...(Platform.OS === 'web' && { fontWeight: '800' as const }),
    },
    black: {
      fontFamily: theme.fonts.black,
      ...(Platform.OS === 'web' && { fontWeight: '900' as const }),
    },
  });

  const color = StyleSheet.create({
    heading: {
      color: theme.colors.foreground,
      ...(Platform.OS === 'web' && { fontWeight: '600' as const }),
    },
    subheading: {
      color: theme.colors.foreground,
      ...(Platform.OS === 'web' && { fontWeight: '500' as const }),
    },
    body: {
      color: theme.colors.foreground,
    },
    caption: {
      color: theme.colors.mutedForeground,
      fontSize: theme.sizes.fonts.sm,
    },
    overline: {
      color: theme.colors.mutedForeground,
      fontSize: theme.sizes.fonts.xs,
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
    },
    primaryForeground: { color: theme.colors.primaryForeground },
    primary: { color: theme.colors.primary },
    secondaryForeground: { color: theme.colors.secondaryForeground },
    secondary: { color: theme.colors.secondary },
    destructiveForeground: { color: theme.colors.destructiveForeground },
    mutedForeground: { color: theme.colors.mutedForeground },
    destructive: { color: theme.colors.destructive },
    foreground: { color: theme.colors.foreground },
  });

  const size = StyleSheet.create({
    xs: { fontSize: theme.sizes.fonts.xs },
    sm: { fontSize: theme.sizes.fonts.sm },
    base: { fontSize: theme.sizes.fonts.base },
    lg: { fontSize: theme.sizes.fonts.lg },
    xl: { fontSize: theme.sizes.fonts.xl },
    '2xl': { fontSize: theme.sizes.fonts['2xl'] },
    '3xl': { fontSize: theme.sizes.fonts['3xl'] },
    '4xl': { fontSize: theme.sizes.fonts['4xl'] },
    '5xl': { fontSize: theme.sizes.fonts['5xl'] },
    '6xl': { fontSize: theme.sizes.fonts['6xl'] },
    '7xl': { fontSize: theme.sizes.fonts['7xl'] },
    '8xl': { fontSize: theme.sizes.fonts['8xl'] },
    '9xl': { fontSize: theme.sizes.fonts['9xl'] },
  });

  return { text: baseStyles.text, weight, color, size };
};
