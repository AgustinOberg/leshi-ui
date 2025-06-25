import {
  TextInput as RNTextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputProps as RNTextInputProps,
  type TextInputFocusEventData,
} from "react-native";
import { useCallback, useState, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../theme/native";
import Label from "./label";
import { Text, type TextSize } from "./text";

export type TextInputSize = "sm" | "base" | "lg" | "xl";
export type TextInputContentSize = "base" | "sm" | "lg" | "xl";
export type TextInputVariant = "default" | "destructive";

export interface TextInputProps extends RNTextInputProps {
  error?: string;
  label?: string;
  size?: TextInputSize;
  variant?: TextInputVariant;
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
  variant = "default",
  suffix,
  textSize = "base",
  ...rest
}: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();
  const styleObj = useMemo(() => styles(theme), [theme]);

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

  const isDisabled = rest.editable === false;
  const isReadOnly = rest.readOnly;

  const containerStyle = useMemo(() => [
    styleObj.container,
    isDisabled && styleObj.disabled.true,
    isReadOnly && styleObj.readOnly.true,
  ], [styleObj.container, styleObj.disabled.true, styleObj.readOnly.true, isDisabled, isReadOnly]);

  const inputWrapperStyle = useMemo(() => [
    styleObj.inputWrapper,
    styleObj.size[size],
    styleObj.variant[variant],
    isFocused && styleObj.isFocused.true,
    error && styleObj.error.true,
    isDisabled && styleObj.inputWrapperDisabled.true,
    isReadOnly && styleObj.inputWrapperReadOnly.true,
  ], [styleObj.inputWrapper, styleObj.size, styleObj.variant, styleObj.isFocused.true, styleObj.error.true, styleObj.inputWrapperDisabled.true, styleObj.inputWrapperReadOnly.true, size, variant, isFocused, error, isDisabled, isReadOnly]);

  const inputStyle = useMemo(() => [
    styleObj.input,
    styleObj.textSize[textSize]
  ], [styleObj.input, styleObj.textSize, textSize]);

  return (
    <View style={containerStyle}>
      {label && (
        <Label size={labelSize ?? LABEL_SIZE[size]} error={!!error}>
          {label}
        </Label>
      )}

      <View style={inputWrapperStyle}>
        {prefix && <View style={styleObj.affix}>{prefix}</View>}

        <RNTextInput
          {...rest}
          style={inputStyle}
          verticalAlign="middle"
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.colors.mutedForeground}
          accessibilityLabel={rest.accessibilityLabel ?? label}
          accessibilityHint={rest.accessibilityHint ?? description}
          accessibilityState={{
            disabled: isDisabled,
            ...rest.accessibilityState,
          }}
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

import type { Theme } from "../theme/theme";

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

  const disabled = {
    true: { opacity: 0.6 },
  } as const;

  const readOnly = {
    true: { opacity: 0.8 },
  } as const;

  const inputWrapperDisabled = {
    true: { 
      backgroundColor: theme.colors.muted,
      borderColor: theme.colors.border,
    },
  } as const;

  const inputWrapperReadOnly = {
    true: {
      backgroundColor: theme.colors.muted,
    },
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

  const variant = {
    default: {},
    destructive: {
      borderColor: theme.colors.destructive,
    },
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

  return { ...base, disabled, readOnly, inputWrapperDisabled, inputWrapperReadOnly, size, variant, isFocused, error, textSize };
};
