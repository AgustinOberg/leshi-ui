import {
  TextInput as RNTextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputProps as RNTextInputProps,
  type TextInputFocusEventData,
} from "react-native";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import Label from "./label";
import { Text, type TextSize } from "./text";
import { useTheme } from "../../styles/context";

export type TextAreaSize = "sm" | "base" | "lg" | "xl";
export type TextAreaVariant = "destructive" | "default";
export type TextAreaRows = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
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

  const isDisabled = rest.editable === false;
  const isReadOnly = rest.readOnly;
  const characterCount = value?.length || 0;

  styles.useVariants({
    error: !!error,
    isFocused,
    size,
    variant: variant as any,
    disabled: isDisabled,
    readOnly: isReadOnly,
    rows: Math.min(rows, 10) as TextAreaRows, // Cap at 10 rows
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

      <View style={styles.textAreaWrapper}>
        <RNTextInput
          {...rest}
          style={styles.textArea}
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

      <View style={styles.footer}>
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
            style={styles.characterCount}
          >
            {characterCount}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

export default TextArea;

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.sizes.gap(1),
    width: "100%",
    variants: {
      disabled: {
        true: {
          opacity: 0.6,
        },
      },
      readOnly: {
        true: {
          opacity: 0.8,
        },
      },
    },
  },

  textAreaWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.input,
    ...theme.shadows.xs,

    variants: {
      size: {
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
      },
      variant: {
        default: {
          borderColor: theme.colors.border,
        },
        destructive: {
          borderColor: theme.colors.destructive,
        },
      },
      disabled: {
        true: {
          backgroundColor: theme.colors.muted,
          borderColor: theme.colors.border,
        },
      },
      readOnly: {
        true: {
          backgroundColor: theme.colors.muted,
        },
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

  textArea: {
    flex: 1,
    color: theme.colors.foreground,
    fontFamily: theme.fonts.regular,
    fontSize: theme.sizes.fonts.base,
    minHeight: 0,
    includeFontPadding: false,
    textAlignVertical: "top",

    variants: {
      rows: {
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
      },
    },
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
}));