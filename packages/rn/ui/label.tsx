import Text, { type TextProps, type TextSize } from "./text";
import { StyleSheet } from "react-native";

interface LabelProps extends Omit<TextProps, "style" | "children"> {
  error?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Label = ({ error, disabled, children, ...rest }: LabelProps) => {
  const styleObj = styles;
  return (
    <Text
      {...rest}
      weight="medium"
      style={[styleObj.text, disabled && styleObj.disabled]}
      variant={error ? "destructive" : "primary"}
    >
      {children}
    </Text>
  );
};

export default Label;

const styles = StyleSheet.create({
  text: {},
  disabled: {
    opacity: 0.5,
  },
});
