import {
  Text as RNText,
  type TextProps as RNTextProps,
  Platform,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

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
  styles.useVariants({
    color: variant,
    size: size,
    weight: weight,
  });

  return (
    <RNText
      style={[styles.text, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create((theme) => ({
  text: {
    includeFontPadding: false,
    lineHeight: theme.sizes.fonts.base * 1.2,
    textAlignVertical: 'center',
    variants: {
      weight: {
        thin: {
          fontFamily: theme.fonts.thin,
          ...(Platform.OS === 'web' && { fontWeight: '100' }),
        },
        extralight: {
          fontFamily: theme.fonts.extralight,
          ...(Platform.OS === 'web' && { fontWeight: '200' }),
        },
        light: {
          fontFamily: theme.fonts.light,
          ...(Platform.OS === 'web' && { fontWeight: '300' }),
        },
        regular: {
          fontFamily: theme.fonts.regular,
          ...(Platform.OS === 'web' && { fontWeight: '400' }),
        },
        medium: {
          fontFamily: theme.fonts.medium,
          ...(Platform.OS === 'web' && { fontWeight: '500' }),
        },
        semibold: {
          fontFamily: theme.fonts.semibold,
          ...(Platform.OS === 'web' && { fontWeight: '600' }),
        },
        bold: {
          fontFamily: theme.fonts.bold,
          ...(Platform.OS === 'web' && { fontWeight: '700' }),
        },
        extrabold: {
          fontFamily: theme.fonts.extrabold,
          ...(Platform.OS === 'web' && { fontWeight: '800' }),
        },
        black: {
          fontFamily: theme.fonts.black,
          ...(Platform.OS === 'web' && { fontWeight: '900' }),
        },
      },
      color: {
        heading: {
          color: theme.colors.foreground,
          ...(Platform.OS === 'web' && { fontWeight: '600' }),
        },
        subheading: {
          color: theme.colors.foreground,
          ...(Platform.OS === 'web' && { fontWeight: '500' }),
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
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
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
        '2xl': {
          fontSize: theme.sizes.fonts['2xl'],
        },
        '3xl': {
          fontSize: theme.sizes.fonts['3xl'],
        },
        '4xl': {
          fontSize: theme.sizes.fonts['4xl'],
        },
        '5xl': {
          fontSize: theme.sizes.fonts['5xl'],
        },
        '6xl': {
          fontSize: theme.sizes.fonts['6xl'],
        },
        '7xl': {
          fontSize: theme.sizes.fonts['7xl'],
        },
        '8xl': {
          fontSize: theme.sizes.fonts['8xl'],
        },
        '9xl': {
          fontSize: theme.sizes.fonts['9xl'],
        },
      },
    },
  },
}));
