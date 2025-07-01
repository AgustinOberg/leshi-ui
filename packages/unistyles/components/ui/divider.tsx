import {
  View,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends ViewProps {
  orientation?: DividerOrientation;
  style?: StyleProp<ViewStyle>;
}

export const Divider = ({
  orientation = 'horizontal',
  style,
  ...rest
}: DividerProps) => {
  styles.useVariants({ orientation });
  return (
    <View
      style={[styles.container, style]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.border,
    alignSelf: 'stretch',
    variants: {
      orientation: {
        horizontal: { height: StyleSheet.hairlineWidth, width: '100%' },
        vertical: { width: StyleSheet.hairlineWidth, height: '100%' },
      },
    },
  },
}));
