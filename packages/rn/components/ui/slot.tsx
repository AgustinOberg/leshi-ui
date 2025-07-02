import * as React from 'react';
import {
  Image as RNImage,
  Pressable as RNPressable,
  Text as RNText,
  View as RNView,
  StyleSheet,
  type PressableStateCallbackType,
  type ImageProps as RNImageProps,
  type ImageStyle as RNImageStyle,
  type PressableProps as RNPressableProps,
  type TextProps as RNTextProps,
  type ViewProps as RNViewProps,
  type StyleProp,
} from 'react-native';

const Pressable = React.forwardRef<
  React.ElementRef<typeof RNPressable>,
  RNPressableProps
>((props, forwardedRef) => {
  const { children, ...pressableSlotProps } = props;

  if (!React.isValidElement(children)) {
    console.warn('Slot.Pressable - Invalid asChild element', children);
    return null;
  }

  return React.cloneElement<
    React.ComponentPropsWithoutRef<typeof RNPressable>,
    React.ElementRef<typeof RNPressable>
  >(isTextChildren(children) ? <></> : children, {
    ...mergeProps(pressableSlotProps, children.props as ComponentProps),
    ref: forwardedRef
      ? composeRefs(
          forwardedRef,
          (
            children as React.ReactElement & {
              ref?: React.Ref<React.ElementRef<typeof RNPressable>>;
            }
          ).ref,
        )
      : (
          children as React.ReactElement & {
            ref?: React.Ref<React.ElementRef<typeof RNPressable>>;
          }
        ).ref,
  });
});

Pressable.displayName = 'SlotPressable';

const View = React.forwardRef<React.ElementRef<typeof RNView>, RNViewProps>(
  (props, forwardedRef) => {
    const { children, ...viewSlotProps } = props;

    if (!React.isValidElement(children)) {
      console.warn('Slot.View - Invalid asChild element', children);
      return null;
    }

    return React.cloneElement<
      React.ComponentPropsWithoutRef<typeof RNView>,
      React.ElementRef<typeof RNView>
    >(isTextChildren(children) ? <></> : children, {
      ...mergeProps(viewSlotProps, children.props as ComponentProps),
      ref: forwardedRef
        ? composeRefs(
            forwardedRef,
            (
              children as React.ReactElement & {
                ref?: React.Ref<React.ElementRef<typeof RNView>>;
              }
            ).ref,
          )
        : (
            children as React.ReactElement & {
              ref?: React.Ref<React.ElementRef<typeof RNView>>;
            }
          ).ref,
    });
  },
);

View.displayName = 'SlotView';

const Text = React.forwardRef<React.ElementRef<typeof RNText>, RNTextProps>(
  (props, forwardedRef) => {
    const { children, ...textSlotProps } = props;

    if (!React.isValidElement(children)) {
      console.warn('Slot.Text - Invalid asChild element', children);
      return null;
    }

    return React.cloneElement<
      React.ComponentPropsWithoutRef<typeof RNText>,
      React.ElementRef<typeof RNText>
    >(isTextChildren(children) ? <></> : children, {
      ...mergeProps(textSlotProps, children.props as ComponentProps),
      ref: forwardedRef
        ? composeRefs(
            forwardedRef,
            (
              children as React.ReactElement & {
                ref?: React.Ref<React.ElementRef<typeof RNText>>;
              }
            ).ref,
          )
        : (
            children as React.ReactElement & {
              ref?: React.Ref<React.ElementRef<typeof RNText>>;
            }
          ).ref,
    });
  },
);

Text.displayName = 'SlotText';

type ImageSlotProps = RNImageProps & {
  children?: React.ReactNode;
};

const Image = React.forwardRef<
  React.ElementRef<typeof RNImage>,
  ImageSlotProps
>((props, forwardedRef) => {
  const { children, ...imageSlotProps } = props;

  if (!React.isValidElement(children)) {
    console.warn('Slot.Image - Invalid asChild element', children);
    return null;
  }

  return React.cloneElement<
    React.ComponentPropsWithoutRef<typeof RNImage>,
    React.ElementRef<typeof RNImage>
  >(isTextChildren(children) ? <></> : children, {
    ...mergeProps(imageSlotProps, children.props as ComponentProps),
    ref: forwardedRef
      ? composeRefs(
          forwardedRef,
          (
            children as React.ReactElement & {
              ref?: React.Ref<React.ElementRef<typeof RNImage>>;
            }
          ).ref,
        )
      : (
          children as React.ReactElement & {
            ref?: React.Ref<React.ElementRef<typeof RNImage>>;
          }
        ).ref,
  });
});

Image.displayName = 'SlotImage';

export { Image, Pressable, Text, View };

function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) =>
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T>).current = node;
      }
    });
}

type ComponentProps = Record<string, unknown>;

function mergeProps(slotProps: ComponentProps, childProps: ComponentProps) {
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          (childPropValue as (...args: unknown[]) => void)(...args);
          (slotPropValue as (...args: unknown[]) => void)(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === 'style') {
      overrideProps[propName] = combineStyles(
        slotPropValue as Style,
        childPropValue as Style,
      );
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .join(' ');
    }
  }

  return { ...slotProps, ...overrideProps };
}

type PressableStyle = RNPressableProps['style'];
type ImageStyle = StyleProp<RNImageStyle>;
type Style = PressableStyle | ImageStyle;

function combineStyles(slotStyle?: Style, childValue?: Style) {
  if (typeof slotStyle === 'function' && typeof childValue === 'function') {
    return (state: PressableStateCallbackType) => {
      return StyleSheet.flatten([slotStyle(state), childValue(state)]);
    };
  }
  if (typeof slotStyle === 'function') {
    return (state: PressableStateCallbackType) => {
      return childValue
        ? StyleSheet.flatten([slotStyle(state), childValue])
        : slotStyle(state);
    };
  }
  if (typeof childValue === 'function') {
    return (state: PressableStateCallbackType) => {
      return slotStyle
        ? StyleSheet.flatten([slotStyle, childValue(state)])
        : childValue(state);
    };
  }

  return StyleSheet.flatten([slotStyle, childValue].filter(Boolean));
}

export function isTextChildren(
  children:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode),
) {
  return Array.isArray(children)
    ? children.every((child) => typeof child === 'string')
    : typeof children === 'string';
}
