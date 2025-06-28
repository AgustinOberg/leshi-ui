import React from "react";
import { StyleSheet } from "react-native";
import { Text, type TextProps } from "./text";

interface LabelProps extends Omit<TextProps, "style" | "children"> {
  error?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const Label = ({ error, disabled, children, ...rest }: LabelProps) => {
  const styleObj = styles;
  return (
    <Text
      {...rest}
      weight="medium"
      style={[styleObj.text, disabled && styleObj.disabled]}
      variant={error ? "destructive" : "foreground"}
    >
      {children}
    </Text>
  );
};


const styles = StyleSheet.create({
  text: {},
  disabled: {
    opacity: 0.5,
  },
});
