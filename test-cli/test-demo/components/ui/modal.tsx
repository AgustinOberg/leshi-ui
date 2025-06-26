import React, { useEffect, useRef, useCallback, useMemo } from "react";
import {
  View,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
  BackHandler,
  StatusBar,
  type ViewProps,
  type ViewStyle,
  type StyleProp,
} from "react-native";
import { Portal } from "@gorhom/portal";
import { useTheme } from "../styles/native";
import { getBackdropConfig, DEFAULT_MODAL_CONFIG } from "./modal-utils";

export type ModalSize = "sm" | "base" | "lg" | "xl" | "full";
export type ModalAnimation = "fade" | "slide" | "scale" | "none";

export interface ModalProps extends ViewProps {
  visible: boolean;
  onRequestClose?: () => void;
  animationType?: ModalAnimation;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnBackButton?: boolean;
  backdropOpacity?: number;
  backdropColor?: string;
  statusBarTranslucent?: boolean;
  children: React.ReactNode;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const SIZE_CONFIG = {
  sm: { width: Math.min(400, SCREEN_WIDTH * 0.9), maxHeight: SCREEN_HEIGHT * 0.6 },
  base: { width: Math.min(500, SCREEN_WIDTH * 0.9), maxHeight: SCREEN_HEIGHT * 0.8 },
  lg: { width: Math.min(600, SCREEN_WIDTH * 0.95), maxHeight: SCREEN_HEIGHT * 0.85 },
  xl: { width: Math.min(800, SCREEN_WIDTH * 0.95), maxHeight: SCREEN_HEIGHT * 0.9 },
  full: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
} as const satisfies Record<ModalSize, { width: number; height?: number; maxHeight?: number }>;

export const Modal: React.FC<ModalProps> = ({
  visible,
  onRequestClose,
  animationType = "fade",
  size = "base",
  closeOnBackdrop = DEFAULT_MODAL_CONFIG.closeOnBackdrop,
  closeOnBackButton = DEFAULT_MODAL_CONFIG.closeOnBackButton,
  backdropOpacity,
  backdropColor,
  statusBarTranslucent = DEFAULT_MODAL_CONFIG.statusBarTranslucent,
  children,
  style,
  ...rest
}) => {
  const theme = useTheme();
  const backdropConfig = useMemo(() => getBackdropConfig(theme), [theme]);
  
  // Use provided values or fall back to theme defaults
  const finalBackdropOpacity = backdropOpacity ?? backdropConfig.opacity;
  const backdropOpacityAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const sizeConfig = useMemo(() => SIZE_CONFIG[size], [size]);

  const animateIn = useCallback(() => {
    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(backdropOpacityAnim, {
        toValue: finalBackdropOpacity,
        duration: 250,
        useNativeDriver: true,
      }),
    ];

    switch (animationType) {
      case "fade":
        animations.push(
          Animated.timing(contentAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          })
        );
        break;
      case "scale":
        animations.push(
          Animated.parallel([
            Animated.timing(contentAnim, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ])
        );
        break;
      case "slide":
        animations.push(
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          })
        );
        break;
      case "none":
        backdropOpacityAnim.setValue(finalBackdropOpacity);
        contentAnim.setValue(1);
        scaleAnim.setValue(1);
        slideAnim.setValue(0);
        return;
    }

    Animated.parallel(animations).start();
  }, [
    backdropOpacityAnim,
    contentAnim,
    scaleAnim,
    slideAnim,
    animationType,
    finalBackdropOpacity,
  ]);

  const animateOut = useCallback(
    (callback?: () => void) => {
      const animations: Animated.CompositeAnimation[] = [
        Animated.timing(backdropOpacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ];

      switch (animationType) {
        case "fade":
          animations.push(
            Animated.timing(contentAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            })
          );
          break;
        case "scale":
          animations.push(
            Animated.parallel([
              Animated.timing(contentAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 200,
                useNativeDriver: true,
              }),
            ])
          );
          break;
        case "slide":
          animations.push(
            Animated.timing(slideAnim, {
              toValue: SCREEN_HEIGHT,
              duration: 250,
              useNativeDriver: true,
            })
          );
          break;
        case "none":
          backdropOpacityAnim.setValue(0);
          contentAnim.setValue(0);
          scaleAnim.setValue(0.95);
          slideAnim.setValue(SCREEN_HEIGHT);
          callback?.();
          return;
      }

      Animated.parallel(animations).start(callback);
    },
    [backdropOpacityAnim, contentAnim, scaleAnim, slideAnim, animationType]
  );

  const handleBackdropPress = useCallback(() => {
    if (closeOnBackdrop && onRequestClose) {
      animateOut(onRequestClose);
    }
  }, [closeOnBackdrop, onRequestClose, animateOut]);

  const handleBackButton = useCallback(() => {
    if (closeOnBackButton && onRequestClose) {
      animateOut(onRequestClose);
      return true;
    }
    return false;
  }, [closeOnBackButton, onRequestClose, animateOut]);

  // Handle Android back button
  useEffect(() => {
    if (visible) {
      const subscription = BackHandler.addEventListener("hardwareBackPress", handleBackButton);
      return () => subscription.remove();
    }
  }, [visible, handleBackButton]);

  // Handle animation when visibility changes
  useEffect(() => {
    if (visible) {
      animateIn();
    } else {
      // Reset animations when not visible
      backdropOpacityAnim.setValue(0);
      contentAnim.setValue(0);
      scaleAnim.setValue(0.95);
      slideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [visible, animateIn, backdropOpacityAnim, contentAnim, scaleAnim, slideAnim]);

  const getContentStyle = useCallback((): StyleProp<ViewStyle> => {
    const baseStyle = [
      styles.content,
      sizeConfig,
      style,
    ];

    switch (animationType) {
      case "fade":
        return [
          ...baseStyle,
          {
            opacity: contentAnim,
          },
        ];
      case "scale":
        return [
          ...baseStyle,
          {
            opacity: contentAnim,
            transform: [{ scale: scaleAnim }],
          },
        ];
      case "slide":
        return [
          ...baseStyle,
          {
            transform: [{ translateY: slideAnim }],
          },
        ];
      default:
        return baseStyle;
    }
  }, [animationType, contentAnim, scaleAnim, slideAnim, sizeConfig, style]);

  if (!visible) {
    return null;
  }

  return (
    <Portal>
      {statusBarTranslucent && <StatusBar translucent backgroundColor="transparent" />}
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              backgroundColor: backdropColor || backdropConfig.color,
              opacity: backdropOpacityAnim,
            },
          ]}
        />
        <Pressable
          style={styles.overlay}
          onPress={handleBackdropPress}
          accessibilityRole="button"
          accessibilityLabel="Close modal"
        >
          <Animated.View
            style={getContentStyle()}
            {...rest}
          >
            {children}
          </Animated.View>
        </Pressable>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
});

export default Modal;