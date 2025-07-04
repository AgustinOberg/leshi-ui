import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { View, Pressable, type ViewProps, type PressableProps, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Text } from './text';

interface TabsContextValue {
  value: string;
  setValue: (val: string) => void;
  register: (val: string, layout: { x: number; width: number }) => void;
  indicatorX: Animated.SharedValue<number>;
  indicatorW: Animated.SharedValue<number>;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabs = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be inside <Tabs.Root>');
  return ctx;
};

export interface TabsRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

function TabsRoot({ value: controlled, defaultValue, onValueChange, children }: TabsRootProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
  const value = controlled ?? uncontrolled;

  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);
  const layouts = useRef<Record<string, { x: number; width: number }>>({});

  const setValue = useCallback(
    (v: string) => {
      if (controlled === undefined) setUncontrolled(v);
      onValueChange?.(v);
      const layout = layouts.current[v];
      if (layout) {
        indicatorX.value = withTiming(layout.x, { duration: 200 });
        indicatorW.value = withTiming(layout.width, { duration: 200 });
      }
    },
    [controlled, onValueChange, indicatorX, indicatorW],
  );

  const register = useCallback(
    (val: string, layout: { x: number; width: number }) => {
      layouts.current[val] = layout;
      if (val === value) {
        indicatorX.value = layout.x;
        indicatorW.value = layout.width;
      }
    },
    [value, indicatorX, indicatorW],
  );

  const context = useMemo(
    () => ({ value, setValue, register, indicatorX, indicatorW }),
    [value, setValue, register, indicatorX, indicatorW],
  );

  return <TabsContext.Provider value={context}>{children}</TabsContext.Provider>;
}

export interface TabsListProps extends ViewProps {
  children: React.ReactNode;
}

function TabsList({ children, style, ...rest }: TabsListProps) {
  const { theme } = useUnistyles();
  const { indicatorX, indicatorW } = useTabs();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorW.value,
  }));

  return (
    <View style={[styles.list, style]} {...rest}>
      {children}
      <Animated.View style={[styles.indicator(theme), animatedStyle]} />
    </View>
  );
}

export interface TabsTriggerProps extends PressableProps {
  value: string;
  children: React.ReactNode;
}

function TabsTrigger({ value, children, onPress, onLayout, style, ...rest }: TabsTriggerProps) {
  const { value: active, setValue, register } = useTabs();
  const isActive = active === value;

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      onLayout?.(e);
      register(value, { x: e.nativeEvent.layout.x, width: e.nativeEvent.layout.width });
    },
    [value, onLayout, register],
  );

  const handlePress = useCallback(
    (e: any) => {
      onPress?.(e);
      if (!e.defaultPrevented) setValue(value);
    },
    [onPress, setValue, value],
  );

  return (
    <Pressable
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      onLayout={handleLayout}
      onPress={handlePress}
      style={[styles.trigger, isActive && styles.triggerActive, style]}
      {...rest}
    >
      <Text variant={isActive ? 'primary' : 'mutedForeground'} weight='medium'>
        {children}
      </Text>
    </Pressable>
  );
}

export interface TabsContentProps extends ViewProps {
  value: string;
  children: React.ReactNode;
}

function TabsContent({ value, children, style, ...rest }: TabsContentProps) {
  const { value: active } = useTabs();
  if (value !== active) return null;
  return (
    <View style={[styles.content, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  list: {
    flexDirection: 'row',
    position: 'relative',
  },
  indicator: (t: typeof theme) => ({
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: t.colors.primary,
  }),
  trigger: {
    paddingVertical: theme.sizes.padding(2),
    paddingHorizontal: theme.sizes.padding(4),
  },
  triggerActive: {},
  content: {
    paddingTop: theme.sizes.padding(4),
  },
}));

export const Tabs = { Root: TabsRoot, List: TabsList, Trigger: TabsTrigger, Content: TabsContent };
