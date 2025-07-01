import React, { useCallback, useState, useMemo } from "react";
import {
  TextInput as RNTextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputProps as RNTextInputProps,
  type TextInputFocusEventData,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../styles/theme";
import type { Theme } from "../../styles/theme";
import { Label } from "./label";
import { Text, type TextSize } from "./text";

export type TextAreaSize = "sm" | "base" | "lg" | "xl";
export type TextAreaVariant = "default" | "destructive";
export type TextAreaResize = "none" | "vertical" | "horizontal" | "both";

export interface TextAreaProps extends Omit<RNTextInputProps, 'multiline'> {
  error?: string;
  label?: string;
  size?: TextAreaSize;
  variant?: TextAreaVariant;
  labelSize?: TextSize;
  description?: string;
  rows?: number;
  resize?: TextAreaResize;
  maxLength?: number;
  showCharacterCount?: boolean;
}

export const LABEL_SIZE: Record<TextAreaSize, TextSize> = {
  sm: "sm",
  base: "sm", 
  lg: "lg",
  xl: "xl",
};

export const TextArea = ({
  description,
  error,
  label,
  labelSize,
  onBlur,
  onFocus,
  size = "base",
  variant = "default",
  rows = 4,
  resize = "vertical",
  maxLength,
  showCharacterCount = false,
  value,
  ...rest
}: TextAreaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();
  const styleObj = useMemo(() => createStyles(theme), [theme]);
  
  const isDisabled = rest.editable === false;
  const isReadOnly = rest.readOnly;
  const characterCount = value?.length || 0;

  const containerStyle = useMemo(() => [
    styleObj.container,
    isDisabled && styleObj.disabled.true,
    isReadOnly && styleObj.readOnly.true,
  ], [styleObj.container, styleObj.disabled.true, styleObj.readOnly.true, isDisabled, isReadOnly]);

  const textAreaWrapperStyle = useMemo(() => [
    styleObj.textAreaWrapper,
    styleObj.size[size],
    styleObj.variant[variant],
    isFocused && styleObj.isFocused.true,
    error && styleObj.error.true,
    isDisabled && styleObj.textAreaWrapperDisabled.true,
    isReadOnly && styleObj.textAreaWrapperReadOnly.true,
  ], [styleObj.textAreaWrapper, styleObj.size, styleObj.variant, styleObj.isFocused.true, styleObj.error.true, styleObj.textAreaWrapperDisabled.true, styleObj.textAreaWrapperReadOnly.true, size, variant, isFocused, error, isDisabled, isReadOnly]);

  const textAreaStyle = useMemo(() => {
    const rowCount = Math.min(rows, 10) as keyof typeof styleObj.rows;
    return [
      styleObj.textArea,
      styleObj.rows[rowCount], // Cap at 10 rows
    ];
  }, [styleObj.textArea, styleObj.rows, rows]);

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
    <View style={containerStyle}>
      {label && (
        <Label size={labelSize ?? LABEL_SIZE[size]} error={!!error}>
          {label}
        </Label>
      )}

      <View style={textAreaWrapperStyle}>
        <RNTextInput
          {...rest}
          style={textAreaStyle}
          multiline
          numberOfLines={rows}
          textAlignVertical="top"
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.colors.mutedForeground}
          accessibilityLabel={rest.accessibilityLabel ?? label}
          accessibilityHint={rest.accessibilityHint ?? description}
          accessibilityState={{
            disabled: isDisabled,
            ...rest.accessibilityState,
          }}
          maxLength={maxLength}
          value={value}
        />
      </View>

      <View style={styleObj.footer}>
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
        {showCharacterCount && maxLength && (
          <Text 
            variant={characterCount > maxLength * 0.9 ? "destructive" : "mutedForeground"} 
            size="sm"
            style={styleObj.characterCount}
          >
            {characterCount}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};


const createStyles = (theme: Theme) => {
  const base = StyleSheet.create({
    container: {
      gap: theme.sizes.gap(1),
      width: "100%",
    },
    textAreaWrapper: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.input,
      paddingHorizontal: theme.sizes.padding(3),
      paddingVertical: theme.sizes.padding(2),
      ...theme.shadows.xs,
    },
    textArea: {
      flex: 1,
      color: theme.colors.foreground,
      fontFamily: theme.fonts.regular,
      fontSize: theme.sizes.fonts.base,
      minHeight: 0,
      includeFontPadding: false,
      textAlignVertical: "top",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: theme.sizes.gap(2),
    },
    characterCount: {
      marginLeft: "auto",
    },
  });

  const disabled = {
    true: { opacity: 0.6 },
  } as const;

  const readOnly = {
    true: { opacity: 0.8 },
  } as const;

  const textAreaWrapperDisabled = {
    true: { 
      backgroundColor: theme.colors.muted,
      borderColor: theme.colors.border,
    },
  } as const;

  const textAreaWrapperReadOnly = {
    true: {
      backgroundColor: theme.colors.muted,
    },
  } as const;

  const size = {
    sm: { 
      paddingHorizontal: theme.sizes.padding(2),
      paddingVertical: theme.sizes.padding(1),
    },
    base: { 
      paddingHorizontal: theme.sizes.padding(3),
      paddingVertical: theme.sizes.padding(2),
    },
    lg: { 
      paddingHorizontal: theme.sizes.padding(4),
      paddingVertical: theme.sizes.padding(3),
    },
    xl: { 
      paddingHorizontal: theme.sizes.padding(5),
      paddingVertical: theme.sizes.padding(4),
    },
  } as const;

  const variant = {
    default: {},
    destructive: {
      borderColor: theme.colors.destructive,
    },
  } as const;

  const isFocused = {
    true: {},
  } as const;

  const error = {
    true: { borderColor: theme.colors.destructive },
  } as const;

  const rows = {
    1: { minHeight: theme.sizes.height(6) },
    2: { minHeight: theme.sizes.height(12) },
    3: { minHeight: theme.sizes.height(18) },
    4: { minHeight: theme.sizes.height(24) },
    5: { minHeight: theme.sizes.height(30) },
    6: { minHeight: theme.sizes.height(36) },
    7: { minHeight: theme.sizes.height(42) },
    8: { minHeight: theme.sizes.height(48) },
    9: { minHeight: theme.sizes.height(54) },
    10: { minHeight: theme.sizes.height(60) },
  } as const;

  return { 
    ...base, 
    disabled, 
    readOnly, 
    textAreaWrapperDisabled, 
    textAreaWrapperReadOnly, 
    size, 
    variant, 
    isFocused, 
    error,
    rows
  };
};