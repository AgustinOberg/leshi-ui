import {
  TextInput as RNTextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputProps as RNTextInputProps,
  type TextInputFocusEventData,
} from "react-native";
import { useCallback, useState } from "react";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
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
  const { theme } = useUnistyles();

  styles.useVariants({
    error: !!error,
    isFocused,
    size,
    textSize,
    editable: rest.editable,
  });

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
    <View style={styles.container}>
      {label && (
        <Label size={labelSize ?? LABEL_SIZE[size]} error={!!error}>
          {label}
        </Label>
      )}

      <View style={styles.inputWrapper}>
        {prefix && <View style={styles.affix}>{prefix}</View>}

        <RNTextInput
          {...rest}
          style={styles.input}
          verticalAlign="middle"
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.colors.mutedForeground}
        />

        {suffix && <View style={styles.affix}>{suffix}</View>}
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

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.sizes.gap(1),
    width: "100%",
    variants: {
      editable: {
        false: {
          opacity: 0.6,
        },
      },
    },
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.input,
    paddingHorizontal: theme.sizes.p(3),
    ...theme.shadow.xs,

    variants: {
      size: {
        base: { height: theme.sizes.h(9.5) },
        sm: { height: theme.sizes.h(8) },
        lg: { height: theme.sizes.h(10) },
        xl: { height: theme.sizes.h(12) },
      },
      isFocused: {
        true: {},
      },
      error: {
        true: {
          borderColor: theme.colors.destructive,
        },
      },
    },
  },

  input: {
    flex: 1,
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    minHeight: 0,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: "center",

    variants: {
      textSize: {
        base: { fontSize: theme.sizes.fonts.base },
        sm: { fontSize: theme.sizes.fonts.sm },
        lg: { fontSize: theme.sizes.fonts.lg },
        xl: { fontSize: theme.sizes.fonts.xl },
      },
    },
  },

  affix: {
    minWidth: theme.sizes.h(5),
    alignItems: "center",
    justifyContent: "center",
    gap: theme.sizes.gap(1),
  },
}));
