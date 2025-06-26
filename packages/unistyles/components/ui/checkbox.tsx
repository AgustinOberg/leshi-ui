import React, { useCallback, useMemo } from "react";
import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
  type DimensionValue,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useTheme } from "../../styles/context";
import { Icon } from "./icon";

/*──────────────────── Types */
export type CheckboxSize = "sm" | "base" | "lg";
export type CheckboxVariant = "default" | "destructive";
export type CheckboxState = "checked" | "unchecked" | "indeterminate";

export interface CheckboxProps extends Omit<PressableProps, "children" | "style"> {
  /** Current checked state */
  checked?: boolean;
  /** Default checked state for uncontrolled component */
  defaultChecked?: boolean;
  /** Called when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Visual size variant */
  size?: CheckboxSize;
  /** Visual style variant */
  variant?: CheckboxVariant;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  /** Custom style for the checkbox container */
  style?: StyleProp<ViewStyle>;
  /** Custom width override */
  width?: DimensionValue;
  /** Custom height override */
  height?: DimensionValue;
  /** Test ID for testing */
  testID?: string;
  /** Unique identifier for the checkbox, useful for forms and labels */
  id?: string;
  /** Accessible name for the checkbox */
  "aria-label"?: string;
  /** Additional description for screen readers */
  "aria-describedby"?: string;
  /** ID of element that labels this checkbox */
  "aria-labelledby"?: string;
}

/*──────────────────── Component */
export const Checkbox = React.memo<CheckboxProps>(({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  size = "base",
  variant = "default",
  disabled = false,
  indeterminate = false,
  style,
  width,
  height,
  testID,
  id,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  "aria-labelledby": ariaLabelledby,
  onPress,
  ...pressableProps
}) => {
  const theme = useTheme();
  
  // Handle controlled vs uncontrolled state
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : internalChecked;
  
  // Determine the current visual state
  const state: CheckboxState = useMemo(() => {
    if (indeterminate) return "indeterminate";
    return checked ? "checked" : "unchecked";
  }, [checked, indeterminate]);

  // Setup Unistyles variants
  styles.useVariants({
    size: size as any,
    variant: variant as any,
    state: state as any,
    disabled: disabled,
  });

  // Handle press events
  const handlePress = useCallback((event: any) => {
    if (disabled) return;
    
    const newChecked = !checked;
    
    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    // Call callbacks
    onCheckedChange?.(newChecked);
    onPress?.(event);
  }, [checked, disabled, isControlled, onCheckedChange, onPress]);

  // Memoized icon properties for performance
  const iconConfig = useMemo(() => {
    const iconColor = variant === "destructive" 
      ? theme.colors.destructiveForeground 
      : theme.colors.primaryForeground;
    
    const iconSize = size === "sm" ? 12 : size === "base" ? 14 : 16;
    
    return { color: iconColor, size: iconSize };
  }, [variant, theme, size]);

  const renderIcon = useCallback(() => {
    if (state === "indeterminate") {
      return (
        <Icon 
          name="minus" 
          color={iconConfig.color}
          size={iconConfig.size}
        />
      );
    }
    
    if (state === "checked") {
      return (
        <Icon 
          name="checkbox" 
          color={iconConfig.color}
          size={iconConfig.size}
        />
      );
    }
    
    return null;
  }, [state, iconConfig]);

  const containerStyle = useMemo(() => {
    const baseStyle: StyleProp<ViewStyle>[] = [styles.container];
    if (width) baseStyle.push({ width });
    if (height) baseStyle.push({ height });
    if (style) baseStyle.push(style);
    return baseStyle;
  }, [width, height, style]);

  // Enhanced accessibility
  const accessibilityProps = useMemo(() => {
    const stateDescription = indeterminate 
      ? "partially checked" 
      : checked 
        ? "checked" 
        : "unchecked";
    
    const baseAccessibilityLabel = ariaLabel || 
      pressableProps.accessibilityLabel || 
      `Checkbox, ${stateDescription}`;
    
    const accessibilityHint = pressableProps.accessibilityHint || 
      disabled 
        ? "Checkbox is disabled" 
        : `Double tap to ${checked ? "uncheck" : "check"}`;

    return {
      accessibilityRole: "checkbox" as const,
      accessibilityLabel: baseAccessibilityLabel,
      accessibilityHint,
      accessibilityState: {
        checked: indeterminate ? "mixed" as const : checked,
        disabled,
      },
      ...(ariaDescribedby && { accessibilityDescribedBy: ariaDescribedby }),
      ...(ariaLabelledby && { accessibilityLabelledBy: ariaLabelledby }),
    };
  }, [
    ariaLabel, 
    ariaDescribedby, 
    ariaLabelledby, 
    indeterminate, 
    checked, 
    disabled, 
    pressableProps.accessibilityLabel, 
    pressableProps.accessibilityHint
  ]);

  return (
    <Pressable
      style={({ pressed }: PressableStateCallbackType) => [
        ...containerStyle,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={disabled}
      testID={testID || id}
      nativeID={id}
      {...accessibilityProps}
      {...pressableProps}
    >
      {renderIcon()}
    </Pressable>
  );
});

Checkbox.displayName = "Checkbox";

/*──────────────────── Styles */
const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radii.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    
    variants: {
      size: {
        sm: {
          width: theme.sizes.width(4),
          height: theme.sizes.height(4),
        },
        base: {
          width: theme.sizes.width(5),
          height: theme.sizes.height(5),
        },
        lg: {
          width: theme.sizes.width(6),
          height: theme.sizes.height(6),
        },
      },
      variant: {
        default: {},
        destructive: {},
      },
      state: {
        unchecked: {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        },
        checked: {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        },
        indeterminate: {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
          backgroundColor: theme.colors.muted,
          borderColor: theme.colors.border,
        },
        false: {},
      },
    },
    
    // Compound variants for destructive variant
    compoundVariants: [
      {
        variant: "destructive",
        state: "checked",
        styles: {
          backgroundColor: theme.colors.destructive,
          borderColor: theme.colors.destructive,
        },
      },
      {
        variant: "destructive", 
        state: "indeterminate",
        styles: {
          backgroundColor: theme.colors.destructive,
          borderColor: theme.colors.destructive,
        },
      },
    ],
  },
  
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
}));