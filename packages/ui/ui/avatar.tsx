import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  forwardRef,
  memo,
  type ReactNode,
} from "react";
import {
  View,
  Image,
  type ImageProps,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
  type NativeSyntheticEvent,
  type ImageErrorEventData,
  type ImageLoadEventData,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Text } from "./text";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
const PX: Record<AvatarSize, number> = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 64,
};

interface Ctx {
  dim: number;
  hasImage: boolean;
  setHasImage: (v: boolean) => void;
}
const Ctx = createContext<Ctx | null>(null);
const useAvatar = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("Avatar primitives must be inside <Avatar>");
  return v;
};

/*──── Root ────*/
export interface AvatarProps {
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}
const Avatar = memo(
  forwardRef<React.ElementRef<typeof View>, AvatarProps>(
    ({ size = "md", style, children }, ref) => {
      const dim = PX[size];
      const [hasImage, setHasImage] = useState(false);

      const context = useMemo<Ctx>(
        () => ({ dim, hasImage, setHasImage }),
        [dim, hasImage],
      );

      return (
        <Ctx.Provider value={context}>
          <View
            ref={ref}
            data-slot="avatar"
            style={[
              styles.wrapper,
              {
                width: dim,
                height: dim,
                borderRadius: dim / 2,
              },
              style,
            ]}
          >
            {children}
          </View>
        </Ctx.Provider>
      );
    },
  ),
);
Avatar.displayName = "Avatar";

export interface AvatarImageProps extends Omit<ImageProps, "style" | "source"> {
  source: ImageProps["source"];
  style?: StyleProp<ImageStyle>;
  alt?: string;
}
const AvatarImage = memo(
  forwardRef<React.ElementRef<typeof Image>, AvatarImageProps>(
    ({ source, style, alt = "avatar", onLoad, onError, ...rest }, ref) => {
      const { dim, setHasImage } = useAvatar();
      const radius = dim / 2;

      const handleLoad = (e: NativeSyntheticEvent<ImageLoadEventData>) => {
        setHasImage(true);
        onLoad?.(e);
      };
      const handleError = (e: NativeSyntheticEvent<ImageErrorEventData>) => {
        setHasImage(false);
        onError?.(e);
      };

      return (
        <Image
          ref={ref}
          {...rest}
          accessibilityLabel={alt}
          accessibilityIgnoresInvertColors
          source={source}
          onLoad={handleLoad}
          onError={handleError}
          resizeMode="cover"
          style={[
            {
              width: dim,
              height: dim,
              borderRadius: radius,
            },
            style,
          ]}
        />
      );
    },
  ),
);
AvatarImage.displayName = "AvatarImage";

export interface AvatarFallbackProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}
const AvatarFallback = memo(
  forwardRef<React.ElementRef<typeof View>, AvatarFallbackProps>(
    ({ children, style }, ref) => {
      const { dim, hasImage } = useAvatar();
      const { theme } = useUnistyles();
      if (hasImage) return null;

      const initials =
        typeof children === "string"
          ? children.slice(0, 2).toUpperCase()
          : null;

      return (
        <View
          ref={ref}
          data-slot="avatar-fallback"
          style={[
            styles.fallback,
            {
              borderRadius: dim / 2,
              backgroundColor: theme.colors.muted,
            },
            style,
          ]}
        >
          {initials ? (
            <Text
              weight="semibold"
              style={{
                fontSize: dim * 0.3,
                lineHeight: dim,
              }}
            >
              {initials}
            </Text>
          ) : (
            children
          )}
        </View>
      );
    },
  ),
);
AvatarFallback.displayName = "AvatarFallback";

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  fallback: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
  },
}));

export { Avatar, AvatarImage, AvatarFallback };
