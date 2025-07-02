import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../styles/theme';
import type { Theme } from '../../styles/theme';
import { Text } from './text';
import { Icon } from './icon';

export type AccordionType = 'single' | 'multiple';
export type AccordionVariant = 'default' | 'bordered' | 'separated';

// Context for managing accordion state
interface AccordionContextValue {
  type: AccordionType;
  variant: AccordionVariant;
  openItems: string[];
  toggleItem: (value: string) => void;
  disabled?: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within AccordionRoot');
  }
  return context;
};

// Root component props
export interface AccordionRootProps {
  type?: AccordionType;
  variant?: AccordionVariant;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: any;
}

// Item component props
export interface AccordionItemProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  style?: any;
}

// Trigger component props
export interface AccordionTriggerProps {
  children: React.ReactNode;
  style?: any;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
}

// Content component props
export interface AccordionContentProps {
  children: React.ReactNode;
  style?: any;
}

// Context for managing individual item state
interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled?: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger and AccordionContent must be used within AccordionItem');
  }
  return context;
};

// Root component
export const AccordionRoot = ({
  type = 'single',
  variant = 'default',
  defaultValue,
  value: controlledValue,
  onValueChange,
  disabled = false,
  children,
  style,
}: AccordionRootProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Initialize state based on type and defaultValue
  const getInitialOpenItems = useCallback(() => {
    if (controlledValue !== undefined) {
      return Array.isArray(controlledValue) ? controlledValue : [controlledValue];
    }
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  }, [controlledValue, defaultValue]);

  const [openItems, setOpenItems] = useState<string[]>(getInitialOpenItems);

  // Update internal state when controlled value changes
  React.useEffect(() => {
    if (controlledValue !== undefined) {
      const newOpenItems = Array.isArray(controlledValue) ? controlledValue : [controlledValue];
      setOpenItems(newOpenItems);
    }
  }, [controlledValue]);

  const toggleItem = useCallback((itemValue: string) => {
    if (disabled) return;

    const newOpenItems = [...openItems];
    const isCurrentlyOpen = newOpenItems.includes(itemValue);

    if (type === 'single') {
      // Single mode: only one item can be open
      if (isCurrentlyOpen) {
        newOpenItems.splice(newOpenItems.indexOf(itemValue), 1);
      } else {
        newOpenItems.length = 0; // Close all others
        newOpenItems.push(itemValue);
      }
    } else {
      // Multiple mode: multiple items can be open
      if (isCurrentlyOpen) {
        newOpenItems.splice(newOpenItems.indexOf(itemValue), 1);
      } else {
        newOpenItems.push(itemValue);
      }
    }

    if (controlledValue === undefined) {
      setOpenItems(newOpenItems);
    }

    // Call onValueChange with appropriate format
    if (onValueChange) {
      if (type === 'single') {
        onValueChange(newOpenItems.length > 0 ? newOpenItems[0] : '');
      } else {
        onValueChange(newOpenItems);
      }
    }
  }, [openItems, type, disabled, controlledValue, onValueChange]);

  const contextValue: AccordionContextValue = {
    type,
    variant,
    openItems,
    toggleItem,
    disabled,
  };

  return (
    <AccordionContext.Provider value={contextValue}>
      <View style={[styles.root[variant], style]}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
};

// Item component
export const AccordionItem = ({
  value,
  disabled = false,
  children,
  style,
}: AccordionItemProps) => {
  const { openItems, disabled: rootDisabled, variant } = useAccordionContext();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isOpen = openItems.includes(value);
  const isDisabled = disabled || rootDisabled;

  const contextValue: AccordionItemContextValue = {
    value,
    isOpen,
    disabled: isDisabled,
  };

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <View style={[styles.item[variant], style]}>
        {children}
      </View>
    </AccordionItemContext.Provider>
  );
};

