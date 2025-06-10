import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  StyleSheet,
  useUnistyles,
  type UnistylesVariants,
} from "react-native-unistyles";
import { Text } from "./text";

/* ───────────────── context ───────────────── */
interface RadioCtx {
  value: string | null;
  onChange: (v: string) => void;
  size: RadioSize;
  disabled: boolean;
}
const RadioContext = createContext<RadioCtx | null>(null);
const useRadioCtx = () => {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("RadioGroupItem must be inside RadioGroup");
  return ctx;
};

/* tamaños */
export type RadioSize = "sm" | "md" | "lg";
const SIZE_CFG: Record<RadioSize, { box: number; dot: number }> = {
  sm: { box: 16, dot: 8 },
  md: { box: 20, dot: 10 },
  lg: { box: 24, dot: 12 },
};

/* ───────────────── RadioGroup ───────────────── */
export interface RadioGroupProps {
  value: string | null;
  onValueChange: (val: string) => void;
  size?: RadioSize;
  disabled?: boolean;
  direction?: "row" | "column";
  gap?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  size = "md",
  disabled = false,
  direction = "column",
  gap,
  style,
  children,
}) => {
  const { theme } = useUnistyles();
  const ctxVal = useMemo<RadioCtx>(
    () => ({ value, onChange: onValueChange, size, disabled }),
    [value, onValueChange, size, disabled]
  );

  return (
    <RadioContext.Provider value={ctxVal}>
      <View
        style={[{ flexDirection: direction, gap: gap ?? theme.gap(1) }, style]}
      >
        {children}
      </View>
    </RadioContext.Provider>
  );
};

/* ───────────────── RadioGroupItem ───────────────── */
export interface RadioGroupItemProps
  extends Omit<PressableProps, "style" | "children" | "onPress" | "disabled">,
    UnistylesVariants<typeof itemStyles> {
  value: string;
  label?: ReactNode;
  labelStyle?: StyleProp<TextStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  indicator?: ReactNode;
  disabled?: boolean; // nuestra prop (boolean)
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  label,
  labelStyle,
  wrapperStyle,
  indicator,
  disabled: propDisabled = false,
  ...rest
}) => {
  const {
    size,
    value: selected,
    onChange,
    disabled: groupDisabled,
  } = useRadioCtx();
  const { theme } = useUnistyles();

  const isChecked = selected === value;
  const isDisabled = groupDisabled || propDisabled;

  /* notificar variante */
  itemStyles.useVariants({ disabled: isDisabled });

  /* animación */
  const prog = useSharedValue(isChecked ? 1 : 0);
  React.useEffect(() => {
    prog.value = withTiming(isChecked ? 1 : 0, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
  }, [isChecked]);

  const dotAnim = useAnimatedStyle(() => ({
    opacity: prog.value,
    transform: [{ scale: prog.value }],
  }));

  const { box, dot } = SIZE_CFG[size];

  const boxStyle: StyleProp<ViewStyle> = [
    itemStyles.boxBase,
    {
      width: box,
      height: box,
      borderRadius: box / 2,
      borderColor: isChecked ? theme.colors.primary : theme.colors.border,
    },
  ];

  const dotNode = indicator ?? (
    <View
      style={{
        width: dot,
        height: dot,
        borderRadius: dot / 2,
        backgroundColor: theme.colors.primary,
      }}
    />
  );

  return (
    <Pressable
      {...rest}
      accessibilityRole="radio"
      accessibilityState={{ disabled: isDisabled, selected: isChecked }}
      disabled={isDisabled}
      onPress={() => !isDisabled && onChange(value)}
      style={({ pressed }) => [
        itemStyles.wrapper,
        wrapperStyle,
        pressed && !isDisabled && itemStyles.pressed,
      ]}
    >
      <View style={boxStyle}>
        <Animated.View style={[dotAnim, itemStyles.center]}>
          {dotNode}
        </Animated.View>
      </View>
      {label && <Text style={labelStyle}>{label}</Text>}
    </Pressable>
  );
};

/* ───────────────── StyleSheet ───────────────── */
const itemStyles = StyleSheet.create((theme) => ({
  center: { justifyContent: "center", alignItems: "center" },

  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(0.5),
    variants: { disabled: { true: { opacity: 0.5 } } },
  },

  boxBase: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    backgroundColor: theme.colors.background,
    marginRight: theme.gap(0.5),
  },

  pressed: { opacity: 0.75 },
}));

/* export conveniencia */
export const Radio = { Group: RadioGroup, Item: RadioGroupItem };
