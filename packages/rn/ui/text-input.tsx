import {
  TextInput as RNTextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputProps as RNTextInputProps,
  type TextInputFocusEventData,
} from "react-native";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "@/theme/native";
import Label from "./label";
import { Text, type TextSize } from "./text";

export type TextInputSize = "sm" | "base" | "lg" | "xl";
export type TextInputContentSize = "base" | "sm" | "lg" | "xl";

export interface TextInputProps extends RNTextInputProps {
  error?: string;
  label?: string;
  size?: TextInputSize;
  labelSize?: TextSize;
  textSize?: TextInputContentSize;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  description?: string;
}

export const LABEL_SIZE: Record<TextInputSize, TextSize> = {
  sm: "sm",
  base: "sm",
  lg: "lg",
  xl: "xl",
};

export const TextInput = ({
  description,
  error,
  label,
  labelSize,
  onBlur,
  onFocus,
  prefix,
  size = "base",
  suffix,
  textSize = "base",
  ...rest
}: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();
  const styleObj = styles(theme);

  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  return (
    <View
      style={[
        styleObj.container,
        rest.editable === false && styleObj.editable.false,
      ]}
    >
      {label && (
        <Label size={labelSize ?? LABEL_SIZE[size]} error={!!error}>
          {label}
        </Label>
      )}

      <View
        style={[
          styleObj.inputWrapper,
          styleObj.size[size],
          isFocused && styleObj.isFocused.true,
          error && styleObj.error.true,
        ]}
      >
        {prefix && <View style={styleObj.affix}>{prefix}</View>}

        <RNTextInput
          {...rest}
          style={[styleObj.input, styleObj.textSize[textSize]]}
          verticalAlign="middle"
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.colors.mutedForeground}
        />

        {suffix && <View style={styleObj.affix}>{suffix}</View>}
      </View>
      {description && (
        <Text variant="mutedForeground" size="sm">
          {description}
        </Text>
      )}
      {error && (
        <Text variant="destructive" size="sm">
          {error}
        </Text>
      )}
    </View>
  );
};

export default TextInput;

import type { Theme } from "@/theme/theme";

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
    container: {
      gap: theme.sizes.gap(1),
      width: "100%",
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.input,
      paddingHorizontal: theme.sizes.padding(3),
      ...theme.shadows.xs,
    },
    input: {
      flex: 1,
      color: theme.colors.foreground,
      fontFamily: theme.fonts.medium,
      minHeight: 0,
      paddingVertical: 0,
      includeFontPadding: false,
      textAlignVertical: "center",
    },
    affix: {
      minWidth: theme.sizes.height(5),
      alignItems: "center",
      justifyContent: "center",
      gap: theme.sizes.gap(1),
    },
  });

  const editable = {
    false: { opacity: 0.6 },
  } as const;

  const size = {
    base: { height: theme.sizes.height(9.5) },
    sm: { height: theme.sizes.height(8) },
    lg: { height: theme.sizes.height(10) },
    xl: { height: theme.sizes.height(12) },
  } as const;

  const isFocused = {
    true: {},
  } as const;

  const error = {
    true: { borderColor: theme.colors.destructive },
  } as const;

  const textSize = {
    base: { fontSize: theme.sizes.fonts.base },
    sm: { fontSize: theme.sizes.fonts.sm },
    lg: { fontSize: theme.sizes.fonts.lg },
    xl: { fontSize: theme.sizes.fonts.xl },
  } as const;

  return { ...base, editable, size, isFocused, error, textSize };
};