// Trigger component
export const AccordionTrigger = ({
  children,
  style,
  showIcon = true,
  iconPosition = 'right',
}: AccordionTriggerProps) => {
  const { toggleItem, variant } = useAccordionContext();
  const { value, isOpen, disabled } = useAccordionItemContext();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const rotation = useSharedValue(isOpen ? 180 : 0);

  React.useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [isOpen, rotation]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handlePress = () => {
    if (!disabled) {
      toggleItem(value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.trigger[variant],
        disabled && styles.triggerDisabled,
        pressed && !disabled && styles.triggerPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ 
        expanded: isOpen,
        disabled: disabled 
      }}
    >
      <View style={styles.triggerContent}>
        {showIcon && iconPosition === 'left' && (
          <Animated.View style={[styles.iconLeft, iconStyle]}>
            <Icon name="chevron-down" size={16} />
          </Animated.View>
        )}
        
        <View style={styles.triggerText}>
          {typeof children === 'string' ? (
            <Text 
              variant="body" 
              weight="medium"
              style={disabled ? styles.triggerTextDisabled : undefined}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
        
        {showIcon && iconPosition === 'right' && (
          <Animated.View style={[styles.iconRight, iconStyle]}>
            <Icon name="chevron-down" size={16} />
          </Animated.View>
        )}
      </View>
    </Pressable>
  );
};

// Content component
export const AccordionContent = ({
  children,
  style,
}: AccordionContentProps) => {
  const { variant } = useAccordionContext();
  const { isOpen } = useAccordionItemContext();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const height = useSharedValue(isOpen ? 1 : 0);
  const contentHeight = useSharedValue(0);

  React.useEffect(() => {
    if (contentHeight.value > 0) {
      height.value = withTiming(isOpen ? contentHeight.value : 0, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [isOpen, contentHeight.value, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: 'hidden',
  }));

  const handleLayout = (event: any) => {
    const { height: measuredHeight } = event.nativeEvent.layout;
    if (measuredHeight > 0 && Math.abs(contentHeight.value - measuredHeight) > 1) {
      contentHeight.value = measuredHeight;
      // Set initial height without animation if first measurement
      if (isOpen && height.value === 1) {
        height.value = measuredHeight;
      } else if (isOpen) {
        height.value = withTiming(measuredHeight, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        });
      }
    }
  };

  return (
    <Animated.View style={[styles.content[variant], animatedStyle]}>
      <View 
        style={[styles.contentInner, style]}
        onLayout={handleLayout}
      >
        {children}
      </View>
    </Animated.View>
  );
};

// Compound component
export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};

const createStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    triggerPressed: { opacity: 0.7 },
    triggerDisabled: { opacity: 0.5 },
    triggerTextDisabled: { color: theme.colors.mutedForeground },
    triggerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    triggerText: {
      flex: 1,
    },
    iconLeft: {
      marginRight: theme.sizes.gap(2),
    },
    iconRight: {
      marginLeft: theme.sizes.gap(2),
    },
    contentInner: {
      paddingTop: theme.sizes.padding(3),
      paddingBottom: theme.sizes.padding(4),
    },
  });

  const root = StyleSheet.create({
    default: {
      backgroundColor: 'transparent',
    },
    bordered: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      overflow: 'hidden',
    },
    separated: {
      backgroundColor: 'transparent',
      gap: theme.sizes.gap(1),
    },
  });

  const item = StyleSheet.create({
    default: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    bordered: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    separated: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
  });

  const trigger = StyleSheet.create({
    default: {
      paddingVertical: theme.sizes.padding(4),
      paddingHorizontal: 0,
      minHeight: 48,
      justifyContent: 'center',
    },
    bordered: {
      paddingVertical: theme.sizes.padding(4),
      paddingHorizontal: theme.sizes.padding(4),
      minHeight: 48,
      justifyContent: 'center',
    },
    separated: {
      paddingVertical: theme.sizes.padding(4),
      paddingHorizontal: theme.sizes.padding(4),
      minHeight: 48,
      justifyContent: 'center',
    },
  });

  const content = StyleSheet.create({
    default: {
      // No extra styling needed, overflow handled by animated view
    },
    bordered: {
      paddingHorizontal: theme.sizes.padding(4),
    },
    separated: {
      paddingHorizontal: theme.sizes.padding(4),
    },
  });

  return {
    ...baseStyles,
    root,
    item,
    trigger,
    content,
  };
};