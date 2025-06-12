import Text, { type TextProps } from "./text";
import { StyleSheet } from "react-native-unistyles";

interface LabelProps extends Omit<TextProps, "style" | "children"> {
  error?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Label = ({ error, disabled, children, ...rest }: LabelProps) => {
  styles.useVariants({
    disabled: !!disabled,
  });
  return (
    <Text
      {...rest}
      weight="medium"
      style={styles.text}
      variant={error ? "destructive" : "primary"}
    >
      {children}
    </Text>
  );
};

export default Label;

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
