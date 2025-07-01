import React from 'react';
import { StyleSheet } from 'react-native-unistyles';
import { Text, type TextProps } from './text';

interface LabelProps extends Omit<TextProps, 'style' | 'children'> {
  error?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const Label = ({ error, disabled, children, ...rest }: LabelProps) => {
  styles.useVariants({
    disabled: !!disabled,
  });
  return (
    <Text
      {...rest}
      weight='medium'
      style={styles.text}
      variant={error ? 'destructive' : 'foreground'}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    variants: {
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
});
