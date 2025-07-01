import React, { createContext, useContext } from "react";
import {
  View,
  Pressable,
  type ViewProps,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../styles/theme";
import type { Theme } from "../../styles/theme";

export type RadioSize = "sm" | "md" | "lg";

interface RadioGroupContextValue {
  value: string | undefined;
  onValueChange: (val: string) => void;
  disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const useRadioGroup = () => {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioGroup primitives must be inside <RadioGroup>");
  return ctx;
};

export interface RadioGroupProps extends ViewProps {
  value: string | undefined;
  onValueChange: (val: string) => void;
  disabled?: boolean;
}

export const RadioGroup = ({
  children,
  value,
  onValueChange,
  disabled = false,
  style,
  ...rest
}: RadioGroupProps) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <View accessibilityRole="radiogroup" style={style} {...rest}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
};

export interface RadioGroupItemProps extends PressableProps {
  value: string;
  size?: RadioSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const RadioGroupItem = ({
  value: itemValue,
  size = "md",
  disabled = false,
  style,
  ...rest
}: RadioGroupItemProps) => {
  const { value, onValueChange, disabled: groupDisabled } = useRadioGroup();
  const checked = value === itemValue;
  const theme = useTheme();
  const stylesObj = styles(theme);
  const sizeStyle = stylesObj.size[size];

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled: groupDisabled || disabled }}
      onPress={() => !groupDisabled && !disabled && onValueChange(itemValue)}
      style={[
        stylesObj.container,
        sizeStyle,
        checked && stylesObj.checked,
        (groupDisabled || disabled) && stylesObj.disabled,
        style,
      ]}
      disabled={groupDisabled || disabled}
      {...rest}
    >
      {checked && <View style={[stylesObj.indicator, stylesObj.indicatorSize[size]]} />}
    </Pressable>
  );
};

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.full,
      ...theme.shadows.xs,
    },
    indicator: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.full,
    },
    checked: {
      borderColor: theme.colors.primary,
    },
    disabled: {
      opacity: 0.5,
    },
  });

  const size = {
    sm: { width: theme.sizes.width(4), height: theme.sizes.width(4) },
    md: { width: theme.sizes.width(5), height: theme.sizes.width(5) },
    lg: { width: theme.sizes.width(6), height: theme.sizes.width(6) },
  } as const;

  const indicatorSize = {
    sm: { width: theme.sizes.width(2), height: theme.sizes.width(2) },
    md: { width: theme.sizes.width(3), height: theme.sizes.width(3) },
    lg: { width: theme.sizes.width(4), height: theme.sizes.width(4) },
  } as const;

  return { ...base, size, indicatorSize };
};


