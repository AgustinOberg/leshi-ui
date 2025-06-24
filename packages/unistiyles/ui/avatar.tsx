import {
  createContext,
  useContext,
  useMemo,
  useState,
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
  type ImageLoadEventData,
  type ImageErrorEventData,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Text from "./text";
import { useTheme } from "../theme/unistyles";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

// TODO: use "w" function here instead of hardcoded pixel values
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
const AvatarCtx = createContext<Ctx | null>(null);

const useAvatar = () => {
  const ctx = useContext(AvatarCtx);
  if (!ctx) throw new Error("Avatar primitives must be inside <Avatar>");
  return ctx;
};

export interface AvatarProps {
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export const Avatar = ({ size = "md", style, children }: AvatarProps) => {
  const dim = PX[size];
  const [hasImage, setHasImage] = useState(false);

  const value = useMemo<Ctx>(
    () => ({ dim, hasImage, setHasImage }),
    [dim, hasImage]
  );

  styles.useVariants({ size });

  return (
    <AvatarCtx.Provider value={value}>
      <View data-slot="avatar" style={[styles.container, style]}>
        {children}
      </View>
    </AvatarCtx.Provider>
  );
};

export interface AvatarImageProps extends Omit<ImageProps, "style" | "source"> {
  source: ImageProps["source"];
  style?: StyleProp<ImageStyle>;
  alt?: string;
}

export const AvatarImage = ({
  source,
  style,
  alt = "avatar",
  onLoad,
  onError,
  ...rest
}: AvatarImageProps) => {
  const { dim, setHasImage } = useAvatar();

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
          borderRadius: dim / 2,
        },
        style,
      ]}
    />
  );
};

export interface AvatarFallbackProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AvatarFallback = ({ children, style }: AvatarFallbackProps) => {
  const { dim, hasImage } = useAvatar();
  const theme = useTheme();

  if (hasImage) return null;

  const initials =
    typeof children === "string" ? children.slice(0, 2).toUpperCase() : null;

  return (
    <View
      data-slot="avatar-fallback"
      style={[styles.fallback, { backgroundColor: theme.colors.muted }, style]}
    >
      {initials ? (
        <Text
          weight="semibold"
          style={{ fontSize: dim * 0.3, lineHeight: dim }}
        >
          {initials}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    borderRadius: theme.radii.full,
    variants: {
      size: {
        sm: { width: theme.sizes.width(6) },
        md: { width: theme.sizes.width(8) },
        lg: { width: theme.sizes.width(10) },
        xl: { width: theme.sizes.width(16) },
      },
    },
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radii.full,
  },
}));
